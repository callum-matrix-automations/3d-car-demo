import { CarProvider } from './hooks/useCarStore'
import { CAR_INFO } from './constants/carData'
import Header from './components/layout/Header'
import CarCanvas from './components/viewer/CarCanvas'
import Sidebar from './components/sidebar/Sidebar'
import InfoCards from './components/bottom/InfoCards'

export default function App() {
  return (
    <CarProvider>
      <div className="relative w-screen h-screen bg-[#0a0a10] overflow-hidden">
        <Header />

        <div className="absolute top-20 left-8 z-10">
          <h1 className="text-white text-5xl font-bold tracking-tight">{CAR_INFO.name}</h1>
          <p className="text-gray-400 text-sm mt-1 tracking-wide">{CAR_INFO.subtitle}</p>
        </div>

        <div className="absolute inset-0 z-0">
          <CarCanvas />
        </div>

        <Sidebar />
        <InfoCards />
      </div>
    </CarProvider>
  )
}
