import { createContext, useContext, useReducer } from 'react'

const CarContext = createContext(null)

const initialState = {
  activeColor: '#f0f0f0',
  activeTab: 'Buy',
  activeView: null,
}

function carReducer(state, action) {
  switch (action.type) {
    case 'SET_COLOR':
      return { ...state, activeColor: action.payload }
    case 'SET_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_VIEW':
      return { ...state, activeView: state.activeView === action.payload ? null : action.payload }
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
