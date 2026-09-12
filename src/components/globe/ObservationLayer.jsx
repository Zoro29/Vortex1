import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { latLonToVector3 } from "../../utils/geo";
import { getArgoTrack } from "../../data/argoObservations";

const SOURCE_COLORS = {
  argo: "#ff7a45",
  bgc: "#b967ff",
  ctd: "#26c6da",
  gliders: "#ffcf4d",
};

const COLOR_PALETTES = {
  Viridis: ["#440154", "#3b528b", "#21918c", "#5ec962", "#fde725"],
  Jet: ["#00007f", "#007fff", "#00ffff", "#ffff00", "#ff0000", "#7f0000"],
  Ocean: ["#031b4f", "#075985", "#0891b2", "#22d3ee", "#d9fbff"],
  Thermal: ["#1b103f", "#7b1fa2", "#e34873", "#ff9d3d", "#fff3a3"],
};

function getColorbarColor(value, colorbar) {
  const colors = COLOR_PALETTES[colorbar?.palette] || COLOR_PALETTES.Viridis;
  const min = colorbar?.min ?? 0;
  const max = colorbar?.max ?? 300;
  const normalized = colorbar?.scale === "log"
    ? (Math.log10(Math.max(value, 1)) - Math.log10(Math.max(min, 1)))
      / (Math.log10(Math.max(max, 1)) - Math.log10(Math.max(min, 1)) || 1)
    : (value - min) / (max - min || 1);
  const position = THREE.MathUtils.clamp(normalized, 0, 1) * (colors.length - 1);
  const index = Math.min(Math.floor(position), colors.length - 2);
  return new THREE.Color(colors[index])
    .lerp(new THREE.Color(colors[index + 1]), position - index)
    .getStyle();
}

// Earth is rendered at a radius of 1.6 units. Actual instruments would be
// imperceptibly small at that scale, so ARGO is deliberately enlarged just
// enough to remain discoverable without reading as a giant surface object.
const PLATFORM_SCALES = {
  argo: 0.45,
  bgc: 0.45,
  ctd: 1,
  gliders: 1,
};

const TRACK_RADIUS = 1.624;

function makeSurfacePath(waypoints) {
  if (waypoints.length < 2) return waypoints;

  const path = [waypoints[0].clone()];
  for (let index = 1; index < waypoints.length; index += 1) {
    const start = waypoints[index - 1].clone().normalize();
    const end = waypoints[index].clone().normalize();
    // Add enough intermediate positions to keep every segment above the
    // curved globe, rather than letting a straight chord cut through it.
    const steps = Math.max(1, Math.ceil(start.angleTo(end) / (Math.PI / 90)));

    for (let step = 1; step <= steps; step += 1) {
      path.push(
        start.clone().lerp(end, step / steps).normalize().multiplyScalar(TRACK_RADIUS),
      );
    }
  }

  return path;
}

