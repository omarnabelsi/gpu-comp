"use client";

import { useEffect, useCallback } from "react";

export function Modal({ open, title, children, onClose, widthClass = "max-w-md", scrollable = false }) {
    const handleKeyDown = useCallback((event) => {
        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, handleKeyDown]);

    if (!open) {
        return null;
    }

    return (
        <div className="dashboard-modal-overlay" onClick={onClose}>
            <div
                className={`dashboard-modal-panel ${widthClass} ${scrollable ? "dashboard-modal-scrollable" : ""}`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="dashboard-modal-header">
                    {title ? <h3 className="dashboard-modal-title">{title}</h3> : null}
                    <button
                        type="button"
                        className="dashboard-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
                <div className={scrollable ? "dashboard-modal-body" : ""}>
                    {children}
                </div>
            </div>
        </div>
    );
}
