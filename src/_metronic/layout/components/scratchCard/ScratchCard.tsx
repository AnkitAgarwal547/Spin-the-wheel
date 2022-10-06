import React, {useEffect, useRef, useState} from 'react'
import './ScratchCard.scss'
import ScratchCard from 'react-scratchcard-v2'
import {useAppSelector} from '../../../../app/redux/hooks/hooks'
import {getToken, updateCount} from '../../../../app/modules/auth/core/_requests'
import {TRIGGER_PRIZE_INDEX} from '../../../../app/redux/actions/actionTypes'
import {useDispatch} from 'react-redux'

export default function ScratchCardWrapper({image}) {
  const {campaignDetails, prizeIndex} = useAppSelector((state) => state.userReducer)
  console.log('🚀 ~ file: ScratchCard.tsx ~ line 11 ~ ScratchCardWrapper ~ prizeIndex', prizeIndex)
  const [reward, setReward] = useState(prizeIndex)
  const dispatch = useDispatch()
  console.log('🚀 ~ file: ScratchCard.tsx ~ line 10 ~ ScratchCardWrapper ~ reward', reward)

  console.log('🚀 ~ file: ScratchCard.tsx ~ line 6 ~ ScratchCardWrapper ~ image', image)
  const ref = useRef<ScratchCard>(null)

  useEffect(() => {
    ref.current && ref.current.reset()
  }, [image])

  const settings = {
    width: 200,
    height: 200,
    finishPercent: 80,
    onComplete: () => {
      const payload = {
        action: 'UPDATE_USER_PLAYEDGAME',
        user_id: campaignDetails?._id,
        access_token: getToken(),
      }
      updateCount(campaignDetails?._id, payload)
      let selectedItem
      if (!prizeIndex) {
        console.log(
          '🚀 ~ file: ScratchCard.tsx ~ line 36 ~ ScratchCardWrapper ~ prizeIndex',
          prizeIndex
        )
        selectedItem = Math.floor(Math.random() * campaignDetails?.winning_values.length)
        if (
          campaignDetails.winning_values[selectedItem]['day_count'] >=
          campaignDetails.winning_values[selectedItem]['max_perday']
        ) {
          let index = campaignDetails.winning_values.findIndex(
            (item) => item['day_count'] <= item['max_perday']
          )
          selectedItem = index
          setReward(selectedItem)
        }

        updateCount(campaignDetails?._id, {
          action: 'UPDATE_CAMPAIGN_WINNINGVALUE',
          winninglabel_key: campaignDetails.winning_values[selectedItem]['key'],
        })
      }
      dispatch({
        type: TRIGGER_PRIZE_INDEX,
        prizeIndex: selectedItem,
      })
      console.log(
        '🚀 ~ file: ScratchCard.tsx ~ line 38 ~ ScratchCardWrapper ~ selectedItem',
        selectedItem
      )
      console.log('The card is now clear!')
    },
  }

  return (
    <div>
      {prizeIndex === 0 || prizeIndex ? (
        <div className='scratch-card'>
          <div className='center'>
            You got "{campaignDetails.winning_values[prizeIndex]?.label}" reward
          </div>
        </div>
      ) : (
        <ScratchCard {...settings} image={image} ref={ref}>
          <div className='center'>
            {/* You got "{campaignDetails.winning_values[prizeIndex]?.label}" reward */}
          </div>
        </ScratchCard>
      )}
    </div>
  )
}
