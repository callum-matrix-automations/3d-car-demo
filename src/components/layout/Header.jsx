import { useCarStore } from '../../hooks/useCarStore'
import { SCENES } from '../../constants/carData'

export default function Header() {
  const { state, dispatch } = useCarStore()

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm md:text-lg">Q</span>
        </div>
      </div>

      <nav className="flex items-center bg-white/5 backdrop-blur-md rounded-full px-1.5 py-0.5 md:px-2 md:py-1 border border-white/10">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => dispatch({ type: 'SET_SCENE', payload: scene.id })}
            className={`px-3 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
              state.activeScene === scene.id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {scene.label}
          </button>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Los Angeles</span>
      </div>
    </header>
  )
}
