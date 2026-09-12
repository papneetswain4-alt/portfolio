import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* =====================================================
   GLOBAL SCROLL STATE
===================================================== */

const scrollState = {
  current: 0,
  target: 0,
};


/* =====================================================
   HERO SCROLL STATE
===================================================== */

const heroState = {
  progress: 0,
  target: 0,
};


/* =====================================================
   SECTION / PAGE STATE
===================================================== */

const sectionState = {
  progress: 0,
  target: 0,

  index: 0,
  targetIndex: 0,

  localProgress: 0,
  targetLocalProgress: 0,
};


/* =====================================================
   SECTION VISUAL STATE
   STEP 5.1 + 5.2
===================================================== */

const sectionVisualState = {
  intensity: 0,
  targetIntensity: 0,

  motion: 0,
  targetMotion: 0,

  energy: 0,
  targetEnergy: 0,

  zone: 0,
  targetZone: 0,

  focus: 0,
  targetFocus: 0,
};

const projectHoverState = {
  current: 0,
  target: 0,
};

const SECTION_VISUAL_PROFILES = [
  { intensity: 0.18, motion: 0.12, energy: 0.18 },
  { intensity: 0.1, motion: 0.16, energy: 0.12 },
  { intensity: 0.38, motion: 0.48, energy: 0.42 },
  { intensity: 0.3, motion: 0.4, energy: 0.3 },
  { intensity: 0.62, motion: 0.58, energy: 0.68 },
  { intensity: 0.5, motion: 0.65, energy: 0.58 },
  { intensity: 0.14, motion: 0.12, energy: 0.16 },
];


/* =====================================================
   CORE POSITION
===================================================== */

const CORE_POSITION = new THREE.Vector3(
  0,
  0,
  -2
);


/* =====================================================
   LAYER 1: BACKGROUND STARS
===================================================== */

