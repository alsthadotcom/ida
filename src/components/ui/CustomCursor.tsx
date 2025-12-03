import { useEffect, useRef } from "react";

const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Don't run on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const updatePosition = (e: MouseEvent) => {
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
        };

        window.addEventListener("mousemove", updatePosition);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
        };
    }, []);

    return (
        <div
            ref={dotRef}
            className="cursor-dot-simple"
        />
    );
};

export default CustomCursor;
