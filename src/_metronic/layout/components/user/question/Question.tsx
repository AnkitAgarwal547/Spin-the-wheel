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
  TRIGGER_IS_ANSWER_CORRECT,
} from '../../../../../app/redux/actions/actionTypes'
import {useAppDispatch, useAppSelector} from '../../../../../app/redux/hooks/hooks'
import Loader from '../../../../../app/shared/Loader'
import {Footer} from '../../Footer'
import './Question.scss'

export default function Question() {
  const {
    campaignDetails,
    questionDetails,
    userDetails,
    prizeIndex,
    answerDetails,
    isAnswerCorrect,
  } = useAppSelector((state) => state.userReducer)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState<any>(questionDetails)

  useEffect(() => {
    if (campaignDetails?._id && (questionDetails === '' || !questionDetails)) {
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
          dispatch({
            type: TRIGGER_END_TIME,
            endTime: '',
          })

          dispatch({
            type: TRIGGER_ANSWER_DETAILS,
            answerDetails: '',
          })
          setQuestion(resp.data.data[0])
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      // navigate('/error')
    }
  }, [])

  const selectAnswer = (item, index) => {
    if (!answerDetails) {
      // setAnswer(item)
      dispatch({
        type: TRIGGER_END_TIME,
        endTime: new Date().getTime(),
      })

      dispatch({
        type: TRIGGER_ANSWER_DETAILS,
        answerDetails: item,
      })

      let i = questionDetails['options']?.findIndex((el) => el === item)
      if (i !== -1) {
        if (Number(questionDetails.answer) !== index + 1) {
          dispatch({
            type: TRIGGER_IS_ANSWER_CORRECT,
            isAnswerCorrect: false,
          })
          return 'active'
        } else {
          dispatch({
            type: TRIGGER_IS_ANSWER_CORRECT,
            isAnswerCorrect: true,
          })
          return 'wrong-anwer'
        }
      }
    }
  }

  const submitAnswer = () => {
    if (answerDetails) {
      navigate('/user-details')
    }
  }

  const checkIfAnswerIsCorrect = (index) => {
    if (answerDetails) {
      if (Number(questionDetails.answer) - 1 == index) {
        return true
      } else {
        return false
      }
    }
  }

  return (
    <div
      className='question-wrapper'
      style={{
        backgroundImage: !campaignDetails?.frontend_img
          ? `url(
              'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/background.png'
            )`
          : `url(${campaignDetails?.frontend_img})`,
      }}
    >
      <Row className='justify-content-center'>
        <Col xxl={5} xl={5} lg={6} md={8} sm={8} col={10}>
          <div className='main-div'>
            {/* {loading && <Loader size='10px' className='center' />} */}
            {loading ? (
              <Loader size='10px' className='center' />
            ) : (
              <>
                <div className='gift-outer-div'>
                  <div className='gift-wrapper'>
                    <img
                      alt='logo'
                      className='logo'
                      src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/gift_box.png'
                    />
                  </div>
                  <div className='postion-relative'>
                    <div className='sub-div'>
                      <div className='heading'>
                        Congratulations you have been rewarded with special Gift Voucher
                      </div>
                      <div>
                        <h2 className='text-center text-primary my-3'>
                          {campaignDetails?.winning_values[prizeIndex]['key'] ===
                            'getfreeservice' && 'You got free service'}
                          {campaignDetails?.winning_values[prizeIndex]['key'].replace(/\D/g, '') &&
                            'You got ' +
                              campaignDetails?.winning_values[prizeIndex]['key'].replace(
                                /\D/g,
                                ''
                              ) +
                              '% off'}

                          {campaignDetails?.winning_values[prizeIndex]['key'] ===
                            'betterlucknexttime' && 'Oops Please try your luck again'}
                        </h2>
                        {/* {answer}
                      <br /> */}
                        {answerDetails &&
                        questionDetails?.options?.findIndex((item) => item === answerDetails) + 1 !=
                          questionDetails?.answer ? (
                          <h4 className='text-center  my-3'>
                            Oops you missed the chance this time, play again
                          </h4>
                        ) : (
                          ''
                        )}
                        {/* {isAnswerCorrect && answer && (
                        <h4 className='text-center  my-3'>
                          Oops you missed the chance this time, play again
                        </h4>
                      )} */}
                      </div>

                      <p>Please answer the below question to get the voucher code</p>
                      <div className='question'>{question?.question}</div>
                      <Row className='gx-10'>
                        {question?.options?.map((item, i) => {
                          return (
                            <Col sm={6} key={i}>
                              {/* {i} {Number(questionDetails.answer) + 'sjgdjs'} */}
                              {/* {answer} */}

                              <div
                                className={clsx(
                                  'answer-div ',
                                  answerDetails ? (checkIfAnswerIsCorrect(i) ? 'active' : '') : ''
                                )}
                                onClick={() => selectAnswer(item, i)}
                                style={{
                                  backgroundColor:
                                    answerDetails == item && !isAnswerCorrect ? 'red' : '',
                                  color: answerDetails == item && !isAnswerCorrect ? 'white' : '',
                                  fontWeight:
                                    answerDetails == item && !isAnswerCorrect ? '600' : '',
                                }}
                                // style={{
                                //   backgroundColor:
                                //     (answer === 0 && Number(questionDetails.answer) == i) ||
                                //     (answer && Number(questionDetails.answer) == i)
                                //       ? 'active'
                                //       : 'red',
                                //   color:
                                //     answer && Number(questionDetails.answer) - 1 == i ? 'white' : '',
                                // }}
                              >
                                {item}
                              </div>
                            </Col>
                          )
                        })}
                      </Row>

                      <button
                        className='btn btn-primary btn-block w-100 mt-10'
                        type='submit'
                        disabled={answerDetails === ''}
                        onClick={() => submitAnswer()}
                      >
                        Next
                      </button>

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
                  </div>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
      <Footer />
    </div>
  )
}