function BackgroundStars() {
  const pointsRef = useRef();
  const { mouse } = useThree();

  const particleCount = typeof window !== "undefined" && window.innerWidth < 768 ? 1500 : 3000;

  const positions = useMemo(() => {
    const data = new Float32Array(
      particleCount * 3
    );

    let created = 0;

    while (created < particleCount) {
      const x =
        (Math.random() - 0.5) * 40;

      const y =
        (Math.random() - 0.5) * 40;

      const z =
        (Math.random() - 0.5) * 20 - 15;

      const dx = x;
      const dy = y;
      const dz = z - CORE_POSITION.z;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy +
          dz * dz
        );

      if (distance < 4.2) {
        continue;
      }

      const i3 = created * 3;

      data[i3] = x;
      data[i3 + 1] = y;
      data[i3 + 2] = z;

      created++;
    }

    return data;
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time =
      state.clock.elapsedTime;

    const pageProgress =
      sectionState.progress;

    const sectionIntensity =
      sectionVisualState.intensity;

    const sectionMotion =
      sectionVisualState.motion;

    const zone =
      sectionVisualState.zone;

    const focus =
      sectionVisualState.focus;


    /* -------------------------------------------------
       BASE ROTATION
    ------------------------------------------------- */

    pointsRef.current.rotation.y =
      time * (
        0.005 +
        sectionMotion * 0.003 +
        zone * 0.0015
      );

    pointsRef.current.rotation.x =
      Math.sin(
        time * (
          0.05 +
          sectionIntensity * 0.025
        )
      ) * 0.01;


    /* -------------------------------------------------
       CURSOR
    ------------------------------------------------- */

    const targetX =
      -mouse.x * 0.045 +
      Math.sin(pageProgress * Math.PI) * 0.025;

    const targetY =
      -mouse.y * 0.045 +
      Math.cos(pageProgress * Math.PI) * 0.02;

    pointsRef.current.position.x +=
      (
        targetX -
        pointsRef.current.position.x
      ) * 0.025;

    pointsRef.current.position.y +=
      (
        targetY -
        pointsRef.current.position.y
      ) * 0.025;


    /* -------------------------------------------------
       SCROLL
    ------------------------------------------------- */

    const scrollOffset =
      Math.min(
        scrollState.current * 0.00032,
        1.8
      );

    const sectionDepth =
      pageProgress * 0.35;

    const targetZ =
      -scrollOffset -
      sectionDepth;

    pointsRef.current.position.z +=
      (
        targetZ -
        pointsRef.current.position.z
      ) * 0.018;


    /* -------------------------------------------------
       SUBTLE PAGE ROTATION
    ------------------------------------------------- */

    const targetRotationZ =
      Math.sin(pageProgress * Math.PI) *
      (0.018 + zone * 0.01);

    pointsRef.current.rotation.z +=
      (
        targetRotationZ -
        pointsRef.current.rotation.z
      ) * 0.015;


    /* -------------------------------------------------
       ZONE DEPTH
    ------------------------------------------------- */

    const targetScale =
      1 +
      zone * 0.008 +
      focus * 0.006;

    pointsRef.current.scale.x +=
      (
        targetScale -
        pointsRef.current.scale.x
      ) * 0.02;

    pointsRef.current.scale.y +=
      (
        targetScale -
        pointsRef.current.scale.y
      ) * 0.02;

    pointsRef.current.scale.z +=
      (
        targetScale -
        pointsRef.current.scale.z
      ) * 0.02;
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
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
   LAYER 1.5: SLOW DRIFTING GLOW STARS
===================================================== */

function DriftingGlowStars() {
  const pointsRef = useRef();
  const { mouse } = useThree();
  const isCompact = typeof window !== "undefined" && window.innerWidth < 768;
  const glowCount = isCompact ? 7 : 16;

  const positions = useMemo(() => {
    const data = new Float32Array(glowCount * 3);

    for (let index = 0; index < glowCount; index += 1) {
      const i3 = index * 3;
      data[i3] = (Math.random() - 0.5) * 30;
      data[i3 + 1] = (Math.random() - 0.5) * 22;
      data[i3 + 2] = (Math.random() - 0.5) * 12 - 9;
    }

    return data;
  }, [glowCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const pageProgress = sectionState.progress;
    const targetX = -mouse.x * 0.11 + Math.sin(pageProgress * Math.PI) * 0.04;
    const targetY = -mouse.y * 0.09 + Math.cos(pageProgress * Math.PI) * 0.03;

    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.018;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.018;
    pointsRef.current.position.z += (-scrollState.current * 0.00058 - pointsRef.current.position.z) * 0.012;
    pointsRef.current.rotation.z = Math.sin(time * 0.035) * 0.025;
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#aaccff"
        size={0.12}
        sizeAttenuation
        depthWrite={false}
        opacity={0.22}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}


/* =====================================================
   LAYER 2: MIDGROUND STARS
===================================================== */

function MidgroundStars() {
  const whitePointsRef = useRef();
  const redPointsRef = useRef();

  const { mouse } = useThree();

  const isCompact = typeof window !== "undefined" && window.innerWidth < 768;
  const whiteCount = isCompact ? 750 : 1500;
  const redCount = isCompact ? 140 : 300;


  /* -----------------------------------------------------
     WHITE STAR POSITIONS
  ----------------------------------------------------- */

  const whitePositions = useMemo(() => {
    const data = new Float32Array(
      whiteCount * 3
    );

    let created = 0;

    while (created < whiteCount) {
      const x =
        (Math.random() - 0.5) * 25;

      const y =
        (Math.random() - 0.5) * 20;

      const z =
        (Math.random() - 0.5) * 15 - 5;

      const dx = x;
      const dy = y;
      const dz = z - CORE_POSITION.z;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy +
          dz * dz
        );

      if (distance < 4.0) {
        continue;
      }

      const i3 = created * 3;

      data[i3] = x;
      data[i3 + 1] = y;
      data[i3 + 2] = z;

      created++;
    }

    return data;
  }, [whiteCount]);


  /* -----------------------------------------------------
     RED STAR POSITIONS
  ----------------------------------------------------- */

  const redPositions = useMemo(() => {
    const data = new Float32Array(
      redCount * 3
    );

    let created = 0;

    while (created < redCount) {
      const x =
        (Math.random() - 0.5) * 20;

      const y =
        (Math.random() - 0.5) * 15;

      const z =
        (Math.random() - 0.5) * 15 - 5;

      const dx = x;
      const dy = y;
      const dz = z - CORE_POSITION.z;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy +
          dz * dz
        );

      if (distance < 4.2) {
        continue;
      }

      const i3 = created * 3;

      data[i3] = x;
      data[i3 + 1] = y;
      data[i3 + 2] = z;

      created++;
    }

    return data;
  }, [redCount]);


  /* -----------------------------------------------------
     ANIMATION
  ----------------------------------------------------- */

  useFrame((state) => {
    const time =
      state.clock.elapsedTime;

    const pageProgress =
      sectionState.progress;

    const sectionIntensity =
      sectionVisualState.intensity;

    const sectionEnergy =
      sectionVisualState.energy;

    const zone =
      sectionVisualState.zone;

    const focus =
      sectionVisualState.focus;


    /* =================================================
       WHITE STARS
    ================================================= */

    if (whitePointsRef.current) {

      whitePointsRef.current.rotation.y =
        time * (
          0.015 +
          sectionIntensity * 0.008 +
          zone * 0.004
        ) +
        pageProgress * 0.08;

      whitePointsRef.current.rotation.z =
        Math.sin(
          time * (
            0.1 +
            sectionEnergy * 0.04 +
            zone * 0.02
          )
        ) * (
          0.02 +
          focus * 0.008
        );


      /* Cursor */

      const targetX =
        -mouse.x * 0.14 +
        Math.sin(pageProgress * Math.PI) * 0.05;

      const targetY =
        -mouse.y * 0.14 +
        Math.cos(pageProgress * Math.PI) * 0.035;

      whitePointsRef.current.position.x +=
        (
          targetX -
          whitePointsRef.current.position.x
        ) * 0.035;

      whitePointsRef.current.position.y +=
        (
          targetY -
          whitePointsRef.current.position.y
        ) * 0.035;


      /* Scroll */

      const scrollOffset =
        Math.min(
          scrollState.current * 0.00078,
          3
        );

      const sectionDepth =
        pageProgress * 0.55;

      const targetZ =
        -scrollOffset -
        sectionDepth;

      whitePointsRef.current.position.z +=
        (
          targetZ -
          whitePointsRef.current.position.z
        ) * 0.025;
    }


    /* =================================================
       RED STARS
    ================================================= */

    if (redPointsRef.current) {

      redPointsRef.current.rotation.y =
        -time * (
          0.02 +
          sectionIntensity * 0.014 +
          zone * 0.007
        ) -
        pageProgress * 0.12;

      redPointsRef.current.rotation.x =
        Math.cos(
          time * (
            0.08 +
            sectionEnergy * 0.035 +
            zone * 0.02
          )
        ) * (
          0.02 +
          focus * 0.01
        );


      /* Cursor */

      const targetX =
        -mouse.x * 0.2 +
        Math.sin(pageProgress * Math.PI) * 0.07;

      const targetY =
        -mouse.y * 0.2 +
        Math.cos(pageProgress * Math.PI) * 0.05;

      redPointsRef.current.position.x +=
        (
          targetX -
          redPointsRef.current.position.x
        ) * 0.04;

      redPointsRef.current.position.y +=
        (
          targetY -
          redPointsRef.current.position.y
        ) * 0.04;


      /* Scroll */

      const scrollOffset =
        Math.min(
          scrollState.current * 0.00105,
          4
        );

      const sectionDepth =
        pageProgress * 0.75;

      const targetZ =
        -scrollOffset -
        sectionDepth;

      redPointsRef.current.position.z +=
        (
          targetZ -
          redPointsRef.current.position.z
        ) * 0.03;
    }
  });


  return (
    <>
      <Points
        ref={whitePointsRef}
        positions={whitePositions}
        stride={3}
        frustumCulled={false}
      >
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


      <Points
        ref={redPointsRef}
        positions={redPositions}
        stride={3}
        frustumCulled={false}
      >
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
   LAYER 3: CENTRAL CORE
===================================================== */

/* =====================================================
   LAYER 3: CENTRAL CORE
   STEP 6.1 — INTERACTIVE CORE PHYSICS
===================================================== */

function CentralCore() {
  const groupRef = useRef();
  const coreOpacity = useRef(1);

  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    const time =
      state.clock.elapsedTime;

    const heroProgress =
      heroState.progress;

    const pageProgress =
      sectionState.progress;

    const sectionIntensity =
      sectionVisualState.intensity;

    const sectionEnergy =
      sectionVisualState.energy;

    const zone =
      sectionVisualState.zone;

    const focus =
      sectionVisualState.focus;

    const skillsFocus =
      THREE.MathUtils.clamp(
        1 -
        Math.abs(sectionState.index - 2),
        0,
        1
      );

    const targetOpacity =
      1 -
      skillsFocus * 0.78;

    coreOpacity.current +=
      (
        targetOpacity -
        coreOpacity.current
      ) * 0.06;

    groupRef.current.traverse((child) => {
      if (!child.material) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        if (material.userData.coreBaseOpacity === undefined) {
          material.userData.coreBaseOpacity = material.opacity;
        }

        material.opacity =
          material.userData.coreBaseOpacity *
          coreOpacity.current;
      });
    });


    /* =================================================
       CURSOR DISTANCE FROM CENTER
    ================================================= */

    const cursorDistance =
      Math.sqrt(
        mouse.x * mouse.x +
        mouse.y * mouse.y
      );

    /*
      0 = cursor at center
      1 = cursor at edge
    */

    const cursorInfluence =
      THREE.MathUtils.clamp(
        1 -
        cursorDistance,
        0,
        1
      );


    /* =================================================
       CURSOR DIRECTION
    ================================================= */

    const cursorAngle =
      Math.atan2(
        mouse.y,
        mouse.x
      );


    /* =================================================
       BASE ROTATION
    ================================================= */

    const baseRotX =
      time * (
        0.1 +
        zone * 0.015
      );

    const baseRotY =
      time * (
        0.15 +
        zone * 0.02
      );


    /* =================================================
       CURSOR PHYSICAL TILT
    ================================================= */

    const cursorTiltStrength =
      0.12 +
      cursorInfluence * 0.16;


    const cursorTiltX =
      Math.cos(
        cursorAngle
      ) *
      cursorInfluence *
      cursorTiltStrength;


    const cursorTiltY =
      Math.sin(
        cursorAngle
      ) *
      cursorInfluence *
      cursorTiltStrength;


    /* =================================================
       TARGET ROTATION
    ================================================= */

    const targetRotationX =
      baseRotX +
      mouse.y * 0.4 +
      cursorTiltX +
      heroProgress * 0.12 +
      pageProgress * 0.18 +
      zone * 0.08;


    const targetRotationY =
      baseRotY +
      mouse.x * 0.6 +
      cursorTiltY +
      heroProgress * 0.18 +
      pageProgress * 0.3 +
      zone * 0.14;


    /* =================================================
       SMOOTH ROTATION
    ================================================= */

    groupRef.current.rotation.x +=
      (
        targetRotationX -
        groupRef.current.rotation.x
      ) * 0.05;


    groupRef.current.rotation.y +=
      (
        targetRotationY -
        groupRef.current.rotation.y
      ) * 0.05;


    /* =================================================
       Z ROTATION
    ================================================= */

    const targetRotationZ =
      time * (
        0.05 +
        sectionIntensity * 0.025 +
        zone * 0.012
      ) +
      pageProgress * 0.12;


    groupRef.current.rotation.z +=
      (
        targetRotationZ -
        groupRef.current.rotation.z
      ) * 0.04;


    /* =================================================
       CURSOR POSITION
    ================================================= */

    const targetPosX =
      mouse.x * (
        0.5 +
        cursorInfluence * 0.12
      );


    const targetPosY =
      mouse.y * (
        0.5 +
        cursorInfluence * 0.12
      );


    groupRef.current.position.x +=
      (
        targetPosX -
        groupRef.current.position.x
      ) * 0.05;


    groupRef.current.position.y +=
      (
        targetPosY -
        groupRef.current.position.y
      ) * 0.05;


    /* =================================================
       CURSOR PROXIMITY SCALE
    ================================================= */

    const proximityScale =
      cursorInfluence * 0.035;


    const targetScale =
      1 +
      heroProgress * 0.06 +
      pageProgress * 0.025 +
      sectionEnergy * 0.035 +
      zone * 0.018 +
      focus * 0.012 +
      proximityScale;


    /* =================================================
       SMOOTH SCALE
    ================================================= */

    groupRef.current.scale.x +=
      (
        targetScale -
        groupRef.current.scale.x
      ) * 0.04;


    groupRef.current.scale.y +=
      (
        targetScale -
        groupRef.current.scale.y
      ) * 0.04;


    groupRef.current.scale.z +=
      (
        targetScale -
        groupRef.current.scale.z
      ) * 0.04;
  });


  return (
    <Float
      speed={1}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group
        ref={groupRef}
        position={[
          CORE_POSITION.x,
          CORE_POSITION.y,
          CORE_POSITION.z
        ]}
      >

        {/* =================================================
            OUTER GRAY WIREFRAME
        ================================================= */}

        <mesh>
          <icosahedronGeometry
            args={[2.2, 1]}
          />

          <meshBasicMaterial
            color="#aaaaaa"
            wireframe
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>


        {/* =================================================
            INNER RED WIREFRAME
        ================================================= */}

        <mesh scale={0.75}>
          <icosahedronGeometry
            args={[2.2, 1]}
          />

          <meshBasicMaterial
            color="#e10600"
            wireframe
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>


        {/* =================================================
            CORE
        ================================================= */}

        <mesh scale={0.2}>
          <sphereGeometry
            args={[2.2, 32, 32]}
          />

          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>

      </group>
    </Float>
  );
}

