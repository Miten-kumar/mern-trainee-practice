const allowedWidths = [

320,

480,

640,

800,

960,

1280,

1440,

1920

];



export function validateWidth(

width:number

){


return allowedWidths.reduce(

(prev,current)=>

Math.abs(current-width)

<
Math.abs(prev-width)

?

current

:

prev

);


}