export interface ApplicationData {

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  age: number;


  employmentType:
    | "Student"
    | "Professional"
    | "Freelancer";


  companyName?: string;


  experience?: number;


  skills: string[];


  resume?: string;


  profileImage?: string;


  portfolioUrl?: string;

}



export interface UpdateApplicationData {

  firstName?: string;

  lastName?: string;

  email?: string;

  phone?: string;

  age?: number;


  employmentType?:
    | "Student"
    | "Professional"
    | "Freelancer";


  companyName?: string;


  experience?: number;


  skills?: string[];


  resume?: string;


  profileImage?: string;


  portfolioUrl?: string;

}



export interface ApiResponse<T>{

  success: boolean;

  message: string;

  data?: T;

  error?: unknown;

}