/* =====================================================
   LAYER 4: ORBITING RINGS
===================================================== */

/* =====================================================
   LAYER 4: ORBITING RINGS
   STEP 6.2 — CORE ↔ RING INTERACTION
===================================================== */

function OrbitingRings() {
  const groupRef = useRef();

  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    const time =
      state.clock.elapsedTime;

    const pageProgress =
      sectionState.progress;

    const sectionIntensity =
      sectionVisualState.intensity;

    const sectionMotion =
      sectionVisualState.motion;

    const zone =
      sectionVisualState.zone;

    const focus =
      sectionVisualState.focus;


    /* =================================================
       CURSOR DISTANCE
    ================================================= */

    const cursorDistance =
      Math.sqrt(
        mouse.x * mouse.x +
        mouse.y * mouse.y
      );

    const cursorInfluence =
      THREE.MathUtils.clamp(
        1 -
        cursorDistance,
        0,
        1
      );


    /* =================================================
       CURSOR ANGLE
    ================================================= */

    const cursorAngle =
      Math.atan2(
        mouse.y,
        mouse.x
      );


    /* =================================================
       BASE ROTATION
    ================================================= */

    const baseRotY =
      time * (
        0.08 +
        sectionIntensity * 0.035 +
        zone * 0.02
      );

    const baseRotZ =
      Math.sin(
        time * (
          0.1 +
          zone * 0.03
        )
      ) * (
        0.1 +
        focus * 0.02
      );


    /* =================================================
       CURSOR TILT
    ================================================= */

    const cursorTiltStrength =
      0.08 +
      cursorInfluence * 0.14;


    const cursorTiltX =
      Math.cos(cursorAngle) *
      cursorInfluence *
      cursorTiltStrength;


    const cursorTiltY =
      Math.sin(cursorAngle) *
      cursorInfluence *
      cursorTiltStrength;


    /* =================================================
       TARGET ROTATION
    ================================================= */

    const targetRotationX =
      mouse.y * 0.5 +
      cursorTiltX +
      pageProgress * 0.08 +
      zone * 0.05;


    const targetRotationY =
      baseRotY +
      mouse.x * 0.7 +
      cursorTiltY +
      pageProgress * 0.18 +
      zone * 0.1;


    const targetRotationZ =
      baseRotZ +
      pageProgress * 0.12 +
      zone * 0.06;


    /* =================================================
       SMOOTH ROTATION
    ================================================= */

    groupRef.current.rotation.x +=
      (
        targetRotationX -
        groupRef.current.rotation.x
      ) * 0.04;


    groupRef.current.rotation.y +=
      (
        targetRotationY -
        groupRef.current.rotation.y
      ) * 0.04;


    groupRef.current.rotation.z +=
      (
        targetRotationZ -
        groupRef.current.rotation.z
      ) * 0.04;


    /* =================================================
       CURSOR POSITION
    ================================================= */

    const cursorPush =
      cursorInfluence * 0.08;


    const targetPosX =
      mouse.x * (
        0.3 +
        cursorPush
      );


    const targetPosY =
      mouse.y * (
        0.3 +
        cursorPush
      );


    groupRef.current.position.x +=
      (
        targetPosX -
        groupRef.current.position.x
      ) * 0.04;


    groupRef.current.position.y +=
      (
        targetPosY -
        groupRef.current.position.y
      ) * 0.04;


    /* =================================================
       PROXIMITY SCALE
    ================================================= */

    const proximityScale =
      cursorInfluence * 0.025;


    const targetScale =
      1 +
      pageProgress * 0.035 +
      sectionMotion * 0.025 +
      zone * 0.02 +
      focus * 0.01 +
      proximityScale;


    /* =================================================
       SMOOTH SCALE
    ================================================= */

    groupRef.current.scale.x +=
      (
        targetScale -
        groupRef.current.scale.x
      ) * 0.03;


    groupRef.current.scale.y +=
      (
        targetScale -
        groupRef.current.scale.y
      ) * 0.03;


    groupRef.current.scale.z +=
      (
        targetScale -
        groupRef.current.scale.z
      ) * 0.03;
  });


  return (
    <group
      ref={groupRef}
      position={[
        CORE_POSITION.x,
        CORE_POSITION.y,
        CORE_POSITION.z
      ]}
    >

      {/* =================================================
          WHITE INNER RING
      ================================================= */}

      <mesh
        rotation={[
          Math.PI / 2.5,
          0,
          0
        ]}
      >
        <torusGeometry
          args={[
            2.6,
            0.008,
            16,
            100
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>


      {/* =================================================
          RED MID RING
      ================================================= */}

      <mesh
        rotation={[
          Math.PI / 3,
          0.4,
          0
        ]}
      >
        <torusGeometry
          args={[
            3.0,
            0.01,
            16,
            100
          ]}
        />

        <meshBasicMaterial
          color="#e10600"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>


      {/* =================================================
          OUTER RING
      ================================================= */}

      <mesh
        rotation={[
          0.6,
          Math.PI / 4,
          0
        ]}
      >
        <torusGeometry
          args={[
            3.5,
            0.005,
            16,
            100
          ]}
        />

        <meshBasicMaterial
          color="#aaaaaa"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}


/* =====================================================
   LAYER 5: CORE PARTICLE FIELD
===================================================== */

function MorphParticles() {
  const pointsRef = useRef();

  const { mouse } = useThree();

  const particleCount = typeof window !== "undefined" && window.innerWidth < 768 ? 500 : 1200;


  /* -----------------------------------------------------
     SCATTERED CORE PARTICLES
  ----------------------------------------------------- */

  const scatteredPositions = useMemo(() => {
    const data = new Float32Array(
      particleCount * 3
    );

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const i3 = i * 3;

      const radius =
        2.8 + Math.random() * 4.5;

      const angle =
        Math.random() *
        Math.PI *
        2;

      data[i3] =
        Math.cos(angle) *
        radius;

      data[i3 + 1] =
        Math.sin(angle) *
        radius *
        0.65;

      data[i3 + 2] =
        (Math.random() - 0.5) * 5;
    }

    return data;
  }, [particleCount]);


  /* -----------------------------------------------------
     CORE FORMATION
  ----------------------------------------------------- */

  const corePositions = useMemo(() => {
    const data = new Float32Array(
      particleCount * 3
    );

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const i3 = i * 3;

      const radius =
        0.8 + Math.random() * 1.5;

      const theta =
        Math.random() *
        Math.PI *
        2;

      const phi =
        Math.acos(
          2 * Math.random() - 1
        );

      data[i3] =
        Math.sin(phi) *
        Math.cos(theta) *
        radius;

      data[i3 + 1] =
        Math.sin(phi) *
        Math.sin(theta) *
        radius;

      data[i3 + 2] =
        Math.cos(phi) *
        radius;
    }

    return data;
  }, [particleCount]);


  /* -----------------------------------------------------
     MORPH
  ----------------------------------------------------- */

  const morphProgress =
    useRef(0);


  useFrame((state) => {
    if (!pointsRef.current) return;

    const time =
      state.clock.elapsedTime;

    const heroProgress =
      heroState.progress;

    const pageProgress =
      sectionState.progress;

    const sectionIntensity =
      sectionVisualState.intensity;

    const sectionEnergy =
      sectionVisualState.energy;

    const zone =
      sectionVisualState.zone;

    const focus =
      sectionVisualState.focus;


    /* =================================================
       HERO SCROLL → CORE ATTRACTOR
    ================================================= */

    const targetMorph =
      0.12 +
      heroProgress * 0.88;

    morphProgress.current +=
      (
        targetMorph -
        morphProgress.current
      ) * 0.045;

    const morph =
      morphProgress.current;


    /* =================================================
       PARTICLE MORPH
    ================================================= */

    const position =
      pointsRef.current
        .geometry
        .attributes
        .position
        .array;


    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const i3 = i * 3;

      position[i3] =
        THREE.MathUtils.lerp(
          scatteredPositions[i3],
          corePositions[i3],
          morph
        );

      position[i3 + 1] =
        THREE.MathUtils.lerp(
          scatteredPositions[i3 + 1],
          corePositions[i3 + 1],
          morph
        );

      position[i3 + 2] =
        THREE.MathUtils.lerp(
          scatteredPositions[i3 + 2],
          corePositions[i3 + 2],
          morph
        );
    }


    pointsRef.current
      .geometry
      .attributes
      .position
      .needsUpdate = true;


    /* =================================================
       KEEP PARTICLES LOCKED TO CORE
    ================================================= */

    const targetX =
      mouse.x * 0.5;

    const targetY =
      mouse.y * 0.5;

    pointsRef.current.position.x +=
      (
        targetX -
        pointsRef.current.position.x
      ) * 0.05;

    pointsRef.current.position.y +=
      (
        targetY -
        pointsRef.current.position.y
      ) * 0.05;


    /* =================================================
       HERO + SECTION SCALE
    ================================================= */

    const targetScale =
      1 +
      heroProgress * 0.08 +
      pageProgress * 0.04 +
      sectionEnergy * 0.025 +
      zone * 0.02 +
      focus * 0.012;


    pointsRef.current.scale.x +=
      (
        targetScale -
        pointsRef.current.scale.x
      ) * 0.04;

    pointsRef.current.scale.y +=
      (
        targetScale -
        pointsRef.current.scale.y
      ) * 0.04;

    pointsRef.current.scale.z +=
      (
        targetScale -
        pointsRef.current.scale.z
      ) * 0.04;


    /* =================================================
       PARTICLE FIELD MOVEMENT
    ================================================= */

    pointsRef.current.rotation.y +=
      (
        0.0015 +
        pageProgress * 0.003 +
        sectionIntensity * 0.002 +
        zone * 0.0015
      );

    pointsRef.current.rotation.x =
      Math.sin(
        time * (
          0.25 +
          sectionEnergy * 0.12 +
          zone * 0.06
        )
      ) *
      (
        0.015 +
        focus * 0.008
      ) +
      pageProgress * 0.025;
  });


  return (
    <Points
      ref={pointsRef}
      positions={scatteredPositions}
      stride={3}
      frustumCulled={false}
      position={[
        CORE_POSITION.x,
        CORE_POSITION.y,
        CORE_POSITION.z
      ]}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.028}
        sizeAttenuation
        depthWrite={false}
        opacity={0.42}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}


