export type EmploymentStatus =
    | "STUDENT"
    | "EMPLOYED"
    | "FREELANCER"
    | "UNEMPLOYED";



export interface Skill {

    name:string;

}



export interface RegistrationFormData {


    firstName:string;


    lastName:string;


    email:string;


    phone:string;


    age:number;


    employmentStatus:EmploymentStatus;


    company?:string;


    designation?:string;


    experience?:number;


    skills:Skill[];


    resume?:FileList;


    profileImage?:FileList;

}