import React, {Component, useEffect, useState} from 'react'
import CSS from 'csstype'
import './SpinTheWheel.scss'
import {getToken, updateCount} from '../../../../../../../app/modules/auth/core/_requests'
import {ToastContainer} from 'react-toastify'
import {ToastMessage} from '../../../../../../../app/shared/ToastMessage'

export const crackers = [
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/rocket_blue.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker1.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker2.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker1.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/rocket_red.png',
  'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker2.png',
]
// export const Delayed = ({children = null, waitBeforeShow = 500}) => {
//   const [isShown, setIsShown] = useState(false)

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShown(true)
//     }, waitBeforeShow)
//   }, [waitBeforeShow])

//   return isShown ? children : null
// }

export default class SpinTheWheel extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      selectedItem: null,
    }
    this.selectItem = this.selectItem.bind(this)
  }

  selectItem() {
    let selectedItem

    if (!this.state.selectedItem && !this.props.prizeIndex && this.props.prizeIndex !== 0) {
      const payload = {
        action: 'UPDATE_USER_PLAYEDGAME',
        user_id: this?.props.userDetails?._id,
        access_token: getToken(),
      }

      updateCount(this?.props.details?._id, payload)
      selectedItem = Math.floor(Math.random() * this.props.details?.winning_values.length)
      if (
        this.props.details.winning_values[selectedItem]['day_count'] >=
        this.props.details.winning_values[selectedItem]['max_perday']
      ) {
        let index = this.props.details.winning_values.findIndex(
          (item) => item['day_count'] <= item['max_perday']
        )
        selectedItem = index
      }

      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem)
      }

      this.setState({selectedItem})
    } else {
      ToastMessage('You have already played', 'error')
    }

    setTimeout(() => {
      if (selectedItem || selectedItem === 0) {
        this.props.setReward(selectedItem)
        updateCount(this?.props.details?._id, {
          action: 'UPDATE_CAMPAIGN_WINNINGVALUE',
          winninglabel_key: this.props.details.winning_values[selectedItem]['key'],
        })
      }
    }, 4000)
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
    const {details} = this.props

    const wheelVars = {
      '--nb-item': details?.winning_values?.length,
      '--selected-item': this.state.selectedItem,
      backgroundColor: details?.prop_color,
      borderColor: details?.prop_color,
    }

    const spinning = this.state.selectedItem !== null ? 'spinning' : ''

    return (
      <div className='user-panel'>
        <div
          className='wheel-container '
          style={{
            borderColor: details?.prop_color,
          }}
        >
          <div
            className={`wheel ${spinning}`}
            style={wheelVars as React.CSSProperties}
            onClick={this.selectItem}
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
                      color: details.forecolor,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
                {details.template === 'TEMPLATE_2' && (
                  <img
                    className='wheel-crackers'
                    style={{
                      paddingRight: index === 0 ? '10px' : '',
                      width: index === 4 || index === 0 ? '20px' : '',
                      height: index === 4 ? '60px' : '',
                    }}
                    src={crackers[index]}
                  />
                )}
              </div>
            ))}
          </div>
          {details.template === 'TEMPLATE_3' && (
            <img
              onClick={this.selectItem}
              className='light cursor-pointer'
              src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/light.png'
            />
          )}

          {details.template === 'TEMPLATE_1' ? (
            <div className='wheel-center' />
          ) : details.template === 'TEMPLATE_3' ? (
            <img
              className='cracker cursor-pointer'
              onClick={this.selectItem}
              src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/cracker.png'
            />
          ) : (
            <img
              className='lamp cursor-pointer'
              onClick={this.selectItem}
              src='https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/spin_the_wheel/lamp.png'
            />
          )}
        </div>

        <ToastContainer />
      </div>
    )
  }
}
