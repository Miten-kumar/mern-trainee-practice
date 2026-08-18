import { Request, Response } from "express";
import prisma from "../config/prisma";
import { emailQueue } from "../queues/email.queue";
import { imageQueue } from "../queues/image.queue";


export const createEmailJob = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const jobId = Date.now().toString();


    // 1. Save job first in PostgreSQL
    await prisma.job.create({

      data: {

        jobId,

        type: "EMAIL",

        status: "WAITING",

        priority: 1,

        progress: 0,

        payload: req.body

      }

    });


    // 2. Add job to Bull Queue
    await emailQueue.add(
      req.body,
      {
        jobId,

        priority: 1,

        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 5000
        }
      }
    );


    res.status(201).json({

      success: true,

      message: "Email Job Created",

      jobId

    });


  } catch (error) {

    console.error(error);


    res.status(500).json({

      success:false,

      message:"Unable to create email job"

    });

  }

};





export const createImageJob = async (
  req: Request,
  res: Response
): Promise<void> => {


  try {


    if(!req.file){

      res.status(400).json({

        success:false,

        message:"Image file required"

      });

      return;

    }



    const jobId = Date.now().toString();



    const imageData = {

      filename:req.file.filename,

      originalName:req.file.originalname,

      path:req.file.path,

      size:req.file.size

    };



    // Save Job in PostgreSQL

    await prisma.job.create({

      data:{

        jobId,

        type:"IMAGE",

        status:"WAITING",

        priority:2,

        progress:0,

        payload:imageData

      }

    });



    // Add to Image Queue

    await imageQueue.add(

      imageData,

      {

        jobId,

        priority:2,

        attempts:5,

        backoff:{

          type:"fixed",

          delay:3000

        }

      }

    );



    res.status(201).json({

      success:true,

      message:"Image Job Created",

      jobId

    });



  }
  catch(error){


    console.error(error);


    res.status(500).json({

      success:false,

      message:"Unable to create image job"

    });


  }

};




export const getJobStatus = async (
  req: Request,
  res: Response
): Promise<void> => {


  try {


    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;



    if(!id){

      res.status(400).json({

        success:false,

        message:"Job ID required"

      });

      return;

    }



    const job = await prisma.job.findUnique({

      where:{

        jobId:id

      }

    });



    if(!job){

      res.status(404).json({

        success:false,

        message:"Job not found"

      });

      return;

    }



    res.status(200).json({

      success:true,

      data:job

    });



  } catch(error){


    console.error(error);


    res.status(500).json({

      success:false,

      message:"Unable to fetch job"

    });


  }

};





export const getAllJobs = async (
  req: Request,
  res: Response
): Promise<void> => {


  try {


    const jobs = await prisma.job.findMany({

      orderBy:{

        createdAt:"desc"

      }

    });



    res.status(200).json({

      success:true,

      count:jobs.length,

      data:jobs

    });



  } catch(error){


    console.error(error);


    res.status(500).json({

      success:false,

      message:"Unable to fetch jobs"

    });


  }

};