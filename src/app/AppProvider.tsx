
import React from 'react'
import { AppState } from './types'
import { reducer, Action } from './reducer'
import { initialState } from './initial'

const AppCtx = React.createContext<{ state: AppState; dispatch: React.Dispatch<Action> }>({} as any)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, undefined, initialState)
  return <AppCtx.Provider value={{ state, dispatch }}>{children}</AppCtx.Provider>
}

export function useApp() { return React.useContext(AppCtx) }
