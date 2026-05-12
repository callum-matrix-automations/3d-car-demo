import { useRef, useEffect, useCallback, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function PathRecorderLogic({ enabled, stateRef }) {
  const { camera } = useThree()
  const keysRef = useRef({})
  const frameCount = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e) => { keysRef.current[e.key.toLowerCase()] = true }
    const onKeyUp = (e) => { keysRef.current[e.key.toLowerCase()] = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [enabled])

  useFrame(() => {
    if (!enabled) return

    const keys = keysRef.current
    const speed = 0.08
    const rotSpeed = 0.03

    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    if (keys['w']) camera.position.addScaledVector(forward, speed)
    if (keys['s']) camera.position.addScaledVector(forward, -speed)
    if (keys['a']) camera.position.addScaledVector(right, -speed)
    if (keys['d']) camera.position.addScaledVector(right, speed)
    if (keys['q']) camera.position.y += speed * 0.5
    if (keys['e']) camera.position.y -= speed * 0.5

    if (keys['arrowleft']) camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotSpeed)
    if (keys['arrowright']) camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -rotSpeed)

    stateRef.current.pos = `${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)}`

    if (stateRef.current.recording) {
      frameCount.current++
      if (frameCount.current % 3 === 0) {
        const dir = new THREE.Vector3()
        camera.getWorldDirection(dir)
        const lookAt = camera.position.clone().add(dir.multiplyScalar(5))

        stateRef.current.waypoints.push({
          pos: [
            parseFloat(camera.position.x.toFixed(2)),
            parseFloat(camera.position.y.toFixed(2)),
            parseFloat(camera.position.z.toFixed(2)),
          ],
          lookAt: [
            parseFloat(lookAt.x.toFixed(2)),
            parseFloat(lookAt.y.toFixed(2)),
            parseFloat(lookAt.z.toFixed(2)),
          ],
        })
        stateRef.current.count = stateRef.current.waypoints.length
      }
    }
  })

  return null
}

export function PathRecorderUI({ stateRef }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((v) => v + 1), 100)
    return () => clearInterval(interval)
  }, [])

  const toggleRecording = useCallback(() => {
    if (stateRef.current.recording) {
      stateRef.current.recording = false

      const waypoints = stateRef.current.waypoints
      console.log('=== RECORDED PATH ===')
      console.log(`Total waypoints: ${waypoints.length}`)
      console.log(JSON.stringify(waypoints, null, 2))
      console.log('=== END PATH ===')

      const simplified = []
      for (let i = 0; i < waypoints.length; i += 10) {
        simplified.push(waypoints[i])
      }
      if (simplified[simplified.length - 1] !== waypoints[waypoints.length - 1]) {
        simplified.push(waypoints[waypoints.length - 1])
      }
      console.log('=== SIMPLIFIED PATH (every 10th point) ===')
      console.log(JSON.stringify(simplified, null, 2))
      console.log('=== END SIMPLIFIED ===')
    } else {
      stateRef.current.waypoints = []
      stateRef.current.count = 0
      stateRef.current.recording = true
    }
  }, [stateRef])

  const isRecording = stateRef.current.recording
  const count = stateRef.current.count
  const pos = stateRef.current.pos

  return (
    <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8, margin: '0 0 8px 0' }}>
          WASD = move · QE = up/down · Arrows = look
        </p>
        <button
          onClick={toggleRecording}
          style={{
            padding: '8px 24px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            color: 'white',
            background: isRecording ? 'rgba(239,68,68,0.8)' : 'rgba(20,184,166,0.8)',
          }}
        >
          {isRecording ? `■ Stop Recording (${count})` : '● Start Recording'}
        </button>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '4px 12px', color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}>
        pos: [{pos}]
      </div>
    </div>
  )
}