/* =====================================================
   SCROLL CONTROLLER
===================================================== */

function ScrollController() {
  useEffect(() => {
    const handleScroll = () => {
      scrollState.target =
        window.scrollY;
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  useFrame(() => {
    scrollState.current +=
      (
        scrollState.target -
        scrollState.current
      ) * 0.06;
  });


  return null;
}


/* =====================================================
   HERO ↔ 3D UNIVERSE SYNC
===================================================== */

function HeroUniverseSync() {
  useEffect(() => {
    let animationFrame;

    const updateHeroState = () => {
      const hero = document.getElementById("home");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const range = Math.max(rect.height - window.innerHeight, 1);
        heroState.target = THREE.MathUtils.clamp(-rect.top / range, 0, 1);
      }
      animationFrame = requestAnimationFrame(updateHeroState);
    };

    updateHeroState();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useFrame(() => {
    heroState.progress +=
      (
        heroState.target -
        heroState.progress
      ) * 0.08;
  });

  return null;
}


/* =====================================================
   SECTION ↔ 3D UNIVERSE SYNC
===================================================== */

function SectionUniverseSync() {
  useEffect(() => {
    let animationFrame;

    const updateSectionState = () => {
      const scrollY =
        window.scrollY || 0;

      const maxScroll =
        Math.max(
          document.documentElement.scrollHeight -
          window.innerHeight,
          1
        );


      /* -----------------------------------------------
         GLOBAL PAGE PROGRESS
      ----------------------------------------------- */

      sectionState.target =
        THREE.MathUtils.clamp(
          scrollY / maxScroll,
          0,
          1
        );


      /* -----------------------------------------------
         FIND ACTIVE SECTION
      ----------------------------------------------- */

      const sections =
        Array.from(
          document.querySelectorAll("section")
        );

      if (sections.length > 0) {
        const viewportCenter =
          window.innerHeight / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        sections.forEach(
          (section, index) => {
            const rect =
              section.getBoundingClientRect();

            const sectionCenter =
              rect.top +
              rect.height / 2;

            const distance =
              Math.abs(
                sectionCenter -
                viewportCenter
              );

            if (
              distance <
              closestDistance
            ) {
              closestDistance =
                distance;

              closestIndex =
                index;
            }
          }
        );

        sectionState.targetIndex =
          closestIndex;


        /* ---------------------------------------------
           LOCAL SECTION PROGRESS
        --------------------------------------------- */

        const activeSection =
          sections[closestIndex];

        if (activeSection) {
          const rect =
            activeSection.getBoundingClientRect();

          const sectionHeight =
            Math.max(
              rect.height,
              window.innerHeight
            );

          const local =
            (
              viewportCenter -
              rect.top
            ) / sectionHeight;

          sectionState.targetLocalProgress =
            THREE.MathUtils.clamp(
              local,
              0,
              1
            );
        }
      }

      animationFrame =
        requestAnimationFrame(
          updateSectionState
        );
    };

    updateSectionState();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);


  useFrame(() => {

    /* -----------------------------------------------
       SMOOTH GLOBAL PROGRESS
    ----------------------------------------------- */

    sectionState.progress +=
      (
        sectionState.target -
        sectionState.progress
      ) * 0.035;


    /* -----------------------------------------------
       SMOOTH SECTION INDEX
    ----------------------------------------------- */

    sectionState.index +=
      (
        sectionState.targetIndex -
        sectionState.index
      ) * 0.08;


    /* -----------------------------------------------
       SMOOTH LOCAL SECTION PROGRESS
    ----------------------------------------------- */

    sectionState.localProgress +=
      (
        sectionState.targetLocalProgress -
        sectionState.localProgress
      ) * 0.05;
  });


  return null;
}


/* =====================================================
   SECTION VISUAL SYNC
   STEP 5.1 + STEP 5.2
===================================================== */

function SectionVisualSync() {
  useEffect(() => {
    const handleProjectHover = (event) => {
      projectHoverState.target = event.detail?.active ? 1 : 0;
    };
    window.addEventListener("galaxy-project-hover", handleProjectHover);
    return () => window.removeEventListener("galaxy-project-hover", handleProjectHover);
  }, []);

  useFrame(() => {

    const sectionIndex =
      sectionState.index;

    const localProgress =
      sectionState.localProgress;

    projectHoverState.current +=
      (projectHoverState.target - projectHoverState.current) * 0.08;


    /* =================================================
       STEP 5.1
    ================================================= */

    const profile = SECTION_VISUAL_PROFILES[Math.min(Math.round(sectionIndex), SECTION_VISUAL_PROFILES.length - 1)];

    sectionVisualState.targetIntensity = profile.intensity;
    sectionVisualState.targetMotion = profile.motion;
    sectionVisualState.targetEnergy = THREE.MathUtils.clamp(
      profile.energy + projectHoverState.current * 0.05,
      0,
      1
    );


    /* =================================================
       STEP 5.2 — SECTION ZONE
    ================================================= */

    /*
      Instead of making the universe change
      dramatically between sections, we create
      a smooth atmospheric zone.

      zone:
      0 → beginning
      1 → deepest / strongest section
    */

    sectionVisualState.targetZone = THREE.MathUtils.clamp(sectionIndex / 6, 0, 1);


    /* =================================================
       SECTION FOCUS
    ================================================= */

    /*
      Focus is strongest near the middle of
      the currently active section.

      This creates a subtle "locked in"
      feeling while reading content.
    */

    const sectionFocus =
      1 -
      Math.abs(
        localProgress - 0.5
      ) * 2;

    sectionVisualState.targetFocus =
      THREE.MathUtils.clamp(
        sectionFocus,
        0,
        1
      );


    /* =================================================
       SMOOTH TRANSITIONS
    ================================================= */

    sectionVisualState.intensity +=
      (
        sectionVisualState.targetIntensity -
        sectionVisualState.intensity
      ) * 0.035;

    sectionVisualState.motion +=
      (
        sectionVisualState.targetMotion -
        sectionVisualState.motion
      ) * 0.04;

    sectionVisualState.energy +=
      (
        sectionVisualState.targetEnergy -
        sectionVisualState.energy
      ) * 0.035;

    sectionVisualState.zone +=
      (
        sectionVisualState.targetZone -
        sectionVisualState.zone
      ) * 0.035;

    sectionVisualState.focus +=
      (
        sectionVisualState.targetFocus -
        sectionVisualState.focus
      ) * 0.05;
  });

  return null;
}


/* =====================================================
   PAGE VISIBILITY CONTROLLER
===================================================== */

function PageVisibilityController() {
  const { invalidate, setFrameloop } = useThree();

  useEffect(() => {
    const updateVisibility = () => {
      if (document.hidden) {
        setFrameloop("never");
        return;
      }

      setFrameloop("always");
      invalidate();
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      setFrameloop("always");
    };
  }, [invalidate, setFrameloop]);

  return null;
}


/* =====================================================
   CAMERA CONTROLLER
===================================================== */

/* =====================================================
   CAMERA CONTROLLER
   STEP 5.3 — CINEMATIC SECTION DEPTH
===================================================== */

function CameraController() {
  const { camera, mouse } = useThree();

  const cameraVelocity = useRef(0);

  useFrame((state) => {

    /* =================================================
       TIME
    ================================================= */

    const time =
      state.clock.elapsedTime;


    /* =================================================
       CURSOR PARALLAX
    ================================================= */

    const targetCamX =
      -mouse.x * 1.5;

    const targetCamY =
      -mouse.y * 1.5;


    camera.position.x +=
      (
        targetCamX -
        camera.position.x
      ) * 0.03;

    camera.position.y +=
      (
        targetCamY -
        camera.position.y
      ) * 0.03;


    /* =================================================
       CURSOR DEPTH
    ================================================= */

    const dist =
      Math.sqrt(
        mouse.x * mouse.x +
        mouse.y * mouse.y
      );

    const cursorDepth =
      dist * 1.0;


    /* =================================================
       HERO DEPTH
    ================================================= */

    const heroProgress =
      heroState.progress;

    const heroDepth =
      heroProgress * 0.8;


    /* =================================================
       SECTION DATA
    ================================================= */

    const pageProgress =
      sectionState.progress;

    const sectionIndex =
      sectionState.index;

    const localProgress =
      sectionState.localProgress;

    const zone =
      sectionVisualState.zone;

    const focus =
      sectionVisualState.focus;


    /* =================================================
       BASE SECTION DEPTH
    ================================================= */

    const baseSectionDepth =
      Math.max(
        0,
        pageProgress - 0.08
      ) * 1.8;


    /* =================================================
       SECTION ZONE DEPTH
    ================================================= */

    /*
      Each section gets a tiny additional
      spatial offset.

      This is intentionally subtle so the
      universe still feels continuous.
    */

    const zoneDepth =
      zone * 0.45;


    /* =================================================
       LOCAL SECTION MOVEMENT
    ================================================= */

    /*
      When entering/leaving a section,
      create a tiny forward/backward
      camera movement.
    */

    const localWave =
      Math.sin(
        localProgress * Math.PI
      );


    const localDepth =
      localWave *
      focus *
      0.22;


    /* =================================================
       SECTION TRANSITION PULSE
    ================================================= */

    /*
      Gives section changes a very small
      cinematic breathing effect.
    */

    const sectionPulse =
      Math.sin(
        time * 0.45 +
        sectionIndex * Math.PI
      ) *
      zone *
      0.035;


    /* =================================================
       TARGET CAMERA Z
    ================================================= */

    const targetCamZ =
      6 +
      cursorDepth -
      heroDepth -
      baseSectionDepth -
      zoneDepth -
      localDepth +
      sectionPulse;


    /* =================================================
       CAMERA VELOCITY
    ================================================= */

    const depthDifference =
      targetCamZ -
      camera.position.z;

    cameraVelocity.current +=
      depthDifference *
      0.002;

    cameraVelocity.current *=
      0.92;


    /* =================================================
       CAMERA MOVEMENT
    ================================================= */

    camera.position.z +=
      cameraVelocity.current;


    /* =================================================
       SAFETY LIMIT
    ================================================= */

    camera.position.z =
      THREE.MathUtils.clamp(
        camera.position.z,
        2.2,
        8
      );


    /* =================================================
       LOOK AT CORE
    ================================================= */

    camera.lookAt(
      CORE_POSITION.x,
      CORE_POSITION.y,
      CORE_POSITION.z
    );
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
        eventSource={
          document.getElementById("root")
        }

        eventPrefix="client"

        camera={{
          position: [0, 0, 6],
          fov: 60,
          near: 0.1,
          far: 100
        }}

        dpr={
          typeof window !== "undefined" && window.innerWidth < 768
            ? [0.7, 1]
            : [1, 1.5]
        }

        gl={{
          antialias: true,
          alpha: true,
          powerPreference:
            "high-performance"
        }}
      >



        {/* =================================================
            CONTROLLERS
        ================================================= */}

        <PageVisibilityController />

        <ScrollController />

        <HeroUniverseSync />

        <SectionUniverseSync />

        <SectionVisualSync />

        <CameraController />


        {/* =================================================
            UNIVERSE
        ================================================= */}

        <BackgroundStars />

        <DriftingGlowStars />

        <MidgroundStars />


        {/* =================================================
            CORE UNIVERSE
        ================================================= */}

        <MorphParticles />

        <CentralCore />

        <OrbitingRings />

      </Canvas>

    </div>
  );
}