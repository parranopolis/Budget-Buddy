import { useEffect, type RefObject } from "react";

/**
 * @param ref - A React ref object pointing to the element to watch
 * @param onClose - The function to call when a click occurs outside the element
 */
function useOutsideClick(
    ref: RefObject<HTMLElement | null>, 
    onClose: () => void
): void {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click target is an actual Node and if it's outside our ref
            if (
                ref.current && 
                event.target instanceof Node && 
                !ref.current.contains(event.target)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClose]);
}

export default useOutsideClick;
