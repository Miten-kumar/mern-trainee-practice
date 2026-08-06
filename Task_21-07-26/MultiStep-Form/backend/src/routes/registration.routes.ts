import { Router } from "express";

import {

createRegistration,

getRegistrations,

getRegistrationById,

updateRegistration,

deleteRegistration

} from "../controllers/registration.controller";

import upload from "../config/multer";


const router = Router();


// CREATE WITH FILE UPLOAD

router.post(

"/",

upload.fields([

{
    name:"resume",
    maxCount:1
},

{
    name:"profileImage",
    maxCount:1
}

]),

createRegistration

);


// GET ALL

router.get(

"/",

getRegistrations

);

// GET SINGLE

router.get(

"/:id",

getRegistrationById

);

// UPDATE

router.put(

"/:id",

updateRegistration

);


// DELETE

router.delete(

"/:id",

deleteRegistration

);

export default router;