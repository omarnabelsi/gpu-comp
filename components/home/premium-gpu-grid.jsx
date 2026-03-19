"use client";
import Link from "next/link";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { buttonSpring, premiumEase, standardTransition } from "@/lib/motion";
import { staggerChild, staggerParent } from "@/components/home/reveal";
import { bem } from "@/lib/bem";
function PremiumGpuCard({ project }) {
    const { glow, handleMove, handleEnter, handleLeave } = useCursorGlow();
    return (<Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} transitionSpeed={800} perspective={1300} scale={1.018} glareEnable glarePosition="all" glareMaxOpacity={0.16} className={bem("components-home-premium-gpu-grid__c1")}>
      <motion.article className={bem("components-home-premium-gpu-grid__c2")} style={{ borderRadius: "20px 6px 20px 6px" }} onMouseMove={handleMove} onMouseEnter={handleEnter} onMouseLeave={handleLeave} whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: premiumEase }}>
        <motion.div className={bem("components-home-premium-gpu-grid__c3")} style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(124,58,237,0.24), transparent 43%)`,
        }} animate={{ opacity: glow.inside ? 1 : 0 }} transition={{ duration: 0.18, ease: "easeOut" }}/>

        <div className={bem("components-home-premium-gpu-grid__c4")} style={{ borderRadius: "16px 2px 16px 2px" }}>
          <Image src={project.imageUrl} alt={project.title} fill sizes="(max-width: 768px) 92vw, (max-width: 1280px) 44vw, 30vw" className={bem("components-home-premium-gpu-grid__c5")}/>
          <motion.div className={bem("components-home-premium-gpu-grid__c6")} style={{
            background: `linear-gradient(${120 + glow.x * 0.4}deg, rgba(255,255,255,0.25), transparent 42%)`,
        }} animate={{ opacity: glow.inside ? 0.45 : 0.1 }}/>
        </div>

        <div className={bem("components-home-premium-gpu-grid__c7")}>
          <h3 className={bem("components-home-premium-gpu-grid__c8")}>{project.title}</h3>
          <span className={bem("components-home-premium-gpu-grid__c9")}>SERIES</span>
        </div>
        <p className={bem("components-home-premium-gpu-grid__c10")}>{project.description}</p>

        <div className={bem("components-home-premium-gpu-grid__c11")}>
          <p className={bem("components-home-premium-gpu-grid__c12")}>RT Cores: Gen 5</p>
          <p className={bem("components-home-premium-gpu-grid__c13")}>Boost: 2805 MHz</p>
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={buttonSpring} style={{ transition: `all ${standardTransition.duration}s cubic-bezier(0.22, 1, 0.36, 1)` }}>
          <Link href={`/projects/${project.slug}`} className={bem("components-home-premium-gpu-grid__c14")}>
            View Details
          </Link>
        </motion.div>
      </motion.article>
    </Tilt>);
}
export function PremiumGpuGrid({ projects }) {
    return (<motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px -10% 0px" }} className={bem("components-home-premium-gpu-grid__c15")}>
      {projects.map((project) => (<motion.div key={project.id} variants={staggerChild} className={bem("components-home-premium-gpu-grid__c16")}>
          <PremiumGpuCard project={project}/>
        </motion.div>))}
    </motion.div>);
}
