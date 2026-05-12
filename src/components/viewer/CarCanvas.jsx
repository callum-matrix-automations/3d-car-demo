import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html, MeshReflectorMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import CarModel from './CarModel'
import FashionScene from './FashionScene'
import { HANDBAGS, CAR_MODELS } from '../../constants/carData'
import { PathRecorderLogic } from './PathRecorder'

const DEBUG_PATH_RECORDER = false

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400 to-emerald-300 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-teal-400/80 text-xs font-light tracking-[0.3em] uppercase">
          Loading {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  )
}

function ShowroomFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <MeshReflectorMaterial
        blur={[400, 200]}
        resolution={1024}
        mixBlur={1}
        mixStrength={15}
        roughness={0.7}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.2}
        color="#1a1a1f"
        metalness={0.3}
        mirror={0.4}
      />
    </mesh>
  )
}

function ShowroomWalls() {
  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0d0d12',
    roughness: 0.9,
    metalness: 0,
  }), [])

  return (
    <group>
      <mesh position={[0, 10, -20]} material={wallMaterial}>
        <planeGeometry args={[80, 20]} />
      </mesh>
      <mesh position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]} material={wallMaterial}>
        <planeGeometry args={[80, 80]} />
      </mesh>
    </group>
  )
}

function ShowroomLights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#e8e8f0" />
      <hemisphereLight color="#ffffff" groundColor="#1a1a2e" intensity={0.8} />

      <spotLight
        position={[8, 14, 8]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#fff8f0"
      />
      <spotLight position={[-8, 12, 6]} angle={0.35} penumbra={1} intensity={2} color="#f0f4ff" />
      <spotLight position={[0, 10, -10]} angle={0.4} penumbra={1} intensity={2.5} color="#d0fff0" />

      <rectAreaLight position={[0, 10, 2]} width={16} height={1.5} intensity={5} color="#ffffff" rotation={[-Math.PI / 2, 0, 0]} />
      <rectAreaLight position={[0, 10, -2]} width={12} height={1} intensity={3} color="#f8f8ff" rotation={[-Math.PI / 2, 0, 0]} />
      <rectAreaLight position={[-6, 10, 0]} width={1} height={10} intensity={2} color="#f0f0ff" rotation={[-Math.PI / 2, 0, 0]} />
      <rectAreaLight position={[6, 10, 0]} width={1} height={10} intensity={2} color="#f0f0ff" rotation={[-Math.PI / 2, 0, 0]} />

      <pointLight position={[3, 0.1, 4]} intensity={0.5} color="#00b894" distance={6} decay={2} />
      <pointLight position={[-3, 0.1, 4]} intensity={0.5} color="#00b894" distance={6} decay={2} />
    </>
  )
}

function ShowroomBackground() {
  const { scene } = useThree()

  useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 2048
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 2048)
    gradient.addColorStop(0, '#2a2a35')
    gradient.addColorStop(0.3, '#1a1a24')
    gradient.addColorStop(0.5, '#12121a')
    gradient.addColorStop(0.8, '#0a0a10')
    gradient.addColorStop(1, '#060608')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2048, 2048)

    const ceilingGlow = ctx.createRadialGradient(1024, 200, 0, 1024, 200, 900)
    ceilingGlow.addColorStop(0, 'rgba(200, 210, 230, 0.12)')
    ceilingGlow.addColorStop(0.5, 'rgba(150, 160, 180, 0.04)')
    ceilingGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = ceilingGlow
    ctx.fillRect(0, 0, 2048, 2048)

    const accentGlow = ctx.createRadialGradient(1024, 1400, 0, 1024, 1400, 600)
    accentGlow.addColorStop(0, 'rgba(0, 184, 148, 0.04)')
    accentGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = accentGlow
    ctx.fillRect(0, 0, 2048, 2048)

    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
  }, [scene])

  return null
}

const CAR_SPACING = 25

