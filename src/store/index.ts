import { configureStore } from '@reduxjs/toolkit'

import { dnxApi } from '@/store/api/dnxApi'

export const store = configureStore({
  reducer: {
    [dnxApi.reducerPath]: dnxApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dnxApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
