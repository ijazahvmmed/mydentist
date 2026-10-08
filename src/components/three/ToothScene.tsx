import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  Box3,
  BufferGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshBasicMaterial,
  ShaderMaterial,
  Vector3,
  PMREMGenerator,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createStorySnap, getStoryStops } from '../../animations/story-snap';
import { createMobileStory } from '../../animations/mobile-story';
gsap.registerPlugin(ScrollTrigger);
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    document.documentElement.classList.remove('tooth-ready');
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
const vertex = `varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){vP=position; vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv;}`;
const fragment = `uniform float scan; uniform float level; uniform float focus; varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){float edge=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.5); float band=1.-smoothstep(.015,.05,abs(fract(vP.y*9.)-.5)); float sweep=exp(-pow((vP.y-level)*9.,2.)); float roots=1.-smoothstep(-.5,.3,vP.y); float a=scan*(edge*.25+band*.13+sweep*.6+focus*roots*.12); gl_FragColor=vec4(.24,.61,.75,a);}`;
function Molar({ ready }: { ready: () => void }) {
  const [geometry, setGeometry] = useState<BufferGeometry>();
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const { camera, viewport, invalidate, gl, scene } = useThree();
  const metrics = useMemo(() => ({ stage: { top: 0, height: 0 } }), []);
  const bounds = useMemo(() => new Box3(), []);
  const state = useMemo(() => ({ p: 0, entry: 0, turn: 0 }), []);
  const enamel = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: '#f3edda',
        roughness: 0.26,
        metalness: 0,
        clearcoat: 0.42,
        envMapIntensity: 0.35,
        clearcoatRoughness: 0.38,
      }),
    []
  );
  useEffect(() => {
    if (!geometry) return;
    const studio = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    let environment: ReturnType<PMREMGenerator['fromScene']> | undefined;
    const frame = requestAnimationFrame(() => {
      environment = generator.fromScene(studio, 0.04, 0.1, 100, { size: 64 });
      scene.environment = environment.texture;
      invalidate();
    });
    return () => {
      cancelAnimationFrame(frame);
      scene.environment = null;
      environment?.dispose();
      generator.dispose();
      studio.dispose();
    };
  }, [geometry, gl, scene, invalidate]);
  const wire = useMemo(
    () =>
      new MeshBasicMaterial({ color: '#3e66b7', wireframe: true, transparent: true, opacity: 0 }),
    []
  );
  const scan = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        uniforms: { scan: { value: 0 }, level: { value: 0 }, focus: { value: 0 } },
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    []
  );
  useEffect(() => {
    let live = true;
    let geo: BufferGeometry | undefined;
    new GLTFLoader().load(
      '/models/refined-molar.glb',
      (gltf) => {
        const mesh = gltf.scene.children[0] as Mesh;
        geo = mesh.geometry;
        geo.center();
        geo.rotateX(-Math.PI / 2);
        geo.computeBoundingBox();
        const size = geo.boundingBox!.getSize(new Vector3());
        geo.scale(3.35 / size.y, 3.35 / size.y, 3.35 / size.y);
        geo.computeVertexNormals();
        if (live) {
          setGeometry(geo);
          invalidate();
          ready();
        } else geo.dispose();
      },
      undefined,
      () => {
        /* The poster stays visible if the model cannot load. */
      }
    );
    return () => {
      live = false;
      geo?.dispose();
      enamel.dispose();
      scan.dispose();
      wire.dispose();
    };
  }, [invalidate, ready, enamel, scan, wire]);
  useEffect(() => {
    if (!geometry) return;
    const stage = document.querySelector('.story-stage')!;
    const mobileStory = createMobileStory(stage);
    const measure = () => {
      const s = stage.getBoundingClientRect();
      metrics.stage = { top: s.top + scrollY, height: s.height };
    };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);

    const context = gsap.context(() => {
      createStorySnap(stage);
      gsap.to(state, { entry: 1, duration: 1.1, ease: 'power3.out', onUpdate: invalidate });
      gsap.to(state, {
        p: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: () => getStoryStops(stage)[0],
          end: () => getStoryStops(stage).at(-1)!,
          scrub: 0.65,
        },
        onUpdate: () => {
          mobileStory.update(state.p);
          if (!document.hidden) invalidate();
        },
      });
    });
    const redraw = () => {
      const rect = stage.getBoundingClientRect();
      const active = rect.top < innerHeight && rect.bottom > innerHeight * 0.15;
      if (!active) (gl.domElement.closest('.tooth-canvas') as HTMLElement).style.opacity = '0';
      if (!document.hidden && active) invalidate();
    };
    const turnTooth = () => {
      gsap.killTweensOf(state, 'turn');
      gsap.to(state, {
        turn: state.turn + Math.PI * 2,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: invalidate,
      });
    };
    addEventListener('mydentist:turn-tooth', turnTooth);
    addEventListener('scroll', redraw, { passive: true });
    addEventListener('resize', measure);
    addEventListener('resize', redraw);
    document.addEventListener('visibilitychange', redraw);
    ScrollTrigger.refresh();
    return () => {
      context.revert();
      mobileStory.destroy();
      removeEventListener('mydentist:turn-tooth', turnTooth);
      gsap.killTweensOf(state);
      removeEventListener('scroll', redraw);
      removeEventListener('resize', redraw);
      removeEventListener('resize', measure);
      ScrollTrigger.removeEventListener('refresh', measure);
      document.removeEventListener('visibilitychange', redraw);
    };
  }, [state, invalidate, metrics, geometry, gl]);
  useFrame(() => {
    if (!group.current || document.hidden) return;
    const stage = {
      top: metrics.stage.top - scrollY,
      bottom: metrics.stage.top + metrics.stage.height - scrollY,
    };
    const mobile = innerWidth < 900;
    const visible = stage.top < innerHeight && stage.bottom > innerHeight * 0.15;
    (gl.domElement.closest('.tooth-canvas') as HTMLElement).style.opacity = visible ? '1' : '0';
    const p = state.p;
    const turn = Math.cos(p * Math.PI);
    const intensity = Math.sin(Math.PI * Math.min(1, p / 3));
    const exit = Math.min(0, stage.bottom - innerHeight);
    const targetX = mobile ? 0.5 : 0.5 - turn * 0.23;
    const targetY =
      Math.max(mobile ? 0.72 : 0.5, stage.top / innerHeight + (mobile ? 0.72 : 0.5)) +
      exit / innerHeight;
    camera.position.set(
      Math.sin(p * 1.8) * 0.18,
      p > 1.5 ? -0.12 : 0,
      7.3 - Math.sin((p / 3) * Math.PI) * 0.65
    );
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const world = viewport.getCurrentViewport(camera, new Vector3());
    group.current.position.set(
      (targetX - 0.5) * world.width,
      (0.5 - targetY) * world.height + (1 - state.entry) * 0.3,
      0
    );
    const scale = mobile ? 0.43 : 0.79 * Math.min(1, innerWidth / innerHeight / 1.6);
    group.current.scale.setScalar(scale * (0.92 + 0.08 * state.entry));
    group.current.rotation.set(
      0.3 + Math.sin(p) * 0.1,
      -1.0 - p * 0.3 + (1 - state.entry) * 0.5 + state.turn,
      turn * -0.08
    );
    wire.opacity = intensity * 0.035;
    if (ring.current) {
      const focus = Math.max(0, 1 - Math.abs(p - 2) * 1.8);
      (ring.current.material as MeshBasicMaterial).opacity = focus * 0.4;
    }
    enamel.color.set(intensity > 0.1 ? '#dce9e5' : '#f3edda');
    enamel.roughness = 0.29 + intensity * 0.12;
    scan.uniforms.scan.value = intensity;
    scan.uniforms.level.value = 1.7 - (p / 3) * 3.4;
    scan.uniforms.focus.value = p > 1.5 && p < 2.5 ? 1 : 0;
    gl.domElement.dataset.phase = p.toFixed(3);
    gl.domElement.dataset.rotation = group.current.rotation.y.toFixed(3);
    gl.domElement.dataset.scan = intensity.toFixed(3);
    gl.domElement.dataset.triangles = String((geometry?.index?.count || 0) / 3);
    group.current.updateWorldMatrix(true, true);
    bounds.setFromObject(group.current);
    const corners = [];
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y])
        for (const z of [bounds.min.z, bounds.max.z])
          corners.push(new Vector3(x, y, z).project(camera));
    gl.domElement.dataset.bounds = JSON.stringify({
      top: ((1 - Math.max(...corners.map((v) => v.y))) * innerHeight) / 2,
      bottom: ((1 - Math.min(...corners.map((v) => v.y))) * innerHeight) / 2,
      left: ((Math.min(...corners.map((v) => v.x)) + 1) * innerWidth) / 2,
      right: ((Math.max(...corners.map((v) => v.x)) + 1) * innerWidth) / 2,
    });
  });
  return geometry ? (
    <group ref={group}>
      <mesh geometry={geometry} material={enamel} />
      <mesh geometry={geometry} material={scan} scale={1.002} />
      <mesh geometry={geometry} scale={1.003} material={wire} />
      <mesh ref={ring} position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.009, 6, 80]} />
        <meshBasicMaterial color="#5479c9" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  ) : null;
}
export default function ToothScene() {
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ready = useMemo(
    () => () => {
      setLoaded(true);
      document.documentElement.classList.add('tooth-ready');
    },
    []
  );
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setEnabled(!q.matches);
      if (q.matches) document.documentElement.classList.remove('tooth-ready');
    };
    update();
    q.addEventListener('change', update);
    return () => {
      q.removeEventListener('change', update);
      document.documentElement.classList.remove('tooth-ready');
    };
  }, []);
  if (!enabled) return null;
  return (
    <Boundary>
      <div className={`tooth-canvas ${loaded ? 'loaded' : ''}`} aria-hidden="true">
        <Canvas
          frameloop="demand"
          dpr={[1, innerWidth < 900 ? 1.25 : 1.5]}
          camera={{ position: [0, 0, 7.3], fov: 38 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              'webglcontextlost',
              () => {
                document.documentElement.classList.remove('tooth-ready');
                setEnabled(false);
              },
              { once: true }
            );
          }}
        >
          <ambientLight intensity={0.25} />
          <hemisphereLight args={['#e9f4ff', '#536264', 0.55]} />
          <directionalLight position={[-3, 5, 5]} intensity={2.1} />
          <directionalLight position={[4, 1, -2]} intensity={1.4} color="#cde9ff" />
          <Molar ready={ready} />
        </Canvas>
      </div>
    </Boundary>
  );
}
