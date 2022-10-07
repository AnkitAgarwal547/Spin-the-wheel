import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import {getToken, updateCount} from '../../../../../../../app/modules/auth/core/_requests'
import {
  TRIGGER_PRIZE_INDEX,
  TRIGGER_SELECTED_BOX_INDEX,
} from '../../../../../../../app/redux/actions/actionTypes'
import {useAppSelector} from '../../../../../../../app/redux/hooks/hooks'
import './PickTheBox.scss'

export default function PickTheBox() {
  const {campaignDetails, prizeIndex, selectedBoxIndex} = useAppSelector(
    (state) => state.userReducer
  )
  console.log(
    '🚀 ~ file: PickTheBox.tsx ~ line 12 ~ PickTheBox ~ selectedBoxIndex',
    selectedBoxIndex
  )
  console.log('🚀 ~ file: PickTheBox.tsx ~ line 12 ~ PickTheBox ~ prizeIndex', prizeIndex)
  console.log('🚀 ~ file: PickTheBox.tsx ~ line 10 ~ PickTheBox ~ campaignDetails', campaignDetails)
  const dispatch = useDispatch()

  const boxesList = [
    {
      img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_1.png',
    },
    {
      img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_2.png',
    },
    {
      img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_3.png',
    },
    {
      img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_4.png',
    },
  ]
  const [boxes, setBoxes] = useState<any>(boxesList)

  const [reward, setReward] = useState(prizeIndex)
  const selectReward = (index) => {
    console.log('🚀 ~ file: PickTheBox.tsx ~ line 53 ~ selectReward ~ prizeIndex', prizeIndex)
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
      dispatch({
        type: TRIGGER_PRIZE_INDEX,
        prizeIndex: selectedItem,
      })

      dispatch({
        type: TRIGGER_SELECTED_BOX_INDEX,
        selectedBoxIndex: index,
      })

      updateCount(campaignDetails?._id, {
        action: 'UPDATE_CAMPAIGN_WINNINGVALUE',
        winninglabel_key: campaignDetails.winning_values[selectedItem]['key'],
      })
    }
  }
  return (
    <div className='pick-the-box'>
      <div className='sub-div text-center my-5'>
        <Row gx={5} gy={5}>
          {boxes.map((item, i) => {
            return (
              <Col
                xxl={6}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                kye={i}
                className={clsx(
                  'position-relative ',
                  {'border-start': i == 1 || i == 3},
                  {
                    'border-top': i == 3 || i == 2,
                  }
                )}
              >
                {selectedBoxIndex === i ? (
                  <div className='center text-light'>
                    <small>
                      You got "
                      {(prizeIndex ||
                        prizeIndex === 0 )&&
                          campaignDetails['winning_values'][prizeIndex]['label']}
                      " reward
                    </small>
                  </div>
                ) : (
                  <img
                    className='p-3 cursor-pointer'
                    src={item.img}
                    onClick={() => {
                      selectReward(i)
                    }}
                  ></img>
                )}
              </Col>
            )
          })}
          {/* <Col xxl={6} xl={6} lg={6} md={6} sm={6} className='border-start'>
            <img
              src={
                'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_2.png'
              }
            ></img>
          </Col>{' '}
          <Col xxl={6} xl={6} lg={6} md={6} sm={6} className='border'>
            <img
              src={
                'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_3.png'
              }
            ></img>
          </Col>{' '}
          <Col xxl={6} xl={6} lg={6} md={6} sm={6} className='border'>
            <img
              src={
                'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_4.png'
              }
            ></img>
          </Col> */}
        </Row>
      </div>
    </div>
  )
}
