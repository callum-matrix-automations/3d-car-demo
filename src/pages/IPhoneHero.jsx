import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'

const COLORS = [
  {
    name: 'Cosmic Orange', hex: '#c75c20', bg: '#f5e6dc',
    materials: {
      Metal_Body: '#ff5a00',
      Metal_Camera_Frame: '#ff640c',
      Frosted_Glass: '#ff7e29',
      Frosted_Glass_Tint: '#ff6600',
      Plastic_Body_Antena: '#cd5600',
      Glass_Camera_Control: '#ff7613',
    },
  },
  {
    name: 'Silver', hex: '#c0c0c0', bg: '#f0f0f0',
    materials: {
      Metal_Body: '#d4d4d4',
      Metal_Camera_Frame: '#c8c8c8',
      Frosted_Glass: '#e8e8e8',
      Frosted_Glass_Tint: '#d0d0d0',
      Plastic_Body_Antena: '#b8b8b8',
      Glass_Camera_Control: '#cccccc',
    },
  },
  {
    name: 'Deep Blue', hex: '#1a2744', bg: '#e0e4ec',
    materials: {
      Metal_Body: '#1a2744',
      Metal_Camera_Frame: '#1e2d4f',
      Frosted_Glass: '#253555',
      Frosted_Glass_Tint: '#1c2a48',
      Plastic_Body_Antena: '#15203a',
      Glass_Camera_Control: '#223050',
    },
  },
]

const VIEWS = [
  { id: 'front', label: 'Front', azimuth: 0 },
  { id: 'back', label: 'Back', azimuth: Math.PI },
  { id: 'side', label: 'Side', azimuth: -Math.PI / 2 },
]

const STORAGE = ['256GB', '512GB', '1TB', '2TB']

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-gray-400 text-xs">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

function PhoneModel({ colorMaterials }) {
  const gltf = useGLTF('/models/iphone-17-pro-max.glb')
  const groupRef = useRef()

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = 2.3 / maxDim

    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -center.y * s, -center.z * s),
    }
  }, [gltf])

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((m) => {
          const targetHex = colorMaterials[m.name]
          if (targetHex) {
            m.color.set(targetHex)
            m.needsUpdate = true
          }
        })
      }
    })
  }, [colorMaterials, gltf.scene])

  return (
    <group ref={groupRef} position={[offset.x, offset.y, offset.z]}>
      <primitive object={gltf.scene} scale={[scale, scale, scale]} />
    </group>
  )
}

function ViewSnapper({ targetAzimuth, controlsRef }) {
  const snapping = useRef(false)
  const prevTarget = useRef(targetAzimuth)

  useEffect(() => {
    if (targetAzimuth !== prevTarget.current) {
      prevTarget.current = targetAzimuth
      snapping.current = true
    }
  }, [targetAzimuth])

  useFrame(() => {
    if (!controlsRef.current || !snapping.current) return
    const controls = controlsRef.current
    const current = controls.getAzimuthalAngle()

    let diff = targetAzimuth - current
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2

    if (Math.abs(diff) < 0.02) {
      snapping.current = false
      return
    }

    controls.setAzimuthalAngle(current + diff * 0.5)
    controls.update()
  })
  return null
}

function PhoneCanvas({ activeView, colorMaterials }) {
  const controlsRef = useRef()
  const target = VIEWS.find((v) => v.id === activeView) || VIEWS[0]

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 35 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      <Environment preset="studio" background={false} environmentIntensity={0.3} />

      <Suspense fallback={<Loader />}>
        <PhoneModel colorMaterials={colorMaterials} />
      </Suspense>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.3} blur={2} far={3} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={3}
        maxDistance={6}
        enableDamping
        dampingFactor={0.05}
      />

      <ViewSnapper targetAzimuth={target.azimuth} controlsRef={controlsRef} />
    </Canvas>
  )
}

