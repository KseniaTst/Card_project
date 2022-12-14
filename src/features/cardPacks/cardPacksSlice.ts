import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThunkType } from '../../app/store'
import {
  cardPacksApi,
  CreateCardsPackPayloadType,
  UpdateCardsPackPayloadType,
} from './cardPacksApi'
import { AxiosError, AxiosResponse } from 'axios'
import { handleNetworkError } from '../../common/utils/errorUtil'
import { setStatus } from '../../app/appSlice'

export type CardPacksType = {
  _id: string
  user_id: string
  name: string
  cardsCount: string
  created: string
  updated: string
}
export type CardPacksResponseType = {
  cardPacks: CardPacksType[]
  cardPacksTotalCount: number // количество колод
  maxCardsCount: number
  minCardsCount: number
  page: number // выбранная страница
  pageCount: number // количество элементов на странице
  token: string
  tokenDeathTime: string
}

export type CardPacksStateTypes = {
  cardPacksInfo: CardPacksResponseType
  privateMode: boolean
}
const initialState: CardPacksStateTypes = {
  cardPacksInfo: {
    cardPacks: [],
    cardPacksTotalCount: 0,
    maxCardsCount: 0,
    minCardsCount: 0,
    page: 0,
    pageCount: 0,
    token: '',
    tokenDeathTime: '',
  },
  privateMode: false,
}

export const cardPacksSlice = createSlice({
  name: 'packList',
  initialState,
  reducers: {
    setCardPacksList(state: CardPacksStateTypes, action: PayloadAction<CardPacksResponseType>) {
      state.cardPacksInfo = action.payload
    },
    setPrivateMode(state: CardPacksStateTypes, action: PayloadAction<boolean>) {
      state.privateMode = action.payload
    },
  },
})

export const { setCardPacksList, setPrivateMode } = cardPacksSlice.actions

export const getCardPacksThunk =
  (userId?: string, page?: number): ThunkType =>
  (dispatch) => {
    dispatch(setStatus({ status: 'loading' }))
    cardPacksApi
      .getPackList(userId, page)
      .then((res: AxiosResponse<CardPacksResponseType>) => {
        dispatch(setCardPacksList(res.data))
      })
      .catch((error) => {
        handleNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(setStatus({ status: 'idle' }))
      })
  }
export const updataCardPack =
  (payload: UpdateCardsPackPayloadType): ThunkType =>
  (dispatch, getState) => {
    dispatch(setStatus({ status: 'loading' }))
    cardPacksApi
      .updateCardtPack(payload)
      .then(() => {
        if (getState().cardPacks.privateMode) {
          dispatch(getCardPacksThunk(getState().app.userData._id))
        } else {
          dispatch(getCardPacksThunk())
        }
      })
      .catch((error) => {
        handleNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(setStatus({ status: 'idle' }))
      })
  }

export const createCardPack =
  (payload: CreateCardsPackPayloadType): ThunkType =>
  (dispatch, getState) => {
    dispatch(setStatus({ status: 'loading' }))
    cardPacksApi
      .createCardPack(payload)
      .then((res) => {
        debugger
        if (getState().cardPacks.privateMode) {
          dispatch(getCardPacksThunk(getState().app.userData._id))
        } else {
          dispatch(getCardPacksThunk())
        }
      })
      .catch((error) => {
        handleNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(setStatus({ status: 'idle' }))
      })
  }
export const deleteCardPack =
  (_id: string): ThunkType =>
  (dispatch, getState) => {
    dispatch(setStatus({ status: 'loading' }))
    cardPacksApi
      .deletePack(_id)
      .then(() => {
        if (getState().cardPacks.privateMode) {
          dispatch(getCardPacksThunk(getState().app.userData._id))
        } else {
          dispatch(getCardPacksThunk())
        }
      })
      .catch((error: Error | AxiosError) => {
        handleNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(setStatus({ status: 'idle' }))
      })
  }
