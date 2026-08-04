import {
    Component,
    type ErrorInfo,
    type ReactNode
} from "react";

import FallbackUI from "../FallbackUI";
import { sendErrorLog } from "../../services/errorLogger.service";


interface Props {

    children: ReactNode;

}

interface State {

    hasError: boolean;

}

class GlobalErrorBoundary 
extends Component<Props, State> {

    constructor(props: Props) {

        super(props);


        this.state = {

            hasError: false

        };

    }

    static getDerivedStateFromError() {

        return {

            hasError: true

        };

    }
    componentDidCatch(

        error: Error,

        errorInfo: ErrorInfo

    ) {

        sendErrorLog({

            message: error.message,

            stack:
            errorInfo.componentStack ?? undefined,

            type: "runtime",
            page:
            window.location.pathname,

            userAgent:
            navigator.userAgent ?? undefined

        });

        console.error(

            error,

            errorInfo

        );


    }

    render() {

        if (this.state.hasError) {

            return (

                <FallbackUI

                    title="Application Error"

                    message="Something went wrong. Please refresh the page."

                    onRetry={() => window.location.reload()}

                />

            );

        }
        return this.props.children;

    }
}

export default GlobalErrorBoundary;