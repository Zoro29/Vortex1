import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { latLonToVector3 } from "../../utils/geo";

const CURRENT_SAMPLES = [
  [-42, -115, 28, 8], [-38, -72, 24, -5], [-32, -18, 32, 7], [-28, 35, 31, 5],
  [-18, 108, 29, -8], [-12, 158, 31, 6], [2, -145, 35, 2], [8, -92, 30, -7],
  [14, -35, 34, 3], [18, 24, 27, 8], [21, 76, 31, -5], [28, 132, 28, 5],
  [39, -165, 30, -6], [42, -105, 34, 4], [45, -45, 27, -5], [36, 12, 26, 6],
  [34, 65, 30, 5], [43, 112, 29, -5],
];

function SurfaceCurrent({ sample, index, verticalExaggeration }) {
  const particleRefs = useRef([]);
  const rippleRef = useRef(null);
  const { start, end } = useMemo(() => {
    const [lat, lon, latOffset, lonOffset] = sample;
    return {
      // A tiny offset prevents depth flicker while keeping all movement on the
      // water surface rather than floating in the atmosphere.
      start: new THREE.Vector3(...latLonToVector3(lat, lon, 1.626 + (verticalExaggeration - 1) * 0.01)),
      end: new THREE.Vector3(...latLonToVector3(lat + latOffset * 0.12, lon + lonOffset, 1.626 + (verticalExaggeration - 1) * 0.01)),
    };
  }, [sample, verticalExaggeration]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const progress = (elapsed * 0.24 + index / CURRENT_SAMPLES.length) % 1;
    particleRefs.current.forEach((particle, trailIndex) => {
      if (!particle) return;
      const trailOffset = trailIndex * 0.035;
      const position = (progress - trailOffset + 1) % 1;
      particle.position.copy(start).lerp(end, position).normalize().multiplyScalar(1.63 + (verticalExaggeration - 1) * 0.01);
    });

    if (rippleRef.current && particleRefs.current[0]) {
      const ripple = rippleRef.current;
      const normal = particleRefs.current[0].position.clone().normalize();
      const pulse = 0.85 + (Math.sin(elapsed * 3 + index) + 1) * 0.2;
      ripple.position.copy(normal).multiplyScalar(1.625 + (verticalExaggeration - 1) * 0.01);
      ripple.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      ripple.scale.setScalar(pulse);
      ripple.material.opacity = 0.28 + (Math.sin(elapsed * 3 + index) + 1) * 0.12;
    }
  });

  return (
    <group>
      <mesh ref={rippleRef} position={start}>
        <ringGeometry args={[0.018, 0.021, 16]} />
        <meshBasicMaterial color="#65e8f2" transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {[0.9, 0.48, 0.22].map((opacity, trailIndex) => (
        <mesh key={opacity} ref={(element) => { particleRefs.current[trailIndex] = element; }} position={start}>
          <sphereGeometry args={[trailIndex === 0 ? 0.014 : 0.009, 8, 6]} />
          <meshBasicMaterial color={trailIndex === 0 ? "#b6fbff" : "#35bfc9"} transparent opacity={opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function OceanCurrentLayer({ visible, verticalExaggeration = 1 }) {
  if (!visible) return null;

  return (
    <group renderOrder={10}>
      {CURRENT_SAMPLES.map((sample, index) => (
        <SurfaceCurrent key={`${sample[0]}-${sample[1]}`} sample={sample} index={index} verticalExaggeration={verticalExaggeration} />
      ))}
    </group>
  );
}
