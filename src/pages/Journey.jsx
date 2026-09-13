import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";

import "../css/Journey.css";

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
    const pageRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            /* =========================================================
               HERO ENTRANCE
            ========================================================= */

            gsap.from(".journey-hero-label", {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.2,
                ease: "power3.out"
            });

            gsap.from(".journey-hero-title span", {
                opacity: 0,
                y: 100,
                rotateX: 70,
                stagger: 0.08,
                duration: 1.2,
                delay: 0.35,
                ease: "power4.out"
            });

            gsap.from(".journey-hero-description", {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.9,
                ease: "power3.out"
            });

            gsap.from(".journey-scroll", {
                opacity: 0,
                y: 20,
                duration: 1,
                delay: 1.3,
                ease: "power3.out"
            });


            /* =========================================================
               HERO PARALLAX
            ========================================================= */

            gsap.to(".journey-hero-bg", {
                yPercent: 20,
                scale: 1.15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".journey-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });


            /* =========================================================
               DEPTH INDICATOR PROGRESS
            ========================================================= */

            gsap.to(".depth-line-progress", {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: ".journey-page",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true
                }
            });


            /* =========================================================
               HERO EXIT
            ========================================================= */

            gsap.to(".journey-hero-content", {
                y: -150,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".journey-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });


            /* =========================================================
               DEPTH NUMBERS
            ========================================================= */

            const depthItems = gsap.utils.toArray(".depth-number");
            depthItems.forEach((item) => {
                gsap.from(item, {
                    opacity: 0,
                    x: 80,
                    duration: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            });


            /* =========================================================
               SECTION REVEALS
            ========================================================= */

            const revealItems = gsap.utils.toArray(".journey-reveal");
            revealItems.forEach((item) => {
                gsap.from(item, {
                    opacity: 0,
                    y: 80,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 82%",
                        toggleActions: "play none none reverse"
                    }
                });
            });


            /* =========================================================
               OCEAN LAYERS
            ========================================================= */

            gsap.utils.toArray(".ocean-layer").forEach((layer) => {
                gsap.fromTo(
                    layer,
                    {
                        y: 100,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: layer,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });


            /* =========================================================
               DATA CARDS
            ========================================================= */

            gsap.utils.toArray(".journey-data-card").forEach((card, index) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 70,
                    scale: 0.96,
                    duration: 0.9,
                    delay: index * 0.08,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".journey-data-grid",
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    }
                });
            });


            /* =========================================================
               HORIZONTAL JOURNEY (LEFT-TO-RIGHT TRACK)
            ========================================================= */

            const horizontalSection = document.querySelector(".horizontal-journey");
            const horizontalTrack = document.querySelector(".horizontal-track");

            if (horizontalSection && horizontalTrack) {
                const getScrollAmount = () =>
                    horizontalTrack.scrollWidth - window.innerWidth;

                gsap.to(horizontalTrack, {
                    x: () => -getScrollAmount(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: horizontalSection,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        end: () => `+=${getScrollAmount()}`
                    }
                });
            }


            /* =========================================================
               FINAL CTA
            ========================================================= */

            gsap.from(".journey-final-title span", {
                opacity: 0,
                y: 100,
                stagger: 0.08,
                duration: 1,
                scrollTrigger: {
                    trigger: ".journey-final",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });


            /* =========================================================
               MOUSE DEPTH GLOW
            ========================================================= */

            const page = document.querySelector(".journey-page");
            const glow = document.querySelector(".journey-cursor-glow");

            const moveGlow = (event) => {
                if (!glow) return;
                gsap.to(glow, {
                    x: event.clientX,
                    y: event.clientY,
                    duration: 0.6,
                    ease: "power3.out"
                });
            };

            page?.addEventListener("mousemove", moveGlow);

            return () => {
                page?.removeEventListener("mousemove", moveGlow);
            };

        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Navbar />
            <main className="journey-page" ref={pageRef}>

                {/* =====================================================
                    CURSOR GLOW
                ===================================================== */}
                <div className="journey-cursor-glow"></div>

                {/* =====================================================
                    DEPTH INDICATOR (Vertical progress)
                ===================================================== */}
                <div className="depth-indicator">
                    <div className="depth-line">
                        <div className="depth-line-progress"></div>
                    </div>
                    <div className="depth-label surface">000m</div>
                    <div className="depth-label deep">6000m</div>
                </div>

                {/* =====================================================
                    HERO
                ===================================================== */}
                <section className="journey-hero">
                    <div className="journey-hero-bg"></div>
                    <div className="journey-hero-overlay"></div>

                    <div className="journey-hero-content">
                        <div className="journey-hero-label">
                            SIH26067 · MOES / INCOIS OPERATIONAL DIGITAL TWIN
                        </div>

                        <h1 className="journey-hero-title">
                            <span>DESCEND</span>
                            <span>INTO THE 4D</span>
                            <span>OCEAN.</span>
                        </h1>

                        <p className="journey-hero-description">
                            Synthesizing multi-source in-situ observational networks with 4D hydrodynamic numerical models across the Indian Ocean basin.
                        </p>
                    </div>

                    <div className="journey-scroll">
                        <span>SCROLL TO DESCEND (0m → 6,000m)</span>
                        <div className="scroll-line"></div>
                    </div>
                </section>

                {/* =====================================================
                    INTRO
                ===================================================== */}
                <section className="journey-intro">
                    <div className="journey-container">
                        <div className="journey-intro-label journey-reveal">
                            01 · MULTI-DIMENSIONAL DIGITAL TWIN
                        </div>

                        <h2 className="journey-intro-title journey-reveal">
                            The ocean is not
                            <br />
                            a static map.
                        </h2>

                        <p className="journey-intro-text journey-reveal">
                            It is an unsteady four-dimensional fluid system preserving dynamics across latitude, longitude, vertical depth, and time. From air-sea monsoon exchanges to abyssal benthic currents, VORTEX unites numerical models with verified in-situ oceanographic observations.
                        </p>
                    </div>
                </section>

                {/* =====================================================
                    OCEAN LAYERS (VERTICAL DEPTH DESCENT)
                ===================================================== */}
                <section className="ocean-layers">
                    <div className="journey-container">
                        <div className="section-heading">
                            <span className="section-number">02</span>
                            <span>OPERATIONAL OBSERVATION NETWORKS BY DEPTH</span>
                        </div>

                        {/* LAYER 01: SURFACE (000m) */}
                        <article className="ocean-layer surface-layer">
                            <div className="layer-depth">000m</div>
                            <div className="layer-content">
                                <span className="layer-tag">
                                    02.1 · AIR-SEA BOUNDARY & MONSOON OBSERVATORIES
                                </span>
                                <h2>
                                    Where atmosphere
                                    <br />
                                    drives the seas.
                                </h2>
                                <p>
                                    Moored buoy networks (OMNI & RAMA-2.0) deploy 3-meter meteorological towers and inductive cables down to 500m. They capture real-time wind stress, heat fluxes, and cyclogenesis across the Arabian Sea and Bay of Bengal.
                                </p>

                                <div className="layer-spec">
                                    <span className="spec-pill"><strong>MAST:</strong> 3m Elevation Sensors</span>
                                    <span className="spec-pill"><strong>WINDS:</strong> ±0.2 m/s Ultrasonic</span>
                                    <span className="spec-pill"><strong>CADENCE:</strong> Hourly Satellite Telemetry</span>
                                </div>

                                <div className="layer-actions">
                                    <Link to="/dashboard" className="layer-cta">
                                        [ EXPLORE MOORED BUOY ARRAYS ↗ ]
                                    </Link>
                                </div>
                            </div>
                        </article>

                        {/* LAYER 02: TWILIGHT (200m) */}
                        <article className="ocean-layer twilight-layer">
                            <div className="layer-depth">200m</div>
                            <div className="layer-content">
                                <span className="layer-tag">
                                    02.2 · MESOSCALE TRANSECTS & HALOCLINES
                                </span>
                                <h2>
                                    Freshwater haloclines
                                    <br />
                                    & barrier layers.
                                </h2>
                                <p>
                                    Autonomous underwater gliders fly undulating saw-tooth transects through boundary currents. Buoyancy engines sample thin river runoff layers (&lt;15m) and the 20°C Isotherm (D20), resolving barrier layers that trap solar heat.
                                </p>

                                <div className="layer-spec">
                                    <span className="spec-pill"><strong>BUOYANCY:</strong> ±500cc Displacement</span>
                                    <span className="spec-pill"><strong>GLIDE:</strong> 15°–26° Pitch Angle</span>
                                    <span className="spec-pill"><strong>SCHEMA:</strong> NetCDF TrajectoryProfile</span>
                                </div>

                                <div className="layer-actions">
                                    <Link to="/dashboard" className="layer-cta">
                                        [ VIEW GLIDER TRANSECTS ↗ ]
                                    </Link>
                                </div>
                            </div>
                        </article>

                        {/* LAYER 03: MIDNIGHT (1,000m) */}
                        <article className="ocean-layer midnight-layer">
                            <div className="layer-depth">1000m</div>
                            <div className="layer-content">
                                <span className="layer-tag">
                                    02.3 · LAGRANGIAN PROFILING (ARGO ARRAY)
                                </span>
                                <h2>
                                    Argo array &amp;
                                    <br />
                                    biogeochemical casts.
                                </h2>
                                <p>
                                    Autonomous floats drift for 9 days at an isobaric parking depth of 1,000 dbar before profiling to 2,000 meters. Onboard SBE CTD and optical sensors measure vertical salinity, dissolved oxygen, and pH with research-grade quality flags.
                                </p>

                                <div className="layer-spec">
                                    <span className="spec-pill"><strong>ACCURACY:</strong> ±0.002°C / ±0.003 PSU</span>
                                    <span className="spec-pill"><strong>INTERVAL:</strong> 10-Day Profiling Cycle</span>
                                    <span className="spec-pill"><strong>PORTAL:</strong> INCOIS National Argo Centre</span>
                                </div>

                                <div className="layer-actions">
                                    <Link to="/dashboard" className="layer-cta">
                                        [ ACCESS ARGO PROFILING CASTS ↗ ]
                                    </Link>
                                </div>
                            </div>
                        </article>

                        {/* LAYER 04: ABYSS (4,000m) */}
                        <article className="ocean-layer abyss-layer">
                            <div className="layer-depth">4000m</div>
                            <div className="layer-content">
                                <span className="layer-tag">
                                    02.4 · BATHYPELAGIC PLAIN & BOTTOM WATER
                                </span>
                                <h2>
                                    Cold bottom waters
                                    <br />
                                    &amp; fracture zones.
                                </h2>
                                <p>
                                    Cold Antarctic Bottom Water (AABW) enters through deep oceanic fracture zones. Deep Argo floats extend surveillance down to 6,000m, establishing planetary heat uptake baselines beneath 400 atmospheres of hydrostatic pressure.
                                </p>

                                <div className="layer-spec">
                                    <span className="spec-pill"><strong>PRESSURE:</strong> ≤400 bar Hydrostatic</span>
                                    <span className="spec-pill"><strong>TERRAIN:</strong> GEBCO 3D Bathymetry Grid</span>
                                    <span className="spec-pill"><strong>QC FLAG:</strong> Level-1 Research Flag</span>
                                </div>

                                <div className="layer-actions">
                                    <Link to="/dashboard" className="layer-cta">
                                        [ INSPECT ABYSSAL HYDROGRAPHY ↗ ]
                                    </Link>
                                </div>
                            </div>
                        </article>

                        {/* LAYER 05: HADAL (6,000m) */}
                        <article className="ocean-layer hadal-layer">
                            <div className="layer-depth">6000m</div>
                            <div className="layer-content">
                                <span className="layer-tag">
                                    02.5 · BENTHIC EXPLORATION &amp; MATSYA-6000
                                </span>
                                <h2>
                                    Samudrayaan &amp;
                                    <br />
                                    sub-seafloor surveys.
                                </h2>
                                <p>
                                    Under India's Deep Ocean Mission, the crewed submersible Matsya-6000 operates inside a 2.1m titanium alloy (Ti-6Al-4V) sphere at 600 bar. Paired with AUV OMe 6000, it evaluates benthic currents and polymetallic nodule deposits.
                                </p>

                                <div className="layer-spec">
                                    <span className="spec-pill"><strong>HULL:</strong> Titanium Sphere (Ti-6Al-4V)</span>
                                    <span className="spec-pill"><strong>SUPPORT:</strong> 96-Hour Life Support</span>
                                    <span className="spec-pill"><strong>PAYLOAD:</strong> 4K LiDAR &amp; Dual Manipulators</span>
                                </div>

                                <div className="layer-actions">
                                    <Link to="/dashboard" className="layer-cta">
                                        [ BENTHIC MISSION OVERVIEW ↗ ]
                                    </Link>
                                </div>
                            </div>
                        </article>

                    </div>
                </section>

                {/* =====================================================
                    DATA SECTION (PHYSICAL OBSERVABLES)
                ===================================================== */}
                <section className="journey-data">
                    <div className="journey-container">
                        <div className="section-heading">
                            <span className="section-number">03</span>
                            <span>CORE PHYSICAL &amp; BIOGEOCHEMICAL VARIABLES</span>
                        </div>

                        <div className="journey-data-header">
                            <h2 className="journey-reveal">
                                Multi-variable
                                <br />
                                synthesis.
                            </h2>

                            <p className="journey-reveal">
                                VORTEX translates heterogeneous multi-dimensional arrays into verified physical diagnostics across the northern Indian Ocean.
                            </p>
                        </div>

                        <div className="journey-data-grid">

                            {/* CARD 01 */}
                            <article className="journey-data-card">
                                <div className="data-card-number">01</div>
                                <div className="data-card-icon">≋</div>
                                <h3>Ocean Currents &amp; Wyrtki Jets</h3>
                                <p>
                                    4D hydrodynamic velocity vectors (u, v, w) resolving semi-annual equatorial Wyrtki Jets, the reversing Somali Current, and coastal mesoscale eddies.
                                </p>
                                <span className="data-card-tag">ROMS &amp; HYCOM 4D VECTORS</span>
                                <Link to="/dashboard" className="data-card-arrow-link">
                                    <span className="data-card-arrow">↗</span>
                                </Link>
                            </article>

                            {/* CARD 02 */}
                            <article className="journey-data-card">
                                <div className="data-card-number">02</div>
                                <div className="data-card-icon">°C</div>
                                <h3>Thermal Structure &amp; TCHP</h3>
                                <p>
                                    High-resolution vertical thermal profiles, Depth of 20°C Isotherm (D20), and Tropical Cyclone Heat Potential (TCHP) pre-storm reservoirs.
                                </p>
                                <span className="data-card-tag">ACCURACY ±0.002°C</span>
                                <Link to="/dashboard" className="data-card-arrow-link">
                                    <span className="data-card-arrow">↗</span>
                                </Link>
                            </article>

                            {/* CARD 03 */}
                            <article className="journey-data-card">
                                <div className="data-card-number">03</div>
                                <div className="data-card-icon">S</div>
                                <h3>Salinity &amp; Haloclines</h3>
                                <p>
                                    Practical Salinity Units (PSU) mapping northern Bay of Bengal river runoff haloclines and high-salinity Arabian Sea water mass exchanges.
                                </p>
                                <span className="data-card-tag">GLIDER &amp; ARGO CASTS</span>
                                <Link to="/dashboard" className="data-card-arrow-link">
                                    <span className="data-card-arrow">↗</span>
                                </Link>
                            </article>

                            {/* CARD 04 */}
                            <article className="journey-data-card">
                                <div className="data-card-number">04</div>
                                <div className="data-card-icon">●</div>
                                <h3>Chlorophyll &amp; PFZ Advisories</h3>
                                <p>
                                    Oceansat-3 OCM satellite ocean color and thermal front (∇SST) gradient advisories delineating Potential Fishing Zones along the continental shelf.
                                </p>
                                <span className="data-card-tag">INCOIS PFZ ADVISORY SUITE</span>
                                <Link to="/dashboard" className="data-card-arrow-link">
                                    <span className="data-card-arrow">↗</span>
                                </Link>
                            </article>

                        </div>
                    </div>
                </section>

                {/* =====================================================
                    HORIZONTAL JOURNEY (LEFT-TO-RIGHT PINNED TRACK)
                    SIH26067 Digital Twin Pipeline
                ===================================================== */}
                <section className="horizontal-journey">
                    <div className="horizontal-track">

                        {/* PANEL 1: INGESTION */}
                        <article className="journey-panel panel-one">
                            <div className="panel-index">01 / 04</div>
                            <div className="panel-content">
                                <span>STAGE 01 · DATA INGESTION</span>
                                <h2>
                                    Multi-source
                                    <br />
                                    telemetry.
                                </h2>
                                <p>
                                    Automated ingestion of NetCDF-4, OPeNDAP, and ERDDAP streams from INCOIS Argo Data Centre, NOAA PMEL moored buoys, and Oceansat-3 satellite radiometers.
                                </p>
                                <div className="panel-badge">
                                    <span>OPeNDAP / ERDDAP / WCS PROTOCOLS</span>
                                </div>
                            </div>
                        </article>

                        {/* PANEL 2: ASSIMILATION */}
                        <article className="journey-panel panel-two">
                            <div className="panel-index">02 / 04</div>
                            <div className="panel-content">
                                <span>STAGE 02 · DATA ASSIMILATION</span>
                                <h2>
                                    4D numerical
                                    <br />
                                    circulation.
                                </h2>
                                <p>
                                    Coupled ROMS Regional Analysis of Indian Ocean (RAIN) running an 80-member Local Ensemble Transform Kalman Filter (LETKF) on 40 terrain-following sigma levels.
                                </p>
                                <div className="panel-badge">
                                    <span>ROMS LETKF · 9KM BASIN RESOLUTION</span>
                                </div>
                            </div>
                        </article>

                        {/* PANEL 3: RENDERING */}
                        <article className="journey-panel panel-three">
                            <div className="panel-index">03 / 04</div>
                            <div className="panel-content">
                                <span>STAGE 03 · GPU RENDERING</span>
                                <h2>
                                    Volumetric
                                    <br />
                                    ray-marching.
                                </h2>
                                <p>
                                    Dual CesiumJS ellipsoidal terrain paired with WebGL2 compute shaders for real-time ray-marching of 3D scalar fields and particle advection at 60 FPS.
                                </p>
                                <div className="panel-badge">
                                    <span>WEBGL2 · 60 FPS PARTICLES</span>
                                </div>
                            </div>
                        </article>

                        {/* PANEL 4: ADVISORIES */}
                        <article className="journey-panel panel-four">
                            <div className="panel-index">04 / 04</div>
                            <div className="panel-content">
                                <span>STAGE 04 · OPERATIONAL ADVISORY</span>
                                <h2>
                                    Coastal hazard
                                    <br />
                                    intelligence.
                                </h2>
                                <p>
                                    Delivering operational Ocean State Forecasts (WAVEWATCH-III wave heights, swell periods) and satellite Potential Fishing Zone advisories to coastal communities.
                                </p>
                                <div className="panel-badge">
                                    <span>INCOIS OSF / PFZ ADVISORY SUITE</span>
                                </div>
                            </div>
                        </article>

                    </div>
                </section>

                {/* =====================================================
                    MISSION SECTION
                ===================================================== */}
                <section className="journey-mission">
                    <div className="journey-container">
                        <div className="section-heading">
                            <span className="section-number">05</span>
                            <span>INSTITUTIONAL VALIDATION &amp; PURPOSE</span>
                        </div>

                        <div className="mission-layout">
                            <div>
                                <span className="mission-label">SIH26067 · PROBLEM STATEMENT</span>
                                <h2 className="journey-reveal">
                                    Bridging models
                                    <br />
                                    with ground truth.
                                </h2>
                            </div>

                            <div className="mission-copy journey-reveal">
                                <p>
                                    Operational oceanography requires moving beyond static 2D web maps into dynamic digital twins. VORTEX unifies petascale numerical simulations with real-time in-situ instruments.
                                </p>
                                <p>
                                    Aligned with the operational mandates of the Ministry of Earth Sciences (MoES) and INCOIS to empower researchers, maritime operators, and coastal communities.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    FINAL CTA
                ===================================================== */}
                <section className="journey-final">
                    <div className="journey-final-bg"></div>
                    <div className="journey-final-overlay"></div>

                    <div className="journey-final-content">
                        <span>ACCESSIBLE SCIENTIFIC INTELLIGENCE</span>

                        <h2 className="journey-final-title">
                            <span>LAUNCH</span>
                            <span>WORKBENCH.</span>
                        </h2>

                        <Link to="/dashboard" className="journey-final-button">
                            Launch 3D Ocean Workbench
                            <span>↗</span>
                        </Link>
                    </div>
                </section>

            </main>
        </>
    );
}