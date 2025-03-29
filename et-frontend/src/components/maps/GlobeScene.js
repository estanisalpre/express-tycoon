import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

// Componente que crea el globo (esfera) con una textura de la Tierra
const Globe = () => {
  const meshRef = useRef();
  // Asegúrate de tener una imagen de mapa terrestre (por ejemplo, en public/images/earth-texture.jpg)
  const texture = useTexture("/assets/textures/earth-texture.jpg");

  // Rota lentamente el globo
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3.5, 40, 40]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const GlobeScene = () => {
  return (
    <Canvas style={{ height: "100%", width: "100%" }}>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Globe />
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default GlobeScene;