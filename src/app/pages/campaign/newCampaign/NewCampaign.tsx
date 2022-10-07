/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import {Button, Form} from 'react-bootstrap'
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import FileUpload from '../../../../_metronic/layout/components/fileupload/FileUpload'
import ScratchCardWrapper from '../../../../_metronic/layout/components/scratchCard/ScratchCard'
import SpinningWheel from '../../../../_metronic/layout/components/SpinningWheel/SpinningWheel'
import './NewCampaign.scss'
import * as yup from 'yup'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {
  getUploadUrl,
  postCampaign,
  postRequest,
  putCampaign,
  uploadFile,
} from '../../../modules/auth/core/_requests'
import {Field, FieldArray, Formik, useFormik, useFormikContext} from 'formik'
import {ToastMessage} from '../../../shared/ToastMessage'
import clsx from 'clsx'
import DatePicker from 'react-datepicker'
import {getBase64} from '../../../utils/common'
import {typeOfCampaigns} from '../../../modules/campaign/CampaignTable'
import {ToastContainer} from 'react-toastify'
import moment from 'moment'
import axios from 'axios'
import {useLocation, useNavigate, useParams} from 'react-router'
import {Link} from 'react-router-dom'

type Props = {}

export const getThemeStyle = (type) => {
  let backgroundImage = ''
  let scratchCardImage
  let color = ''
  let buttonBackgroundColor = ''
  let pickTheBox =
    'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/box_group.png'
  switch (type) {
    case 'TEMPLATE_1':
      backgroundImage =
        'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/general.jpg'
      scratchCardImage = toAbsoluteUrl('/media/scratch-card/general-scratch-card.png')

      color = '#000000'
      buttonBackgroundColor = '#ffffff'

      break

    case 'TEMPLATE_2':
      backgroundImage =
        'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/festive.jpg'
      scratchCardImage = toAbsoluteUrl('/media/scratch-card/festive-scratch-card.png')

      color = '#000000'
      buttonBackgroundColor = '#ffffff'

      break
    case 'TEMPLATE_3':
      backgroundImage =
        'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/newyear.jpg'
      scratchCardImage = toAbsoluteUrl('/media/scratch-card/new-year-scratch-card.png')
      buttonBackgroundColor = '#1E7FC9'
      color = '#000000'
      break
    default:
      backgroundImage =
        'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/background_images/general.jpg'
      scratchCardImage = toAbsoluteUrl('/media/scratch-card/general-scratch-card.png')
      color = '#ffffff'
      buttonBackgroundColor = '#ffffff'
  }
  return {backgroundImage, color, scratchCardImage, buttonBackgroundColor, pickTheBox}
}

