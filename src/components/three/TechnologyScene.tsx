import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
  Vector3,
  Color,
  ACESFilmicToneMapping,
} from 'three';
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Arch({ kind, onReady }: { kind: 'scan' | 'opg'; onReady: () => void }) {
  const [object, setObject] = useState<Group>();
  const ref = useRef<Group>(null);
  const sweep = useRef<Mesh>(null);
  const clock = useRef(0);
  useEffect(() => {
    let active = true;
    let loaded: Group | undefined;
    new GLTFLoader().load(
      kind === 'opg' ? '/models/technology-dentition.glb' : '/models/technology-scan.glb',
      (g) => {
        loaded = g.scene;
        if (!active) return;
        const box = new Box3().setFromObject(loaded);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        loaded.position.sub(center);
        const wrapper = new Group();
        wrapper.add(loaded);
        wrapper.scale.setScalar(5 / size.x);
        loaded.traverse((node) => {
          if (node instanceof Mesh && !node.userData.scanOverlay) {
            const gum = node.name.startsWith('gingiva');
            if (!node.geometry.getAttribute('normal')) node.geometry.computeVertexNormals();
            node.material = new MeshStandardMaterial({
              color: gum
                ? kind === 'scan'
                  ? '#91b7ce'
                  : '#38566e'
                : kind === 'scan'
                  ? '#f0ede3'
                  : '#bfd9e7',
              emissive: '#000000',
              roughness: gum ? 0.72 : 0.32,
              metalness: 0.025,
              side: gum ? 2 : 0,
            });
            if (gum) return;
            const scan = new ShaderMaterial({
              transparent: true,
              depthWrite: false,
              polygonOffset: true,
              polygonOffsetFactor: -1,
              polygonOffsetUnits: -1,
              uniforms: {
                plane: { value: 0 },
                tint: { value: new Color(kind === 'scan' ? '#78bcd9' : '#b4dcff') },
              },
              vertexShader: `
                varying vec3 world;
                varying vec3 viewNormal;
                varying vec3 viewPosition;
                void main() {
                  vec4 p = modelMatrix * vec4(position, 1.);
                  world = p.xyz;
                  viewNormal = normalize(normalMatrix * normal);
                  viewPosition = (viewMatrix * p).xyz;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
                }`,
              fragmentShader: `
                uniform float plane;
                uniform vec3 tint;
                varying vec3 world;
                varying vec3 viewNormal;
                varying vec3 viewPosition;
                void main() {
                  float distanceToPlane = abs(world.x - plane);
                  float band = exp(-pow(distanceToPlane * 10., 2.));
                  float halo = exp(-pow(distanceToPlane * 3., 2.));
                  float edge = pow(1. - abs(dot(normalize(viewNormal), normalize(-viewPosition))), 2.);
                  float acquired = 1. - smoothstep(plane - .15, plane + .15, world.x);
                  float alpha = band * .48 + halo * .06 + edge * .055 + acquired * .025;
                  gl_FragColor = vec4(tint, alpha);
                }`,
            });
            const overlay = new Mesh(node.geometry, scan);
            overlay.userData.scanOverlay = true;
            node.add(overlay);
          }
        });
        setObject(wrapper);
        onReady();
      },
      undefined,
      () => {}
    );
    return () => {
      active = false;
      loaded?.traverse((n) => {
        if (n instanceof Mesh) {
          n.geometry.dispose();
          (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => m.dispose());
        }
      });
    };
  }, [kind, onReady]);
  useFrame(({ gl, camera, viewport }, delta) => {
    // Use elapsed time so a slower GPU does not turn the loop into near-static motion.
    clock.current += delta;
    const t = clock.current;
    if (ref.current) {
      const view = viewport.getCurrentViewport(camera);
      const studyHeight = kind === 'scan' ? 4.8 : 2.8;
      ref.current.scale.setScalar(
        Math.min((view.width * 0.82) / 5, (view.height * 0.83) / studyHeight)
      );
      ref.current.rotation.set(
        kind === 'scan' ? 0.08 : 0.02,
        Math.sin(t * 0.38) * 0.28,
        kind === 'scan' ? -0.08 : 0
      );
    }
    const x = Math.sin(t * 0.75) * 2.7;
    gl.domElement.dataset.animationTime = t.toFixed(3);
    gl.domElement.dataset.scanPosition = x.toFixed(3);
    gl.domElement.dataset.rotation = (ref.current?.rotation.y ?? 0).toFixed(3);
    object?.traverse((n) => {
      if (n instanceof Mesh && n.material instanceof ShaderMaterial)
        n.material.uniforms.plane.value = x;
    });
    if (sweep.current) sweep.current.position.x = x;
  });
  return (
    <group ref={ref}>
      {object && <primitive object={object} />}
      <mesh ref={sweep} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.4, 2.2]} />
        <meshBasicMaterial
          color="#8bb7ff"
          transparent
          opacity={0.035}
          depthWrite={false}
          side={2}
        />
      </mesh>
    </group>
  );
}
export default function TechnologyScene({ kind }: { kind: 'scan' | 'opg' }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!q.matches);
    update();
    q.addEventListener('change', update);
    const io = new IntersectionObserver((entries) =>
      setActive(entries[0].isIntersecting && !document.hidden)
    );
    if (root.current) io.observe(root.current);
    const visibility = () => {
      if (document.hidden) setActive(false);
      else if (root.current) {
        const r = root.current.getBoundingClientRect();
        setActive(r.bottom > 0 && r.top < innerHeight);
      }
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      q.removeEventListener('change', update);
      io.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  const onReady = useRef(() => setReady(true)).current;
  return (
    <div
      ref={root}
      className={`technology-canvas ${ready && enabled ? 'ready' : ''}`}
      aria-hidden="true"
    >
      <Boundary>
        {enabled && (
          <Canvas
            orthographic
            frameloop={active ? 'always' : 'never'}
            dpr={[1, 1.25]}
            camera={{ position: kind === 'scan' ? [0, 9, 6] : [0, 0.15, 10], zoom: 60 }}
            gl={{ alpha: true, antialias: true }}
            onCreated={({ camera, gl }) => {
              camera.lookAt(0, 0, 0);
              gl.toneMapping = ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
              gl.domElement.addEventListener(
                'webglcontextlost',
                () => {
                  setReady(false);
                  setEnabled(false);
                },
                { once: true }
              );
            }}
          >
            <ambientLight intensity={0.5} />
            <hemisphereLight args={['#edf5ff', '#53667d', kind === 'scan' ? 0.75 : 1]} />
            <directionalLight
              position={[-3, 6, 5]}
              intensity={kind === 'scan' ? 3.1 : 1.7}
              color="#fff8ee"
            />
            <directionalLight position={[4, 2, -2]} intensity={1.7} color="#98c6f0" />
            <directionalLight position={[1, -1, 4]} intensity={0.45} color="#dceafa" />
            <Arch kind={kind} onReady={onReady} />
          </Canvas>
        )}
      </Boundary>
    </div>
  );
}
