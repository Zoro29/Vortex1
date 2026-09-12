import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import { useImperativeHandle, useRef, useState } from "react";
import Earth from "./Earth";
import Atmosphere from "./Atmosphere";
import ObservationLayer from "./ObservationLayer";
import OceanCurrentLayer from "./OceanCurrentLayer";

// Rotate the globe so India (roughly 20°N, 78°E) faces the camera on load.
const INDIA_FIRST_YAW = 3.36;

export default function OceanGlobe({
  filters,
  data,
  setCoords,
  globeRef,
  isRotationEnabled = true,
  colorbar,
  showSurfaceCurrents = true,
  verticalExaggeration = 1,
}) {
  const controlsRef = useRef();
  const [isPlatformActive, setIsPlatformActive] = useState(false);
  useImperativeHandle(globeRef, () => ({
    zoomIn: () => {
      const controls = controlsRef.current;
      const camera = controls?.object;
      if (!controls || !camera) return;
      const offset = camera.position.clone().sub(controls.target);
      const distance = offset.length();
      if (distance <= 2.5) return;
      camera.position.copy(controls.target).add(offset.multiplyScalar(Math.max(2.5 / distance, 0.8)));
      controls.update();
    },
    zoomOut: () => {
      const controls = controlsRef.current;
      const camera = controls?.object;
      if (!controls || !camera) return;
      const offset = camera.position.clone().sub(controls.target);
      const distance = offset.length();
      if (distance >= 7) return;
      camera.position.copy(controls.target).add(offset.multiplyScalar(Math.min(7 / distance, 1.25)));
      controls.update();
    },
    reset: () => controlsRef.current?.reset(),
  }), []);

  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 45,
      }}
    >
      <color attach="background" args={["#020817"]} />
      <Stars
        radius={80}
        depth={45}
        count={1800}
        factor={2.5}
        saturation={0.25}
        fade
        speed={0.15}
      />

      <ambientLight intensity={1.5} />

      <directionalLight position={[5, 3, 5]} intensity={2} />

      <group rotation={[0, INDIA_FIRST_YAW, 0]}>
        <Earth filters={filters} setCoords={setCoords} globeYaw={INDIA_FIRST_YAW} />

        <Atmosphere />

        <OceanCurrentLayer visible={showSurfaceCurrents} verticalExaggeration={verticalExaggeration} />

        <ObservationLayer
          data={data}
          parameters={filters.parameters}
          colorbar={colorbar}
          verticalExaggeration={verticalExaggeration}
          onInteractionChange={setIsPlatformActive}
        />
      </group>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        autoRotate={isRotationEnabled && !isPlatformActive}
        autoRotateSpeed={0.18}
        minDistance={2.5}
        maxDistance={7}
      />
    </Canvas>
  );
}
