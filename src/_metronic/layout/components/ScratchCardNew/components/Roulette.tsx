import React, {useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../helpers'
import {getRotationDegrees} from '../utils'
import {RotationContainer} from './styles'

const STARTED_SPINNING = 'started-spinning'
const START_SPINNING_TIME = 800
const CONTINUE_SPINNING_TIME = 400
const STOP_SPINNING_TIME = 4000

export const Wheel = ({mustStartSpinning, prizeNumber, onStopSpinning}) => {
  const [startRotationDegrees, setStartRotationDegrees] = useState(0)
  const [finalRotationDegrees, setFinalRotationDegrees] = useState(0)
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false)
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false)
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState(false)
  const mustStopSpinning = useRef(false)

  const startSpinning = () => {
    setHasStartedSpinning(true)
    setHasStoppedSpinning(false)
    mustStopSpinning.current = true
    setTimeout(() => {
      if (mustStopSpinning.current) {
        mustStopSpinning.current = false
        setHasStartedSpinning(false)
        setHasStoppedSpinning(true)
        onStopSpinning()
      }
    }, START_SPINNING_TIME + CONTINUE_SPINNING_TIME + STOP_SPINNING_TIME - 100)
  }

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true)
      startSpinning()
      const finalRotationDegreesCalculated = getRotationDegrees(prizeNumber, 6)
      setFinalRotationDegrees(finalRotationDegreesCalculated)
    }
  }, [mustStartSpinning])

  useEffect(() => {
    if (hasStoppedSpinning) {
      setIsCurrentlySpinning(false)
      setStartRotationDegrees(finalRotationDegrees)
    }
  }, [hasStoppedSpinning])

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING
    }
    return ''
  }

  return (
    <>
      <RotationContainer
        className={getRouletteClass()}
        startSpinningTime={START_SPINNING_TIME}
        continueSpinningTime={CONTINUE_SPINNING_TIME}
        stopSpinningTime={STOP_SPINNING_TIME}
        startRotationDegrees={startRotationDegrees}
        finalRotationDegrees={finalRotationDegrees}
      >
        <img
          src={toAbsoluteUrl('/media/spin-wheel/wheel.png')}
          alt='wheel'
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            //transform: `rotate(22.5deg)`
          }}
        />
      </RotationContainer>
      <img
        src='assets/marker.png'
        alt='marker'
        style={{
          position: 'absolute',
          width: '3em',
          left: '6.5em',
          top: '-1em',
          zIndex: 2,
        }}
      />
    </>
  )
}