function AutoStudioScene() {
  return (
    <>
      <ShowroomBackground />
      <ShowroomLights />
      <ShowroomWalls />
      <ShowroomFloor />
      <Environment preset="studio" background={false} environmentIntensity={0.5} />

      {CAR_MODELS.map((car, i) => (
        <group key={car.id} position={[i * CAR_SPACING, 0, 0]}>
          <Suspense fallback={<Loader />}>
            <CarModel modelPath={car.path} />
          </Suspense>
        </group>
      ))}
    </>
  )
}

function AutoCamera({ carSpec, carModel, controlsRef }) {
  const { camera } = useThree()
  const animating = useRef(false)
  const frameCount = useRef(0)

  useEffect(() => {
    const carIndex = CAR_MODELS.findIndex((m) => m.id === carModel)
    const xOffset = carIndex * CAR_SPACING
    const car = CAR_MODELS.find((m) => m.id === carModel)

    let pos, lookAt

    if (carSpec && car?.specs) {
      const spec = car.specs.find((s) => s.id === carSpec)
      if (spec?.cameraAngle) {
        pos = new THREE.Vector3(spec.cameraAngle.pos[0] + xOffset, spec.cameraAngle.pos[1], spec.cameraAngle.pos[2])
        lookAt = new THREE.Vector3(spec.cameraAngle.lookAt[0] + xOffset, spec.cameraAngle.lookAt[1], spec.cameraAngle.lookAt[2])
      }
    }

    if (!pos) {
      pos = new THREE.Vector3(10 + xOffset, 5, 15)
      lookAt = new THREE.Vector3(xOffset, 1.5, 0)
    }

    camera.position.copy(pos)
    if (controlsRef.current) {
      controlsRef.current.target.copy(lookAt)
      controlsRef.current.update()
    }
  }, [carSpec, carModel, camera, controlsRef])

  return null
}

// Cinematic walkthrough — smooth sweeping arc through the gallery
// Position: wide entrance from left, single graceful curve arriving center
const WALKTHROUGH_POSITIONS = [
  [-15, 2.5, 0],
  [-10, 2.5, 7],
  [-4, 2.5, 8],
  [0, 2.5, 5.5],
]

// Look-at: gaze drifts smoothly from corridor ahead → toward the altars
const WALKTHROUGH_LOOKAT = [
  [-10, 1.4, 5],
  [-4, 1.3, 6],
  [-1, 1.2, 3],
  [0, 1.2, 0],
]

function buildSpline(points) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'catmullrom',
    0.5
  )
}

const posSpline = buildSpline(WALKTHROUGH_POSITIONS)
const lookSpline = buildSpline(WALKTHROUGH_LOOKAT)

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

