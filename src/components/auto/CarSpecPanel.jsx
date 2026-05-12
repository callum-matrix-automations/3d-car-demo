import { useCarStore } from '../../hooks/useCarStore'
import { CAR_MODELS } from '../../constants/carData'

function SpecButton({ spec, isActive, dispatch }) {
  return (
    <div className={`w-full transition-all duration-500 ${!isActive && dispatch ? 'opacity-100' : ''}`}>
      <button
        onClick={() => dispatch({
          type: 'SET_CAR_SPEC',
          payload: isActive ? null : spec.id,
        })}
        className={`w-full text-left px-5 py-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
          isActive
            ? 'bg-black/50 backdrop-blur-xl border-teal-500/30'
            : 'bg-black/30 backdrop-blur-md border-white/8 hover:bg-black/40 hover:border-white/15'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-base transition-colors duration-300 ${isActive ? 'text-teal-400' : 'text-white/30'}`}>
            {spec.icon}
          </span>
          <div className="flex-1">
            <p className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${isActive ? 'text-teal-400/60' : 'text-white/25'}`}>
              {spec.label}
            </p>
            <p className={`text-sm font-light mt-0.5 transition-colors duration-300 ${isActive ? 'text-white/90' : 'text-white/60'}`}>
              {spec.value}
            </p>
          </div>
          <span className={`text-white/20 text-xs transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 py-3.5 bg-black/40 backdrop-blur-xl border border-teal-500/10 rounded-xl">
          <p className="text-white/45 text-xs leading-relaxed font-light">
            {spec.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function CarNav({ currentModel, otherModel, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: 'SET_MODEL', payload: otherModel.id })}
      className="group cursor-pointer animate-[fadeUp_0.5s_ease-out_0.3s_both]"
    >
      <div className="px-6 py-5 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 transition-all duration-400 hover:bg-black/40 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]">
        <p className="text-white/25 text-[8px] tracking-[0.3em] uppercase mb-2">View next</p>
        <p className="text-white/70 text-lg font-extralight tracking-wider">{otherModel.name} →</p>
        <p className="text-white/30 text-xs font-light mt-1">{otherModel.price}</p>
      </div>
    </button>
  )
}

export default function CarSpecPanel() {
  const { state, dispatch } = useCarStore()

  if (state.activeScene !== 'auto-studio') return null

  const car = CAR_MODELS.find((m) => m.id === state.activeModel)
  if (!car || !car.specs) return null

  const currentIndex = CAR_MODELS.indexOf(car)
  const otherCar = CAR_MODELS[currentIndex === 0 ? 1 : 0]

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center justify-between px-8 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-start gap-3 w-72">
          <div className="animate-[fadeUp_0.5s_ease-out_both] mb-1">
            <p className="text-white/35 text-[9px] tracking-[0.3em] uppercase">{car.subtitle}</p>
            <h2 className="text-white text-3xl font-extralight tracking-wider mt-0.5">{car.name}</h2>
            <p className="text-teal-400/70 text-base font-light mt-1">{car.price}</p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-teal-500/20 to-transparent animate-[fadeUp_0.5s_ease-out_0.1s_both]" />

          {car.specs.map((spec, i) => (
            <div
              key={spec.id}
              className={`w-full transition-opacity duration-500 ${state.carSpec && state.carSpec !== spec.id ? 'opacity-50' : 'opacity-100'}`}
              style={{ animation: `fadeUp 0.5s ease-out ${0.15 + i * 0.1}s both` }}
            >
              <SpecButton spec={spec} isActive={state.carSpec === spec.id} dispatch={dispatch} />
            </div>
          ))}

          <div className="w-full h-px bg-gradient-to-r from-teal-500/20 to-transparent animate-[fadeUp_0.5s_ease-out_0.5s_both]" />

          <div className="w-full animate-[fadeUp_0.5s_ease-out_0.55s_both]">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_BOOKING' })}
              className="w-full py-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-light tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 hover:bg-teal-500/20 hover:border-teal-500/50 active:scale-[0.98]"
            >
              Book Test Drive
            </button>
          </div>
        </div>

        <div className="pointer-events-auto">
          <CarNav currentModel={car} otherModel={otherCar} dispatch={dispatch} />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 pointer-events-auto animate-[fadeUp_0.5s_ease-out_both]">
        <div className="bg-black/60 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-white/35 text-[8px] tracking-[0.25em] uppercase">{car.subtitle}</p>
              <h2 className="text-white text-lg font-extralight tracking-wider">{car.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-400/70 text-sm font-light">{car.price}</span>
              <button
                onClick={() => dispatch({ type: 'SET_MODEL', payload: otherCar.id })}
                className="py-1.5 px-3 rounded-lg bg-black/30 border border-white/10 cursor-pointer"
              >
                <span className="text-white/50 text-xs">{otherCar.name} →</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            {car.specs.map((spec) => {
              const isActive = state.carSpec === spec.id
              return (
                <button
                  key={spec.id}
                  onClick={() => dispatch({ type: 'SET_CAR_SPEC', payload: isActive ? null : spec.id })}
                  className={`flex-1 py-2 rounded-lg border cursor-pointer transition-all duration-300 text-center ${
                    isActive ? 'bg-black/50 border-teal-500/30' : 'bg-black/30 border-white/8'
                  }`}
                >
                  <span className={`block text-xs mb-0.5 ${isActive ? 'text-teal-400' : 'text-white/30'}`}>{spec.icon}</span>
                  <span className={`text-[8px] tracking-[0.2em] uppercase ${isActive ? 'text-teal-400/60' : 'text-white/25'}`}>{spec.label}</span>
                </button>
              )
            })}
          </div>

          {state.carSpec && (() => {
            const spec = car.specs.find((s) => s.id === state.carSpec)
            return (
              <div className="bg-black/40 border border-teal-500/10 rounded-lg px-3 py-2 mb-2 animate-[fadeUp_0.3s_ease-out_both]">
                <p className="text-white/80 text-xs font-light">{spec.value}</p>
                <p className="text-white/40 text-[10px] leading-relaxed font-light mt-1">{spec.description}</p>
              </div>
            )
          })()}

          <button
            onClick={() => dispatch({ type: 'TOGGLE_BOOKING' })}
            className="w-full py-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-light tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 active:scale-[0.98]"
          >
            Book Test Drive
          </button>
        </div>
      </div>
    </>
  )
}
