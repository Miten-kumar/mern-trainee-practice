export type EmploymentType =
  | ""
  | "Student"
  | "Professional"
  | "Freelancer";


export interface ApplicationFormData {

  firstName:string;

  lastName:string;

  email:string;

  phone:string;

  age:number;


  employmentType:EmploymentType;


  companyName?:string;


  experience?:number;


  skills:string[];


  resume?:File | null;


  profileImage?:File | null;


  portfolioUrl?:string;

}