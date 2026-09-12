import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../css/DeepDive.css";

gsap.registerPlugin(ScrollTrigger);

export default function DeepDive() {

    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const labelRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const statsRef = useRef(null);
    const depthRef = useRef(null);

    useLayoutEffect(() => {

        const ctx = gsap.context(() => {

            gsap.set(labelRef.current, {
                opacity: 0,
                y: 30
            });

            gsap.set(titleRef.current, {
                opacity: 0,
                y: 100
            });

            gsap.set(descriptionRef.current, {
                opacity: 0,
                y: 50
            });

            gsap.set(statsRef.current.children, {
                opacity: 0,
                y: 40
            });

            gsap.set(depthRef.current, {
                opacity: 0,
                x: 50
            });


            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });


            tl.to(labelRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            })

                .to(titleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power4.out"
                }, "-=0.4")

                .to(descriptionRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.5")

                .to(statsRef.current.children, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power3.out"
                }, "-=0.4")

                .to(depthRef.current, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.8");


            // Floating particles
            gsap.to(".ocean-particle", {
                y: -100,
                opacity: 0,
                duration: 4,
                stagger: {
                    each: 0.4,
                    repeat: -1
                },
                ease: "none"
            });


            // Light rays movement
            gsap.to(".light-ray", {
                y: 40,
                opacity: 0.15,
                duration: 4,
                repeat: -1,
                yoyo: true,
                stagger: 0.8,
                ease: "sine.inOut"
            });

        }, sectionRef);

        return () => ctx.revert();

    }, []);


    return (
        <section
            ref={sectionRef}
            id="deep-dive"
            className="deep-dive"
        >

            {/* ==================================
                UNDERWATER LIGHT
            ================================== */}

            <div className="surface-light"></div>

            <div className="light-ray ray-one"></div>
            <div className="light-ray ray-two"></div>
            <div className="light-ray ray-three"></div>
            <div className="light-ray ray-four"></div>


            {/* ==================================
                WATER PARTICLES
            ================================== */}

            <div className="ocean-particles">

                <span className="ocean-particle particle-1"></span>
                <span className="ocean-particle particle-2"></span>
                <span className="ocean-particle particle-3"></span>
                <span className="ocean-particle particle-4"></span>
                <span className="ocean-particle particle-5"></span>
                <span className="ocean-particle particle-6"></span>
                <span className="ocean-particle particle-7"></span>
                <span className="ocean-particle particle-8"></span>
                <span className="ocean-particle particle-9"></span>
                <span className="ocean-particle particle-10"></span>

            </div>


            {/* ==================================
                DEPTH INDICATOR
            ================================== */}

            <div
                className="depth-indicator"
                ref={depthRef}
            >

                <div className="depth-line"></div>

                <span>0m</span>
                <span>50m</span>
                <span>200m</span>
                <span>1000m</span>
                <span>4000m</span>

            </div>


            {/* ==================================
                CONTENT
            ================================== */}

            <div
                className="deep-dive-content"
                ref={contentRef}
            >

                <div
                    className="deep-dive-label"
                    ref={labelRef}
                >
                    <span></span>

                    DEEP DIVE

                    <span></span>
                </div>


                <h2 ref={titleRef}>

                    Discover
                    <br />

                    <em>what lies beneath.</em>

                </h2>


                <p
                    className="deep-dive-description"
                    ref={descriptionRef}
                >
                    Dive beneath the surface and explore
                    the ocean through numerical models,
                    observations and environmental data.
                </p>


                {/* ==================================
                    DATA
                ================================== */}

                <div
                    className="ocean-stats"
                    ref={statsRef}
                >

                    <div className="ocean-stat">

                        <span className="stat-value">
                            0–6000m
                        </span>

                        <span className="stat-label">
                            Ocean Depth
                        </span>

                    </div>


                    <div className="ocean-stat">

                        <span className="stat-value">
                            3D
                        </span>

                        <span className="stat-label">
                            Spatial Models
                        </span>

                    </div>


                    <div className="ocean-stat">

                        <span className="stat-value">
                            LIVE
                        </span>

                        <span className="stat-label">
                            Observations
                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================
                BOTTOM TEXT
            ================================== */}

            <div className="deep-dive-bottom">

                <span>
                    VORTEX OCEAN VISUALIZATION
                </span>

                <span>
                    EXPLORE THE UNKNOWN ↓
                </span>

            </div>

        </section>
    );
}