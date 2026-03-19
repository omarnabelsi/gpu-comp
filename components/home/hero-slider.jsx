"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { heroSlides } from "@/lib/hero-slides";
import { floatTransition, sectionTransition, standardTransition } from "@/lib/motion";
import { bem } from "@/lib/bem";
const transition = { type: "spring", stiffness: 145, damping: 24, mass: 0.72 };
const slideVariants = {
    enter: (direction) => ({ opacity: 0, x: direction > 0 ? 108 : -108, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1, transition },
    exit: (direction) => ({ opacity: 0, x: direction > 0 ? -108 : 108, scale: 0.97, transition }),
};
export function HeroSlider({ heroContent }) {
    const reduceMotion = useReducedMotion();
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const depthSlowX = useSpring(useTransform(pointerX, [-1, 1], [-18, 18]), { stiffness: 80, damping: 18, mass: 0.7 });
    const depthSlowY = useSpring(useTransform(pointerY, [-1, 1], [-12, 12]), { stiffness: 80, damping: 18, mass: 0.7 });
    const depthFastX = useSpring(useTransform(pointerX, [-1, 1], [-30, 30]), { stiffness: 95, damping: 22, mass: 0.55 });
    const depthFastY = useSpring(useTransform(pointerY, [-1, 1], [-18, 18]), { stiffness: 95, damping: 22, mass: 0.55 });
    const cardRotateY = useSpring(useTransform(pointerX, [-1, 1], [-4.5, 4.5]), { stiffness: 130, damping: 20, mass: 0.55 });
    const cardRotateX = useSpring(useTransform(pointerY, [-1, 1], [3.8, -3.8]), { stiffness: 130, damping: 20, mass: 0.55 });
    const handleMouseMove = useCallback((event) => {
        if (reduceMotion) {
            return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        pointerX.set(x);
        pointerY.set(y);
    }, [pointerX, pointerY, reduceMotion]);
    const handleMouseLeave = useCallback(() => {
        setPaused(false);
        pointerX.set(0);
        pointerY.set(0);
    }, [pointerX, pointerY]);
    const nextSlide = useCallback(() => {
        setDirection(1);
        setActive((prev) => (prev + 1) % heroSlides.length);
    }, []);
    useEffect(() => {
        if (paused) {
            return;
        }
        const timer = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(timer);
    }, [nextSlide, paused]);
    const slide = heroSlides[active];
    const activeSlideImage = heroContent?.slideImages?.[active] || slide.image;
    const metrics = Array.isArray(heroContent?.metrics) && heroContent.metrics.length >= 3
      ? heroContent.metrics
      : [
        { label: "PEAK CLOCK", value: "2.8 GHz" },
        { label: "AI THROUGHPUT", value: "4M tokens/hr" },
        { label: "EFFICIENCY", value: "380W TDP" },
      ];
    return (<section className={bem("components-home-hero-slider__c1")} onMouseEnter={() => setPaused(true)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
      <motion.div className={bem("components-home-hero-slider__c2")} style={{ x: depthSlowX, y: depthSlowY }}/>
      <motion.div className={bem("components-home-hero-slider__c3")} style={{ x: depthFastX, y: depthFastY }}/>
      <motion.div className={bem("components-home-hero-slider__c4")} style={{ x: depthFastX, y: depthSlowY }}/>
      <motion.div className={bem("components-home-hero-slider__c5")} style={{ x: depthSlowX, y: depthFastY }}/>

      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div key={slide.id} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className={bem("components-home-hero-slider__c6")}>
          <motion.div className={bem("components-home-hero-slider__c7")} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sectionTransition, duration: 0.62, delay: 0.08 }}>
            <motion.p className={bem("components-home-hero-slider__c8")} animate={reduceMotion ? undefined : { y: [0, -1.8, 0] }} transition={reduceMotion ? undefined : { duration: 4.2, ease: "easeInOut", repeat: Infinity }}>
              {heroContent?.badge || "GPU TECHNOLOGY COMPANY"}
            </motion.p>

            <h1 className={bem("components-home-hero-slider__c9")}>{heroContent?.title || slide.title}</h1>
            <p className={bem("components-home-hero-slider__c10")}>{heroContent?.description || slide.description}</p>

            <div className={bem("components-home-hero-slider__c11")}>
              <Link href={heroContent?.primaryCtaLink || "/projects"} className={bem("components-home-hero-slider__c12")}>
                {heroContent?.primaryCtaLabel || "Explore GPUs"}
              </Link>
              <Link href={heroContent?.secondaryCtaLink || "/services"} className={bem("components-home-hero-slider__c13")}>
                {heroContent?.secondaryCtaLabel || "AI & Cloud Services"}
              </Link>
            </div>

            <div className={bem("components-home-hero-slider__c14")}>
              <div className={bem("components-home-hero-slider__c15")}>
                <p className={bem("components-home-hero-slider__c16")}>{metrics[0].label}</p>
                <p className={bem("components-home-hero-slider__c17")}>{metrics[0].value}</p>
              </div>
              <div className={bem("components-home-hero-slider__c18")}>
                <p className={bem("components-home-hero-slider__c19")}>{metrics[1].label}</p>
                <p className={bem("components-home-hero-slider__c20")}>{metrics[1].value}</p>
              </div>
              <div className={bem("components-home-hero-slider__c21")}>
                <p className={bem("components-home-hero-slider__c22")}>{metrics[2].label}</p>
                <p className={bem("components-home-hero-slider__c23")}>{metrics[2].value}</p>
              </div>
            </div>
          </motion.div>

          <motion.div className={bem("components-home-hero-slider__c24")} style={reduceMotion ? undefined : { rotateX: cardRotateX, rotateY: cardRotateY, transformPerspective: 1200 }} initial={{ opacity: 0, x: 30, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1.02 }} transition={{ ...sectionTransition, duration: 0.72, delay: 0.12 }}>
            <motion.div className={bem("components-home-hero-slider__c25")} animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={reduceMotion ? undefined : floatTransition}>
              {slide.videoEmbed ? (<iframe src={slide.videoEmbed} title={slide.title} className={bem("components-home-hero-slider__c26")} loading="lazy" allow="autoplay; encrypted-media" allowFullScreen/>) : (<>
                  <Image src={activeSlideImage} alt={slide.title} fill className={bem("components-home-hero-slider__c27")} sizes="(max-width: 1024px) 85vw, 35vw" priority/>
                  <div className={bem("components-home-hero-slider__c28")}/>
                </>)}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className={bem("components-home-hero-slider__c29")}>
        {heroSlides.map((item, index) => (<button key={item.id} type="button" onClick={() => {
                setDirection(index > active ? 1 : -1);
                setActive(index);
          }} className={bem("components-home-hero-slider__c30", index === active ? "components-home-hero-slider__c31" : "components-home-hero-slider__c32")} style={{ transition: `all ${standardTransition.duration}s cubic-bezier(0.22, 1, 0.36, 1)` }} aria-label={`Go to slide ${index + 1}`}/>))}
      </div>
    </section>);
}
