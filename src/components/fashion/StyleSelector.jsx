import { useCarStore } from '../../hooks/useCarStore'
import { HANDBAGS } from '../../constants/carData'

export default function StyleSelector() {
  const { state, dispatch } = useCarStore()

  if (state.activeScene !== 'fashion' || state.fashionPhase !== 'select') return null

  return (
    <div className="absolute inset-0 z-30 flex items-end md:items-center justify-center pb-12 md:pb-0 pointer-events-none px-4">
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 w-full md:w-auto pointer-events-auto animate-[fadeUp_0.8s_ease-out_both]">
        {HANDBAGS.map((bag, i) => (
          <button
            key={bag.id}
            onClick={() => dispatch({ type: 'SET_HANDBAG', payload: bag.id })}
            className="group relative cursor-pointer"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:border-white/40 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.06)]">
              <span className="block text-white/90 text-xs md:text-sm font-light tracking-[0.2em] md:tracking-[0.25em] uppercase">
                {bag.tagline}
              </span>
              <span className="block text-white text-base md:text-xl font-extralight tracking-wider mt-0.5 md:mt-1">
                {bag.name}
              </span>
              <span className="block text-white/40 text-[10px] md:text-xs tracking-widest mt-1 md:mt-2">
                {bag.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
