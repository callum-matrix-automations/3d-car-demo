import { Suspense, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'

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

function PuxxModel() {
  const gltf = useGLTF('/models/puxx.glb')
  const groupRef = useRef()

  const { clonedScene, scale, offset } = useMemo(() => {
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.position.set(0, 0, 0)
    gltf.scene.updateMatrixWorld(true)

    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone()
      }
    })

    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = 4 / maxDim

    return {
      clonedScene: clone,
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    }
  }, [gltf])

  return (
    <group ref={groupRef} position={[offset.x, offset.y, offset.z]}>
      <primitive object={clonedScene} scale={[scale, scale, scale]} />
    </group>
  )
}

export default function PuxxViewer() {
  return (
    <div className="relative w-screen h-dvh bg-[#0a0a10] overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="text-white/30 text-xs tracking-[0.2em] uppercase hover:text-white/60 transition-colors duration-300"
        >
          ← Back
        </Link>
      </div>

      <div className="absolute top-14 left-4 md:top-20 md:left-8 z-10">
        <h1 className="text-white text-2xl md:text-5xl font-bold tracking-tight">Puxx</h1>
        <p className="text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 tracking-wide">3D Model Viewer</p>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [5, 3, 5], fov: 40 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <ambientLight intensity={0.2} color="#e8e8f0" />
          <hemisphereLight color="#ffffff" groundColor="#1a1a2e" intensity={0.3} />
          <spotLight position={[8, 10, 8]} angle={0.3} penumbra={1} intensity={1} color="#fff8f0" castShadow />
          <spotLight position={[-6, 8, -4]} angle={0.4} penumbra={1} intensity={0.6} color="#f0f4ff" />
          <Environment preset="studio" background={false} environmentIntensity={0.25} />

          <Suspense fallback={<Loader />}>
            <PuxxModel />
          </Suspense>

          <OrbitControls
            enablePan
            minDistance={2}
            maxDistance={20}
            enableDamping
            dampingFactor={0.05}
            target={[0, 1, 0]}
          />
        </Canvas>
      </div>
    </div>
  )
}
