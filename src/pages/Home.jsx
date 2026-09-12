import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { Box3, MathUtils, Vector3 } from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { useNavigate } from "react-router-dom";

import "../css/Home.css";

gsap.registerPlugin(ScrollTrigger, Observer);

const MODEL_URL = "/models/earth.glb";
const VIDEO_URL = "/video/home.mp4";

const CHAPTERS = [
  {
    indexLabel: "chapter 01",
    subtitle: "Argo Floats",
    title: "Four thousand drifters, one shared logbook.",
    copy: "Argo floats park at 1,000 metres, drift with the current for nine days, then rise to 2,000 metres and read temperature and salinity the whole way up.",
    cta: "Dive with a float",
    source: "argo-floats",
  },
  {
    indexLabel: "chapter 02",
    subtitle: "BGC-Argo",
    title: "The chemistry of a living ocean.",
    copy: "Biogeochemical floats add oxygen, nitrate, pH, chlorophyll and backscatter, turning a physical survey into a record of how the ocean breathes.",
    cta: "Dive into the chemistry",
    source: "bgc-argo",
  },
  {
    indexLabel: "chapter 03",
    subtitle: "CTD",
    title: "The cast that anchors everything.",
    copy: "A ship stops, a rosette goes over the side, and a research-grade CTD returns the calibration reference that every autonomous platform is measured against.",
    cta: "Follow the cast down",
    source: "ctd",
  },
  {
    indexLabel: "chapter 04",
    subtitle: "Gliders",
    title: "Flying the water column.",
    copy: "Gliders convert buoyancy into forward motion and fly saw-tooth transects for weeks, resolving fronts and eddies that a drifting float would pass straight through.",
    cta: "Fly the transect",
    source: "gliders",
  },
];

const DISPLAY_CHAPTERS = [...CHAPTERS, CHAPTERS[0]];

// The colour the dive fades into. Explore.css starts its arrival veil here, so
// the two pages meet on the same frame.
const DIVE_COLOR = "#02121f";

// Playback speed at the end of the story. Kept low on purpose: this is pacing,
// not fast-forward.
const MAX_PLAYBACK_RATE = 1.35;

// Earth radius in world units before the viewport fit is applied.
const BASE_RADIUS = 1;

// Share of the smaller viewport dimension the earth fills at rest.
const VIEWPORT_FILL = 0.78;

// Yaw that turns the interesting face of the texture towards the camera.
const REST_YAW = 6.39;

const CAMERA_REST_Z = 5;
const CAMERA_END_Z = 1.15;

function Earth({ anim }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef(null);
  const viewport = useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);

  // Normalize the unknown GLB scale/offset to BASE_RADIUS centred on the origin.
  const { scale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const radius = Math.max(size.x, size.y, size.z) / 2 || 1;
    const s = BASE_RADIUS / radius;
    return { scale: s, offset: center.multiplyScalar(-s) };
  }, [scene]);

  // Fit to the smaller viewport dimension so the whole globe stays in frame.
  const span = Math.min(viewport.width, viewport.height);
  const fit = (span * VIEWPORT_FILL) / (BASE_RADIUS * 2);

  useFrame(() => {
    // Cinematic dolly towards the surface. The planet itself is never touched.
    camera.position.z = MathUtils.lerp(CAMERA_REST_Z, CAMERA_END_Z, anim.current.zoom);
  });

  return (
    <group ref={groupRef} scale={fit} rotation={[0, REST_YAW, 0]}>
      <primitive object={scene} scale={scale} position={offset} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

function Scene({ anim }) {
  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_REST_Z], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#04060c"]} />

      <Stars radius={140} depth={70} count={3500} factor={4} saturation={0} fade speed={0.3} />

      {/* Key light from upper right, cold rim from behind for atmospheric depth. */}
      <ambientLight intensity={0.32} />
      <directionalLight position={[3, 2, 3]} intensity={2.4} />
      <directionalLight position={[-6, -1, -4]} intensity={1.1} color="#3f7fd8" />

      <Suspense fallback={null}>
        <Earth anim={anim} />
      </Suspense>
    </Canvas>
  );
}

