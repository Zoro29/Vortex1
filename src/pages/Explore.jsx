import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import gsap from "gsap";

import OceanEnvironment from "../components/OceanEnvironment";
import ArgoFloat from "../components/ArgoFloat";
import { ARGO_CALLOUTS } from "../data/argoCallouts";
import { createNarrator } from "../utils/narrator";
import { PARAMETERS, SOURCES, ZONES } from "../data/oceanProfile";
import "../css/ocean.css";
import "../css/Explore.css";

const formatValue = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(2));

// Narration runs at rate 1.02, which lands near 2.6 words per second once
// sentence pauses are counted. Silent reading of the on-screen detail is faster.
const SPOKEN_WPS = 2.6;
const READ_WPS = 3.6;
const PAD = 3;
const MIN_SCENE = 11;
const MAX_SCENE = 34;

const ENTER = 1.2;
const EXIT = 0.9;

// The float only appears for the platforms that actually are one.
const ARGO_SOURCES = { "argo-floats": "core", "bgc-argo": "bgc" };

const countWords = (text) => text.trim().split(/\s+/).length;

/** Left column, then right column. Odd counts put the extra reading on the left. */
const splitParams = (keys) => {
  const half = Math.ceil(keys.length / 2);
  return [keys.slice(0, half), keys.slice(half)];
};

const SPEEDS = [1, 1.5, 2];

/**
 * Narration is the headline only: label, title and the narrative line. The
 * readings, observations and units stay on screen but are never read aloud -
 * spoken numbers are noise, and they stretch the journey badly.
 */
function narrationFor(scene) {
  return [scene.label, scene.title, scene.subtitle].filter(Boolean).join(". ");
}

/** Everything shown on screen, used to make sure a scene outlasts its reading. */
function visibleTextFor(scene) {
  const parts = [scene.label, scene.title, scene.subtitle, scene.note];
  if (scene.zone) parts.push(...scene.zone.insights.map(([term, text]) => `${term} ${text}`));
  return parts.filter(Boolean).join(" ");
}

/**
 * A scene lasts as long as the slower of the two: hearing it, or reading it.
 * Whichever wins, narration can never be cut off by the next scene starting.
 */
function durationFor(scene) {
  const spoken = countWords(narrationFor(scene)) / SPOKEN_WPS;
  const read = countWords(visibleTextFor(scene)) / READ_WPS;
  return gsap.utils.clamp(MIN_SCENE, MAX_SCENE, Math.max(spoken, read) + PAD);
}

/**
 * When each piece of a scene surfaces, relative to the scene's own start.
 * Nothing arrives at the same moment as anything else: the eye is led down the
 * central axis, then outward to the detail.
 */
function revealDelay(role, slot, hold) {
  switch (role) {
    case "label":
      return 0.1;
    case "title":
      return 0.45;
    case "subtitle":
      return 1.05;
    case "note":
      return 1.6;
    case "params":
      return 2.1;
    case "insight":
      return ENTER + hold * (0.05 + 0.16 * slot);
    default:
      return 0.4;
  }
}

/** The running order, after the prologue: every depth zone, then the close. */
function buildScenes(config) {
  const zones = ZONES.map((zone, index) => ({
    kind: "zone",
    zone,
    index,
    label: `${zone.depth.toLocaleString()} metres · ${zone.zone}`,
    title: zone.title,
    subtitle: zone.subtitle,
    note: config.notes[index],
    depth: zone.depth,
    zoneIndex: index,
  }));

  const closing = {
    kind: "close",
    label: "End of descent",
    title: "The seabed.",
    subtitle:
      "Six thousand metres of water column, measured on the way down. The instruments keep working long after the narration stops.",
    depth: ZONES[ZONES.length - 1].depth,
    zoneIndex: ZONES.length - 1,
  };

  return [...zones, closing];
}

