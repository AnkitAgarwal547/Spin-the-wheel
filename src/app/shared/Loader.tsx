import React from 'react'
import {Loading} from 'react-loading-dot/lib'
type Props = {
  size?: string
  background?: string
  className?: string
}

const Loader: React.FC<Props> = ({size, background = '#303030', className = 'center'}) => {
  return (
    <div className={className}>
      <Loading size={size} background={background} margin='5px' />
    </div>
  )
}

export default Loader
