import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import {useNavigate} from 'react-router'
import {useAuth} from '../../../../../app/modules/auth'
import {getQuestion} from '../../../../../app/modules/auth/core/_requests'
import {
  TRIGGER_CAMPAIGN_DETAILS,
  TRIGGER_QUESTION_DETAILS,
  TRIGGER_ANSWER_DETAILS,
  TRIGGER_START_TIME,
  TRIGGER_END_TIME,
} from '../../../../../app/redux/actions/actionTypes'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import Loader from '../../../../../app/shared/Loader'
import './Question.scss'

export default function Question() {
  const {campaignDetails, questionDetails, userDetails} = useAppSelector(
    (state) => state.userReducer
  )
  const {currentUser} = useAuth()
  const navigate = useNavigate()
  console.log('🚀 ~ file: Question.tsx ~ line 18 ~ Question ~ currentUser', currentUser)

  console.log('🚀 ~ file: Question.tsx ~ line 15 ~ Question ~ campaignDetails', campaignDetails)
  console.log('🚀 ~ file: Question.tsx ~ line 15 ~ Question ~ userDetails', userDetails)
  console.log('🚀 ~ file: Question.tsx ~ line 14 ~ Question ~ questionDetails', questionDetails)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState<any>({})

  useEffect(() => {
    if (campaignDetails?._id) {
      setLoading(true)
      getQuestion(campaignDetails?._id)
        .then((resp) => {
          dispatch({
            type: TRIGGER_START_TIME,
            startTime: new Date().getTime(),
          })
          setLoading(false)
          dispatch({
            type: TRIGGER_QUESTION_DETAILS,
            questionDetails: resp.data.data[0],
          })
          setQuestion(resp.data.data[0])
          console.log('🚀 ~ file: CampaignDetailsWrapper.tsx ~ line 34 ~ .then ~ resp', resp)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      navigate('/error')
    }
  }, [])

  const selectAnswer = (item) => {
    setAnswer(item)
    dispatch({
      type: TRIGGER_END_TIME,
      endTime: new Date().getTime(),
    })
  }

  const submitAnswer = () => {
    if (answer) {
      navigate('/user-details')
      dispatch({
        type: TRIGGER_ANSWER_DETAILS,
        answerDetails: answer,
      })
    }
  }

  return (
    <div className='question-wrapper'>
      <Row className='justify-content-center'>
        <Col xxl={5} xl={5} lg={6} md={8} sm={8} col={10}>
          <div className='main-div'>
            <div className='gift-outer-div'>
              {loading ? (
                <Loader size='10px' />
              ) : (
                <>
                  <div className='gift-wrapper'>
                    <img
                      alt='logo'
                      className='logo'
                      src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/gift_box.png'
                    />
                  </div>
                  <div className='sub-div'>
                    <div className='heading'>Your Special Rewards Has Been Unblocked !</div>
                    <p>Answer the question below to continue</p>
                    <div className='question'>{question?.question}</div>
                    <Row className='gx-10'>
                      {question?.options?.map((item, i) => {
                        return (
                          <Col sm={6} key={i}>
                            <div
                              className={clsx('answer-div ', answer === item && 'active')}
                              onClick={() => selectAnswer(item)}
                            >
                              {item}
                            </div>
                          </Col>
                        )
                      })}
                    </Row>

                    <button
                      className='btn btn-primary btn-block w-100 my-10'
                      type='submit'
                      disabled={answer === ''}
                      onClick={() => submitAnswer()}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className='banner-div'>
              {campaignDetails?.banner1_url && (
                <div
                  className='banner1'
                  style={{
                    backgroundImage: `url(${campaignDetails?.banner1_url})`,
                  }}
                ></div>
              )}

              {campaignDetails?.banner2_url && (
                <div
                  className='banner2'
                  style={{
                    backgroundImage: `url(${campaignDetails?.banner2_url})`,
                  }}
                ></div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
