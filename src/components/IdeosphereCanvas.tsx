import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ActiveLayer, AxisDefinition, AxisScore, CloudParameters } from '../types/ideosphere';

interface Props {
  cloud: CloudParameters;
  axes: AxisDefinition[];
  activeLayer: ActiveLayer;
  axisScores: AxisScore[];
}

const BOUNDS_RADIUS = 1.8;
const PARTICLE_COUNT = 2200;
const AXIS_DIRECTIONS: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
  [0.71, 0.71, 0],
  [0, 0.71, 0.71],
];

function gaussian3D(stdDev: number): [number, number, number] {
  const boxMuller = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  return [boxMuller() * stdDev, boxMuller() * stdDev, boxMuller() * stdDev];
}

function createSoftParticleTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(size / 2, size / 2, size * 0.06, size / 2, size / 2, size * 0.5);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.3, 'rgba(210,225,255,0.55)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function IdeosphereCanvas({ cloud, axes, activeLayer, axisScores }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cloudRef = useRef<THREE.Points | null>(null);
  const particleMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d14');

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const resize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    resize();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = 2.3;
    controls.maxDistance = 7;

    const ambient = new THREE.AmbientLight('#89a0d7', 0.4);
    const light = new THREE.DirectionalLight('#9cc2ff', 0.5);
    light.position.set(2, 3, 2);
    scene.add(ambient, light);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(BOUNDS_RADIUS, 48, 48),
      new THREE.MeshBasicMaterial({ color: '#6ca8ff', transparent: true, opacity: 0.1, wireframe: true }),
    );
    scene.add(sphere);

    axes.slice(0, 8).forEach((_, i) => {
      const direction = new THREE.Vector3(...AXIS_DIRECTIONS[i % AXIS_DIRECTIONS.length]).normalize();
      const anchor = direction.clone().multiplyScalar(BOUNDS_RADIUS);

      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), anchor]),
        new THREE.LineBasicMaterial({ color: '#385275', transparent: true, opacity: 0.35 }),
      );
      scene.add(line);

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 12, 12),
        new THREE.MeshBasicMaterial({ color: '#7d96bb', transparent: true, opacity: 0.6 }),
      );
      node.position.copy(anchor);
      scene.add(node);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
    const material = new THREE.PointsMaterial({
      color: '#6fa8ff',
      map: createSoftParticleTexture(),
      alphaTest: 0.02,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    particleMaterialRef.current = material;

    const particles = new THREE.Points(geometry, material);
    cloudRef.current = particles;
    scene.add(particles);

    let rafId = 0;
    const animate = () => {
      controls.update();
      particles.rotation.y += 0.0007;
      particles.rotation.x += 0.0002;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
      controls.dispose();
      material.map?.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      scene.clear();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [axes]);

  useEffect(() => {
    const particles = cloudRef.current;
    const material = particleMaterialRef.current;
    if (!particles || !material) return;

    const positions = particles.geometry.attributes.position.array as Float32Array;
    const [cx, cy, cz] = cloud.centroid;
    const stdDev = Math.max(0.12, cloud.spread * 0.5);

    for (let i = 0; i < positions.length; i += 3) {
      let point: THREE.Vector3;
      let attempts = 0;

      do {
        const [gx, gy, gz] = gaussian3D(stdDev);
        point = new THREE.Vector3(
          cx + gx + (Math.random() - 0.5) * cloud.jitter,
          cy + gy + (Math.random() - 0.5) * cloud.jitter,
          cz + gz + (Math.random() - 0.5) * cloud.jitter,
        );
        attempts += 1;
      } while (point.length() > BOUNDS_RADIUS && attempts < 8);

      if (point.length() > BOUNDS_RADIUS) {
        point.setLength(BOUNDS_RADIUS * 0.98);
      }

      positions[i] = point.x;
      positions[i + 1] = point.y;
      positions[i + 2] = point.z;
    }

    const directionalBias = axisScores.reduce((acc, axis, index) => {
      const dir = AXIS_DIRECTIONS[index % AXIS_DIRECTIONS.length];
      return acc + axis.value * (dir[0] * 0.34 + dir[1] * 0.33 + dir[2] * 0.33);
    }, 0);

    const tintShift = THREE.MathUtils.clamp((directionalBias + 1) / 2, 0, 1);
    const layerBase = new THREE.Color(activeLayer === 'descriptive' ? '#6fa8ff' : '#8e7bff');
    const tintTarget = new THREE.Color(activeLayer === 'descriptive' ? '#95bbff' : '#a38dff');
    layerBase.lerp(tintTarget, 0.2 + tintShift * 0.35);

    material.color.copy(layerBase);
    material.opacity = 0.62 + cloud.density * 0.15;
    particles.geometry.attributes.position.needsUpdate = true;
  }, [cloud, axisScores, activeLayer]);

  return <div className="viz-mount" ref={mountRef} />;
}
