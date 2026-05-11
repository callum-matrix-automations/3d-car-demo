import { CAR_SPECS } from '../../constants/carData'

export default function StatsBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-2 bg-black/80 border-b border-white/5">
      {CAR_SPECS.map((spec, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-gray-500 uppercase">
            {spec.label}
          </span>
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: spec.color }}
          >
            {spec.value}
          </span>
          {i < CAR_SPECS.length - 1 && (
            <div className="w-px h-3 bg-white/10 ml-4" />
          )}
        </div>
      ))}
    </div>
  )
}
