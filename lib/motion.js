export const premiumEase = [0.22, 1, 0.36, 1];
export const sectionReveal = {
    hidden: {
        opacity: 0,
        y: 26,
        filter: "blur(8px)",
    },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.65,
            ease: premiumEase,
        },
    },
};
export const staggerRevealParent = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.11,
            delayChildren: 0.06,
        },
    },
};
export const staggerRevealChild = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: "blur(6px)",
    },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.55,
            ease: premiumEase,
        },
    },
};
export const buttonSpring = {
    type: "spring",
    stiffness: 320,
    damping: 24,
};
export const standardTransition = {
    duration: 0.3,
    ease: premiumEase,
};
export const sectionTransition = {
    duration: 0.7,
    ease: premiumEase,
};
export const floatTransition = {
    duration: 4.6,
    ease: "easeInOut",
    repeat: Infinity,
};
