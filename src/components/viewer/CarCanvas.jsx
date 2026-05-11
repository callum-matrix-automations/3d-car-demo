import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import CarModel from './CarModel'

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
      {/* Back wall */}
      <mesh position={[0, 10, -20]} material={wallMaterial}>
        <planeGeometry args={[80, 20]} />
      </mesh>
      {/* Curved ceiling glow — simulated with a large dim plane */}
      <mesh position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]} material={wallMaterial}>
        <planeGeometry args={[80, 80]} />
      </mesh>
    </group>
  )
}

function ShowroomLights() {
  return (
    <>
      {/* Showroom ambient — bright enough to see everything */}
      <ambientLight intensity={0.6} color="#e8e8f0" />

      {/* Hemisphere light — simulates light bouncing between ceiling and floor */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#1a1a2e"
        intensity={0.8}
      />

      {/* Key spotlight — main dramatic light from front-right, warm white */}
      <spotLight
        position={[8, 14, 8]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#fff8f0"
        target-position={[0, 0, 0]}
      />

      {/* Fill spotlight — from front-left, cooler white */}
      <spotLight
        position={[-8, 12, 6]}
        angle={0.35}
        penumbra={1}
        intensity={2}
        color="#f0f4ff"
      />

      {/* Rim/back light — creates edge definition, slight teal tint */}
      <spotLight
        position={[0, 10, -10]}
        angle={0.4}
        penumbra={1}
        intensity={2.5}
        color="#d0fff0"
      />

      {/* Overhead showroom strip lights — simulating long ceiling fixtures */}
      <rectAreaLight
        position={[0, 10, 2]}
        width={16}
        height={1.5}
        intensity={5}
        color="#ffffff"
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <rectAreaLight
        position={[0, 10, -2]}
        width={12}
        height={1}
        intensity={3}
        color="#f8f8ff"
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <rectAreaLight
        position={[-6, 10, 0]}
        width={1}
        height={10}
        intensity={2}
        color="#f0f0ff"
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <rectAreaLight
        position={[6, 10, 0]}
        width={1}
        height={10}
        intensity={2}
        color="#f0f0ff"
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Floor accent lights — subtle teal strips */}
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

    // Gradient from medium grey at top to dark at bottom — like a lit showroom interior
    const gradient = ctx.createLinearGradient(0, 0, 0, 2048)
    gradient.addColorStop(0, '#2a2a35')
    gradient.addColorStop(0.3, '#1a1a24')
    gradient.addColorStop(0.5, '#12121a')
    gradient.addColorStop(0.8, '#0a0a10')
    gradient.addColorStop(1, '#060608')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2048, 2048)

    // Overhead glow — simulates ceiling light wash
    const ceilingGlow = ctx.createRadialGradient(1024, 200, 0, 1024, 200, 900)
    ceilingGlow.addColorStop(0, 'rgba(200, 210, 230, 0.12)')
    ceilingGlow.addColorStop(0.5, 'rgba(150, 160, 180, 0.04)')
    ceilingGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = ceilingGlow
    ctx.fillRect(0, 0, 2048, 2048)

    // Subtle teal accent glow
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

export default function CarCanvas() {
  const controlsRef = useRef()

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
      <fog attach="fog" args={['#0a0a10', 20, 50]} />

      <ShowroomBackground />
      <ShowroomLights />
      <ShowroomWalls />

      <Environment preset="studio" background={false} environmentIntensity={0.5} />

      <Suspense fallback={<Loader />}>
        <CarModel />
      </Suspense>

      <ShowroomFloor />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={3.5}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0.8, 0]}
      />

    </Canvas>
  )
}
