import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function ScaledModel({ path, targetSize = 1.5, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const gltf = useGLTF(path)

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
    const s = targetSize / maxDim

    return {
      clonedScene: clone,
      scale: s,
      offset: new THREE.Vector3(
        -center.x * s,
        -box.min.y * s,
        -center.z * s
      ),
    }
  }, [gltf, targetSize])

  return (
    <group position={position} rotation={rotation}>
      <group position={[offset.x, offset.y, offset.z]}>
        <primitive object={clonedScene} scale={[scale, scale, scale]} />
      </group>
    </group>
  )
}

function GalleryEnvironment() {
  const { scene } = useGLTF('/models/art-gallery.glb')
  const painting1 = useTexture('/models/painting-1.jpg')
  const painting2 = useTexture('/models/painting-2.jpg')
  const { camera } = useThree()
  const wallMeshesRef = useRef([])

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)

    painting1.flipY = false
    painting1.colorSpace = THREE.SRGBColorSpace
    painting2.flipY = true
    painting2.colorSpace = THREE.SRGBColorSpace

    let paintingIndex = 0
    const fadeableMeshes = []

    clone.traverse((child) => {
      if (child.name === 'Bench') {
        child.visible = false
        return
      }

      if (child.isMesh && child.material?.name === 'Painting') {
        const tex = paintingIndex % 2 === 0 ? painting1 : painting2
        child.material = child.material.clone()
        child.material.map = tex
        child.material.color.set('#ffffff')
        child.material.needsUpdate = true
        paintingIndex++
      }

      if (child.isMesh && child.material?.name === 'Emissive') {
        child.material = child.material.clone()
        child.material.emissive = new THREE.Color('#c49a6c')
        child.material.emissiveIntensity = 1.5
        child.material.color.set('#2a2018')
        child.material.needsUpdate = true
      }

      if (child.isMesh && child.material?.name === 'Walls') {
        child.material = child.material.clone()
        child.material.color.set('#8a8580')
        child.material.transparent = true
        child.material.needsUpdate = true
        fadeableMeshes.push(child)
      }

      if (child.isMesh && child.material?.name === 'Floor') {
        child.material = child.material.clone()
        child.material.color.set('#605550')
        child.material.roughness = 0.95
        child.material.needsUpdate = true
      }

      if (child.isMesh && child.material?.name === 'Ceilling') {
        child.material = child.material.clone()
        child.material.color.set('#4a4540')
        child.material.needsUpdate = true
      }

      if (child.isMesh && child.material
        && !['Painting', 'Emissive', 'Walls', 'Floor', 'Ceilling'].includes(child.material.name)) {
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone()
      }
    })

    wallMeshesRef.current = fadeableMeshes
    return clone
  }, [scene, painting1, painting2])

  useFrame(() => {
    const camDist = camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
    const fadeStart = 12
    const fadeEnd = 18

    wallMeshesRef.current.forEach((mesh) => {
      let opacity
      if (camDist < fadeStart) {
        opacity = 1
      } else if (camDist > fadeEnd) {
        opacity = 0
      } else {
        opacity = 1 - (camDist - fadeStart) / (fadeEnd - fadeStart)
      }

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        m.opacity = opacity
      })
    })
  })

  return <primitive object={clonedScene} scale={[2, 2, 2]} position={[0, 0, 0]} />
}

function GalleryLights() {
  return (
    <>
      {/* Near-zero ambient — force all light from spots for dramatic falloff */}
      <ambientLight intensity={0.04} color="#1a1520" />
      <hemisphereLight color="#2a2530" groundColor="#000000" intensity={0.08} />

      {/* Ceiling strip accents — warm amber, low intensity, just for atmosphere */}
      <rectAreaLight
        position={[0, 8, 0]}
        width={10}
        height={0.8}
        intensity={0.8}
        color="#c49a6c"
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* ===== LEFT BAG (Classic) — warm golden lighting ===== */}

      {/* Key spot — tight cone directly above, creates visible pool of light */}
      <spotLight
        position={[-2, 5, 0]}
        angle={0.25}
        penumbra={0.6}
        intensity={12}
        color="#fff0d4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        distance={8}
        decay={2}
      />
      {/* Fill spot — slightly forward and angled, softer */}
      <spotLight
        position={[-2.5, 3.5, 2]}
        angle={0.35}
        penumbra={1}
        intensity={3}
        color="#ffe8cc"
        distance={6}
        decay={2}
      />
      {/* Rim light — behind the bag, cool blue-white edge glow */}
      <spotLight
        position={[-2, 2.5, -1.5]}
        angle={0.4}
        penumbra={1}
        intensity={4}
        color="#b0c4de"
        distance={5}
        decay={2}
      />
      {/* Halo glow — warm point light just above altar surface */}
      <pointLight position={[-2, 1.3, 0]} intensity={1.5} color="#daa06d" distance={2} decay={2} />

      {/* ===== RIGHT BAG (Noir) — cool silver/blue lighting ===== */}

      {/* Key spot — tight cone directly above */}
      <spotLight
        position={[2, 5, 0]}
        angle={0.25}
        penumbra={0.6}
        intensity={12}
        color="#e8eeff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        distance={8}
        decay={2}
      />
      {/* Fill spot — slightly forward */}
      <spotLight
        position={[2.5, 3.5, 2]}
        angle={0.35}
        penumbra={1}
        intensity={3}
        color="#d4deff"
        distance={6}
        decay={2}
      />
      {/* Rim light — behind, warm gold for contrast */}
      <spotLight
        position={[2, 2.5, -1.5]}
        angle={0.4}
        penumbra={1}
        intensity={4}
        color="#daa06d"
        distance={5}
        decay={2}
      />
      {/* Halo glow — cool point light at altar surface */}
      <pointLight position={[2, 1.3, 0]} intensity={1.5} color="#8090b0" distance={2} decay={2} />

      {/* Painting wash — very dim, just enough to see them */}
      <spotLight position={[-3, 3.5, -3]} angle={0.5} penumbra={1} intensity={0.6} color="#c4b8a8" distance={6} decay={2} />
      <spotLight position={[3, 3.5, -3]} angle={0.5} penumbra={1} intensity={0.6} color="#c4b8a8" distance={6} decay={2} />
    </>
  )
}

