'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create more realistic Earth textures
  const createEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Create base ocean color
    const oceanGradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
    oceanGradient.addColorStop(0, '#1e3a8a'); // Deep ocean blue
    oceanGradient.addColorStop(0.3, '#1e40af'); // Medium ocean blue
    oceanGradient.addColorStop(0.6, '#3b82f6'); // Light ocean blue
    oceanGradient.addColorStop(1, '#60a5fa'); // Coastal blue

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Add more detailed continents
    ctx.fillStyle = '#166534'; // Dark green for forests

    // North America
    ctx.beginPath();
    ctx.ellipse(200, 180, 120, 80, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // South America
    ctx.beginPath();
    ctx.ellipse(280, 350, 40, 120, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Europe
    ctx.beginPath();
    ctx.ellipse(550, 160, 60, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.ellipse(580, 280, 50, 140, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Asia
    ctx.beginPath();
    ctx.ellipse(750, 200, 150, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.ellipse(850, 380, 70, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add desert regions (brown)
    ctx.fillStyle = '#92400e'; // Desert brown

    // Sahara
    ctx.beginPath();
    ctx.ellipse(580, 260, 80, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Arabian Desert
    ctx.beginPath();
    ctx.ellipse(680, 240, 40, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gobi Desert
    ctx.beginPath();
    ctx.ellipse(780, 200, 50, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add some green variations for forests
    ctx.fillStyle = '#15803d'; // Forest green
    ctx.globalAlpha = 0.7;

    // Amazon rainforest
    ctx.beginPath();
    ctx.ellipse(280, 340, 35, 40, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Congo rainforest
    ctx.beginPath();
    ctx.ellipse(600, 320, 25, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1.0;

    return new THREE.CanvasTexture(canvas);
  };

  const createNormalMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Create normal map for surface detail
    const imageData = ctx.createImageData(1024, 512);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Base normal (flat surface)
      data[i] = 128;     // R
      data[i + 1] = 128; // G
      data[i + 2] = 255; // B (pointing outward)
      data[i + 3] = 255; // A
    }

    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  };

  const createSpecularMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Specular map - water reflects light
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 512);

    // Make land less specular
    ctx.fillStyle = '#333333';
    // Land areas (approximate)
    ctx.fillRect(150, 140, 240, 160); // North America
    ctx.fillRect(260, 290, 80, 240);  // South America
    ctx.fillRect(520, 140, 120, 70);  // Europe
    ctx.fillRect(550, 200, 100, 280); // Africa
    ctx.fillRect(650, 140, 300, 200); // Asia
    ctx.fillRect(800, 350, 140, 80);  // Australia

    return new THREE.CanvasTexture(canvas);
  };

  const createCloudTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Create cloud pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 30 + 10;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  };

  const earthTexture = createEarthTexture();
  const normalMap = createNormalMap();
  const specularMap = createSpecularMap();
  const cloudTexture = createCloudTexture();

  // Shader for scroll-based color transformation
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float scrollProgress;
    uniform sampler2D earthTexture;
    uniform sampler2D normalMap;
    uniform sampler2D specularMap;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec4 texColor = texture2D(earthTexture, vUv);
      vec4 normalColor = texture2D(normalMap, vUv);
      vec4 specularColor = texture2D(specularMap, vUv);

      // Desert colors (browns/oranges)
      vec3 desertColor = vec3(0.8, 0.6, 0.4);

      // Healthy Earth colors (greens/blues)
      vec3 healthyColor = vec3(0.3, 0.6, 0.2);

      // Ocean remains blue
      vec3 oceanColor = vec3(0.1, 0.3, 0.8);

      vec3 finalColor;

      // Transform land areas based on scroll
      if (texColor.g > texColor.r && texColor.g > texColor.b) {
        // Green areas (forests) - become healthier
        finalColor = mix(desertColor * 0.8, healthyColor, scrollProgress);
      } else if (texColor.b > texColor.g && texColor.b > texColor.r) {
        // Blue areas (oceans) - stay blue
        finalColor = oceanColor;
      } else {
        // Brown/desert areas - transform to green
        finalColor = mix(desertColor, healthyColor, scrollProgress);
      }

      // Add some lighting
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float diff = max(dot(vNormal, lightDir), 0.0);
      finalColor *= (diff * 0.5 + 0.5);

      // Add specular highlight for water
      if (specularColor.r > 0.5) {
        vec3 viewDir = normalize(-vPosition);
        vec3 reflectDir = reflect(-lightDir, vNormal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        finalColor += spec * 0.3;
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  useFrame((state, delta) => {
    if (earthRef.current) {
      // Rotate the Earth
      earthRef.current.rotation.y += delta * 0.2;

      // Add slight axial tilt
      earthRef.current.rotation.z = 0.41; // 23.5 degrees in radians

      // Update scroll progress in shader
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);

      if (materialRef.current) {
        materialRef.current.uniforms.scrollProgress.value = progress;
      }
    }

    if (cloudsRef.current) {
      // Rotate clouds slightly faster
      cloudsRef.current.rotation.y += delta * 0.25;
    }

    if (atmosphereRef.current) {
      // Atmosphere rotates with Earth
      atmosphereRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 128, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            scrollProgress: { value: 0 },
            earthTexture: { value: earthTexture },
            normalMap: { value: normalMap },
            specularMap: { value: specularMap }
          }}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 32]} />
        <meshLambertMaterial
          map={cloudTexture}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.1, 64, 32]} />
        <meshLambertMaterial
          color={0x87ceeb}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

export default function Earth3D() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Earth />

        {/* Realistic lighting setup */}
        {/* Ambient light for overall illumination */}
        <ambientLight intensity={0.2} color="#ffffff" />

        {/* Main directional light (Sun) */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow={false}
        />

        {/* Fill light from the side */}
        <directionalLight
          position={[-5, 0, 5]}
          intensity={0.3}
          color="#87ceeb"
        />

        {/* Rim light for atmosphere */}
        <pointLight
          position={[0, 0, 0]}
          intensity={0.5}
          color="#87ceeb"
          distance={10}
        />

        {/* Subtle starfield effect */}
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial
            color="#000011"
            side={THREE.BackSide}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      </Canvas>

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 dark:via-black/5 dark:to-black/10" />
    </div>
  );
}