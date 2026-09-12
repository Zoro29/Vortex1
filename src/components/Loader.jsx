import { useEffect, useRef } from "react";
import gsap from "gsap";

import "../css/Loader.css";

export default function Loader({ onComplete }) {
    const loaderRef = useRef(null);
    const waveRef = useRef(null);
    const fillRef = useRef(null);
    const logoRef = useRef(null);
    const percentRef = useRef(null);

    useEffect(() => {
        const loader = loaderRef.current;
        const wave = waveRef.current;
        const fill = fillRef.current;
        const logo = logoRef.current;
        const percent = percentRef.current;

        const tl = gsap.timeline({
            onComplete: () => {
                onComplete?.();
            },
        });

        // Initial state
        gsap.set(fill, {
            y: 260,
        });

        gsap.set(wave, {
            y: 260,
        });

        gsap.set(logo, {
            opacity: 0,
            scale: 0.96,
        });

        gsap.set(percent, {
            opacity: 0,
        });

        /*
        ============================================================
        SHOW LOGO
        ============================================================
        */

        tl.to(logo, {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
        });

        tl.to(
            percent,
            {
                opacity: 1,
                duration: 0.4,
            },
            "-=0.5"
        );

        /*
        ============================================================
        WATER RISE
        ============================================================
        */

        tl.to(
            fill,
            {
                y: 0,
                duration: 4,
                ease: "power2.inOut",

                onUpdate: () => {

                    const y = gsap.getProperty(fill, "y");

                    const percentage = Math.max(
                        0,
                        Math.min(
                            100,
                            Math.round(
                                100 - (y / 260) * 100
                            )
                        )
                    );

                    percent.textContent = `${percentage}%`;
                }
            }
        );

        /*
        ============================================================
        WAVE FOLLOWS WATER
        ============================================================
        */

        tl.to(
            wave,
            {
                y: 0,
                duration: 3,
                ease: "power2.inOut",
            },
            "<"
        );

        /*
        ============================================================
        SMALL HOLD
        ============================================================
        */

        tl.to({}, {
            duration: 0.4,
        });

        /*
        ============================================================
        EXIT
        ============================================================
        */

        tl.to(
            logo,
            {
                scale: 1.08,
                opacity: 0,
                duration: 0.8,
                ease: "power3.in",
            }
        );

        tl.to(
            percent,
            {
                opacity: 0,
                duration: 0.4,
            },
            "<"
        );

        tl.to(
            loader,
            {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
            },
            "-=0.3"
        );
        gsap.to(wave, {
            x: -35,
            duration: 2.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });
        gsap.to(wave, {
            skewX: 2,
            duration: 1.7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });
        

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <div
            className="vortex-loader"
            ref={loaderRef}
        >
            <div
                className="vortex-logo"
                ref={logoRef}
            >
                <svg
                    className="vortex-logo-svg"
                    viewBox="0 0 1000 300"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>

                        {/* ============================================================
      TEXT MASK
      ============================================================ */}

                        <mask id="vortex-text-mask">

                            <rect
                                width="1000"
                                height="300"
                                fill="black"
                            />

                            <text
                                x="500"
                                y="220"
                                textAnchor="middle"
                                className="vortex-svg-text"
                                fill="white"
                            >
                                VORTEX
                            </text>

                        </mask>


                        {/* ============================================================
      WATER GRADIENT
      ============================================================ */}

                        <linearGradient
                            id="vortex-water"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#ffffff"
                            />

                            <stop
                                offset="35%"
                                stopColor="#f7fdff"
                            />

                            <stop
                                offset="100%"
                                stopColor="#d8f5ff"
                            />
                        </linearGradient>


                        {/* ============================================================
      WATER DISTORTION
      ============================================================ */}

                        <filter
                            id="water-distortion"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >

                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.012 0.035"
                                numOctaves="3"
                                seed="8"
                                result="noise"
                            />

                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="18"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />

                        </filter>


                        {/* ============================================================
      SOFT WATER HIGHLIGHT
      ============================================================ */}

                        <linearGradient
                            id="water-highlight"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                        >

                            <stop
                                offset="0%"
                                stopColor="rgba(255,255,255,0)"
                            />

                            <stop
                                offset="45%"
                                stopColor="rgba(255,255,255,0.65)"
                            />

                            <stop
                                offset="55%"
                                stopColor="rgba(255,255,255,0.2)"
                            />

                            <stop
                                offset="100%"
                                stopColor="rgba(255,255,255,0)"
                            />

                        </linearGradient>

                    </defs>

                    {/* ===================================================
              EMPTY LETTERS
          =================================================== */}

                    <text
                        x="500"
                        y="220"
                        textAnchor="middle"
                        className="vortex-svg-text vortex-outline"
                    >
                        VORTEX
                    </text>


                    {/* ===================================================
              WATER INSIDE LETTERS
          =================================================== */}

                    <g mask="url(#vortex-text-mask)">

                        {/* ==========================================================
      MAIN WATER BODY
      ========================================================== */}

                        <rect
                            ref={fillRef}
                            x="0"
                            y="0"
                            width="1000"
                            height="300"
                            fill="url(#vortex-water)"
                        />


                        {/* ==========================================================
      ORGANIC WATER SURFACE
      ========================================================== */}

                        <g
                            ref={waveRef}
                            filter="url(#water-distortion)"
                        >

                            <path
                                className="water-surface-main"
                                d="
        M -100 40

        C 0 15,
          80 70,
          170 38

        C 260 5,
          350 70,
          440 35

        C 530 0,
          620 72,
          710 40

        C 800 8,
          900 68,
          1100 30

        L 1100 120
        L -100 120
        Z
      "
                                fill="#ffffff"
                            />


                            <path
                                className="water-surface-secondary"
                                d="
        M -100 65

        C 100 35,
          180 85,
          300 60

        C 420 35,
          510 85,
          650 58

        C 780 30,
          900 82,
          1100 55

        L 1100 120
        L -100 120
        Z
      "
                                fill="rgba(220,248,255,0.65)"
                            />

                        </g>


                        {/* ==========================================================
      MOVING WATER HIGHLIGHT
      ========================================================== */}

                        <rect
                            className="water-shimmer"
                            x="-100"
                            y="0"
                            width="300"
                            height="300"
                            fill="url(#water-highlight)"
                        />

                    </g>

                </svg>
            </div>


            {/* ======================================================
          PROGRESS
          ====================================================== */}

            <div
                className="vortex-loader-progress"
                ref={percentRef}
            >
                0%
            </div>

        </div>
    );
}