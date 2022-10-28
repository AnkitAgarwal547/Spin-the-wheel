import clsx from 'clsx'
import React, {useEffect, useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import {useDispatch} from 'react-redux'

import './PickTheBox.scss'

export const boxesList = [
  {
    img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/gift_box.png',
  },
  {
    img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/gift_box.png',
  },
  {
    img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/gift_box.png',
  },
  {
    img: 'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/gift_box.png',
  },
]
export default function PickTheBox({img}) {
  const dispatch = useDispatch()

  const [boxList, setBoxList] = useState(boxesList)

  useEffect(() => {
    let list = [...boxList]
    if (img) {
      list.map((item) => {
        return (item.img = img)
      })
      setBoxList(list)
    } else {
      setBoxList(boxesList)
    }

  }, [img])

  return (
    <div className='pick-the-box'>
      <div className='sub-div text-center my-5'>
        <Row gx={5} gy={5}>
          {boxList.map((item, i) => {
            return (
              <Col
                xxl={6}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                col={3}
                key={i}
                className={clsx(
                  'position-relative ',
                  {'border-start': i == 1 || i == 3},
                  {
                    'border-top': i == 3 || i == 2,
                  }
                )}
              >
                <div className='position-relative'>
                  <div
                    className='box-div'
                    style={{
                      marginTop: i == 2 || i == 3 ? '10px' : '',
                    }}
                  >
                    <img
                      className='p-3 box-img'
                      width={'100px'}
                      src={item.img}
                      onClick={() => {}}
                    ></img>
                    <div
                      className='text-dark index'
                      style={{
                        right: i == 1 || i == 3 ? '0%' : '',
                      }}
                    >
                      <div className='index-text center'>{i + 1}</div>
                    </div>
                  </div>
                </div>
                {/* )} */}
              </Col>
            )
          })}
        </Row>
      </div>
    </div>
  )
}
