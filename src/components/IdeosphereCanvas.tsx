import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { AxisDefinition, CloudParameters } from '../types/ideosphere';

interface Props {
  cloud: CloudParameters;
  axes: AxisDefinition[];
}

export function IdeosphereCanvas({ cloud, axes }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cloudRef = useRef<THREE.Points | null>(null);

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
      new THREE.SphereGeometry(1.8, 48, 48),
      new THREE.MeshBasicMaterial({ color: '#6ca8ff', transparent: true, opacity: 0.12, wireframe: true }),
    );
    scene.add(sphere);

    axes.slice(0, 8).forEach((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, (i % 2 === 0 ? 1 : -1) * 0.7),
      ];
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: '#385275', transparent: true, opacity: 0.55 }),
      );
      scene.add(line);
    });

    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    const material = new THREE.PointsMaterial({
      color: '#8eb8ff',
      size: 0.03,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(geometry, material);
    cloudRef.current = particles;
    scene.add(particles);

    const animate = () => {
      controls.update();
      particles.rotation.y += 0.0009;
      particles.rotation.x += 0.00025;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [axes]);

  useEffect(() => {
    const particles = cloudRef.current;
    if (!particles) return;
    const positions = particles.geometry.attributes.position.array as Float32Array;
    const [cx, cy, cz] = cloud.centroid;

    for (let i = 0; i < positions.length; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.pow(Math.random(), cloud.density) * cloud.spread;

      positions[i] = cx + radius * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * cloud.jitter;
      positions[i + 1] = cy + radius * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * cloud.jitter;
      positions[i + 2] = cz + radius * Math.cos(phi) + (Math.random() - 0.5) * cloud.jitter;
    }

    particles.geometry.attributes.position.needsUpdate = true;
  }, [cloud]);

  return <div className="viz-mount" ref={mountRef} />;
}
