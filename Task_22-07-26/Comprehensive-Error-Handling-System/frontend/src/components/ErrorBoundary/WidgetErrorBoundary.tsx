import {
Component,
    type ReactNode
}
from "react";


interface Props{

children:ReactNode;

}

interface State{

hasError:boolean;

}

class WidgetErrorBoundary 
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

<div>

⚠ Widget failed to load

</div>

);


}

return this.props.children;

}

}

export default WidgetErrorBoundary;