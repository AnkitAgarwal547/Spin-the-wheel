import React, {useEffect, useRef} from 'react'
import './ScratchCard.scss'
import ScratchCard from 'react-scratchcard-v4'

export default function ScratchCardWrapper({image}) {
  console.log('🚀 ~ file: ScratchCard.tsx ~ line 6 ~ ScratchCard ~ image', image)
  const ref = useRef<ScratchCard>(null)

  useEffect(() => {
    ref.current && ref.current.reset()
  }, [image])

  const settings = {
    width: 120,
    height: 120,
    finishPercent: 90,
    onComplete: () => console.log('The card is now clear!'),
    image:
      'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/scratch_the_card/general-scratch-card.png',
  }

  return (
    <div>
      <ScratchCard {...settings}>Congratulations! You WON!</ScratchCard>
      {/* <ScratchMe
        width={400}
        height={300}
        foregroundImageSrc={image}
        backgroundImageSrc={<p>hello</p>}
        strokeWidth={20}
        onProgress={(percent) => console.log(`${percent}% cleared`)}
        onCompleted={() => console.log(`Scratch Card Completed!`)}
        completedAt={30}
      /> */}
    </div>
  )
}
