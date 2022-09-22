import React, {Component, useEffect, useState} from 'react'
import CSS from 'csstype'

import './SpinningWheel.css'
import {crackers} from '../user/campaigns/campaign-types/SpinTheWheel/SpinTheWheel'

export const Delayed = ({children = null, waitBeforeShow = 500}) => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsShown(true)
    }, waitBeforeShow)
  }, [waitBeforeShow])

  return isShown ? children : null
}

export default class Wheel extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      selectedItem: null,
    }
    this.selectItem = this.selectItem.bind(this)
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length)
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem)
      }
      this.setState({selectedItem})
    } else {
      this.setState({selectedItem: null})
      setTimeout(this.selectItem, 500)
    }
  }
  h1Styles: CSS.Properties = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    position: 'absolute',
    right: 0,
    bottom: '2rem',
    padding: '0.5rem',
    fontFamily: 'sans-serif',
    fontSize: '1.5rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  }
  render() {
    const {textColor, backgroundColor, selectedItem, items, type} = this.props

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
    }

    const itemStyle = {}
    const spinning = selectedItem !== null ? 'spinning' : ''
    const run = selectedItem !== null ? true : false
    const style = {'--item-nb': 10} as React.CSSProperties

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* {run && (
          <Delayed waitBeforeShow={4000}>
            <ConfettiExplosion duration={5000} particleCount={200} />
          </Delayed>
        )} */}
        <div className='wheel-container' style={{borderColor: backgroundColor}}>
          <div
            className={`wheel ${spinning}`}
            style={wheelVars as React.CSSProperties}

            // onClick={this.selectItem}
          >
            {items.map((item: any, index: any) => (
              <div
                className='wheel-item'
                key={index}
                style={{'--item-nb': index} as React.CSSProperties}
              >
                <div className='wheel-text'>
                  <div
                    style={{
                      color: textColor,
                    }}
                  >
                    {item}
                  </div>
                </div>
                {type === 'TEMPLATE_2' && (
                  <img
                    className='wheel-crackers'
                    style={{paddingRight: index === 0 ? '10px' : ''}}
                    src={crackers[index]}
                  />
                )}
              </div>
            ))}
          </div>
          {type === 'TEMPLATE_3' && (
            <img
              className='light'
              src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/light.png'
            />
          )}

          {type === 'TEMPLATE_1' ? (
            <div className='wheel-center' />
          ) : type === 'TEMPLATE_3' ? (
            <img
              className='cracker'
              src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker.png'
            />
          ) : (
            <img
              className='lamp'
              src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/lamp.png'
            />
          )}
        </div>
      </div>
    )
  }
}
