import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { loginReducer } from '../features/signIn/signIn-slice'
import { registrationReducer } from '../features/signUp/singnUp-slice'
import { forgotPasswordSlice } from '../features/recoveryPassword/ForgotPasswordSlice'

const RootReducer = combineReducers({
  login: loginReducer,
  registration: registrationReducer,
  forgotPassword: forgotPasswordSlice.reducer,
})

export const store = configureStore({
  reducer: RootReducer,
})

export type RootStateType = ReturnType<typeof store.getState>

// в react 18 используем useAppDispatch вместо useDispatch
export type DispatchType = ThunkDispatch<RootStateType, unknown, AnyAction>
