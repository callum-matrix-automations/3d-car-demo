import { Suspense, useRef, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html, useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const STRENGTHS = ['3mg', '6mg', '9mg', '12mg', '16mg']

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-gray-400 text-xs">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

function PuxxModel() {
  const gltf = useGLTF('/models/puxx.glb')
  const groupRef = useRef()

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = 3 / maxDim

    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -center.y * s, -center.z * s),
    }
  }, [gltf])

  return (
    <group ref={groupRef} position={[offset.x, offset.y, offset.z]}>
      <primitive object={gltf.scene} scale={[scale, scale, scale]} />
    </group>
  )
}

function PuxxCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 35 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <directionalLight position={[-3, 5, -3]} intensity={0.4} />
      <Environment preset="studio" background={false} environmentIntensity={0.35} />

      <Suspense fallback={<Loader />}>
        <PuxxModel />
      </Suspense>

      <ContactShadows position={[0, -1.2, 0]} opacity={0.2} blur={2} far={3} />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3}
        maxDistance={8}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  )
}

export default function PuxxViewer() {
  const [selectedStrength, setSelectedStrength] = useState(null)
  const [quantity, setQuantity] = useState(5)

  return (
    <div className="min-h-dvh bg-[#e8e6e3]">
      {/* Warning banner */}
      <div className="bg-black text-white text-center py-2 text-xs tracking-wide">
        WARNING: This product contains nicotine. Nicotine is an addictive chemical
      </div>

      {/* Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>Home</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors">Shop</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors">My account</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>PUXX</span>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest leading-tight">Worlds<br/>Best<br/>Pouches</span>
          </div>
          <button className="relative text-gray-600 hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      {/* Promo banner */}
      <div className="bg-[#f5c518] text-black text-center py-2.5 text-sm font-medium">
        Minimum Order Quantity 5 | Free Delivery for Orders above CAD 150
      </div>

      {/* Product section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6">
          <span className="hover:text-gray-700 cursor-pointer">Home</span>
          <span className="mx-1">/</span>
          <span className="hover:text-gray-700 cursor-pointer">Shop</span>
          <span className="mx-1">/</span>
          <span className="hover:text-gray-700 cursor-pointer">Nicotine Pouches</span>
          <span className="mx-1">/</span>
          <span className="text-gray-700">PUXX Watermelon</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Left — 3D model */}
          <div>
            <div className="relative aspect-square bg-white rounded-sm overflow-hidden">
              <PuxxCanvas />
              <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-black transition-colors z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">Drag to rotate · Scroll to zoom</p>
          </div>

          {/* Right — Product info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
              PUXX Watermelon
            </h1>

            <p className="text-2xl text-gray-900 mt-3" style={{ fontFamily: "'Inter', sans-serif", fontFeatureSettings: '"tnum"' }}>
              CAD$15.00
            </p>

            {/* Strength selector */}
            <div className="mt-8">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Strength</p>
              <div className="flex flex-wrap gap-2">
                {STRENGTHS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStrength(s)}
                    className={`px-4 py-2 rounded border text-sm cursor-pointer transition-all ${
                      selectedStrength === s
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(5, quantity - 1))}
                  className="px-3 py-2.5 text-gray-400 hover:text-black transition-colors cursor-pointer text-lg"
                >
                  −
                </button>
                <span className="px-4 py-2.5 text-sm text-gray-900 min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-gray-400 hover:text-black transition-colors cursor-pointer text-lg"
                >
                  +
                </button>
              </div>
              <button className={`flex-1 py-3 rounded text-sm font-medium transition-all cursor-pointer ${
                selectedStrength
                  ? 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}>
                Add to cart
              </button>
            </div>

            {/* Meta */}
            <div className="mt-8 space-y-2 text-sm text-gray-600">
              <p><span className="text-gray-400 uppercase text-xs tracking-wider">Category:</span> <span className="uppercase text-xs tracking-wider">Nicotine Pouches</span></p>
              <p><span className="text-gray-400 uppercase text-xs tracking-wider">Brand:</span> <span className="uppercase text-xs tracking-wider">PUXX</span></p>
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-gray-300 pt-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                PUXX Watermelon nicotine pouches deliver a refreshing burst of juicy watermelon flavour with a smooth, satisfying nicotine experience. Tobacco-free and discreet, these pouches are designed for on-the-go enjoyment.
              </p>
            </div>

            {/* Features */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ['Flavour', 'Watermelon'],
                ['Type', 'Nicotine Pouch'],
                ['Tobacco', 'Free'],
                ['Pouches', '20 per can'],
              ].map(([label, value]) => (
                <div key={label} className="bg-white rounded px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-gray-300">
          <div className="flex gap-8 pt-4">
            <button className="text-sm font-medium text-gray-900 border-b-2 border-black pb-2 cursor-pointer">Additional information</button>
            <button className="text-sm text-gray-400 pb-2 cursor-pointer hover:text-gray-600 transition-colors">Reviews (0)</button>
          </div>

          <div className="py-6">
            <table className="w-full max-w-md text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-500 font-medium">Strength</td>
                  <td className="py-3 text-gray-700">3mg, 6mg, 9mg, 12mg, 16mg</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-500 font-medium">Weight</td>
                  <td className="py-3 text-gray-700">25g</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-500 font-medium">Format</td>
                  <td className="py-3 text-gray-700">Slim</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
