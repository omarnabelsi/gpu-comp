"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { buttonSpring, sectionTransition } from "@/lib/motion";
import { bem } from "@/lib/bem";
export function PremiumHero({ title, content, imageUrl }) {
    const reduceMotion = useReducedMotion();
    const { glow, handleMove, handleEnter, handleLeave } = useCursorGlow();
    return (<motion.div className={bem("components-home-premium-hero__c1")} onMouseMove={handleMove} onMouseEnter={handleEnter} onMouseLeave={handleLeave} initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }} animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }} transition={sectionTransition}>
      <motion.div className={bem("components-home-premium-hero__c2")} animate={reduceMotion
            ? undefined
            : {
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}/>
      <div className={bem("components-home-premium-hero__c3")}/>
      <motion.div className={bem("components-home-premium-hero__c4")} style={{ left: `${glow.x}%`, top: `${glow.y}%`, width: 320, height: 320 }} animate={{ opacity: glow.inside && !reduceMotion ? 1 : 0 }} transition={{ duration: 0.2, ease: "easeOut" }}/>

      <div className={bem("components-home-premium-hero__c5")}>
        <div>
          <p className={bem("components-home-premium-hero__c6")}>
            GPU TECHNOLOGY COMPANY
          </p>
          <h1 className={bem("components-home-premium-hero__c7")}>{title}</h1>
          <p className={bem("components-home-premium-hero__c8")}>{content}</p>

          <div className={bem("components-home-premium-hero__c9")}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={buttonSpring}>
              <Link href="/projects" className={bem("components-home-premium-hero__c10")}>
                Explore GPUs
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={buttonSpring}>
              <Link href="/services" className={bem("components-home-premium-hero__c11")}>
                AI & Cloud Services
              </Link>
            </motion.div>
          </div>

          <div className={bem("components-home-premium-hero__c12")}>
            <div className={bem("components-home-premium-hero__c13")}>
              <p className={bem("components-home-premium-hero__c14")}>PEAK CLOCK</p>
              <p className={bem("components-home-premium-hero__c15")}>2.8 GHz</p>
            </div>
            <div className={bem("components-home-premium-hero__c16")}>
              <p className={bem("components-home-premium-hero__c17")}>AI THROUGHPUT</p>
              <p className={bem("components-home-premium-hero__c18")}>4M tokens/hr</p>
            </div>
            <div className={bem("components-home-premium-hero__c19")}>
              <p className={bem("components-home-premium-hero__c20")}>EFFICIENCY</p>
              <p className={bem("components-home-premium-hero__c21")}>380W TDP</p>
            </div>
          </div>
        </div>

        <div className={bem("components-home-premium-hero__c22")}>
          <div className={bem("components-home-premium-hero__c23")}>
            <Image src={imageUrl || "/globe.svg"} alt="GPU showcase" fill className={bem("components-home-premium-hero__c24")} sizes="(max-width: 1024px) 90vw, 35vw" priority/>
            <div className={bem("components-home-premium-hero__c25")}/>
          </div>
        </div>
      </div>
    </motion.div>);
}
