"use client"

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "./store"
import { PreferencesProvider } from "./providers/PreferencesProvider"

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PreferencesProvider>
          {children}
        </PreferencesProvider>
      </PersistGate>
    </Provider>
  )
} 