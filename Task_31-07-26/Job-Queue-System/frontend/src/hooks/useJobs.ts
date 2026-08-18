import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Job } from "../types/job.types";


export const useJobs = () => {

  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(false);

  
  const fetchJobs = async () => {

    try {

      setLoading(true);

      const response = await api.get("/jobs");

      setJobs(response.data.data);

    } catch (error) {

      console.error(
        "Fetch Jobs Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();

    const interval = setInterval(() => {

      fetchJobs();

    }, 3000);

    return () => {

      clearInterval(interval);

    };

  }, []);


  return {

    jobs,

    loading,

    refreshJobs: fetchJobs
  };

};