function SelectionSpotlight({ position, active }) {
  const keyRef = useRef()
  const fillRef = useRef()
  const backRef = useRef()

  useFrame(() => {
    const target = active ? 1 : 0
    const speed = 0.06

    if (keyRef.current) {
      keyRef.current.intensity += (target * 8 - keyRef.current.intensity) * speed
    }
    if (fillRef.current) {
      fillRef.current.intensity += (target * 3 - fillRef.current.intensity) * speed
    }
    if (backRef.current) {
      backRef.current.intensity += (target * 1.5 - backRef.current.intensity) * speed
    }
  })

  const x = position[0]

  return (
    <group>
      {/* Main overhead key — high up, wide spread */}
      <spotLight
        ref={keyRef}
        position={[x, 6, 1]}
        angle={0.45}
        penumbra={0.9}
        intensity={0}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        distance={12}
        decay={1}
      />
      {/* Front fill — soft, from further away */}
      <spotLight
        ref={fillRef}
        position={[x, 2.5, 4]}
        angle={0.5}
        penumbra={1}
        intensity={0}
        color="#ffe8d0"
        distance={10}
        decay={1}
      />
      {/* Back rim — gentle, pulled far back */}
      <spotLight
        ref={backRef}
        position={[x, 3.5, -3.5]}
        angle={0.5}
        penumbra={1}
        intensity={0}
        color="#d0e0ff"
        distance={10}
        decay={1.5}
      />
    </group>
  )
}

function DisplayHandbag({ path, targetSize, basePosition, isSelected }) {
  const gltf = useGLTF(path)
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
    const s = targetSize / maxDim

    return {
      clonedScene: clone,
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    }
  }, [gltf, targetSize])

  useFrame(() => {
    if (!groupRef.current) return

    if (isSelected) {
      const targetY = basePosition[1] + 0.3
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05

    } else {
      groupRef.current.position.y += (basePosition[1] - groupRef.current.position.y) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={basePosition}>
      <group position={[offset.x, offset.y, offset.z]}>
        <primitive object={clonedScene} scale={[scale, scale, scale]} />
      </group>
    </group>
  )
}

function ClearBackground() {
  const { scene } = useThree()
  useMemo(() => {
    scene.background = new THREE.Color('#0a0a10')
  }, [scene])
  return null
}

export default function FashionScene({ activeHandbag }) {
  return (
    <>
      <ClearBackground />
      <GalleryLights />
      <Environment preset="apartment" background={false} environmentIntensity={0.08} />

      <GalleryEnvironment />

      <SelectionSpotlight position={[-4, 0, 0]} active={activeHandbag === 'classic'} />
      <SelectionSpotlight position={[4, 0, 0]} active={activeHandbag === 'noir'} />

      <ScaledModel path="/models/marble-altar.glb" targetSize={2.25} position={[-2, 0, 0]} />
      <DisplayHandbag
        path="/models/handbag-light.glb"
        targetSize={0.6}
        basePosition={[-2, 1.1, 0]}
        isSelected={activeHandbag === 'classic'}
      />

      <ScaledModel path="/models/marble-altar.glb" targetSize={2.25} position={[2, 0, 0]} />
      <DisplayHandbag
        path="/models/handbag-dark.glb"
        targetSize={0.6}
        basePosition={[2, 1.1, 0]}
        isSelected={activeHandbag === 'noir'}
      />
    </>
  )
}
