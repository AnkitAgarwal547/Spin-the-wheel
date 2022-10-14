import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import {useAuth} from '../../../../../../../app/modules/auth'
import {getToken, updateCount} from '../../../../../../../app/modules/auth/core/_requests'
import {
  TRIGGER_PRIZE_INDEX,
  TRIGGER_SELECTED_BOX_INDEX,
} from '../../../../../../../app/redux/actions/actionTypes'
import {useAppSelector} from '../../../../../../../app/redux/hooks/hooks'
import authReducer from '../../../../../../../app/redux/reducers/authReducer'
import './PickTheBox.scss'

export default function PickTheBox() {
  const {campaignDetails, prizeIndex, selectedBoxIndex} = useAppSelector(
    (state) => state.userReducer
  )

  const dispatch = useDispatch()
  const {currentUser} = useAuth()

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
    const payload = {
      action: 'UPDATE_USER_PLAYEDGAME',
      user_id: currentUser?._id,
      access_token: getToken(),
    }
    updateCount(campaignDetails?._id, payload)
    let selectedItem
    if (!prizeIndex) {
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
                col={3}
                key={i}
                className={clsx(
                  'position-relative ',
                  {'border-start': i == 1 || i == 3},
                  {
                    'border-top': i == 3 || i == 2,
                  }
                )}
              >
                <div className='position-relative'>
                  <img
                    style={{
                      opacity:
                        selectedBoxIndex === i && (prizeIndex || prizeIndex === 0) ? '0.18' : '',
                    }}
                    className='p-3 cursor-pointer'
                    src={item.img}
                    onClick={() => {
                      selectReward(i)
                    }}
                  ></img>
                  {selectedBoxIndex === i && (prizeIndex || prizeIndex === 0) && (
                    <div
                      className='center  fadeIn w-100'
                      style={{fontWeight: 'bold', color: campaignDetails?.forecolor}}
                    >
                      <div>
                        You got "
                        {(prizeIndex || prizeIndex === 0) &&
                          campaignDetails['winning_values'][prizeIndex]['label']}
                        " reward
                      </div>
                    </div>
                  )}
                </div>
                {/* )} */}
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
