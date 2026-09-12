import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import OceanEnvironment from "../components/OceanEnvironment";
import { CHAPTERS } from "../data/journeyChapters";
import { createNarrator } from "../utils/narrator";
import "../css/ocean.css";
import "../css/Journey.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Narration is the story, never the instrumentation: label, title, subtitle and
 * the narrative line. Parameters and figures stay on screen and stay unspoken.
 */
const narrationFor = (chapter) =>
  [chapter.label, chapter.title, chapter.subtitle, chapter.narrative].filter(Boolean).join(". ");

export default function Journey() {
  const pageRef = useRef(null);
  const depthLabelRef = useRef(null);
  const progressRef = useRef(null);
  const glowRef = useRef(null);

  // Read by the particle canvas every frame without re-rendering React.
  const depthRef = useRef(0);

  const [narrating, setNarrating] = useState(false);
  const narratingRef = useRef(false);
  narratingRef.current = narrating;

  const narratorRef = useRef(null);
  if (!narratorRef.current && typeof window !== "undefined") {
    narratorRef.current = createNarrator();
  }

  useEffect(() => {
    narratorRef.current?.setEnabled(narrating);
    return undefined;
  }, [narrating]);

  useEffect(() => () => narratorRef.current?.destroy(), []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const page = pageRef.current;

      // ---- The water -----------------------------------------------------
      // One continuous descent, not eight transitions. Colour, light and the
      // depth readout are tweened across the whole page so no chapter boundary
      // is ever visible in the environment.
      const light = { value: CHAPTERS[0].light };
      const depth = { value: 0 };

      const water = gsap.timeline({
        scrollTrigger: {
          trigger: page,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
        onUpdate: () => {
          page.style.setProperty("--light", String(light.value));
          const label = depthLabelRef.current;
          if (label) label.textContent = Math.round(depth.value).toLocaleString();
        },
      });

      CHAPTERS.slice(1).forEach((chapter) => {
        water
          .to(".ocean-body", { backgroundColor: chapter.color, duration: 1, ease: "none" })
          .to(light, { value: chapter.light, duration: 1, ease: "none" }, "<")
          .to(depth, { value: chapter.depth, duration: 1, ease: "none" }, "<");
      });

      // Progress rail and the value the particle field reads.
      ScrollTrigger.create({
        trigger: page,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress }) => {
          depthRef.current = progress;
          const bar = progressRef.current;
          if (bar) bar.style.transform = `scaleY(${progress})`;
        },
      });

      // ---- Chapters ------------------------------------------------------
      gsap.utils.toArray(".chapter").forEach((chapter, index) => {
        const frags = Array.from(chapter.querySelectorAll(".frag"));
        const stage = chapter.querySelector(".chapter-stage");

        frags.forEach((frag) => {
          const z = Number(frag.dataset.z ?? 0.3);
          frag.style.setProperty("--z", String(z));
          const near = 1 - z;

          // Surfaces out of the water as the chapter arrives.
          gsap.fromTo(
            frag,
            {  y: 60 * near + 20, autoAlpha: 0, filter: "blur(8px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 1.4,
              ease: "power3.out",
              // Chapters are adjacent, so this chapter's top edge is the
              // previous chapter's bottom edge. Revealing at 48% leaves the
              // outgoing stage (faded out by 58%) fully clear first.
              scrollTrigger: { trigger: chapter, start: "top 48%" },
            }
          );

          // Then keeps drifting with the current for as long as it is held,
          // near fragments travelling further than deep ones.
          gsap.to(frag, {
            y: -(70 * near + 15),
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top top",
              end: "bottom top",
              scrub: 1.1,
            },
          });
        });

        // The chapter recedes into the haze as the next one comes up behind it.
        if (stage) {
          gsap.to(stage, {
            autoAlpha: 0,
            scale: 0.96,
            filter: "blur(5px)",
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              // Finishes above the 48% mark where the next chapter reveals, so
              // two sticky stages are never legible at the same time.
              start: "bottom 96%",
              end: "bottom 58%",
              scrub: 1,
            },
          });
        }

        // Narration, tied to the chapter actually being on screen.
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 55%",
          end: "bottom 40%",
          onEnter: () => {
            if (narratingRef.current) narratorRef.current?.speak(narrationFor(CHAPTERS[index]));
          },
          onEnterBack: () => {
            if (narratingRef.current) narratorRef.current?.speak(narrationFor(CHAPTERS[index]));
          },
        });
      });

      // ---- The pipeline, told sideways -----------------------------------
      const track = document.querySelector(".pipeline-track");
      if (track) {
        const distance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".pipeline",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            end: () => `+=${distance()}`,
          },
        });
      }

      // ---- A light that follows the reader --------------------------------
      const moveGlow = (event) => {
        gsap.to(glowRef.current, {
          x: event.clientX,
          y: event.clientY,
          duration: 1.1,
          ease: "power3.out",
        });
      };

      window.addEventListener("pointermove", moveGlow, { passive: true });

      // Every trigger position and the pinned section's spacer are measured
      // from text height. The site loads its own webfonts with font-display:
      // swap, so a synchronous refresh here measures the fallback metrics and
      // is stale the moment the real faces land. Re-measure once they have.
      let cancelled = false;
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      ScrollTrigger.refresh();

      return () => {
        cancelled = true;
        window.removeEventListener("pointermove", moveGlow);
      };
    }, pageRef);

    return () => {
      narratorRef.current?.stop();
      ctx.revert();
    };
  }, []);

  return (
    <main className="journey" ref={pageRef}>
      {/* Water column: shared with the dive experience. */}
      <div className="ocean" aria-hidden="true">
        <div className="ocean-body" />
        <div className="ocean-shafts">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="ocean-caustics" />
        <div className="ocean-haze" />
      </div>

      <OceanEnvironment depthRef={depthRef} />

      <div className="journey-glow" ref={glowRef} aria-hidden="true" />

      {/* Instrument rail: where you are in the column, and nothing else. */}
      <div className="journey-hud">
        <Link className="hud-back" to="/">
          Surface
        </Link>

        <div className="hud-depth">
          <b ref={depthLabelRef}>0</b>
          <span>metres</span>
        </div>

        <button
          type="button"
          className={`hud-audio ${narrating ? "is-on" : ""}`}
          aria-pressed={narrating}
          onClick={() => setNarrating((on) => !on)}
        >
          Narration {narrating ? "on" : "off"}
        </button>
      </div>

      <div className="journey-rail" aria-hidden="true">
        <span className="rail-mark">000</span>
        <div className="rail-line">
          <i ref={progressRef} />
        </div>
        <span className="rail-mark">6000</span>
      </div>

      {CHAPTERS.map((chapter) => (
        <Fragment key={chapter.id}>
        <section className="chapter" id={chapter.id}>
          <div className="chapter-stage">
            <div className="chapter-axis">
              <span className="frag chapter-label" data-z="0.42">
                <i />
                {chapter.label}
              </span>

              <h2 className="frag chapter-title" data-z="0.04">
                {chapter.title}
              </h2>

              <p className="frag chapter-subtitle" data-z="0.14">
                {chapter.subtitle}
              </p>

              <p className="frag chapter-narrative" data-z="0.24">
                {chapter.narrative}
              </p>

              {chapter.closing && (
                <Link className="frag chapter-cta" data-z="0.08" to="/dashboard">
                  Launch the ocean workbench
                </Link>
              )}
            </div>

            {/* Detail and the held fact share one column, so they cannot run
                into each other on a short viewport. */}
            <div className="chapter-side">
              <div className="chapter-detail">
                {chapter.insights.map(([term, text]) => (
                  <div className="frag insight" data-z="0.5" key={term}>
                    <span>{term}</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>

              {chapter.facts.map((fact) => (
                <p className="frag chapter-fact" data-z="0.34" key={fact}>
                  {fact}
                </p>
              ))}
            </div>

            {/* Readings, hung in the water rather than tabulated. */}
            <div className="frag chapter-params" data-z="0.62">
              {chapter.params.map(([name, value, unit]) => (
                <p key={name}>
                  <span>{name}</span>
                  <b>{value}</b>
                  {unit && <i>{unit}</i>}
                </p>
              ))}
            </div>
          </div>

        </section>

        {/* The pipeline chapter continues sideways, in its own scroll range:
            a sticky stage and a pinned track cannot share one. */}
        {chapter.stages && (
          <section className="pipeline">
            <div className="pipeline-track">
              {chapter.stages.map((stage) => (
                <article className="stage" key={stage.index}>
                  <span className="stage-index">{stage.index}</span>
                  <span className="stage-label">{stage.label}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.copy}</p>
                  <span className="stage-meta">{stage.meta}</span>
                </article>
              ))}
            </div>
          </section>
        )}
        </Fragment>
      ))}
    </main>
  );
}
