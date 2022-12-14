import React, { useEffect } from 'react'
import { CardPacksType, getCardPacksThunk } from './cardPacksSlice'
import { useAppDispatch, useAppSelector } from '../../common/hooks'
import style from './cardPacks.module.css'
import { MyCardsOnlySwitch } from './components/MyCardsOnlySwitch'
import { CardPackTable } from './components/CardPackTable'
import { PacksPagination } from './components/PacksPagination'
import { AddNewCardPackModal } from './modals/addNewCardPackModal/AddNewCardPackModal'
import { Navigate } from 'react-router-dom'
import { Path } from '../../common/enums/Path'

export const CardPacksPage = () => {
  let currentUserId = useAppSelector((state) => state.app.userData._id)
  let privateMode = useAppSelector((state) => state.cardPacks.privateMode)
  let totalPacks = useAppSelector((state) => state.cardPacks.cardPacksInfo.cardPacksTotalCount)
  let currentPagePacksCount = useAppSelector((state) => state.cardPacks.cardPacksInfo.pageCount)
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn)

  let cardPacks: CardPacksType[] = useAppSelector(
    (state) => state.cardPacks.cardPacksInfo.cardPacks
  )

  let dispatch = useAppDispatch()

  useEffect(() => {
    if (privateMode) {
      dispatch(getCardPacksThunk(currentUserId))
    } else {
      dispatch(getCardPacksThunk())
    }
  }, [privateMode])

  if (!isLoggedIn) {
    return <Navigate to={Path.SingIn} />
  }

  return (
    <div className={style.pageContainer}>
      <div className={style.pageNameContainer}>
        <h2>Packs list</h2>
      </div>
      <div className={style.btnPanel}>
        <MyCardsOnlySwitch privateMode={privateMode} />

        <AddNewCardPackModal />
      </div>
      <div className={style.tableContainer}>
        <CardPackTable cardPacks={cardPacks} />
        <div className={style.pagination}>
          <PacksPagination
            currentUserId={currentUserId}
            privateMode={privateMode}
            totalPages={Math.ceil(totalPacks / currentPagePacksCount)}
          />
        </div>
      </div>
    </div>
  )
}