export default function Explore() {
  const { source } = useParams();
  const config = SOURCES[source];
  const argoVariant = ARGO_SOURCES[source];

  const rootRef = useRef(null);
  const prologueRef = useRef(null);
  const depthLabelRef = useRef(null);
  const progressRef = useRef(null);
  const veilRef = useRef(null);
  const masterRef = useRef(null);

  // Read by the particle canvas without re-rendering React.
  const depthRef = useRef(0);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  // The timeline is built once; the speed it runs at is read, never depended on.
  const speedRef = useRef(1);
  speedRef.current = speed;

  const narratorRef = useRef(null);
  if (!narratorRef.current && typeof window !== "undefined") {
    narratorRef.current = createNarrator();
  }

  useEffect(() => () => narratorRef.current?.destroy(), []);

  const scenes = config ? buildScenes(config) : [];

  // ---- Prologue ----------------------------------------------------------
  // On screen and spoken from the first frame. No delay, no waiting.
  useEffect(() => {
    if (!config) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.to(veilRef.current, { autoAlpha: 0, duration: 1.2, ease: "power2.out" });

      gsap.from(".prologue-line", {
        y: 30,
        autoAlpha: 0,
        filter: "blur(6px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        delay: 0.2,
      });
    }, rootRef);

    narratorRef.current?.speak([config.label, config.name, config.intro].join(". "));

    return () => {
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [config]);

  // ---- The journey -------------------------------------------------------
  // Built up front, held paused, released by the CTA.
  useEffect(() => {
    if (!config) return undefined;

    const list = buildScenes(config);

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const speak = (text) => narratorRef.current?.speak(text);

      const light = { value: ZONES[0].light };
      const depth = { value: 0 };

      const master = gsap.timeline({
        paused: true,
        onUpdate: () => {
          root.style.setProperty("--light", String(light.value));
          depthRef.current = gsap.utils.clamp(0, 1, master.progress());

          const label = depthLabelRef.current;
          if (label) label.textContent = Math.round(depth.value).toLocaleString();

          const bar = progressRef.current;
          if (bar) bar.style.transform = `scaleX(${master.progress()})`;
        },
      });

      master.timeScale(speedRef.current);
      masterRef.current = master;

      // The float hangs on the central axis; GSAP owns its transform outright,
      // so the horizontal centring has to live here rather than in CSS.
      if (argoVariant) master.set(".argo", { xPercent: -50 }, 0);

      // Absolute placement on one clock. Every fragment of a scene - narration,
      // water, each piece of text - is pinned to its own start time, so a scene
      // is discovered piece by piece instead of arriving as one block.
      let cursor = 0;

      list.forEach((scene, index) => {
        const node = document.getElementById(`scene-${index}`);
        const frags = Array.from(node.querySelectorAll(".frag"));
        const zone = ZONES[scene.zoneIndex];
        const isLast = index === list.length - 1;

        const total = durationFor(scene);
        const hold = total - ENTER - EXIT;
        const settle = ENTER + hold * 0.5;
        const leaveAt = cursor + ENTER + hold;

        master.call(() => speak(narrationFor(scene)), null, cursor);

        // The water reaches this zone's colour and light while the content
        // arrives, so the environment and the story change together.
        master.to(
          ".ocean-body",
          { backgroundColor: zone.color, duration: settle, ease: "sine.inOut" },
          cursor
        );
        master.to(light, { value: zone.light, duration: settle, ease: "sine.inOut" }, cursor);
        master.to(depth, { value: scene.depth, duration: settle, ease: "sine.inOut" }, cursor);

        master.set(node, { autoAlpha: 1, pointerEvents: "auto" }, cursor);

        // ---- The float rides the same clock ------------------------------
        if (argoVariant && scene.kind === "zone") {
          const callout = ARGO_CALLOUTS[scene.index];

          master.to(
            ".argo",
            {
              yPercent: scene.index * 6,
              scale: 1 - scene.index * 0.06,
              rotate: -3 + scene.index * 1.3,
              autoAlpha: callout ? 1 : 0.14,
              filter: `blur(${scene.index * 0.4}px)`,
              duration: settle,
              ease: "sine.inOut",
            },
            cursor
          );

          master.call(
            () => {
              document.querySelectorAll(".argo-hotspot").forEach((pin) => {
                const on = callout && pin.dataset.part === callout.part;
                pin.classList.toggle("is-active", Boolean(on));
                if (on) pin.querySelector(".argo-tag em").textContent = callout.note;
              });
            },
            null,
            cursor + ENTER * 0.6
          );
        }

        frags.forEach((frag) => {
          const z = Number(frag.dataset.z);
          const slot = Number(frag.dataset.slot ?? 0);
          const appearAt = cursor + revealDelay(frag.dataset.role, slot, hold);

          frag.style.setProperty("--z", String(z));
          const near = 1 - z;
          const rise = 30 * near + 10;
          const drift = -(16 * near + 4);

          master.fromTo(
            frag,
            { y: rise, autoAlpha: 0, filter: "blur(7px)" },
            { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" },
            appearAt
          );

          master.to(
            frag,
            { y: drift, duration: Math.max(leaveAt - appearAt - 1.5, 0.1), ease: "none" },
            appearAt + 1.5
          );

          if (!isLast) {
            master.to(
              frag,
              {
                y: drift - 22 * near - 6,
                autoAlpha: 0,
                filter: "blur(6px)",
                duration: EXIT,
                ease: "power2.in",
              },
              leaveAt + z * 0.2
            );
          }
        });

        if (isLast) {
          cursor += ENTER + hold;
        } else {
          master.set(node, { autoAlpha: 0, pointerEvents: "none" }, leaveAt + EXIT + 0.25);
          cursor = leaveAt + EXIT + 0.25;
        }
      });
    }, rootRef);

    return () => {
      narratorRef.current?.stop();
      masterRef.current = null;
      ctx.revert();
    };
  }, [config, source, argoVariant]);

  // Journey and narration move together: the timeline is scaled and the voice
  // is given the matching rate, so a scene still outlasts the words in it.
  // ponytail: the sentences already queued keep the old rate; the next scene
  // picks the new one up. Re-speak from the current scene if that ever shows.
  useEffect(() => {
    masterRef.current?.timeScale(speed);
    narratorRef.current?.setRate(speed);
  }, [speed]);

  // ---- Controls ----------------------------------------------------------
  const begin = () => {
    if (started) return;
    setStarted(true);
    narratorRef.current?.stop();

    gsap.to(prologueRef.current, {
      autoAlpha: 0,
      y: -40,
      filter: "blur(8px)",
      duration: 0.85,
      ease: "power2.in",
      onComplete: () => masterRef.current?.play(),
    });
  };

  const setPlayback = (next) => {
    setPlaying(next);
    if (next) {
      narratorRef.current?.resume();
      if (started) masterRef.current?.resume();
    } else {
      narratorRef.current?.pause();
      masterRef.current?.pause();
    }
  };

  if (!config) return <Navigate to="/404" replace />;

  return (
    <main className="dive" ref={rootRef}>
      {/* Water column: flat base colour, light from above, haze below. */}
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

      {argoVariant && <ArgoFloat variant={argoVariant} />}

      <header className="dive-head">
        <Link className="dive-back" to="/">
          Surface
        </Link>

        <span className="dive-depth">
          <b ref={depthLabelRef}>0</b> m
        </span>

        <div className="dive-audio">
          <button
            type="button"
            className="audio-btn speed-btn"
            aria-label={`Playback speed ${speed} times, change`}
            onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
          >
            {speed}&#215;
          </button>

          <button
            type="button"
            className={`audio-btn ${playing ? "is-on" : ""}`}
            aria-label="Play narration"
            onClick={() => setPlayback(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </button>

          <button
            type="button"
            className={`audio-btn ${playing ? "" : "is-on"}`}
            aria-label="Pause narration"
            onClick={() => setPlayback(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3.4v14H7zm6.6 0H17v14h-3.4z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Prologue: centred on the float, spoken from the first frame. */}
      {!started && (
        <section className="prologue" ref={prologueRef}>
          <span className="prologue-label prologue-line">
            <i />
            {config.label}
            <i />
          </span>

          <h1 className="prologue-title prologue-line">{config.name}</h1>

          <p className="prologue-intro prologue-line">{config.intro}</p>

          <button type="button" className="prologue-cta prologue-line" onClick={begin}>
            Continue exploration
          </button>
        </section>
      )}

      {/* Scenes are inhabited spaces: each fragment sits at its own place in
          the frame and at its own depth in the water. */}
      <div className="scene-stack">
        {scenes.map((scene, index) => (
          <section className="scene" id={`scene-${index}`} key={`${scene.kind}-${index}`}>
            {/* Central axis: the story reads down the middle of the frame. */}
            <div className="scene-axis">
              <div className="frag frag-label" data-role="label" data-z="0.4">
                <span className="frag-inner">
                  <i className="frag-tick" />
                  {scene.label}
                  <i className="frag-tick" />
                </span>
              </div>

              <div className="frag frag-title" data-role="title" data-z="0.04">
                <h2 className="frag-inner">{scene.title}</h2>
              </div>

              <div className="frag frag-subtitle" data-role="subtitle" data-z="0.16">
                <p className="frag-inner">{scene.subtitle}</p>
              </div>

              {scene.note && (
                <div className="frag frag-note" data-role="note" data-z="0.3">
                  <p className="frag-inner">{scene.note}</p>
                </div>
              )}

              {scene.zone && (
                <div className="scene-detail">
                  {scene.zone.insights.map(([term, text], slot) => (
                    <div
                      className="frag frag-insight"
                      data-role="insight"
                      data-slot={slot}
                      data-z={0.46 + slot * 0.05}
                      style={{ "--slot": slot }}
                      key={term}
                    >
                      <div className="frag-inner">
                        <span className="insight-term">{term}</span>
                        <p className="insight-text">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {scene.kind === "close" && (
                <div className="frag frag-actions" data-role="params" data-z="0.1">
                  <div className="frag-inner">
                    <Link className="scene-cta" to="/dashboard">
                      Open the workbench
                    </Link>
                    <Link className="scene-cta ghost" to="/">
                      Return to the surface
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Readings hang either side of the float, never across it: the
                first half of the list to the left, the rest to the right. */}
            {scene.kind === "zone" &&
              splitParams(config.parameters).map((keys, side) => (
                <div
                  className={`frag frag-params ${side ? "is-right" : "is-left"}`}
                  data-role="params"
                  data-z="0.58"
                  key={side}
                >
                  <div className="frag-inner">
                    {keys.map((key) => {
                      const parameter = PARAMETERS[key];
                      const value = parameter.values[scene.index];

                      return (
                        <p className="param" key={key}>
                          <span>{parameter.label}</span>
                          <b>{value === null ? "—" : formatValue(value)}</b>
                          <i>{value === null ? "no signal" : parameter.unit}</i>
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
          </section>
        ))}
      </div>

      <div className="dive-progress" aria-hidden="true">
        <i ref={progressRef} />
      </div>

      <div className="dive-veil" ref={veilRef} />
    </main>
  );
}
