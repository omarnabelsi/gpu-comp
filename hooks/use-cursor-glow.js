"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
const DEFAULT_GLOW = { x: 50, y: 50, inside: false };
export function useCursorGlow() {
    const reduceMotion = useReducedMotion();
    const frameRef = useRef(null);
    const [glow, setGlow] = useState(DEFAULT_GLOW);
    useEffect(() => {
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);
    const handleMove = (event) => {
        if (reduceMotion) {
            return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }
        frameRef.current = requestAnimationFrame(() => {
            setGlow({ x, y, inside: true });
        });
    };
    const handleEnter = () => {
        if (reduceMotion) {
            return;
        }
        setGlow((prev) => ({ ...prev, inside: true }));
    };
    const handleLeave = () => {
        setGlow((prev) => ({ ...prev, inside: false }));
    };
    return {
        glow,
        reduceMotion,
        handleMove,
        handleEnter,
        handleLeave,
    };
}