const NewCampaign: React.FC<Props> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {id} = useParams()
  const location = useLocation()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [campaignBackground, setCampaignBackground] = useState({
    details: {name: ''},
    path: '',
    binaryData: '',
  })

  const [campaignBgBinary, setCampaignBgBinary] = useState()
  const [logoBinary, setLogoBinary] = useState('')
  const [banner1Binary, setBanner1Binary] = useState('')
  const [banner2Binary, setBanner2Binary] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const formFields = {
    TYPE: 'type',
    START_DATE: 'start_date',
    END_DATE: 'end_date',
    TITLE: 'title',
    COMPANY_NAME: 'company_name',
    DIFFICULTY: 'difficulty',
    MAX_WINNER_PERDAY: 'max_winner_perday',
    LOGO: 'logo_url',
    BANNER1: 'banner1_url',
    BANNER2: 'banner2_url',
    BACKGROUND_IMAGE: 'backimg',
    FOREGROUND_COLOR: 'foreground_color',
    _ID: '_id',
    WHEEL_BACKGROUNDCOLOR: 'prop_color',
    MAX_PLAY_USER: 'maxplay_peruser_perday',
    TEMPLATE_TYPE: 'template',
    TERMS: 'tnc',
    FONT_COLOR: 'forecolor',
    WINNING_VALUES: 'winning_values',
    LABEL: 'label',
    MAX_PERDAY: 'max_perday',
  }

  const initialWinningValues = [
    {
      label: 'Better luck next time',
      max_perday: 70,
    },
    {
      label: 'Get 20% off',
      max_perday: 10,
    },
    {
      label: 'Get 10% off',
      max_perday: 5,
    },
    {
      label: 'Get 5% off',
      max_perday: 5,
    },

    {
      label: 'Get Free Service',
      max_perday: 5,
    },

    {
      label: 'Get 60% off',
      max_perday: 5,
    },
  ]

  const initialValues: any = {
    [formFields.COMPANY_NAME]: '',
    [formFields.DIFFICULTY]: '',
    [formFields.START_DATE]: new Date().getTime(),
    [formFields.END_DATE]: new Date().setDate(new Date().getDate() + 1),
    [formFields.TITLE]: '',
    [formFields.TYPE]: typeOfCampaigns.SPIN_THE_WHEEL,
    [formFields.MAX_PLAY_USER]: '',
    [formFields.TEMPLATE_TYPE]: 'TEMPLATE_1',
    [formFields.TERMS]: '',
    [formFields.FONT_COLOR]: getThemeStyle('TEMPLATE_1').color as string,
    [formFields.LOGO]: '',
    [formFields.WINNING_VALUES]: initialWinningValues,
    [formFields.WHEEL_BACKGROUNDCOLOR]: '#da3768',
  }

  const validationSchema = Yup.object().shape({
    [formFields.COMPANY_NAME]: Yup.string().required(),
    [formFields.DIFFICULTY]: Yup.string().required(),
    [formFields.START_DATE]: yup.string().required(),
    [formFields.END_DATE]: Yup.string().required(),
    [formFields.LOGO]: Yup.string().required(),
    [formFields.BANNER1]: Yup.string(),
    [formFields.BANNER2]: Yup.string(),
    [formFields.WHEEL_BACKGROUNDCOLOR]: Yup.string(),
    [formFields.TITLE]: Yup.string().required(),
    [formFields.TYPE]: Yup.string().required(),
    [formFields.TERMS]: Yup.string().required(),
    [formFields.MAX_PLAY_USER]: Yup.number().min(1).required(),
    [formFields.TEMPLATE_TYPE]: Yup.string().required(),
    [formFields.FONT_COLOR]: Yup.string(),
    [formFields.WINNING_VALUES]: Yup.array().of(
      Yup.object().shape({
        [formFields.MAX_PERDAY]: Yup.number().min(1).required(),
        [formFields.LABEL]: Yup.string().required(),
      })
    ),
  })

  const initialValueOfImages = {
    details: null,
    path: '',
    binaryData: '',
  }

  const [logoOfCampaign, setLogoOfCampaign] = useState(initialValueOfImages)
  const [banner1, setBanner1] = useState(initialValueOfImages)
  const [banner2, setBanner2] = useState(initialValueOfImages)
  const [initialData, setInitialData] = useState(initialValues)

  const getWinningValuesLabel = (values) => {
    return values.map((a) => a.label)
  }

  const getInitialWinningValues = (type) => {
    let updatedValues: any[] = [...initialWinningValues]
    switch (type) {
      case typeOfCampaigns.SCRATCH_THE_CARD:
        updatedValues.length = 3
        break

      case typeOfCampaigns.CHOOSE_THE_BOX:
        updatedValues.length = 4
        break

      case typeOfCampaigns.SPIN_THE_WHEEL:
        updatedValues.length = 6
        break
    }

    return updatedValues
  }

  const [url, setUrl] = useState('')

  const resetImages = () => {
    setUrl('')
    setLogoOfCampaign(initialValueOfImages)
    setBanner1(initialValueOfImages)
    setBanner2(initialValueOfImages)
    setLogoBinary('')
    setBanner1Binary('')
    setBanner1Binary('')
  }

  const getImageUrl = async (file, blob) => {
    setUrl('')
    let url = ''
    let fileExtension = file.details.name.split('.').pop()

    let payload = {
      usecase: 'CAMPAIGN_IMAGES',
      file_ext: fileExtension,
    }

    await getUploadUrl(payload).then(async (response) => {
      await uploadFile(response.data.data.aws_signed_url, blob).then((resp) => {
        url = response.data.data.aws_signed_url
      })
    })

    return url.split('?')[0]
  }

  const handleFileChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0]
    let fileExtension = event.target.files[0].name.split('.').pop()

    let binaryData = ''
    if (!fileObj) {
      return
    }

    getBase64(fileObj)
      .then((result) => {
        fileObj['base64'] = result
        fetch(result as string)
          .then((res) => res.blob())
          .then((blob) => {
            setCampaignBgBinary(blob as any)
          })
      })
      .catch((err) => {
        console.log(err)
      })

    setCampaignBackground({
      details: event.target.files[0],
      path: URL.createObjectURL(event.target.files[0]),
      binaryData: campaignBackground.binaryData,
    })

    event.target.value = null
  }

  const patchForm = () => {
    let obj: any = location.state
    let winningValues = obj[formFields.WINNING_VALUES]

    winningValues.map((item) => {
      delete item.day_count
      delete item.key
      return item
    })

    let newObj = {
      [formFields.COMPANY_NAME]: obj[formFields.COMPANY_NAME],
      [formFields.DIFFICULTY]: obj[formFields.DIFFICULTY],
      [formFields.START_DATE]: new Date(obj.start_date),
      [formFields.END_DATE]: new Date(obj.end_date),
      [formFields.TITLE]: obj[formFields.TITLE],
      [formFields.TYPE]: obj[formFields.TYPE],
      [formFields.MAX_PLAY_USER]: obj[formFields.MAX_PLAY_USER],
      [formFields.TEMPLATE_TYPE]: obj[formFields.TEMPLATE_TYPE],
      [formFields.TERMS]: obj[formFields.TERMS],
      [formFields.FONT_COLOR]: obj[formFields.FONT_COLOR],
      [formFields.LOGO]: obj[formFields.LOGO],
      [formFields.WINNING_VALUES]: winningValues,
      [formFields.BANNER1]: obj[formFields.BANNER1],
      [formFields.BANNER2]: obj[formFields.BANNER2],
      [formFields.BACKGROUND_IMAGE]: obj[formFields.BACKGROUND_IMAGE],
      [formFields.WHEEL_BACKGROUNDCOLOR]: obj[formFields.WHEEL_BACKGROUNDCOLOR]?.length
        ? obj[formFields.WHEEL_BACKGROUNDCOLOR][0]
        : obj[formFields.WHEEL_BACKGROUNDCOLOR],
    }

    setInitialData(newObj)
    // return newObj
  }

  useEffect(() => {
    if (id) {
      patchForm()
    }
  }, [])

  return (
    <Formik
      initialValues={initialData}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values, {setSubmitting, resetForm}) => {
        console.log('🚀 ~ file: NewCampaign.tsx ~ line 319 ~ onSubmit={ ~ values', values)
        setIsSubmitted(true)
        const format = 'YYYY-MM-DD'
        const payload = {...values}
        payload['start_date'] = moment(values['start_date']).format(format)
        payload['end_date'] = moment(values['end_date']).format(format)
        payload['prop_color'] = [values['prop_color']]
        if (
          new Date(values[formFields.END_DATE]).getTime() >
          new Date(values[formFields.START_DATE]).getTime()
        ) {
          setIsLoading(true)

          axios
            .all([
              !campaignBackground.path
                ? (payload['backimg'] = getThemeStyle(values.template).backgroundImage)
                : (payload['backimg'] = await getImageUrl(campaignBackground, campaignBgBinary)),
              logoOfCampaign.path &&
                logoBinary &&
                (payload['logo_url'] = await getImageUrl(logoOfCampaign, logoBinary)),
              banner1.path &&
                banner1Binary &&
                (payload['banner1_url'] = await getImageUrl(banner1, banner1Binary)),
              banner2.path &&
                banner2Binary &&
                (payload['banner2_url'] = await getImageUrl(banner2, banner2Binary)),
            ])
            .then(
              axios.spread((firstResponse, secondResponse, thirdResponse, forthResponse) => {
                if (id) {
                  putCampaign(payload, id)
                    .then((resp) => {
                      if (resp) {
                        ToastMessage('Campaign updated successfully', 'success')
                        setIsLoading(false)
                        resetForm()
                        resetImages()
                        setIsSubmitted(false)
                        navigate('/campaigns')
                      }
                    })
                    .catch((error) => {
                      if (error?.response?.data?.message) {
                        ToastMessage(error?.response?.data?.message, 'error')
                      } else {
                        ToastMessage('Something went wrong!', 'error')
                      }
                      setIsLoading(false)
                      setIsSubmitted(false)
                    })
                } else {
                  postCampaign(payload)
                    .then((resp) => {
                      if (resp) {
                        ToastMessage('Campaign updated successfully', 'success')
                        setIsLoading(false)
                        resetForm()
                        resetImages()
                        setIsSubmitted(false)
                        navigate('/campaigns')
                      }
                    })
                    .catch((error) => {
                      if (error?.response?.data?.message) {
                        ToastMessage(error?.response?.data?.message, 'error')
                      } else {
                        ToastMessage('Something went wrong!', 'error')
                      }
                      setIsLoading(false)
                      setIsSubmitted(false)
                    })
                }
              })
            )
            .catch((error) => {
              ToastMessage('Something went wrong!', 'error')
              setIsLoading(false)
              setIsSubmitted(false)
            })
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
        isSubmitting,
        initialErrors,
      }) => {
        console.log('🚀 ~ file: NewCampaign.tsx ~ line 423 ~ onSubmit={ ~ values', values)
        return (
          <form>
            <div>
              <div className='card-body new-campaign'>
                {/* <Spin /> */}

                <h1 className=''>New Campaign</h1>
                <hr />
                <div className='row mt-3'>
                  <div className='col-xxl-4 col-xl-4 col-lg-5 col-md-5 col-sm-6  col-sm-6 col-12'>
                    <div className='mb-10'>
                      <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                        Campaign Company<sup className='text-danger'>*</sup>
                      </label>
                      <input
                        type='text'
                        placeholder='Name'
                        name={formFields.COMPANY_NAME}
                        value={values[formFields.COMPANY_NAME]}
                        onChange={handleChange}
                        className={clsx(
                          'form-control ',
                          {'is-invalid': touched.company_name && errors.company_name},
                          {
                            'is-valid': touched.company_name && !errors.company_name,
                          }
                        )}
                      />
                    </div>

                    <div className='mb-10'>
                      <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                        Title of Campaign<sup className='text-danger'>*</sup>
                      </label>
                      <input
                        type='text'
                        id='exampleFormControlInput1'
                        placeholder='Name'
                        name={formFields.TITLE}
                        onChange={handleChange}
                        value={values[formFields.TITLE]}
                        // {...formik.getFieldProps(formFields.TITLE)}
                        className={clsx(
                          'form-control ',
                          {'is-invalid': touched.title && errors.title},
                          {
                            'is-valid': touched.title && !errors.title,
                          }
                        )}
                      />
                    </div>

                    <div className='mb-10'>
                      <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                        Select Type of the campaign<sup className='text-danger'>*</sup>
                      </label>

                      <Form.Select
                        aria-label='Default select example'
                        placeholder='Spin the Wheel'
                        name={formFields.TYPE}
                        onChange={(e) => {
                          setFieldValue(formFields.TYPE, e.target.value)
                          setFieldValue(
                            formFields.WINNING_VALUES,
                            getInitialWinningValues(e.target.value)
                          )
                        }}
                        value={values[formFields.TYPE]}
                        className={clsx(
                          'form-select ',
                          {'is-invalid': touched.type && errors.type},
                          {
                            'is-valid': touched.type && !errors.type,
                          }
                        )}
                      >
                        <option value={typeOfCampaigns.SPIN_THE_WHEEL}>Spin the wheel</option>
                        <option value={typeOfCampaigns.SCRATCH_THE_CARD}>Scratch Card</option>
                        <option value={typeOfCampaigns.CHOOSE_THE_BOX}>Pick the box</option>
                      </Form.Select>
                    </div>

                    <div className='mb-10'>
                      <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                        Number of Selection per user per day<sup className='text-danger'>*</sup>
                      </label>
                      <input
                        min={1}
                        type='number'
                        name={formFields.MAX_PLAY_USER}
                        onChange={handleChange}
                        value={values[formFields.MAX_PLAY_USER]}
                        disabled={id ? true : false}
                        className={clsx(
                          'form-control ',
                          {
                            'is-invalid':
                              touched.maxplay_peruser_perday && errors.maxplay_peruser_perday,
                          },
                          {
                            'is-valid':
                              touched.maxplay_peruser_perday && !errors.maxplay_peruser_perday,
                          }
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                        Dates<sup className='text-danger'>*</sup>
                      </label>
                      <div className='row mb-10'>
                        <div className='col-xxl-6 col-lg-12 gy-lg-5 gy-md-5 gy-sm-5 gy-5 col-md-12'>
                          <DatePicker
                            dateFormat='dd-MM-yyyy'
                            selected={values[formFields.START_DATE]}
                            onChange={(date) => setFieldValue(formFields.START_DATE, date)}
                            minDate={new Date()}
                            className={clsx(
                              'form-control ',
                              {
                                'is-invalid': touched.start_date && errors.start_date,
                              },
                              {
                                'is-valid': touched.start_date && !errors.start_date,
                              }
                            )}
                          />

                          {errors.start_date && (
                            <p className='text-danger px-1'>Please select future date.</p>
                          )}
                        </div>
                        <div className='col-xxl-6 col-lg-12 gy-lg-5 gy-md-5 gy-sm-5 gy-5  col-md-12'>
                          <DatePicker
                            dateFormat='dd-MM-yyyy'
                            selected={values[formFields.END_DATE]}
                            onChange={(date) => {
                              setFieldValue(formFields.END_DATE, date)
                            }}
                            minDate={new Date().setDate(
                              new Date(values[formFields.START_DATE]).getDate() + 1
                            )}
                            className={clsx(
                              'form-control ',
                              {
                                'is-invalid':
                                  (touched.end_date && errors.end_date) ||
                                  new Date(values[formFields.END_DATE]).getTime() <
                                    new Date(values[formFields.START_DATE]).getTime(),
                              },
                              {
                                'is-valid': touched.end_date && !errors.end_date,
                              }
                            )}
                          />
                          {errors.end_date && touched.end_date && (
                            <p className='text-danger px-1'>
                              End date must be ahead of start date.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-xxl-5 col-xl-6 col-lg-7 col-md-7 col-sm-6 offset-xxl-2 col-12'>
                    <div className='mb-10'>
                      <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                        Select Template<sup className='text-danger'>*</sup>
                      </label>
                      <Form.Select
                        name={formFields.TEMPLATE_TYPE}
                        onChange={handleChange}
                        className={clsx(
                          'form-select ',
                          {'is-invalid': touched.template && errors.template},
                          {
                            'is-valid': touched.template && !errors.template,
                          }
                        )}
                        value={values[formFields.TEMPLATE_TYPE]}
                        placeholder='Spin the Wheel'
                      >
                        <option disabled value=''>
                          Choose
                        </option>
                        <option value='TEMPLATE_1'>General</option>
                        <option value='TEMPLATE_2'>Festive</option>
                        <option value='TEMPLATE_3'>New Year</option>
                      </Form.Select>
                    </div>
                    <div className='mb-10'>
                      <label className='form-label fw-bold mb-10'>Check Campaign Preview</label>
                      <div
                        className='campaign-outer-div text-center'
                        style={{
                          backgroundImage: `url(${
                            values.template && !campaignBackground.path && !values.backimg
                              ? getThemeStyle(values.template).backgroundImage
                              : values.backimg
                              ? values.backimg
                              : campaignBackground.path
                          })`,
                        }}
                      >
                        <div>
                          {logoOfCampaign.path || values.logo_url ? (
                            <img
                              alt='logo'
                              className='logo'
                              src={values.logo_url ? values.logo_url : logoOfCampaign.path}
                            />
                          ) : (
                            <img
                              className='logo'
                              alt='logo'
                              src={toAbsoluteUrl('/media/icons/logo_placeholder.png')}
                            />
                          )}
                        </div>

                        <h6
                          className='type-of-campaign'
                          style={{
                            color: values.forecolor
                              ? values.forecolor
                              : (getThemeStyle(values.template).color as string),
                          }}
                        >
                          {values.type === typeOfCampaigns.SCRATCH_THE_CARD
                            ? 'Scratch the Card'
                            : values.type === typeOfCampaigns.SPIN_THE_WHEEL
                            ? 'Spin the Wheel'
                            : 'Choose the Box'}
                        </h6>
                        {values.type === typeOfCampaigns.SCRATCH_THE_CARD ? (
                          <div className='my-2'>
                            <img
                              height={'120px'}
                              src={getThemeStyle(values.template).scratchCardImage}
                            />
                          </div>
                        ) : // <ScratchCardWrapper
                        //   image={getThemeStyle(values.template).scratchCardImage}
                        // />
                        values.type === typeOfCampaigns.SPIN_THE_WHEEL ? (
                          <p>
                            <SpinningWheel
                              textColor={values.forecolor}
                              items={getWinningValuesLabel(values.winning_values)}
                              type={values.template}
                              backgroundColor={values.prop_color}
                            />
                          </p>
                        ) : (
                          <div className='my-2'>
                            <img src={getThemeStyle(values.template).pickTheBox} />
                          </div>
                        )}
                        <button
                          type='button'
                          className='my-5 btn btn-light claim-prize-btn'
                          style={{
                            color: values.forecolor as string,
                            backgroundColor: getThemeStyle(values.template)
                              .buttonBackgroundColor as string,
                            border: `1px solid ${values.forecolor}`,
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                          }}
                        >
                          Next
                        </button>

                        {banner1.path && (
                          <div
                            className='banner-img'
                            style={{
                              backgroundImage: `url(${banner1.path})`,
                            }}
                          />
                        )}

                        {banner2.path && (
                          <div
                            className='banner-img'
                            style={{
                              backgroundImage: `url(${banner2.path})`,
                            }}
                          />
                        )}

                        {values.banner1_url && !banner1.path && (
                          <div
                            className='banner-img'
                            style={{
                              backgroundImage: `url(${values.banner1_url})`,
                            }}
                          />
                        )}

                        {values.banner2_url && !banner2.path && (
                          <div
                            className='banner-img'
                            style={{
                              backgroundImage: `url(${values.banner2_url})`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='col-xxl-8 col-xl-8 col-lg-10 col-md-8 col-sm-12'>
                    <div className='row'>
                      <div className='col-xxl-3 col-lg-4 col-md-4 col-sm-4 col-4'>
                        <div className='form-label fw-bold mb-5'>
                          {' '}
                          Logo of campaign<sup className='text-danger'>*</sup>
                        </div>
                        <FileUpload
                          fileData={logoOfCampaign}
                          setFileData={setLogoOfCampaign}
                          showError={touched.logo_url && errors.logo_url}
                          setBinaryData={setLogoBinary}
                          setFieldValue={(file) => {
                            setFieldValue(formFields.LOGO, file)
                          }}
                          fieldValue={values.logo_url}
                        />
                        {touched.logo_url && errors.logo_url && (
                          <p className='text-danger'>Please select logo</p>
                        )}
                      </div>
                      <div className='col-xxl-3 offset-xxl-1 col-lg-4 col-md-4 col-sm-4 col-4'>
                        <div className='form-label fw-bold mb-5'>Banner 1</div>
                        <FileUpload
                          fileData={banner1}
                          setFileData={setBanner1}
                          showError={false}
                          setBinaryData={setBanner1Binary}
                          setFieldValue={(file) => {
                            setFieldValue(formFields.BANNER1, file)
                          }}
                          fieldValue={values.banner1_url}
                        />
                        {/* {!banner1.path && isSubmitted && (
                          <p className='text-danger'>Please select Banner 1</p>
                        )} */}
                      </div>
                      <div className='col-xxl-3 offset-xxl-1 col-lg-4 col-md-4 col-sm-4 col-4'>
                        <div className='form-label fw-bold mb-5'>Banner 2 </div>
                        <FileUpload
                          fileData={banner2}
                          setFileData={setBanner2}
                          showError={false}
                          setBinaryData={setBanner2Binary}
                          setFieldValue={(file) => {
                            setFieldValue(formFields.BANNER2, file)
                          }}
                          fieldValue={values.banner2_url}
                        />
                        {/* {!banner2.path && isSubmitted && (
                          <p className='text-danger'>Please select Banner 2</p>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className='row mt-10'>
                    <div className='col-xxl-5 col-xl-6 col-lg-8 col-md-6 col-sm-6 col-12 row align-items-center'>
                      <div className='col-xxl-6 col-xl- col-lg-5 col-md-5 col-sm-5 col-5'>
                        <label className='form-label fw-bold'>Change Background Image</label>
                      </div>
                      <div className='col-xxl-6 col-xl-4 col-lg-5 col-md-5 col-sm-5 col-5'>
                        {campaignBackground?.details?.name && campaignBackground.path ? (
                          <div className='card border py-2 px-0 mt-2'>
                            <div className='d-flex justify-content-around align-items-center'>
                              <div
                                className='file-thumbnail'
                                style={{backgroundImage: `url(${campaignBackground.path})`}}
                              />
                              <div className='file-name'>
                                <small>{campaignBackground?.details?.name}</small>
                              </div>
                              <div>
                                <i
                                  className='bi bi-x-lg text-dark fw-600 cursor-pointer'
                                  onClick={() => {
                                    setCampaignBackground({
                                      details: {name: ''},
                                      path: '',
                                      binaryData: '',
                                    })
                                  }}
                                ></i>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <input
                            type='file'
                            accept='image/*'
                            ref={inputRef}
                            onChange={handleFileChange}
                          />
                        )}
                      </div>
                    </div>
                    <div className='col-xxl-3 col-xl-6 col-md-3 col-lg-4 col-sm-3 col-12 row align-items-center'>
                      <div className='col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8'>
                        <label className='form-label fw-bold'>Change Font Color</label>
                      </div>
                      <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4'>
                        <input
                          type='color'
                          name={formFields.FONT_COLOR}
                          value={values[formFields.FONT_COLOR]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className='col-xxl-4 col-xl-6 col-md-3 col-lg-4 col-sm-3 col-12 row align-items-center'>
                      <div className='col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8'>
                        <label className='form-label fw-bold'>Change Wheel Background Color</label>
                      </div>
                      <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4'>
                        <input
                          type='color'
                          name={formFields.WHEEL_BACKGROUNDCOLOR}
                          value={values[formFields.WHEEL_BACKGROUNDCOLOR]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <>
                    <div className='col-xxl-12 my-5'>
                      <label htmlFor='exampleFormControlInput1' className='form-label fw-bold mb-5'>
                        {values.type === typeOfCampaigns.SPIN_THE_WHEEL && 'Wheel '}
                        {values.type === typeOfCampaigns.SCRATCH_THE_CARD && 'Scratch Card '}
                        {values.type === typeOfCampaigns.CHOOSE_THE_BOX && 'Box '}
                        Winnings Values
                      </label>
                      <FieldArray
                        name={formFields.WINNING_VALUES}
                        render={(arrayHelpers) => (
                          <>
                            {values.winning_values &&
                              values.winning_values.length &&
                              values.winning_values.map((item, index) => (
                                <div
                                  className='col-xxl-7 col-xl-8 col-lg-10 col-md-10 col-sm-12 col-12 row mb-5'
                                  key={index}
                                >
                                  <div className='col-xl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-6 d-flex align-items-center'>
                                    <div className='fw-bold px-3'>{index + 1}.</div>
                                    <input
                                      type='text'
                                      className='form-control'
                                      id='exampleFormControlInput1'
                                      name={`${formFields.WINNING_VALUES}.${index}.${formFields.LABEL}`}
                                      onChange={handleChange}
                                      value={item[formFields.LABEL]}
                                    />
                                  </div>
                                  <div className='col-xxl-5 col-xl-5 col-lg-5 col-md-5 col-sm-5 col-6'>
                                    <div className='input-group mb-3'>
                                      <input
                                        min={1}
                                        type='number'
                                        name={`${formFields.WINNING_VALUES}.${index}.${formFields.MAX_PERDAY}`}
                                        className='form-control'
                                        value={item[formFields.MAX_PERDAY]}
                                        onChange={handleChange}
                                      />
                                      <div className='input-group-append'>
                                        <span className='input-group-text' id='basic-addon2'>
                                          times/day
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </>
                        )}
                      />
                    </div>
                    <ToastContainer />
                    <div className='col-xxl-12 col-xl-12 col-md-12 col-lg-12 col-sm-12 col-12'>
                      <div className='col-xxl-3 col-xl-3 col-md-6 col-lg-4 col-sm-6 col-6'>
                        <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                          Difficulty Level<sup className='text-danger'>*</sup>
                        </label>
                        <Form.Select
                          placeholder='Spin the Wheel'
                          name={formFields.DIFFICULTY}
                          onChange={handleChange}
                          value={values[formFields.DIFFICULTY]}
                          className={clsx(
                            'form-select ',
                            {'is-invalid': touched.difficulty && errors.difficulty},
                            {
                              'is-valid': touched.difficulty && !errors.difficulty,
                            }
                          )}
                        >
                          <option disabled value=''>
                            Choose
                          </option>
                          <option value='EASY'>Easy</option>
                          <option value='MODERATE'>Moderate</option>
                          <option value='DIFFICULT'>Difficult</option>
                        </Form.Select>
                      </div>

                      <div className='col-xxl-7 col-xl-7 col-md-7 col-lg-10 col-sm-7 col-7 mt-10'>
                        <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                          Terms & Conditions<sup className='text-danger'>*</sup>
                        </label>
                        <textarea
                          id='floatingTextarea'
                          rows={5}
                          name={formFields.TERMS}
                          value={values[formFields.TERMS]}
                          onChange={handleChange}
                          className={clsx(
                            'form-control ',
                            {'is-invalid': touched.tnc && errors.tnc},
                            {
                              'is-valid': touched.tnc && !errors.tnc,
                            }
                          )}
                        ></textarea>
                      </div>
                    </div>
                  </>
                </div>
                <div className='row my-10'>
                  <div className='col-xxl-1 col-xl-2 col-lg-2 col-md-2 col-3'>
                    <Link to='/campaigns' type='button' className='btn btn-sm btn-outline-dark'>
                      Cancel
                    </Link>
                  </div>
                  <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-3'>
                    <Button
                      variant='dark'
                      type='submit'
                      size='sm'
                      disabled={isLoading || isSubmitting}
                      onClick={(e) => {
                        e.preventDefault()
                        handleSubmit()
                      }}
                      className='mb-10'
                    >
                      <span className='indicator-progress' style={{display: 'block'}}>
                        {id ? 'Update' : 'Create'}

                        {isLoading && (
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )
      }}
    </Formik>
  )
}

export {NewCampaign}
