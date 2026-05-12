import { createContext, useContext, useReducer } from 'react'

const CarContext = createContext(null)

const initialState = {
  activeScene: 'auto-studio',
  activeModel: 'ferrari',
  activeHandbag: null,
  fashionPhase: 'intro',
  detailView: null,
  carSpec: null,
  carTransition: null,
  showBooking: false,
}

function carReducer(state, action) {
  switch (action.type) {
    case 'SET_SCENE':
      return { ...state, activeScene: action.payload, activeHandbag: null, fashionPhase: 'intro', carSpec: null, carTransition: null, showBooking: false }
    case 'SET_MODEL':
      return { ...state, activeModel: action.payload, carSpec: null, carTransition: null }
    case 'SET_HANDBAG':
      return { ...state, activeHandbag: action.payload, fashionPhase: action.payload ? 'product' : 'select', detailView: null }
    case 'SET_FASHION_PHASE':
      return { ...state, fashionPhase: action.payload }
    case 'SET_DETAIL_VIEW':
      return { ...state, detailView: action.payload }
    case 'SET_CAR_SPEC':
      return { ...state, carSpec: action.payload }
    case 'START_CAR_TRANSITION':
      return { ...state, carTransition: action.payload, carSpec: null }
    case 'FINISH_CAR_TRANSITION':
      return { ...state, activeModel: state.carTransition, carTransition: null }
    case 'TOGGLE_BOOKING':
      return { ...state, showBooking: !state.showBooking, carSpec: null }
    default:
      return state
  }
}

export function CarProvider({ children }) {
  const [state, dispatch] = useReducer(carReducer, initialState)
  return (
    <CarContext.Provider value={{ state, dispatch }}>
      {children}
    </CarContext.Provider>
  )
}

export function useCarStore() {
  const context = useContext(CarContext)
  if (!context) throw new Error('useCarStore must be used within CarProvider')
  return context
}
