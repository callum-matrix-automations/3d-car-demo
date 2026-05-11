import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function CarModel() {
  const gltf = useGLTF('/models/car.glb')
  const groupRef = useRef()

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 4
    const s = targetSize / maxDim

    return {
      scale: s,
      offset: new THREE.Vector3(
        -center.x * s,
        -box.min.y * s,
        -center.z * s
      ),
    }
  }, [gltf])

  return (
    <group ref={groupRef} position={[offset.x, offset.y, offset.z]}>
      <primitive object={gltf.scene} scale={[scale, scale, scale]} />
    </group>
  )
}

useGLTF.preload('/models/car.glb')