function PlatformMarker({ observation, index, isSelected, onSelect, onHoverChange, colorbar, verticalExaggeration }) {
  const markerRef = useRef(null);
  const modelRef = useRef(null);
  const wakeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef(null);
  const position = useMemo(
    // Earth has a 1.6 radius. Keeping the marker base at 1.603 makes it emerge
    // from the ocean surface instead of appearing to float in space.
    () => new THREE.Vector3(...latLonToVector3(
      observation.lat,
      observation.lon,
      1.603 + (verticalExaggeration - 1) * 0.012,
    )),
    [observation.lat, observation.lon, verticalExaggeration],
  );
  const normal = useMemo(() => position.clone().normalize(), [position]);
  const orientation = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize()),
    [position],
  );
  const color = observation.source === "argo"
    ? getColorbarColor(observation.levels, colorbar)
    : SOURCE_COLORS[observation.source];
  const platformScale = PLATFORM_SCALES[observation.source] ?? 1;

  useFrame(({ clock }) => {
    if (!markerRef.current) return;
    const elapsed = clock.getElapsedTime();
    const bob = Math.sin(elapsed * 0.8 + index) * 0.0009;
    markerRef.current.position.copy(position).addScaledVector(normal, bob);

    // A slow, irregular roll keeps the platform feeling waterborne instead of
    // rigidly fixed to the globe. The group is already aligned with the local
    // ocean normal, so this rotates it around its own waterline.
    if (modelRef.current) {
      modelRef.current.rotation.z = Math.sin(elapsed * 0.55 + index * 1.7) * 0.07;
      modelRef.current.rotation.x = Math.cos(elapsed * 0.42 + index) * 0.035;
    }

    if (wakeRef.current) {
      const pulse = (Math.sin(elapsed * 1.15 + index) + 1) / 2;
      wakeRef.current.scale.setScalar(0.9 + pulse * 0.22);
      wakeRef.current.material.opacity = 0.18 + (1 - pulse) * 0.16;
    }
  });

  const startPopupDrag = (event) => {
    event.stopPropagation();
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      popupX: popupPosition.x,
      popupY: popupPosition.y,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const dragPopup = (event) => {
    if (!dragStartRef.current) return;

    event.stopPropagation();
    setPopupPosition({
      x: dragStartRef.current.popupX + event.clientX - dragStartRef.current.pointerX,
      y: dragStartRef.current.popupY + event.clientY - dragStartRef.current.pointerY,
    });
  };

  const stopPopupDrag = (event) => {
    event.stopPropagation();
    dragStartRef.current = null;
  };

  return (
    <group ref={markerRef} position={position} quaternion={orientation} renderOrder={20}>
      <group
        ref={modelRef}
        scale={platformScale}
        onPointerOver={(event) => {
          event.stopPropagation();
          event.nativeEvent.target.style.cursor = "pointer";
          if (observation.source === "argo" || observation.source === "bgc") {
            setIsHovered(true);
            onHoverChange(observation.id);
          }
        }}
        onPointerOut={(event) => {
          event.nativeEvent.target.style.cursor = "auto";
          setIsHovered(false);
          if (observation.source === "argo" || observation.source === "bgc") onHoverChange(null);
        }}
        onPointerDown={(event) => {
          event.nativeEvent.target.style.cursor = "grabbing";
        }}
        onPointerUp={(event) => {
          event.nativeEvent.target.style.cursor = "pointer";
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (observation.source === "argo" || observation.source === "bgc") onSelect(isSelected ? null : observation.id);
        }}
      >
        <mesh ref={wakeRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[0.018, 0.023, 32]} />
          <meshBasicMaterial color="#d8fbff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      {observation.source === "argo" && <>
        {/* ARGO profiling float: lower hull sits below the waterline while the
            buoyant collar, telemetry cap, and antenna remain visible above it. */}
        <mesh position={[0, 0.013, 0]}>
          <cylinderGeometry args={[0.009, 0.011, 0.034, 16]} />
          <meshStandardMaterial color={color} roughness={0.36} metalness={0.12} />
        </mesh>
        {(isHovered || isSelected) && (
          <mesh position={[0, 0.013, 0]}>
            <cylinderGeometry args={[0.0096, 0.0116, 0.0352, 16]} />
            <meshBasicMaterial
              color="#159dff"
              wireframe
              transparent
              opacity={1}
              depthWrite={false}
            />
          </mesh>
        )}
        <mesh position={[0, 0.032, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.008, 20]} />
          <meshStandardMaterial color="#ffae32" roughness={0.42} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.038, 0]}>
          <cylinderGeometry args={[0.008, 0.009, 0.009, 16]} />
          <meshStandardMaterial color="#f7f4e9" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <sphereGeometry args={[0.0075, 16, 12]} />
          <meshStandardMaterial color="#f5f7f4" roughness={0.28} metalness={0.18} />
        </mesh>
        <mesh position={[0.0065, 0.046, 0]}>
          <sphereGeometry args={[0.0016, 10, 8]} />
          <meshBasicMaterial color="#253b49" />
        </mesh>
        <mesh position={[0, 0.057, 0]}>
          <cylinderGeometry args={[0.0009, 0.0009, 0.02, 8]} />
          <meshStandardMaterial color="#293b48" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.0675, 0]}>
          <sphereGeometry args={[0.0017, 8, 8]} />
          <meshBasicMaterial color="#ff584a" />
        </mesh>
        <mesh position={[0, 0.006, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.024, 0.003, 0.007]} />
          <meshStandardMaterial color="#ee5a2c" roughness={0.4} />
        </mesh>
      </>}
      {observation.source === "bgc" && <>
        <mesh position={[0, 0.03, 0]}><capsuleGeometry args={[0.014, 0.06, 6, 12]} /><meshBasicMaterial color={color} /></mesh>
        <mesh position={[0.016, 0.045, 0]}><sphereGeometry args={[0.011, 10, 10]} /><meshBasicMaterial color="#4df6c0" /></mesh>
      </>}
      {observation.source === "ctd" && <>
        <mesh position={[0, 0.028, 0]}><cylinderGeometry args={[0.014, 0.014, 0.065, 12]} /><meshBasicMaterial color={color} /></mesh>
        <mesh position={[0, 0.065, 0]}><sphereGeometry args={[0.01, 10, 10]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </>}
      {observation.source === "gliders" && <>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.025, 0]}><capsuleGeometry args={[0.012, 0.065, 6, 12]} /><meshBasicMaterial color={color} /></mesh>
        <mesh position={[0, 0.025, 0]}><boxGeometry args={[0.065, 0.005, 0.022]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </>}
      </group>
      {isSelected && (
        <Html
          position={[0, 0, 0]}
          style={{ transform: "translate3d(-50%, calc(-100% - 12px), 0)" }}
          zIndexRange={[30, 0]}
        >
          <section
            className="argo-data-popup"
            style={{ "--popup-x": `${popupPosition.x}px`, "--popup-y": `${popupPosition.y}px` }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <header
              className="argo-data-popup-drag-handle"
              onPointerDown={startPopupDrag}
              onPointerMove={dragPopup}
              onPointerUp={stopPopupDrag}
              onPointerCancel={stopPopupDrag}
            >
              <span>{observation.source === "bgc" ? "BGC-ARGO PROFILE" : "ARGO PROFILE"}</span>
              <button
                type="button"
                aria-label="Close ARGO profile"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(null);
                }}
              >
                ×
              </button>
            </header>
            <strong>Float {observation.platformId}</strong>
            <div className="argo-data-grid">
              <div><span>LAST PROFILE</span><b>{observation.observedAt.toLocaleDateString("en-GB")}</b></div>
              <div><span>POSITION</span><b>{observation.lat.toFixed(2)}°, {observation.lon.toFixed(2)}°</b></div>
              <div><span>INSTITUTION</span><b>{observation.institution || "—"}</b></div>
              <div><span>PROFILER</span><b>{observation.profilerType || "—"}</b></div>
              <div><span>DEPTH LEVELS</span><b>{observation.levels || "—"}</b></div>
              <div><span>SURFACE TEMP.</span><b>{Number.isFinite(observation.temperature) && observation.dataFormat.includes("NetCDF") ? `${observation.temperature.toFixed(2)} °C` : "Index only"}</b></div>
              <div><span>SURFACE SALINITY</span><b>{Number.isFinite(observation.salinity) && observation.dataFormat.includes("NetCDF") ? `${observation.salinity.toFixed(2)} PSU` : "Index only"}</b></div>
              <div><span>MAX PRESSURE</span><b>{Number.isFinite(observation.maxPressure) ? `${observation.maxPressure.toFixed(0)} dbar` : "—"}</b></div>
              <div><span>DATA FORMAT</span><b>{observation.dataFormat}</b></div>
            </div>
          </section>
        </Html>
      )}
    </group>
  );
}

