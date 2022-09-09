/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import {useForm} from 'react-hook-form'

import FileUpload from '../../../../_metronic/layout/components/fileupload/FileUpload'
import ScratchCardWrapper from '../../../../_metronic/layout/components/scratchCard/ScratchCard'
import SpinningWheel from '../../../../_metronic/layout/components/SpinningWheel/SpinningWheel'
import './NewCampaign.scss'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'

type Props = {}

const NewCampaign: React.FC<Props> = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm()

  const formFields = {
    TYPE: 'type',
    START_DATE: 'start_date',
    END_DATE: 'end_date',
    TITLE: 'title',
    COMPANY_NAME: 'company_name',
    DIFFICULTY: 'difficulty',
    MAX_WINNER_PERDAY: 'max_winner_perday',
    LOGO: 'logo',
    BANNER1: 'banner_1',
    BANNER2: 'banner_2',
    BACKGROUND_COLOR: 'background_color',
    FOREGROUND_COLOR: 'foreground_color',
    TEMPLATE_ID: '',
    ATTEMPT_COUNT: '',
    CLICK_COUNT: '',
  }
  const schema = yup
    .object({
      [formFields.COMPANY_NAME]: yup.number().positive().integer().required(),
      [formFields.DIFFICULTY]: yup.number().positive().integer().required(),
      [formFields.START_DATE]: yup.number().positive().integer().required(),
      [formFields.END_DATE]: yup.number().positive().integer().required(),
    })
    .required()
  const [campaign, setTypeOfCampaign] = useState('wheel')
  const places = [
    'Get 50% off',
    'Better Luck Next Time',
    'Get free service',
    'Get 10% off',
    'Get 50% off',
    'Get 60% off',
  ]

  const [logoOfCampaign, setLogoOfCampaign] = useState({
    details: null,
    path: '',
  })
  const [banner1, setBanner1] = useState({
    details: null,
    path: '',
  })
  const [banner2, setBanner2] = useState({
    details: null,
    path: '',
  })
  const onSubmit = (data) => {
    console.log('data', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register(formFields.COMPANY_NAME)}
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
                      {logoOfCampaign.path ? (
                        <img className='logo my-6' src={logoOfCampaign.path} />
                      ) : (
                        <img
                          className='logo my-6'
                          src={toAbsoluteUrl('/media/icons/logo_placeholder.png')}
                        />
                      )}
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
                      <div className='card-body p-0'>
                        {banner1.path ? (
                          <img width='100%' height='100%' src={banner1.path} />
                        ) : (
                          'Banner 1.'
                        )}
                      </div>
                    </div>

                    <div className='card mb-5 p-0'>
                      <div className='card-body p-0'>
                        {banner1.path ? (
                          <img width='100%' height='100%' src={banner2.path} />
                        ) : (
                          'Banner 2.'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xxl-8 col-xl-8 col-lg-10 col-md-8 col-sm-12'>
              <div className='row'>
                <div className='col-xxl-3 col-lg-4 col-md-4 col-sm-4 col-4'>
                  <div className='form-label fw-bold mb-5'> Logo of campaign</div>
                  <FileUpload fileData={logoOfCampaign} setFileData={setLogoOfCampaign} />
                </div>
                <div className='col-xxl-3 offset-xxl-1 col-lg-4 col-md-4 col-sm-4 col-4'>
                  <div className='form-label fw-bold mb-5'>Banner 1</div>
                  <FileUpload fileData={banner1} setFileData={setBanner1} />
                </div>{' '}
                <div className='col-xxl-3 offset-xxl-1 col-lg-4 col-md-4 col-sm-4 col-4'>
                  <div className='form-label fw-bold mb-5'>Banner 2 </div>
                  <FileUpload fileData={banner2} setFileData={setBanner2} />
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

            <>
              <div className='col-xxl-12 my-5'>
                <label htmlFor='exampleFormControlInput1' className='form-label fw-bold mb-5'>
                  {campaign === 'wheel' && 'Wheel '}{' '}
                  {campaign === 'scratch-card' && 'Scratch Card '}
                  {campaign === 'pick-the-box' && 'Box '}
                  Winnings Values
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
                </div>
                {campaign !== 'scratch-card' && (
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
                  </div>
                )}
                {campaign !== 'scratch-card' && campaign !== 'pick-the-box' && (
                  <>
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
                    {campaign == 'wheel' && (
                      <div className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'>
                        <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                          <div className='fw-bold px-3'>6.</div>
                          <input
                            type='text'
                            className='form-control'
                            id='exampleFormControlInput1'
                          />
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
                    )}
                  </>
                )}
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
              <Button variant='dark' type='submit' size='sm'>
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export {NewCampaign}