export default function IPhoneHero() {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedStorage, setSelectedStorage] = useState(1)
  const [activeView, setActiveView] = useState('front')

  return (
    <div className="min-h-dvh bg-[#f5f5f7]">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-gray-400 text-sm hover:text-gray-600 transition-colors">← Back</Link>
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-medium">1</span> Device and plan</span>
            <span className="flex items-center gap-2 text-gray-300"><span className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">2</span> Add-ons and extras</span>
            <span className="flex items-center gap-2 text-gray-300"><span className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center font-medium">3</span> Review basket</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Left — 3D model */}
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <PhoneCanvas activeView={activeView} colorMaterials={COLORS[selectedColor].materials} />
            </div>

            {/* View selector thumbnails */}
            <div className="flex gap-3 mt-4 justify-center">
              {VIEWS.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                    activeView === view.id
                      ? 'border-black bg-white text-black'
                      : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Product info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Apple iPhone 17 Pro Max {STORAGE[selectedStorage]} {COLORS[selectedColor].name}
            </h1>

            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                48MP + 48MP + 48MP
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="3" /></svg>
                6.9" screen
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex">
                {[1, 2, 3, 4].map((i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                ))}
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="#e5e7eb" /></linearGradient></defs><path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
              </div>
              <span className="text-sm text-blue-600 font-medium">4.5 (63)</span>
              <span className="text-sm text-blue-600 cursor-pointer hover:underline">Write a review</span>
            </div>

            {/* Upgrade banner */}
            <div className="mt-6 bg-[#ffd6cc] rounded-xl px-5 py-4 text-center">
              <p className="font-semibold text-gray-900">Looking to upgrade?</p>
              <p className="text-sm text-blue-600 cursor-pointer hover:underline mt-1">Log in to get started</p>
            </div>

            {/* Color selector */}
            <div className="mt-6">
              <p className="font-semibold text-gray-900 mb-3">Colour</p>
              <div className="flex gap-4">
                {COLORS.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === i ? 'border-black scale-110' : 'border-gray-200 group-hover:border-gray-400'
                    }`} style={{ backgroundColor: color.hex }} />
                    <span className={`text-xs transition-colors ${selectedColor === i ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage selector */}
            <div className="mt-6">
              <p className="font-semibold text-gray-900 mb-3">Storage</p>
              <div className="flex gap-3">
                {STORAGE.map((size, i) => (
                  <button
                    key={size}
                    onClick={() => setSelectedStorage(i)}
                    className={`px-5 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                      selectedStorage === i
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h3.75m0 0V6.375a1.125 1.125 0 011.125-1.125h6.75a1.125 1.125 0 011.125 1.125v7.875m-7.875 0h7.875m0 0l2.25-3.375h3.375a1.125 1.125 0 011.125 1.125v2.25" /></svg>
                <div>
                  <p className="font-semibold text-gray-900">Delivery</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-0.5">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> In stock
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Order before 20:00 for delivery on <strong className="text-gray-900">Thursday 14th May</strong></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0A2.997 2.997 0 007.5 12" /></svg>
                <div>
                  <p className="font-semibold text-gray-900">Collect from store</p>
                  <p className="text-sm text-blue-600 cursor-pointer hover:underline mt-0.5">Check stock near you</p>
                </div>
              </div>
            </div>

            {/* Specs summary */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="font-semibold text-gray-900 mb-4">Key Specifications</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Chip', 'A19 Pro'],
                  ['Display', '6.9" OLED, 120Hz'],
                  ['Camera', '48MP Triple System'],
                  ['Battery', 'Up to 39hr video'],
                  ['Zoom', '8x optical quality'],
                  ['Charging', '50% in 20 min'],
                  ['Storage', STORAGE[selectedStorage]],
                  ['Connectivity', 'Wi-Fi 7, 5G'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white rounded-lg px-3 py-2.5 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-gray-900 font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex gap-3">
              <button className="flex-1 py-3.5 rounded-xl bg-black text-white text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors active:scale-[0.98]">
                Add to Basket
              </button>
              <button className="px-4 py-3.5 rounded-xl border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              </button>
            </div>

            {/* Trade-in */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="font-semibold text-gray-900">Get it for less when you trade in</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Use your trade-in value to reduce your monthly payment for your new device, put it towards any existing device agreements you might have, or get a one-off payment to your bank.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