// Source-specific 3D platform models stay attached to the Earth as it rotates.
export default function ObservationLayer({ data = [], onInteractionChange, colorbar, verticalExaggeration = 1 }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const observations = useMemo(
    () => {
      const valid = data.filter(({ lat, lon }) => Number.isFinite(lat) && Number.isFinite(lon));
      const sources = [...new Set(valid.map(({ source }) => source))];
      const perSource = Math.max(1, Math.floor(100 / sources.length));

      return sources.flatMap((source) => {
        const records = valid.filter((observation) => observation.source === source);
        const stride = Math.max(1, Math.ceil(records.length / perSource));
        return records.filter((_, index) => index % stride === 0).slice(0, perSource);
      });
    },
    [data],
  );

  const selectedObservation = observations.find(({ id }) => id === selectedId);
  const selectedTrack = useMemo(() => {
    if (!selectedObservation?.platformId) return [];

    return getArgoTrack(selectedObservation.platformId)
      .map(({ lat, lon }) => new THREE.Vector3(...latLonToVector3(lat, lon, TRACK_RADIUS)));
  }, [selectedObservation]);
  const selectedSurfacePath = useMemo(
    () => makeSurfacePath(selectedTrack),
    [selectedTrack],
  );

  useEffect(() => {
    onInteractionChange?.(Boolean(selectedId || hoveredId));
  }, [hoveredId, onInteractionChange, selectedId]);

  if (observations.length === 0) return null;

  return (
    <group>
      {selectedTrack.length > 1 && (
        <>
          <Line
            points={selectedSurfacePath}
            color="#ff332c"
            lineWidth={2}
            transparent
            opacity={1}
            depthWrite={false}
          />
          {selectedTrack.map((point, index) => (
            <mesh key={`${selectedId}-waypoint-${index}`} position={point}>
              <sphereGeometry args={[0.002, 6, 6]} />
              <meshBasicMaterial color="#ff332c" depthWrite={false} />
            </mesh>
          ))}
        </>
      )}
      {observations.map((observation, index) => (
        <PlatformMarker
          key={observation.id}
          observation={observation}
          index={index}
          isSelected={selectedId === observation.id}
          onSelect={setSelectedId}
          onHoverChange={setHoveredId}
          colorbar={colorbar}
          verticalExaggeration={verticalExaggeration}
        />
      ))}
    </group>
  );
}
