/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import FileUpload from '../../../../_metronic/layout/components/fileupload/FileUpload'
import ScratchCardWrapper from '../../../../_metronic/layout/components/scratchCard/ScratchCard'
import SpinningWheel from '../../../../_metronic/layout/components/SpinningWheel/SpinningWheel'
import './NewCampaign.scss'

type Props = {}

const NewCampaign: React.FC<Props> = () => {
  const [campaign, setTypeOfCampaign] = useState('wheel')
  const places = [
    'Get 50% off',
    'Better Luck Next Time',
    'Get free service',
    'Get 10% off',
    'Get 50% off',
    'Get 60% off',
  ]

  return (
    <div>
      <div className='card-body new-campaign'>
        <h1 className=''>New Campaign</h1>
        <hr />
        <div className='row mt-3'>
          <div className='col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6  col-sm-6 col-12'>
            <div className='mb-10'>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Campaign Company
              </label>
              <input
                type='text'
                className='form-control'
                id='exampleFormControlInput1'
                placeholder='Name'
              />
            </div>

            <div className='mb-10'>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Title of Campaign
              </label>
              <input
                type='text'
                className='form-control'
                id='exampleFormControlInput1'
                placeholder='Name'
              />
            </div>

            <div className='mb-10'>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Select Bumpur Prize for the campaign
              </label>
              <select
                className='form-select'
                aria-label='Default select example'
                placeholder='Spin the Wheel'
              >
                <option selected>Spin the Wheel</option>
                <option value='1'>One</option>
                <option value='2'>Two</option>
                <option value='3'>Three</option>
              </select>
            </div>

            <div className='mb-10'>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Select Type of the campaign
              </label>

              <select
                className='form-select'
                aria-label='Default select example'
                placeholder='Spin the Wheel'
                onChange={(e) => setTypeOfCampaign(e.target.value)}
                value={campaign}
              >
                <option value='wheel'>Spin the wheel</option>
                <option value='scratch-card'>Scratch Card</option>
                <option value='pick-the-box'>Pick the box</option>
              </select>
            </div>

            <div className='mb-10'>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Number of Spins per user per day
              </label>
              <input type='number' className='form-control' id='exampleFormControlInput1' />
            </div>
            <div>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Dates
              </label>
              <div className='row mb-10'>
                <div className='col-xxl-6 col-lg-12 gy-lg-5 gy-md-5 gy-sm-5 gy-5 col-md-12'>
                  <input type='date' className='form-control' id='exampleFormControlInput1' />
                </div>
                <div className='col-xxl-6 col-lg-12 gy-lg-5 gy-md-5 gy-sm-5 gy-5  col-md-12'>
                  <input type='date' className='form-control' id='exampleFormControlInput1' />
                </div>
              </div>
            </div>
          </div>

          <div className='col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6 offset-xxl-2 col-12'>
            <div className='mb-10'>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Select Template
              </label>
              <select
                className='form-select'
                aria-label='Default select example'
                placeholder='Spin the Wheel'
              >
                <option selected>Template 3</option>
                <option value='1'>One</option>
                <option value='2'>Two</option>
                <option value='3'>Three</option>
              </select>
            </div>
            <div className='mb-10'>
              <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                Check Campaign Preview
              </label>
              <div className='campaign-outer-div text-center row'>
                <div className='col-xxl-8 col-xl-8 col-lg-10 col-md-10 offset-md-1 offset-lg-1 col-xl-2 offset-xxl-2'>
                  <div>
                    <img
                      className='logo my-6'
                      src='data:image/png;base64,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'
                    />
                  </div>

                  <h6 className='text-light mb-9'>
                    {campaign === 'scratch-card'
                      ? 'Scratch the Card'
                      : campaign === 'wheel'
                      ? 'Spin the Wheel'
                      : 'Choose the Box'}
                  </h6>
                  {campaign === 'scratch-card' ? (
                    <ScratchCardWrapper />
                  ) : campaign === 'wheel' ? (
                    <p>
                      <SpinningWheel items={places} />
                    </p>
                  ) : (
                    <p>Show box</p>
                  )}
                  <Button size='sm' variant='light' className='my-5 claim-prize-btn'>
                    Claim your Prize
                  </Button>

                  <div className='card mb-5 p-0'>
                    <div className='card-body'>Banner 1.</div>
                  </div>

                  <div className='card mb-5 p-0'>
                    <div className='card-body'>Banner 2.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-12'>
            <div className='row'>
              <div className='col-xxl-3 col-lg-4 col-md-4 col-sm-4 col-4'>
                <div className='form-label fw-bold mb-5'> Logo of campaign</div>
                <FileUpload />
              </div>
              <div className='col-xxl-3 offset-xxl-1 col-lg-4 col-md-4 col-sm-4 col-4'>
                <div className='form-label fw-bold mb-5'>Banner 1</div>
                <FileUpload />
              </div>{' '}
              <div className='col-xxl-3 offset-xxl-1 col-lg-4 col-md-4 col-sm-4 col-4'>
                <div className='form-label fw-bold mb-5'>Banner 2 </div>
                <FileUpload />
              </div>
            </div>
          </div>
          <div className='col-xxl-8 col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12 row mt-10'>
            <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 row align-items-center'>
              <div className='col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8'>
                <label className='form-label fw-bold'>Change Background Color</label>
              </div>
              <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4'>
                <input type='color' />
              </div>
            </div>
            <div className='col-xxl-6 col-xl-6 col-md-6 col-lg-6 col-sm-6 col-12 row align-items-center'>
              <div className='col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8'>
                <label className='form-label fw-bold'>Change Font Color</label>
              </div>
              <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4'>
                <input type='color' />
              </div>
            </div>
          </div>

          {campaign === 'scratch-card' && (
            <>
              <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-10'>
                <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                  Add Scratch Card Winnings
                </label>
                <input className='form-control' placeholder='Add' id='floatingTextarea' />
              </div>
            </>
          )}

          {campaign === 'wheel' && (
            <>
              <div className='col-xxl-12 my-5'>
                <label htmlFor='exampleFormControlInput1' className='form-label fw-bold mb-5'>
                  Spin Wheel Winnings Values
                </label>
                <div className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'>
                  <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                    <div className='fw-bold px-3'>1.</div>
                    <input type='text' className='form-control' id='exampleFormControlInput1' />
                  </div>
                  <div className='col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6'>
                    <div className='input-group mb-3'>
                      <input type='text' className='form-control' />
                      <div className='input-group-append'>
                        <span className='input-group-text' id='basic-addon2'>
                          times/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'>
                  <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                    <div className='fw-bold px-3'>2.</div>
                    <input type='text' className='form-control' id='exampleFormControlInput1' />
                  </div>
                  <div className='col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6 d-flex'>
                    <div className='input-group'>
                      <input type='text' className='form-control' />
                      <div className='input-group-append'>
                        <span className='input-group-text' id='basic-addon2'>
                          times/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'>
                  <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                    <div className='fw-bold px-3'>3.</div>
                    <input type='text' className='form-control' id='exampleFormControlInput1' />
                  </div>
                  <div className='col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6'>
                    <div className='input-group mb-3'>
                      <input type='text' className='form-control' />
                      <div className='input-group-append'>
                        <span className='input-group-text' id='basic-addon2'>
                          times/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'>
                  <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                    <div className='fw-bold px-3'>4.</div>
                    <input type='text' className='form-control' id='exampleFormControlInput1' />
                  </div>
                  <div className='col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6'>
                    <div className='input-group mb-3'>
                      <input type='text' className='form-control' />
                      <div className='input-group-append'>
                        <span className='input-group-text' id='basic-addon2'>
                          times/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'>
                  <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                    <div className='fw-bold px-3'>5.</div>
                    <input type='text' className='form-control' id='exampleFormControlInput1' />
                  </div>
                  <div className='col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6'>
                    <div className='input-group mb-3'>
                      <input type='text' className='form-control' />
                      <div className='input-group-append'>
                        <span className='input-group-text' id='basic-addon2'>
                          times/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                <div className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'>
                  <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                    <div className='fw-bold px-3'>6.</div>
                    <input type='text' className='form-control' id='exampleFormControlInput1' />
                  </div>
                  <div className='col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6'>
                    <div className='input-group mb-3'>
                      <input type='text' className='form-control' />
                      <div className='input-group-append'>
                        <span className='input-group-text' id='basic-addon2'>
                          times/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-xxl-12 col-xl-12 col-md-12 col-lg-12 col-sm-12 col-12'>
                <div className='col-xxl-3 col-xl-3 col-md-6 col-lg-4 col-sm-6 col-6'>
                  <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                    Difficulty Level
                  </label>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    placeholder='Spin the Wheel'
                  >
                    <option selected>Choose</option>
                    <option value='1'>One</option>
                    <option value='2'>Two</option>
                    <option value='3'>Three</option>
                  </select>
                </div>

                <div className='col-xxl-7 col-xl-7 col-md-7 col-lg-10 col-sm-7 col-7 mt-10'>
                  <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                    Terms & Conditions
                  </label>
                  <textarea
                    className='form-control'
                    placeholder='Leave a comment here'
                    id='floatingTextarea'
                    rows={5}
                  ></textarea>
                </div>
              </div>
            </>
          )}
          {campaign === 'pick-the-box' && (
            <>
              <div className='col-xxl-12 mt-10'>
                <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                  Box Winnings
                </label>
              </div>

              <div className='col-xxl-8 mt-10 row'>
                <div className='col-xxl-4'>
                  <div className='d-flex align-items-center'>
                    <div className='px-3 fw-bold'>1.</div>
                    <div>
                      <input className='form-control' placeholder='Add' id='floatingTextarea' />
                    </div>
                  </div>
                </div>{' '}
                <div className='col-xxl-4  col-xl-4 col-lg-4 col-md-4'>
                  <div className='d-flex align-items-center'>
                    <div className='px-3 fw-bold'>2.</div>
                    <div>
                      <input className='form-control' placeholder='Add' id='floatingTextarea' />
                    </div>
                  </div>
                </div>
                <div className='col-xxl-4  col-xl-4 col-lg-4 col-md-4'>
                  <div className='d-flex align-items-center'>
                    <div className='px-3 fw-bold'>3.</div>
                    <div>
                      <input className='form-control' placeholder='Add' id='floatingTextarea' />
                    </div>
                  </div>
                </div>
                <div className='col-xxl-4 gy-xxl-3 gy-xl-3  col-xl-4 col-lg-4 col-md-4'>
                  <div className='d-flex align-items-center'>
                    <div className='px-3 fw-bold'>4.</div>
                    <div>
                      <input className='form-control' placeholder='Add' id='floatingTextarea' />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='row my-10'>
          <div className='col-xxl-1 col-xl-1 col-lg-2 col-md-2 col-3'>
            <Button variant='outline-dark' size='sm'>
              Cancel
            </Button>{' '}
          </div>
          <div className='col-xxl-1 col-xl-1 col-lg-2 col-md-2 col-3'>
            <Button variant='dark' size='sm'>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export {NewCampaign}
