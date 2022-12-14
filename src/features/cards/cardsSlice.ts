import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CardQueryParams,
  cardsApi,
  CardType,
  CreateCardType,
  ResponseGetCardType,
  UpdateCardType,
} from './cardsApi'
import { ThunkType } from '../../app/store'
import { AxiosError } from 'axios'
import { handleNetworkError } from '../../common/utils/errorUtil'

const initialState = {
  cardsData: {
    cards: [] as CardType[],
    packUserId: '',
    page: 0,
    pageCount: 0,
    cardsTotalCount: -1,
    minGrade: 0,
    maxGrade: 0,
    token: '',
    tokenDeathTime: 0,
  } as ResponseGetCardType,
  queryParams: {} as CardQueryParams,
  sortParams: {},
}
console.log(initialState)

export const packListSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCardsAC(state, action: PayloadAction<{ cardsData: ResponseGetCardType }>) {
      state.cardsData = action.payload.cardsData
    },
    clearCardsListAC(state) {
      state.cardsData.cards = []
    },
    addCardsQueryParamsAC(state, action: PayloadAction<{ queryParams: CardQueryParams }>) {
      state.queryParams = action.payload.queryParams
    },
  },
})

export const cardsReducer = packListSlice.reducer

export const { setCardsAC, clearCardsListAC, addCardsQueryParamsAC } = packListSlice.actions

export const getCardsThunk =
  (params: CardQueryParams): ThunkType =>
  (dispatch) => {
    cardsApi
      .getCards(params)
      .then((res) => {
        dispatch(setCardsAC({ cardsData: res.data }))
      })
      .catch((err: AxiosError<{ error: string }>) => {})
  }
export const deleteCardThunk =
  (id: string, packId: string): ThunkType =>
  (dispatch, getState) => {
    cardsApi
      .deleteCard(id)
      .then((res) => {
        dispatch(getCardsThunk({ cardsPack_id: packId, ...getState().cards.queryParams }))
      })
      .catch((err: AxiosError<{ error: string }>) => handleNetworkError(err, dispatch))
  }
export const updateCardThunk =
  (data: UpdateCardType, packId: string): ThunkType =>
  (dispatch, getState) => {
    cardsApi
      .updateCard(data)
      .then((res) => {
        dispatch(getCardsThunk({ cardsPack_id: packId, ...getState().cards.queryParams }))
      })
      .catch((err: AxiosError<{ error: string }>) => handleNetworkError(err, dispatch))
  }
export const addCardThunk =
  (data: CreateCardType): ThunkType =>
  (dispatch, getState) => {
    cardsApi
      .createCard(data)
      .then((res) => {
        dispatch(
          getCardsThunk({ cardsPack_id: data.card.cardsPack_id, ...getState().cards.queryParams })
        )
      })
      .catch((err: AxiosError<{ error: string }>) => handleNetworkError(err, dispatch))
  }
