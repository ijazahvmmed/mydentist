import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Group, Mesh, MeshStandardMaterial, ShaderMaterial, Vector3 } from 'three';
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
      '/models/dental-arch.glb',
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
        wrapper.rotation.x = -Math.PI / 2;
        loaded.traverse((node) => {
          if (node instanceof Mesh && !node.userData.scanOverlay) {
            node.geometry.computeVertexNormals();
            node.material = new MeshStandardMaterial({
              color: kind === 'scan' ? '#c4d7f5' : '#96b6f2',
              roughness: 0.42,
              metalness: 0.08,
            });
            const scan = new ShaderMaterial({
              transparent: true,
              depthWrite: false,
              uniforms: { plane: { value: 0 } },
              vertexShader:
                'varying vec3 world; varying vec3 n; void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xyz;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*viewMatrix*p;}',
              fragmentShader:
                'uniform float plane;varying vec3 world;varying vec3 n;void main(){float sweep=exp(-pow((world.x-plane)*8.,2.));float grid=1.-smoothstep(.025,.08,abs(fract(world.y*14.)-.5));gl_FragColor=vec4(.38,.62,1.,sweep*.8+grid*.12);}',
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
  useFrame((_, delta) => {
    clock.current += Math.min(delta, 0.05);
    const t = clock.current;
    if (ref.current) {
      ref.current.rotation.set(
        kind === 'scan' ? 0.45 : 0.02,
        Math.sin(t * 0.22) * 0.22,
        kind === 'scan' ? -0.08 : 0
      );
    }
    const x = Math.sin(t * 0.65) * 2.7;
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
        <meshBasicMaterial color="#8bb7ff" transparent opacity={0.11} depthWrite={false} side={2} />
      </mesh>
      {kind === 'opg' && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <torusGeometry args={[3.1, 0.014, 6, 100]} />
          <meshBasicMaterial color="#709cdf" transparent opacity={0.5} />
        </mesh>
      )}
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
            frameloop={active ? 'always' : 'never'}
            dpr={[1, 1.25]}
            camera={{ position: kind === 'scan' ? [0, 4.9, 5.4] : [0, 1.1, 7.2], fov: 43 }}
            gl={{ alpha: true, antialias: true }}
            onCreated={({ camera, gl }) => {
              camera.lookAt(0, 0, 0);
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
            <ambientLight intensity={1.4} />
            <directionalLight position={[-3, 6, 5]} intensity={2.6} />
            <directionalLight position={[4, 2, -2]} intensity={1.5} color="#8faefb" />
            <Arch kind={kind} onReady={onReady} />
          </Canvas>
        )}
      </Boundary>
    </div>
  );
}
