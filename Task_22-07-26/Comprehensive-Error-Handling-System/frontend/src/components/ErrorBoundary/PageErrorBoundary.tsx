import {
Component,
    type ReactNode
}
from "react";


import FallbackUI from "../FallbackUI";


interface Props{

children:ReactNode;

}

interface State{

hasError:boolean;

}


class PageErrorBoundary 
extends Component<Props,State>{

state={

hasError:false

};

static getDerivedStateFromError(){

return {

hasError:true

};

}

render(){


if(this.state.hasError){


return (

<FallbackUI

title="Page Failed"

message=
"Unable to load this page."

onRetry={()=>
this.setState({
hasError:false
})
}

/>

);

}

return this.props.children;

}

}

export default PageErrorBoundary;