export const saveFormData = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
data:any
)=>{

localStorage.setItem(

"registration-data",

JSON.stringify(data)

);

};

export const getFormData = ()=>{

const data =
localStorage.getItem(
"registration-data"
);


return data
?
JSON.parse(data)
:
null;

};

export const removeFormData = ()=>{

localStorage.removeItem(

"registration-data"
);

};