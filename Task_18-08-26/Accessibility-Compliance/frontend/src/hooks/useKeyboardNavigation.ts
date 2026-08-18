import { useCallback } from "react";

interface KeyboardNavigationOptions {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
}

export const useKeyboardNavigation = ({
    onEnter,
    onSpace,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight
}: KeyboardNavigationOptions ) => {
    return useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            switch (event.key) {
                case "Enter":
                    onEnter?.();
                    break;
                
                case " ":
                case "Spacebar":
                    onSpace?.();
                    break;

                case "Escape":
                    onEscape?.();
                    break;
                
                case "ArrowUp":
                    event.preventDefault();
                    onArrowUp?.();
                    break;

                case "ArrowDown":
                    event.preventDefault();
                    onArrowDown?.();
                    break;

                case "ArrowLeft":
                    event.preventDefault();
                    onArrowLeft?.();
                    break;

                case "ArrowRight":
                    event.preventDefault();
                    onArrowRight?.();
                    break;
                
                default:
                    break;
            }
        },[
            onEnter,
            onSpace,
            onEscape,
            onArrowUp,
            onArrowDown,
            onArrowLeft,
            onArrowRight
        ]
    );
};