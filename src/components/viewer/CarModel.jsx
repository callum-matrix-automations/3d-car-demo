import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function CarModel({ modelPath }) {
  const gltf = useGLTF(modelPath)
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
    const targetSize = 12
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
  }, [gltf])

  return (
    <group ref={groupRef} position={[offset.x, offset.y, offset.z]} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={clonedScene} scale={[scale, scale, scale]} />
    </group>
  )
}
