import { useState, useEffect } from 'react'
import { useCarStore } from '../../hooks/useCarStore'

export default function BrandReveal() {
  const { state, dispatch } = useCarStore()
  const [phase, setPhase] = useState(0)

  const isActive = state.activeScene === 'fashion' && state.fashionPhase === 'intro'

  useEffect(() => {
    if (!isActive) {
      setPhase(0)
      return
    }

    const timers = []

    timers.push(setTimeout(() => setPhase(1), 200))
    timers.push(setTimeout(() => setPhase(2), 1000))
    timers.push(setTimeout(() => setPhase(3), 2200))
    timers.push(setTimeout(() => {
      dispatch({ type: 'SET_FASHION_PHASE', payload: 'walkthrough' })
    }, 2800))

    return () => timers.forEach(clearTimeout)
  }, [isActive, dispatch])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none px-4">
      <div className={`flex flex-col items-center transition-opacity duration-1000 ${
        phase >= 3 ? 'opacity-0' : phase >= 1 ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className={`w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mb-5 md:mb-8 transition-all duration-1000 ${
          phase >= 1 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} />

        <h1 className={`text-white text-3xl md:text-6xl font-extralight tracking-[0.3em] md:tracking-[0.5em] uppercase transition-all duration-1500 ${
          phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Maison
        </h1>

        <div className={`w-6 md:w-8 h-px bg-white/20 my-3 md:my-5 transition-all duration-1000 delay-300 ${
          phase >= 1 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} />

        <p className={`text-white/50 text-xs md:text-sm font-light tracking-[0.3em] md:tracking-[0.4em] uppercase transition-all duration-1000 ${
          phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          L'Art du Cuir
        </p>

        <p className={`text-white/20 text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] mt-4 md:mt-6 transition-all duration-1000 delay-200 ${
          phase >= 2 ? 'opacity-100' : 'opacity-0'
        }`}>
          Established MMXII
        </p>

        <div className={`w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mt-5 md:mt-8 transition-all duration-1000 delay-300 ${
          phase >= 2 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} />
      </div>
    </div>
  )
}
