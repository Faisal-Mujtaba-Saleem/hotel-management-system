"use client"

import { createContext, useContext, useRef, useState, useEffect } from "react";

const ElementsHeightsContext = createContext();

export const ElementsHeightsProvider = ({ children }) => {
    const topbarRef = useRef(null);
    const headerRef = useRef(null);

    const [topbarHeight, setTopbarHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const updateHeights = () => {
            if (topbarRef.current)
                setTopbarHeight(Math.round(topbarRef.current.getBoundingClientRect().height));
            if (headerRef.current)
                setHeaderHeight(Math.round(headerRef.current.getBoundingClientRect().height));
        };

        // Run initially
        updateHeights();

        // One observer for both elements
        const observer = new ResizeObserver(updateHeights);
        if (topbarRef.current) observer.observe(topbarRef.current);
        if (headerRef.current) observer.observe(headerRef.current);

        // Backup window resize listener
        window.addEventListener("resize", updateHeights);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateHeights);
        };
    }, []);

    return (
        <ElementsHeightsContext.Provider
            value={{ topbarRef, headerRef, topbarHeight, headerHeight }}
        >
            {children}
        </ElementsHeightsContext.Provider>
    );
};

export const useElementsHeights = () => useContext(ElementsHeightsContext);
