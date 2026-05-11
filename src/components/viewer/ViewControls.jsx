import { useCarStore } from '../../hooks/useCarStore'
import { VIEW_ANGLES } from '../../constants/carData'

export default function ViewControls() {
  const { state, dispatch } = useCarStore()

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
      {VIEW_ANGLES.map(({ key }) => (
        <button
          key={key}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: key })}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
            state.activeView === key
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm'
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  )
}
