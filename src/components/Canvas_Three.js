import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { DoubleSide } from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  PointLightHelper,
  useTexture,
} from "@react-three/drei";
import { useControls } from "leva";

function MyEarth({ color, ...props }) {
  const radius = 10;
  const ref = useRef();
  const earthTexture = useTexture({ map: "/earth.jpg" }); //x = 0が経度0、y=0が緯度0
  useFrame((state, delta, xrFrame) => {});
  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh
        castShadow
        position={[0, 0, 0]}
        scale={1}
        onPointerDown={(e) => {
          const pi = e.intersections[0].point;
          //経度: (pi.x, pi.y, 0)の直線と(pi.x, 0, 0)の間の角度
          let longitude =
            (Math.asin(pi.z / Math.sqrt(pi.x * pi.x + pi.z * pi.z)) * 180) /
            Math.PI;
          //x,zの合成ベクトルとこのベクトルの内積を求める
          let latitude =
            (Math.acos(
              (pi.x * pi.x + pi.z * pi.z) /
                (Math.sqrt(pi.x * pi.x + pi.z * pi.z) *
                  Math.sqrt(pi.x * pi.x + pi.y * pi.y + pi.z * pi.z))
            ) *
              180) /
            Math.PI;
          if (pi.y < 0) {
            latitude *= -1.0;
          }
          console.log(longitude, latitude);
          console.log(pi);
        }}
      >
        <sphereGeometry args={[radius, 128, 64]} />
        <meshPhysicalMaterial map={earthTexture.map} />
      </mesh>
    </group>
  );
}

export default function Canvas_Three(props) {
  const refCanvas = useRef(null);
  useEffect(() => {
    if (refCanvas != null) {
      console.log(refCanvas.current);
    }
  }, [refCanvas]);
  return (
    <Canvas
      ref={refCanvas}
      shadows
      camera={{ position: [0, 0, 20] }}
      gl={{
        alpha: false,
        antialias: true,
        stencil: false,
        depth: true,
      }}
    >
      <color attach="background" args={["white"]} />
      <ambientLight intensity={3} />
      <axesHelper scale={100} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        enableDamping={true}
      />
      <Suspense fallback={null}></Suspense>
      <MyEarth></MyEarth>
    </Canvas>
  );
}
