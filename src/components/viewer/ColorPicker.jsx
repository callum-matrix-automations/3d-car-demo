import { useState, useRef, useCallback, useEffect } from 'react'
import { useCarStore } from '../../hooks/useCarStore'
import { COLOR_OPTIONS } from '../../constants/carData'

function hsvToHex(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r, g, b
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToHsv(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6)
    else if (max === g) h = 60 * ((b - r) / d + 2)
    else h = 60 * ((r - g) / d + 4)
  }
  if (h < 0) h += 360
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

function useDrag(onDrag) {
  const dragging = useRef(false)

  const onPointerDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    onDrag(e)
    const onMove = (ev) => { if (dragging.current) onDrag(ev) }
    const onUp = () => { dragging.current = false; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [onDrag])

  return onPointerDown
}

function SaturationBrightnessPanel({ hue, sat, val, onChange }) {
  const panelRef = useRef()

  const handleDrag = useCallback((e) => {
    const rect = panelRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    onChange(x, 1 - y)
  }, [onChange])

  const onPointerDown = useDrag(handleDrag)

  const pureColor = hsvToHex(hue, 1, 1)

  return (
    <div
      ref={panelRef}
      onPointerDown={onPointerDown}
      className="relative w-full h-36 rounded-lg cursor-crosshair overflow-hidden"
      style={{ background: pureColor }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000000, transparent)' }} />
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg shadow-black/50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${sat * 100}%`, top: `${(1 - val) * 100}%` }}
      />
    </div>
  )
}

function HueSlider({ hue, onChange }) {
  const sliderRef = useRef()

  const handleDrag = useCallback((e) => {
    const rect = sliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onChange(x * 360)
  }, [onChange])

  const onPointerDown = useDrag(handleDrag)

  return (
    <div
      ref={sliderRef}
      onPointerDown={onPointerDown}
      className="relative w-full h-3 rounded-full cursor-pointer"
      style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
    >
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg shadow-black/50 -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2"
        style={{ left: `${(hue / 360) * 100}%` }}
      />
    </div>
  )
}

export default function ColorPicker() {
  const { state, dispatch } = useCarStore()
  const [open, setOpen] = useState(false)
  const [hsv, setHsv] = useState(() => hexToHsv(state.activeColor))

  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v)

  useEffect(() => {
    dispatch({ type: 'SET_COLOR', payload: currentHex })
  }, [currentHex, dispatch])

  const handlePreset = (hex) => {
    const newHsv = hexToHsv(hex)
    setHsv(newHsv)
  }

  return (
    <div className="absolute left-6 bottom-36 z-10">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:border-white/50"
        style={{ backgroundColor: currentHex }}
        title="Open color picker"
      />

      {/* Picker panel */}
      {open && (
        <div className="absolute left-14 bottom-0 w-56 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest text-gray-400 uppercase">Paint Color</span>
            <span className="text-[10px] font-mono text-gray-500">{currentHex.toUpperCase()}</span>
          </div>

          <SaturationBrightnessPanel
            hue={hsv.h}
            sat={hsv.s}
            val={hsv.v}
            onChange={(s, v) => setHsv((prev) => ({ ...prev, s, v }))}
          />

          <HueSlider
            hue={hsv.h}
            onChange={(h) => setHsv((prev) => ({ ...prev, h }))}
          />

          {/* Preset swatches */}
          <div className="flex gap-2 pt-1">
            {COLOR_OPTIONS.map(({ name, hex }) => (
              <button
                key={hex}
                onClick={() => handlePreset(hex)}
                title={name}
                className={`w-6 h-6 rounded-full border transition-all duration-150 cursor-pointer ${
                  currentHex === hex
                    ? 'border-white scale-110'
                    : 'border-white/20 hover:border-white/40'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
