import React, {useState} from 'react'
import {Wheel} from './components/Roulette'
import {getRandomInt} from './utils'

const useStyles = () => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: '70%',
    border: '2px solid #000',
    fontSize: 30,
    textAlign: 'center',
    // backgroundColor: theme.palette.background.paper,
    // padding: theme.spacing(2, 4, 3),
  },
  wheelContainer: {
    width: '20em',
    height: '20em',
    margin: '0 auto',
    marginTop: '5em',
    position: 'relative',
  },
  button: {
    margin: '3em auto',
    display: 'block',
    width: '10rem',
    cursor: 'pointer',
  },
})

export default function Spin() {
  const classes = useStyles()
  const [couponNum, setCouponNum] = useState(1)
  const [mustSpin, setMustSpin] = useState(false)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    alert(mockData[couponNum])
  }

  const handleClose = () => {
    setOpen(false)
  }

  const mockData = {
    1: 'Get 50% off',
    2: 'Better Luck Next Time',
    3: 'Get free service',
    4: 'Get 10% off',
    5: 'Get 50% off',
    6: 'Get 60% off',
  }

  const onClick = () => {
    const newCouponNum = getRandomInt(1, 6)
    setCouponNum(newCouponNum)
    console.log(newCouponNum)
    console.log(couponNum)
    setMustSpin(true)
  }

  return (
    <div className='App'>
      <h1>Ruleta</h1>
      <div
        style={{
          width: '20em',
          height: '20em',
          margin: '0 auto',
          marginTop: '5em',
          position: 'relative',
        }}
      >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={couponNum}
          onStopSpinning={() => {
            setMustSpin(false)
            handleOpen()
          }}
        />
      </div>
      <img
        src='https://github.com/weibenfalk/wheel-of-fortune-part2/blob/main/vanilla-js-wheel-of-fortune-part2-FINISHED/button.png?raw=true'
        // className={classes.button}
        alt='button'
        onClick={() => onClick()}
      />
    </div>
  )
}
