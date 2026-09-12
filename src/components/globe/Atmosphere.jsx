export default function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.67, 128, 128]} />

      <meshBasicMaterial color="#7fd7ff" transparent opacity={0.15} side={2} />
    </mesh>
  );
}