export default function Home() {
  const anim = useRef({ zoom: 0 });
  const rootRef = useRef(null);
  const copyRef = useRef(null);
  const stageRef = useRef(null);
  const portalRef = useRef(null);
  const videoRef = useRef(null);
  const storyRef = useRef(null);
  const scrimRef = useRef(null);
  const locked = useRef(false);
  const diving = useRef(false);
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".home-copy > *", {
        y: 34,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.35,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // The page does not scroll natively, we handle all scrolling with GSAP Observer
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Chapter choreography. Only wired once the story section actually exists.
  useEffect(() => {
    if (!entered) return;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray(".story-chapter");
      const last = chapters.length - 1;

      // Scroll-time budget per chapter. HOLD is reading time, TRANSIT is the
      // handover. Shorter TRANSIT than HOLD keeps the rhythm on the content.
      const HOLD = 2.5;
      const TRANSIT = 1.6;
      const CYCLE = HOLD + TRANSIT;

      // Slow creep while a chapter holds the frame, so it is never frozen.
      const DRIFT = 6;

      /**
       * Distance one chapter travels during a handover, as a percentage of the
       * panel's own width. It has to clear whichever edge is further away, so
       * the same value parks a chapter safely off-screen on both sides.
       *
       * Consecutive chapters are always exactly this far apart, which is what
       * makes overlap impossible rather than merely unlikely.
       */
      const travel = () => {
        const width = chapters[0].offsetWidth || 1;
        const toLeftEdge = window.innerWidth * 0.8; // panel sits 20% off the right
        const toRightEdge = window.innerWidth * 0.2 + width;
        // Increased padding from 12 to 100 to ensure wider chapters (like chapter 2) fully clear the left edge
        return (Math.max(toLeftEdge, toRightEdge) / width) * 100 + 100;
      };

      const tl = gsap.timeline({
        paused: true,
        defaults: { immediateRender: false, force3D: true },
        onUpdate: function () {
          const progress = this.progress();
          const media = videoRef.current;
          if (media && media.playbackRate !== undefined) media.playbackRate = 1 + progress * (MAX_PLAYBACK_RATE - 1);
          if (media && media.contentWindow) {
            media.contentWindow.postMessage({ progress }, '*');
          }
        }
      });

      chapters.forEach((chapter, index) => {
        const at = index * CYCLE;
        
        tl.addLabel(`chapter${index}`, at);

        if (index > 0) {
          tl.set(chapter, { xPercent: () => travel() - DRIFT, autoAlpha: 1 }, 0);
        } else {
          tl.set(chapter, { xPercent: 0, autoAlpha: 1 }, 0);
        }

        tl.to(chapter, { xPercent: -DRIFT, duration: HOLD, ease: "none" }, at);

        if (index < last) {
          tl.to(
            chapter,
            { xPercent: () => -travel(), duration: TRANSIT, ease: "power2.inOut" },
            at + HOLD
          );

          tl.to(
            chapters[index + 1],
            { xPercent: 0, duration: TRANSIT, ease: "power2.inOut" },
            at + HOLD
          );
        }
      });

      // Force the timeline to render frame 0 immediately so Chapter 1 is visible
      tl.progress(0.001).progress(0);

      let currentIndex = 0;
      let animating = false;

      const gotoChapter = (index) => {
        if (animating) return;

        if (index < 0) {
          tl.seek(`chapter${last}`);
          currentIndex = last;
          index = last - 1;
        } else if (index > last) {
          return;
        }

        animating = true;
        currentIndex = index;

        tl.tweenTo(`chapter${currentIndex}`, {
          duration: 2.0, // increased transition speed so it feels responsive
          ease: "power2.inOut",
          onComplete: () => {
            animating = false;
            if (currentIndex === last) {
              tl.progress(0);
              currentIndex = 0;
            }
          }
        });
      };

      Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        // Scroll down (onDown) -> Next chapter
        onDown: () => gotoChapter(currentIndex + 1), 
        // Scroll up (onUp) -> Prev chapter
        onUp: () => gotoChapter(currentIndex - 1),   
        preventDefault: true,
        ignore: "button, a, .home-cta, .story-action, .story-title",
      });

    }, rootRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [entered]);

  const enter = useCallback(() => {
    if (locked.current) return;
    locked.current = true;

    const portal = portalRef.current;
    const media = videoRef.current;

    // Start playback under the closed portal so the first frame is already live
    // when the circle opens. Sound is allowed here: this runs inside the click.
    if (media && typeof media.play === 'function') {
      media.play().catch(() => {
        media.muted = true;
        media.play().catch(() => { });
      });
    }

    const tl = gsap.timeline();

    tl.to(copyRef.current, {
      opacity: 0,
      y: -46,
      filter: "blur(12px)",
      duration: 0.9,
      ease: "power2.in",
    });

    // Dolly towards the surface for the whole transition.
    tl.to(anim.current, { zoom: 1, duration: 3.4, ease: "power2.inOut" }, 0.2);

    // The portal opens from the earth's centre, which sits on the viewport centre.
    tl.set(portal, { autoAlpha: 1 }, 1.1);
    tl.fromTo(
      portal,
      { "--portal": "0vmax" },
      { "--portal": "78vmax", duration: 2.2, ease: "power2.inOut" },
      1.1
    );

    // The video settles back to rest scale as the circle reaches the edges.
    tl.fromTo(
      media,
      { scale: 1.28 },
      { scale: 1, duration: 2.6, ease: "power2.out" },
      1.1
    );

    // Once the circle covers the screen the 3D stage is no longer visible.
    tl.call(() => setEntered(true), null, 3.3);
    tl.to(stageRef.current, { opacity: 0, duration: 0.6 }, 3.1);
  }, []);

  // Chapter CTA: keep pushing into the water, then hand over to the dive page
  // once the frame is already deep blue. No cut, no loading state.
  const dive = useCallback(
    (source) => {
      if (diving.current) return;
      diving.current = true;

      gsap
        .timeline({
          onComplete: () => navigate(`/explore/${source}`),
        })
        .to(".story-panel", { autoAlpha: 0, y: -30, duration: 0.7, ease: "power2.in" }, 0)
        .to(videoRef.current, { scale: 1.55, duration: 1.9, ease: "power2.in" }, 0)
        .to(
          scrimRef.current,
          { backgroundColor: DIVE_COLOR, opacity: 1, duration: 1.6, ease: "power2.in" },
          0.3
        );
    },
    [navigate]
  );

  return (
    <main className={`home ${entered ? "is-entered" : ""}`} ref={rootRef}>
      <section className="home-hero">
        <div className="home-stage" ref={stageRef}>
          <Scene anim={anim} />
        </div>

        <div className="home-copy" ref={copyRef}>
          <span className="home-label">Vortex · Ocean Intelligence</span>

          <h1 className="home-title">
            The planet keeps
            <br />
            its record underwater.
          </h1>

          <p className="home-subtitle">
            Four thousand drifting floats, a fleet of gliders and half a century of casts.
            We open that archive and let you travel through it.
          </p>

          <div className="home-actions">
            <button type="button" className="home-cta" onClick={enter}>
              Enter the experience
            </button>

            <a className="home-cta ghost" href="/journey">
              See the journey
            </a>
          </div>
        </div>
      </section>

      {/* Circular reveal: a clip-path circle grown from the centre of the earth.
          It stays fixed afterwards and becomes the backdrop for the chapters. */}
      <div className="home-portal" ref={portalRef}>
        <iframe
          className="home-video"
          ref={videoRef}
          src="/oceanx-boat.html?scene=timeline&v=3"
          title="OceanX Interactive Boat"
          style={{ border: 'none' }}
        />
        <div className="home-scrim" ref={scrimRef} />
      </div>

      {entered && (
        <section className="story" ref={storyRef}>
          {/* Fixed side panel; the steps below only supply scroll distance. */}
          <div className="story-panel">
            {DISPLAY_CHAPTERS.map((chapter, index) => (
              <article className="headings__wrapper story-chapter" id={`chapter-${index}`} key={`chapter-${index}`}>
                <div className="index__wrapper story-line">{chapter.indexLabel}</div>
                <h3 className="heading story-line">{chapter.subtitle}</h3>
                <h2 className="heading story-line">{chapter.title}</h2>
                <p className="heading story-line">{chapter.copy}</p>

                <div className="link__wrapper story-action story-line">
                  <button
                    type="button"
                    className="home-cta ghost"
                    onClick={() => dive(chapter.source)}
                  >
                    {chapter.cta}
                  </button>
                </div>
              </article>
            ))}
          </div>

        </section>
      )}
    </main>
  );
}
