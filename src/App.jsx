import { useState, useEffect, useRef, useCallback } from 'react'
import { CarProvider, useCarStore } from './hooks/useCarStore'
import { CAR_MODELS, FASHION_INFO, HANDBAGS } from './constants/carData'
import Header from './components/layout/Header'
import CarCanvas from './components/viewer/CarCanvas'
import InfoCards from './components/bottom/InfoCards'
import StyleSelector from './components/fashion/StyleSelector'
import ProductCard from './components/fashion/ProductCard'
import BrandReveal from './components/fashion/BrandReveal'
import CarSpecPanel from './components/auto/CarSpecPanel'
import BookingDrawer from './components/auto/BookingDrawer'
import { PathRecorderUI } from './components/viewer/PathRecorder'

const DEBUG_PATH_RECORDER = false

function AppInner() {
  const { state, dispatch } = useCarStore()
  const [renderedScene, setRenderedScene] = useState(state.activeScene)
  const [fading, setFading] = useState(false)
  const prevScene = useRef(state.activeScene)
  const pathRecorderRef = useRef({ recording: false, waypoints: [], count: 0, pos: '0.0, 0.0, 0.0' })

  useEffect(() => {
    if (state.activeScene === prevScene.current) return
    prevScene.current = state.activeScene

    setFading(true)

    const timer = setTimeout(() => {
      setRenderedScene(state.activeScene)
      setTimeout(() => setFading(false), 50)
    }, 500)

    return () => clearTimeout(timer)
  }, [state.activeScene])

  const handleFashionArrived = useCallback(() => {
    dispatch({ type: 'SET_FASHION_PHASE', payload: 'select' })
  }, [dispatch])

  const activeCarModel = CAR_MODELS.find((m) => m.id === state.activeModel) || CAR_MODELS[0]
  const isAutoStudio = renderedScene === 'auto-studio'
  const isFashion = renderedScene === 'fashion'

  const activeBag = state.activeHandbag ? HANDBAGS.find((b) => b.id === state.activeHandbag) : null
  const showTitle = isFashion && (state.fashionPhase === 'select' || state.fashionPhase === 'product')

  let title, subtitle
  if (activeBag) {
    title = activeBag.name
    subtitle = activeBag.tagline
  } else {
    title = FASHION_INFO.name
    subtitle = FASHION_INFO.subtitle
  }

  return (
    <div className="relative w-screen h-dvh bg-[#0a0a10] overflow-hidden">
      <Header />

      {showTitle && (
        <div className="absolute top-14 left-4 md:top-20 md:left-8 z-10">
          <h1 className="text-white text-2xl md:text-5xl font-bold tracking-tight">{title}</h1>
          <p className="text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 tracking-wide">{subtitle}</p>
        </div>
      )}

      <div className="absolute inset-0 z-0">
        <CarCanvas
          activeScene={renderedScene}
          activeHandbag={state.activeHandbag}
          fashionPhase={state.fashionPhase}
          detailView={state.detailView}
          carSpec={state.carSpec}
          carModel={state.activeModel}
          onFashionArrived={handleFashionArrived}
          pathRecorderRef={pathRecorderRef}
        />
      </div>

      {isAutoStudio && !state.carTransition && <CarSpecPanel />}
      {isAutoStudio && <InfoCards />}
      {isAutoStudio && <BookingDrawer />}

      {isFashion && !DEBUG_PATH_RECORDER && <BrandReveal />}
      {isFashion && !DEBUG_PATH_RECORDER && <StyleSelector />}
      {isFashion && !DEBUG_PATH_RECORDER && <ProductCard />}
      {isFashion && DEBUG_PATH_RECORDER && <PathRecorderUI stateRef={pathRecorderRef} />}

      <div
        className={`absolute inset-0 z-50 bg-black pointer-events-none transition-opacity duration-500 ${
          fading ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

export default function App() {
  return (
    <CarProvider>
      <AppInner />
    </CarProvider>
  )
}
