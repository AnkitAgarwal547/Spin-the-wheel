import React, {Component, useEffect, useState} from 'react'
import CSS from 'csstype'
import './SpinTheWheel.scss'

export const crackers = [
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/rocket_blue.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker1.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker2.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker3.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/rocket_red.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker4.png',
]
export const Delayed = ({children = null, waitBeforeShow = 500}) => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsShown(true)
    }, waitBeforeShow)
  }, [waitBeforeShow])

  return isShown ? children : null
}

export default class SpinTheWheel extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      selectedItem: null,
    }
    // this.selectItem = this.selectItem.bind(this)
  }

  // selectItem() {
  //   if (this.state.selectedItem === null) {
  //     const selectedItem = Math.floor(Math.random() * this.props.items.length)
  //     if (this.props.onSelectItem) {
  //       this.props.onSelectItem(selectedItem)
  //     }
  //     this.setState({selectedItem})
  //   } else {
  //     this.setState({selectedItem: null})
  //     setTimeout(this.selectItem, 500)
  //   }
  // }
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
    const {textColor, backgroundColor, selectedItem, items, details} = this.props
    console.log('🚀 ~ file: SpinTheWheel.tsx ~ line 58 ~ SpinTheWheel ~ render ~ details', details)

    const wheelVars = {
      '--nb-item': details?.winning_values?.length,
      '--selected-item': selectedItem,
      backgroundColor: details?.prop_color?.length ? details?.prop_color[0] : details?.prop_color,
      borderColor: details?.prop_color?.length ? details?.prop_color[0] : details?.prop_color,
    }

    const itemStyle = {}
    const spinning = selectedItem !== null ? 'spinning' : ''
    const run = selectedItem !== null ? true : false
    const style = {'--item-nb': 10} as React.CSSProperties

    return (
      <div
        className='wheel-container'
        style={{
          borderColor: details?.prop_color?.length ? details?.prop_color[0] : details?.prop_color,
        }}
      >
        <div
          className={`wheel ${spinning}`}
          style={wheelVars as React.CSSProperties}

          // onClick={this.selectItem}
        >
          {details?.winning_values?.map((item: any, index: any) => (
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
                  {item.label}
                </div>
              </div>
              {details.template === 'TEMPLATE_2' && (
                <img
                  className='wheel-crackers'
                  style={{paddingRight: index === 0 ? '10px' : ''}}
                  src={crackers[index]}
                />
              )}
            </div>
          ))}
        </div>
        {details.template === 'TEMPLATE_3' && (
          <img
            className='light'
            src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/light.png'
          />
        )}

        {details.template === 'TEMPLATE_1' ? (
          <div className='wheel-center' />
        ) : details.template === 'TEMPLATE_3' ? (
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
    )
  }
}
