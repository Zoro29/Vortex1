import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import { Vector3 } from "three";

const UP_AXIS = new Vector3(0, 1, 0);

export default function Earth({ setCoords, globeYaw = 0 }) {
  const meshRef = useRef();
  const texture = useTexture("/textures/earth.jpg");

  const handlePointerMove = (e) => {
    const point = e.point.clone();

    point.applyAxisAngle(UP_AXIS, -globeYaw);

    const radius = point.length();

    const lat = 90 - (Math.acos(point.y / radius) * 180) / Math.PI;

    const lon = (Math.atan2(point.z, point.x) * 180) / Math.PI - 90;

    setCoords({
      lat,
      lon,
    });
  };

  return (
    <mesh ref={meshRef} onPointerMove={handlePointerMove}>
      <sphereGeometry args={[1.6, 128, 128]} />

      <meshStandardMaterial map={texture} roughness={0.8} metalness={0} />
    </mesh>
  );
}
