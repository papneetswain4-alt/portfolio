import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* =====================================================
   LAYER 1: BACKGROUND STARS (Deepest, Slowest Parallax)
===================================================== */
function BackgroundStars() {
  const pointsRef = useRef();

  const particleCount = 3000;
  const positions = useMemo(() => {
    const data = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread wide and deep
      data[i3] = (Math.random() - 0.5) * 40;
      data[i3 + 1] = (Math.random() - 0.5) * 40;
      data[i3 + 2] = (Math.random() - 0.5) * 20 - 15; // Deep Z
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;

    // Very slow idle rotation
    pointsRef.current.rotation.y = time * 0.005;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.01;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#aaccff"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/* =====================================================
   LAYER 2: MIDGROUND STARS (White & Red, Faster Parallax)
===================================================== */
function MidgroundStars() {
  const whitePointsRef = useRef();
  const redPointsRef = useRef();

  const whiteCount = 1500;
  const redCount = 300;

  const whitePositions = useMemo(() => {
    const data = new Float32Array(whiteCount * 3);
    for (let i = 0; i < whiteCount; i++) {
      const i3 = i * 3;
      data[i3] = (Math.random() - 0.5) * 25;
      data[i3 + 1] = (Math.random() - 0.5) * 20;
      data[i3 + 2] = (Math.random() - 0.5) * 15 - 5; // Closer Z
    }
    return data;
  }, []);

  const redPositions = useMemo(() => {
    const data = new Float32Array(redCount * 3);
    for (let i = 0; i < redCount; i++) {
      const i3 = i * 3;
      data[i3] = (Math.random() - 0.5) * 20;
      data[i3 + 1] = (Math.random() - 0.5) * 15;
      data[i3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!whitePointsRef.current || !redPointsRef.current) return;
    const time = state.clock.elapsedTime;

    // Noticeable movement, different direction/speed
    whitePointsRef.current.rotation.y = time * 0.015;
    whitePointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.02;

    redPointsRef.current.rotation.y = -time * 0.02;
    redPointsRef.current.rotation.x = Math.cos(time * 0.08) * 0.02;
  });

  return (
    <>
      <Points ref={whitePointsRef} positions={whitePositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points ref={redPointsRef} positions={redPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff3333"
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </>
  );
}

/* =====================================================
   LAYER 3: CENTRAL OBJECT & RINGS (Strongest Response)
===================================================== */
function CentralCore() {
  const groupRef = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Idle rotation
    const baseRotX = time * 0.1;
    const baseRotY = time * 0.15;

    // Cursor influence on tilt (rotate toward cursor)
    // When mouse moves right (x > 0), we want it to tilt right
    const targetTiltX = mouse.y * 0.4;
    const targetTiltY = mouse.x * 0.6;

    // Add tilt to base rotation using lerp conceptually
    groupRef.current.rotation.x += (baseRotX + targetTiltX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (baseRotY + targetTiltY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.z = time * 0.05;

    // Cursor influence on position (move slightly with cursor)
    // To make it move left when cursor is left, targetX = -mouse.x * something if camera moves right? 
    // Wait, if camera moves RIGHT (targetCamX = -mouse.x * 1.5), 
    // the whole scene appears to move LEFT. 
    // If we want the central object to move slightly MORE left, we should move it left in world space.
    // So targetPosX = mouse.x * positive_value.
    const targetPosX = mouse.x * 0.5;
    const targetPosY = mouse.y * 0.5;

    groupRef.current.position.x += (targetPosX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.y += (targetPosY - groupRef.current.position.y) * 0.05;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 0, -2]}>
        {/* Outer Gray Wireframe */}
        <mesh>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshBasicMaterial color="#aaaaaa" wireframe transparent opacity={0.08} depthWrite={false} />
        </mesh>

        {/* Inner Red Wireframe */}
        <mesh scale={0.75}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshBasicMaterial color="#e10600" wireframe transparent opacity={0.15} depthWrite={false} />
        </mesh>

        {/* Core Solid Glow */}
        <mesh scale={0.2}>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} depthWrite={false} />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitingRings() {
  const groupRef = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Idle continuous rotation
    const baseRotY = time * 0.08;
    const baseRotZ = Math.sin(time * 0.1) * 0.1;

    // Cursor influence on rings
    const targetTiltX = mouse.y * 0.5;
    const targetTiltY = mouse.x * 0.7;

    // Smooth easing
    groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.y += (baseRotY + targetTiltY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.z += (baseRotZ - groupRef.current.rotation.z) * 0.04;

    // Rings shift slightly differently from the core
    const targetPosX = mouse.x * 0.3;
    const targetPosY = mouse.y * 0.3;

    groupRef.current.position.x += (targetPosX - groupRef.current.position.x) * 0.04;
    groupRef.current.position.y += (targetPosY - groupRef.current.position.y) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* White Inner Ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.6, 0.008, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} depthWrite={false} />
      </mesh>

      {/* Red Mid Ring */}
      <mesh rotation={[Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[3.0, 0.01, 16, 100]} />
        <meshBasicMaterial color="#e10600" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {/* Subtle Outer Ring */}
      <mesh rotation={[0.6, Math.PI / 4, 0]}>
        <torusGeometry args={[3.5, 0.005, 16, 100]} />
        <meshBasicMaterial color="#aaaaaa" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* =====================================================
   INTERACTIVE CAMERA (Parallax Controller)
===================================================== */
function CameraController() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    // Parallax logic: 
    // To make the background shift left when the cursor moves left, 
    // the camera must move right. 
    // mouse.x is -1 on the left. So target camera X should be positive.
    const targetCamX = -mouse.x * 1.5;
    const targetCamY = -mouse.y * 1.5;

    camera.position.x += (targetCamX - camera.position.x) * 0.03;
    camera.position.y += (targetCamY - camera.position.y) * 0.03;

    // Slight depth response based on distance from center
    const dist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
    const targetCamZ = 6 + dist * 1.0;

    camera.position.z += (targetCamZ - camera.position.z) * 0.03;

    // Always look at the center of the scene
    camera.lookAt(0, 0, -2);
  });

  return null;
}

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function WebBackground() {
  return (
    <div className="web-background">
      <Canvas
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        camera={{
          position: [0, 0, 6],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Deep black/dark background */}
        <color attach="background" args={["#030305"]} />

        <CameraController />
        <BackgroundStars />
        <MidgroundStars />
        <CentralCore />
        <OrbitingRings />
      </Canvas>
    </div>
  );
}