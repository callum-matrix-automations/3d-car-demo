export default function InfoCards() {
  return (
    <div className="hidden md:flex absolute bottom-0 left-0 right-0 z-20 gap-0 h-28">
      <div className="flex-1 bg-white/5 backdrop-blur-md border-t border-r border-white/10 p-5 flex flex-col justify-center">
        <span className="text-[10px] tracking-widest text-gray-500 uppercase mb-1">My Location</span>
        <span className="text-white text-sm font-medium">Vermont Square, Los Angeles</span>
        <div className="absolute bottom-4 right-4">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/5 backdrop-blur-md border-t border-r border-white/10 p-5 flex flex-col justify-center">
        <span className="text-[10px] tracking-widest text-gray-500 uppercase mb-2">My Dates</span>
        <div className="flex items-baseline gap-8">
          <div>
            <span className="text-white text-3xl font-light">20</span>
            <span className="text-gray-500 text-xs ml-1">JUL</span>
          </div>
          <div>
            <span className="text-white text-3xl font-light">10:25</span>
            <span className="text-gray-500 text-xs ml-1">AM</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/5 backdrop-blur-md border-t border-white/10 p-5 flex flex-col justify-center">
        <span className="text-[10px] tracking-widest text-gray-500 uppercase mb-2">Payment Method</span>
        <div className="flex items-center gap-3 bg-black/40 rounded-lg px-3 py-2">
          <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center">
            <svg className="w-5 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 12">
              <rect width="20" height="12" rx="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-medium">Credit Card</span>
            <span className="text-gray-500 text-[10px]">3451 **** **** 7896</span>
          </div>
          <div className="ml-auto w-4 h-4 rounded-full border-2 border-teal-400 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-teal-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
