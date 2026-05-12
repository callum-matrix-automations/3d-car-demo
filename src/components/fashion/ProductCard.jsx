import { useCarStore } from '../../hooks/useCarStore'
import { HANDBAGS } from '../../constants/carData'

const SPECS = [
  {
    id: 'material',
    icon: '◈',
    label: 'Material',
    getDetail: (bag) => ({
      value: bag.material,
      description: 'Selected from the finest tanneries, each hide is hand-inspected for grain consistency and natural character.',
    }),
  },
  {
    id: 'craftsmanship',
    icon: '✦',
    label: 'Craft',
    getDetail: (bag) => ({
      value: bag.origin,
      description: 'Over 18 hours of saddle-stitching ensures every seam outlasts the leather. Hardware is individually cast and polished.',
    }),
  },
  {
    id: 'dimensions',
    icon: '⬡',
    label: 'Size',
    getDetail: (bag) => ({
      value: bag.dimensions,
      description: 'Engineered proportions balance elegance with practicality. Silk-lined interior with hand-painted edges.',
    }),
  },
]

function InfoPanel({ bag, detailView, dispatch, mobile = false }) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-white/35 text-[8px] tracking-[0.25em] uppercase">{bag.tagline}</p>
            <h2 className="text-white text-lg font-extralight tracking-wider">{bag.name}</h2>
          </div>
          <p className="text-white/50 text-sm font-light">{bag.price}</p>
        </div>

        <div className="flex gap-2">
          {SPECS.map((spec) => {
            const isActive = detailView === spec.id
            const detail = spec.getDetail(bag)

            return (
              <button
                key={spec.id}
                onClick={() => dispatch({
                  type: 'SET_DETAIL_VIEW',
                  payload: isActive ? null : spec.id,
                })}
                className={`flex-1 py-2 rounded-lg border cursor-pointer transition-all duration-300 text-center ${
                  isActive
                    ? 'bg-black/50 border-white/20'
                    : 'bg-black/30 border-white/8'
                }`}
              >
                <span className={`block text-xs mb-0.5 ${isActive ? 'text-white/80' : 'text-white/30'}`}>{spec.icon}</span>
                <span className={`text-[8px] tracking-[0.2em] uppercase ${isActive ? 'text-white/60' : 'text-white/25'}`}>{spec.label}</span>
              </button>
            )
          })}
        </div>

        {detailView && (() => {
          const spec = SPECS.find((s) => s.id === detailView)
          const detail = spec.getDetail(bag)
          return (
            <div className="bg-black/40 border border-white/8 rounded-lg px-3 py-2 animate-[fadeUp_0.3s_ease-out_both]">
              <p className="text-white/80 text-xs font-light">{detail.value}</p>
              <p className="text-white/40 text-[10px] leading-relaxed font-light mt-1">{detail.description}</p>
            </div>
          )
        })()}

        <button className="w-full py-2.5 rounded-lg bg-black/40 border border-white/15 text-white/90 text-xs font-light tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 active:scale-[0.98]">
          Add to Bag
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-3 w-72">
      <div className="animate-[fadeUp_0.5s_ease-out_both] mb-1">
        <p className="text-white/35 text-[9px] tracking-[0.3em] uppercase">{bag.tagline}</p>
        <h2 className="text-white text-3xl font-extralight tracking-wider mt-0.5">{bag.name}</h2>
        <p className="text-white/50 text-base font-light mt-1">{bag.price}</p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-white/15 to-transparent animate-[fadeUp_0.5s_ease-out_0.1s_both]" />

      {SPECS.map((spec, i) => {
        const isActive = detailView === spec.id
        const isHidden = detailView && !isActive
        const detail = spec.getDetail(bag)

        return (
          <div
            key={spec.id}
            className={`w-full transition-all duration-500 ${isHidden ? 'opacity-50' : 'opacity-100'}`}
            style={{ animation: `fadeUp 0.5s ease-out ${0.15 + i * 0.1}s both` }}
          >
            <button
              onClick={() => dispatch({
                type: 'SET_DETAIL_VIEW',
                payload: isActive ? null : spec.id,
              })}
              className={`w-full text-left px-5 py-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'bg-black/50 backdrop-blur-xl border-white/20'
                  : 'bg-black/30 backdrop-blur-md border-white/8 hover:bg-black/40 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-base transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                  {spec.icon}
                </span>
                <div className="flex-1">
                  <p className={`text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${isActive ? 'text-white/50' : 'text-white/25'}`}>
                    {spec.label}
                  </p>
                  <p className={`text-sm font-light mt-0.5 transition-colors duration-300 ${isActive ? 'text-white/90' : 'text-white/60'}`}>
                    {detail.value}
                  </p>
                </div>
                <span className={`text-white/20 text-xs transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="px-5 py-3.5 bg-black/40 backdrop-blur-xl border border-white/8 rounded-xl">
                <p className="text-white/45 text-xs leading-relaxed font-light">
                  {detail.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}

      <div className="w-full h-px bg-gradient-to-r from-white/15 to-transparent animate-[fadeUp_0.5s_ease-out_0.5s_both]" />

      <div className="w-full animate-[fadeUp_0.5s_ease-out_0.55s_both]">
        <button className="w-full py-3.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/15 text-white/90 text-sm font-light tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/25 active:scale-[0.98]">
          Add to Bag
        </button>
      </div>

      <button
        onClick={() => dispatch({ type: 'SET_HANDBAG', payload: null })}
        className="text-white/25 text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-all duration-300 hover:text-white/50 animate-[fadeUp_0.5s_ease-out_0.6s_both]"
      >
        ← Collection
      </button>
    </div>
  )
}

function NavButton({ direction, otherBag, dispatch, mobile = false }) {
  const isNext = direction === 'next'

  if (mobile) {
    return (
      <button
        onClick={() => dispatch({ type: 'SET_HANDBAG', payload: otherBag.id })}
        className="py-2 px-4 rounded-lg bg-black/30 border border-white/10 cursor-pointer transition-all duration-300 active:scale-[0.98]"
      >
        <span className="text-white/50 text-xs font-light tracking-wider">
          {isNext ? `${otherBag.name} →` : `← ${otherBag.name}`}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={() => dispatch({ type: 'SET_HANDBAG', payload: otherBag.id })}
      className="group cursor-pointer animate-[fadeUp_0.5s_ease-out_0.3s_both]"
    >
      <div className="px-6 py-5 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 transition-all duration-400 hover:bg-black/40 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]">
        <p className="text-white/25 text-[8px] tracking-[0.3em] uppercase mb-2">
          {isNext ? 'View next' : 'View previous'}
        </p>
        <p className="text-white/70 text-lg font-extralight tracking-wider">
          {isNext ? `${otherBag.name} →` : `← ${otherBag.name}`}
        </p>
        <p className="text-white/30 text-xs font-light mt-1">{otherBag.price}</p>
      </div>
    </button>
  )
}

export default function ProductCard() {
  const { state, dispatch } = useCarStore()

  if (state.activeScene !== 'fashion' || !state.activeHandbag) return null

  const bag = HANDBAGS.find((b) => b.id === state.activeHandbag)
  if (!bag) return null

  const currentIndex = HANDBAGS.indexOf(bag)
  const otherBag = HANDBAGS[currentIndex === 0 ? 1 : 0]
  const isClassic = state.activeHandbag === 'classic'

  return (
    <>
      {/* Desktop layout — side panels */}
      <div className="hidden md:flex absolute inset-0 z-30 items-center justify-between px-8 pointer-events-none">
        <div className="pointer-events-auto">
          {isClassic ? (
            <InfoPanel bag={bag} detailView={state.detailView} dispatch={dispatch} />
          ) : (
            <NavButton direction="prev" otherBag={otherBag} dispatch={dispatch} />
          )}
        </div>

        <div className="pointer-events-auto">
          {isClassic ? (
            <NavButton direction="next" otherBag={otherBag} dispatch={dispatch} />
          ) : (
            <InfoPanel bag={bag} detailView={state.detailView} dispatch={dispatch} />
          )}
        </div>
      </div>

      {/* Mobile layout — bottom drawer */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 pointer-events-auto animate-[fadeUp_0.5s_ease-out_both]">
        <div className="bg-black/60 backdrop-blur-xl border-t border-white/10 px-4 pt-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => dispatch({ type: 'SET_HANDBAG', payload: null })}
              className="text-white/30 text-[10px] tracking-[0.2em] uppercase cursor-pointer"
            >
              ← Back
            </button>
            <NavButton direction={isClassic ? 'next' : 'prev'} otherBag={otherBag} dispatch={dispatch} mobile />
          </div>
          <InfoPanel bag={bag} detailView={state.detailView} dispatch={dispatch} mobile />
        </div>
      </div>
    </>
  )
}
