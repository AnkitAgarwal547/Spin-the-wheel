import React, {useEffect, useRef} from 'react'
import './ScratchCard.scss'
import ScratchCard from 'react-scratchcard-v2'

export default function ScratchCardWrapper({image}) {
  const ref = useRef<ScratchCard>(null)

  useEffect(() => {
    ref.current && ref.current.reset()
  }, [image])

  const settings = {
    width: 120,
    height: 120,
    finishPercent: 90,
    onComplete: () => console.log('The card is now clear!'),
  }

  return (
    <div>
      <ScratchCard {...settings} image={image} ref={ref}>
        Congratulations! You WON!
      </ScratchCard>
    </div>
  )
}
