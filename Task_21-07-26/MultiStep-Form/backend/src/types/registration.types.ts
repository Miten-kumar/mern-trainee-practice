export type EmploymentStatus =
    | "STUDENT"
    | "EMPLOYED"
    | "FREELANCER"
    | "UNEMPLOYED";


export interface SkillInput {

    name:string;

}


export interface CreateRegistrationInput {

    firstName:string;

    lastName:string;

    email:string;

    phone:string;

    age:number;

    employmentStatus:EmploymentStatus;

    company?:string;

    designation?:string;

    experience?:number;

    resume?:string;

    profileImage?:string;

    skills?:SkillInput[];

}



export interface UpdateRegistrationInput {

    firstName?:string;

    lastName?:string;

    email?:string;

    phone?:string;

    age?:number;

    employmentStatus?:EmploymentStatus;

    company?:string;

    designation?:string;

    experience?:number;

    resume?:string;

    profileImage?:string;

}