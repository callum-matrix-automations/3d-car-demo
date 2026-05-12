import { useCarStore } from '../../hooks/useCarStore'
import { CAR_MODELS } from '../../constants/carData'

export default function ModelSelector() {
  const { state, dispatch } = useCarStore()

  return (
    <div className="absolute right-4 bottom-4 md:right-6 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-10 flex flex-row md:flex-col gap-2">
      {CAR_MODELS.map((model) => (
        <button
          key={model.id}
          onClick={() => dispatch({ type: 'SET_MODEL', payload: model.id })}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-medium transition-all duration-200 cursor-pointer text-left ${
            state.activeModel === model.id
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-lg shadow-teal-500/10'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-sm'
          }`}
        >
          {model.name}
        </button>
      ))}
    </div>
  )
}
