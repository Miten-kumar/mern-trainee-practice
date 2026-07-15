module.exports={


apps:[

{

name:"typescript-api",


script:"dist/server.js",


instances:"max",


exec_mode:"cluster",


env:{

NODE_ENV:"production"

}


}


]


}