function FashionCamera({ activeHandbag, fashionPhase, detailView, controlsRef, onArrived }) {
  const { camera } = useThree()
  const progressRef = useRef(0)
  const arrivedRef = useRef(false)
  const settledRef = useRef(false)
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const modeRef = useRef('spline')

  useEffect(() => {
    if (fashionPhase === 'intro') {
      progressRef.current = 0
      arrivedRef.current = false
      modeRef.current = 'spline'
      const startPos = posSpline.getPoint(0)
      const startLook = lookSpline.getPoint(0)
      camera.position.copy(startPos)
      if (controlsRef.current) {
        controlsRef.current.target.copy(startLook)
        controlsRef.current.update()
      }
    } else if (fashionPhase === 'walkthrough') {
      progressRef.current = 0
      arrivedRef.current = false
      modeRef.current = 'spline'
    } else if (fashionPhase === 'select') {
      modeRef.current = 'lerp'
      settledRef.current = false
      const endPos = posSpline.getPoint(1)
      const endLook = lookSpline.getPoint(1)
      targetPos.current.copy(endPos)
      targetLookAt.current.copy(endLook)
    } else if (fashionPhase === 'product' && activeHandbag) {
      modeRef.current = 'lerp'
      settledRef.current = false
      const bag = HANDBAGS.find((b) => b.id === activeHandbag)
      if (bag) {
        targetPos.current.set(bag.cameraOffset[0], bag.cameraOffset[1], bag.cameraOffset[2])
        targetLookAt.current.set(bag.position[0], 1.4, bag.position[2])
      }
    }
  }, [fashionPhase, activeHandbag, camera, controlsRef])

  useEffect(() => {
    if (fashionPhase !== 'product' || !activeHandbag) return

    const bag = HANDBAGS.find((b) => b.id === activeHandbag)
    if (!bag) return
    const bx = bag.position[0]

    modeRef.current = 'lerp'
    settledRef.current = false

    if (!detailView) {
      targetPos.current.set(bag.cameraOffset[0], bag.cameraOffset[1], bag.cameraOffset[2])
      targetLookAt.current.set(bx, 1.4, 0)
    } else if (detailView === 'material') {
      targetPos.current.set(bx + 1.5, 1.8, 2.5)
      targetLookAt.current.set(bx, 1.5, 0)
    } else if (detailView === 'craftsmanship') {
      targetPos.current.set(bx - 1, 2.5, 1.5)
      targetLookAt.current.set(bx, 1.3, 0)
    } else if (detailView === 'dimensions') {
      targetPos.current.set(bx, 3, 2)
      targetLookAt.current.set(bx, 1.2, 0)
    }
  }, [detailView, fashionPhase, activeHandbag])

  useFrame((_, delta) => {
    if (modeRef.current === 'spline' && fashionPhase === 'walkthrough') {
      progressRef.current += delta / 5
      progressRef.current = Math.min(progressRef.current, 1)

      const t = easeInOutSine(progressRef.current)
      const pos = posSpline.getPoint(t)
      const look = lookSpline.getPoint(t)

      camera.position.copy(pos)
      if (controlsRef.current) {
        controlsRef.current.target.copy(look)
        controlsRef.current.update()
      }

      if (progressRef.current >= 1 && !arrivedRef.current) {
        arrivedRef.current = true
        onArrived?.()
      }
    } else if (modeRef.current === 'lerp' && !settledRef.current) {
      camera.position.lerp(targetPos.current, 0.035)
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 0.035)
        controlsRef.current.update()
      }

      if (fashionPhase === 'product') {
        const dist = camera.position.distanceTo(targetPos.current)
        if (dist < 0.1) {
          settledRef.current = true
        }
      }
    }
  })

  return null
}

export default function CarCanvas({ activeScene, activeHandbag, fashionPhase, detailView, carSpec, carModel, onFashionArrived, pathRecorderRef }) {
  const controlsRef = useRef()
  const isFashionDebug = DEBUG_PATH_RECORDER && activeScene === 'fashion'

  return (
    <Canvas
      camera={{ position: [5, 2.5, 6], fov: 35 }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <fog attach="fog" args={['#0a0a10', 20, 60]} />

      {activeScene === 'auto-studio' ? (
        <>
          <AutoStudioScene />
          <AutoCamera carSpec={carSpec} carModel={carModel} controlsRef={controlsRef} />
        </>
      ) : (
        <>
          <Suspense fallback={<Loader />}>
            <FashionScene activeHandbag={activeHandbag} />
          </Suspense>
          {isFashionDebug ? (
            <PathRecorderLogic enabled={true} stateRef={pathRecorderRef} />
          ) : (
            <FashionCamera
              activeHandbag={activeHandbag}
              fashionPhase={fashionPhase}
              detailView={detailView}
              controlsRef={controlsRef}
              onArrived={onFashionArrived}
            />
          )}
        </>
      )}

      <OrbitControls
        key={`${activeScene}-${fashionPhase}`}
        ref={controlsRef}
        enabled={!isFashionDebug}
        enablePan={fashionPhase === 'product' || activeScene === 'auto-studio'}
        enableRotate={fashionPhase === 'product' || activeScene === 'auto-studio'}
        enableZoom={fashionPhase === 'product' || activeScene === 'auto-studio'}
        minDistance={1.5}
        maxDistance={30}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0.8, 0]}
      />

      {activeScene === 'fashion' && (
        <EffectComposer>
          <Bloom
            intensity={0.2}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
