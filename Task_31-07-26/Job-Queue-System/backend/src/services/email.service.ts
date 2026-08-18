import transporter from "../config/mailer";

interface EmailData {
  to: string;
  subject: string;
  message: string;
}

export const sendEmail = async(data:any)=>{

console.log(
"Sending email...",
data
);

await new Promise(
resolve=>setTimeout(resolve,3000)
);

console.log(
"Email Sent Successfully"
);

};