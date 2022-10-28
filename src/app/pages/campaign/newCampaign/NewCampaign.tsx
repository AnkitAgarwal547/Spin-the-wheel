/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {createRef, useEffect, useRef, useState} from 'react'
import {Button, Form} from 'react-bootstrap'
import * as Yup from 'yup'
import FileUpload from '../../../../_metronic/layout/components/fileupload/FileUpload'
import SpinningWheel from '../../../../_metronic/layout/components/SpinningWheel/SpinningWheel'
import './NewCampaign.scss'
import * as yup from 'yup'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {
  getUploadUrl,
  postCampaign,
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
import PickTheBox from '../../../../_metronic/layout/components/PickTheBox/PickTheBox'

type Props = {}

export function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg|jfif)$/.test(url)
}

export const ScrollToFieldError = ({isValid, submitCount, errors, logo}) => {
  useEffect(() => {
    if (isValid && logo.path) return
    const fieldErrorNames = getFieldErrorNames(errors)
    if (fieldErrorNames.length <= 0) return
    const element = document.querySelector(`input[name='${fieldErrorNames[0]}']`)
    if (!element || !logo) return

    // Scroll to first known error into view
    element.scrollIntoView({behavior: 'smooth', block: 'center'})
  }, [submitCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export const getFieldErrorNames = (formikErrors) => {
  const transformObjectToDotNotation = (obj, prefix = '', result: any[] = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (!value) return

      const nextKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'object') {
        transformObjectToDotNotation(value, nextKey, result)
      } else {
        result.push(nextKey)
      }
    })

    return result
  }

  return transformObjectToDotNotation(formikErrors)
}

export const getThemeStyle = (type) => {
  let backgroundImage = ''
  let scratchCardImage
  let color = ''
  let buttonBackgroundColor = ''
  let pickTheBox =
    'https://s3.ap-south-1.amazonaws.com/fedicoms.net/template_images/pick_the_box/gift_box.png'
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
  const logoReference = useRef<null | HTMLDivElement>(null)
  const [campaignBackground, setCampaignBackground] = useState({
    details: {name: ''},
    path: '',
    binaryData: '',
  })

  const [frontendBackground, setFrontendBackground] = useState({
    details: {name: ''},
    path: '',
    binaryData: '',
  })

  const [scratchBoxBackground, setScratchBoxBackground] = useState({
    details: {name: ''},
    path: '',
    binaryData: '',
  })

  const [campaignBgBinary, setCampaignBgBinary] = useState()
  const [frontendBgBinary, setFrontendBgBinary] = useState()
  const [logoBinary, setLogoBinary] = useState('')
  const [banner1Binary, setBanner1Binary] = useState('')
  const [banner2Binary, setBanner2Binary] = useState('')
  const [scratchBoxBinary, setScratchBoxBinary] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function scrollToMyDiv(element) {
    document.getElementById('logo-div')
    window.scroll({
      top: element.offsetTop,
      left: 0,
      behavior: 'smooth',
    })
  }

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
    FRONTEND_IMG: 'frontend_img',
    TEMPLATE_ID: 'template_id',
    COUPON_CODE: 'coupon_code',
    SMS_CONTENT: 'sms_content',
    SMS_TNC: 'sms_tnc',
    ScratchBoxBackground: 'scratchBox_bg',
  }

  const initialWinningValues = [
    {
      label: 'Better luck next time',
      max_perday: 70,
      sms_content: '{var1}',
      coupon_code: 'betterlucknexttime',
      template_id: 'template_id1',
    },
    {
      label: 'Get 20% off',
      max_perday: 10,
      sms_content: '{var2}',
      coupon_code: 'get20',
      template_id: 'template_id2',
    },
    {
      label: 'Get 10% off',
      max_perday: 5,
      sms_content: '{var3}',
      coupon_code: 'get10',
      template_id: 'template_id3',
    },
    {
      label: 'Get 5% off',
      max_perday: 5,
      sms_content: '{var4}',
      coupon_code: 'get5',
      template_id: 'template_id4',
    },

    {
      label: 'Get Free Service',
      max_perday: 5,
      sms_content: '{var5}',
      coupon_code: 'getFreeService',
      template_id: 'template_id5',
    },

    {
      label: 'Get 60% off',
      max_perday: 5,
      sms_content: '{var6}',
      coupon_code: 'get60',
      template_id: 'template_id5',
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
    [formFields.FRONTEND_IMG]: '',
    [formFields.SMS_TNC]: '',
  }

  const validationSchema = Yup.object().shape({
    [formFields.COMPANY_NAME]: Yup.string().required(),
    [formFields.DIFFICULTY]: Yup.string().required(),
    [formFields.START_DATE]: yup.string().required(),
    [formFields.END_DATE]: Yup.string().required(),
    [formFields.LOGO]: Yup.string(),
    [formFields.BANNER1]: Yup.string(),
    [formFields.BANNER2]: Yup.string(),
    [formFields.WHEEL_BACKGROUNDCOLOR]: Yup.string(),
    [formFields.TITLE]: Yup.string().required(),
    [formFields.TYPE]: Yup.string().required(),
    [formFields.TERMS]: Yup.string().required(),
    [formFields.MAX_PLAY_USER]: Yup.string().required(),
    [formFields.TEMPLATE_TYPE]: Yup.string().required(),
    [formFields.FRONTEND_IMG]: Yup.string(),
    [formFields.FONT_COLOR]: Yup.string(),
    [formFields.SMS_TNC]: Yup.string().required(),
    [formFields.WINNING_VALUES]: Yup.array().of(
      Yup.object().shape({
        [formFields.MAX_PERDAY]: Yup.string().required(),
        [formFields.LABEL]: Yup.string().required(),
        [formFields.TEMPLATE_ID]: Yup.string(),
        [formFields.COUPON_CODE]: Yup.string(),
        [formFields.SMS_CONTENT]: Yup.string(),
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
  var numberRegex = /^\d+$/

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

  const handleFileChange = (event: any, type) => {
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
            if (type === 'frontendBg') {
              setFrontendBgBinary(blob as any)
            } else if (type === 'prop_color') {
              setScratchBoxBinary(blob as any)
            } else {
              setCampaignBgBinary(blob as any)
            }
          })
      })
      .catch((err) => {
        console.log(err)
      })

    if (type === 'frontendBg') {
      setFrontendBackground({
        details: event.target.files[0],
        path: URL.createObjectURL(event.target.files[0]),
        binaryData: frontendBackground.binaryData,
      })
    } else if (type === 'prop_color') {
      setScratchBoxBackground({
        details: event.target.files[0],
        path: URL.createObjectURL(event.target.files[0]),
        binaryData: scratchBoxBackground.binaryData,
      })
    } else {
      setCampaignBackground({
        details: event.target.files[0],
        path: URL.createObjectURL(event.target.files[0]),
        binaryData: campaignBackground.binaryData,
      })
    }

    event.target.value = null
  }

  const patchForm = () => {
    let obj: any = location.state
    let winningValues = obj[formFields.WINNING_VALUES]
    winningValues = winningValues.map((item) => {
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
      [formFields.FRONTEND_IMG]: obj[formFields.FRONTEND_IMG],
      [formFields.SMS_TNC]: obj[formFields.SMS_TNC],
      [formFields.ScratchBoxBackground]: obj[formFields.ScratchBoxBackground],
    }

    setInitialData(newObj)
    // return newObj
  }

  useEffect(() => {
    if (id) {
      patchForm()
    }
  }, [])

  const numberRegEx = /\-?\d*\.?\d{1,2}/

  return (
    <Formik
      initialValues={initialData}
      enableReinitialize={id ? true : false}
      validationSchema={validationSchema}
      onSubmit={async (values, {setSubmitting, resetForm}) => {
        setIsSubmitted(true)
        const format = 'YYYY-MM-DD'
        const payload = {...values}
        payload['start_date'] = moment(values['start_date']).format(format)
        payload['end_date'] = moment(values['end_date']).format(format)
        payload['prop_color'] = [values['prop_color']]
        if (!logoOfCampaign.path && !logoBinary) {
          scrollToMyDiv(logoReference?.current)
        }

        if (
          new Date(values[formFields.END_DATE]).getTime() >
            new Date(values[formFields.START_DATE]).getTime() &&
          ((logoOfCampaign.path && logoBinary) || values.logo_url)
        ) {
          setIsLoading(true)
          axios
            .all([
              !campaignBackground.path
                ? (payload['backimg'] = getThemeStyle(values.template).backgroundImage)
                : (payload['backimg'] = await getImageUrl(campaignBackground, campaignBgBinary)),
              !frontendBackground.path
                ? delete payload['frontend_img']
                : (payload['frontend_img'] = await getImageUrl(
                    frontendBackground,
                    frontendBgBinary
                  )),
              logoOfCampaign.path &&
                logoBinary &&
                (payload['logo_url'] = await getImageUrl(logoOfCampaign, logoBinary)),
              banner1.path &&
                banner1Binary &&
                (payload['banner1_url'] = await getImageUrl(banner1, banner1Binary)),
              banner2.path &&
                banner2Binary &&
                (payload['banner2_url'] = await getImageUrl(banner2, banner2Binary)),
              values.type !== typeOfCampaigns.SPIN_THE_WHEEL &&
                scratchBoxBackground.path &&
                (payload['prop_color'] = [
                  await getImageUrl(scratchBoxBackground, scratchBoxBinary),
                ]),
            ])
            .then(
              axios.spread(
                (
                  firstResponse,
                  secondResponse,
                  thirdResponse,
                  forthResponse,
                  fifthResponse,
                  sixthResponse
                ) => {
                  if (id) {
                    if (payload)
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
                }
              )
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
        isValid,
        submitCount,
      }) => {
        return (
          <form>
            <ScrollToFieldError
              isValid={isValid}
              submitCount={submitCount}
              errors={errors}
              logo={logoOfCampaign}
            />
            {/* {ScrollToFieldError(isValid, submitCount)} */}
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
                        disabled={id ? true : false}
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
                        disabled={id ? true : false}
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
                        disabled={id ? true : false}
                        onChange={(e) => {
                          setFieldValue(formFields.TYPE, e.target.value)
                          setFieldValue(
                            formFields.WINNING_VALUES,
                            getInitialWinningValues(e.target.value)
                          )

                          // if (e.target.value === typeOfCampaigns.SPIN_THE_WHEEL) {
                          //   setFieldValue(
                          //     formFields.WHEEL_BACKGROUNDCOLOR,
                          //     initialData[formFields.WHEEL_BACKGROUNDCOLOR]
                          //   )
                          // } else if (e.target.value === typeOfCampaigns.CHOOSE_THE_BOX) {
                          //   console.log('change')
                          //   // setFieldValue(
                          //   //   formFields.WHEEL_BACKGROUNDCOLOR,
                          //   //   getThemeStyle(values[formFields.TYPE]).pickTheBox
                          //   // )
                          // } else {
                          //   // setFieldValue(
                          //   //   formFields.WHEEL_BACKGROUNDCOLOR,
                          //   //   getThemeStyle(values[formFields.TYPE]).scratchCardImage
                          //   // )
                          // }
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
                        type='text'
                        name={formFields.MAX_PLAY_USER}
                        onChange={(e) => {
                          if (e.target.value) {
                            if (numberRegex.test(e.target.value)) {
                              setFieldValue(formFields.MAX_PLAY_USER, e.target.value)
                            } else {
                              setFieldValue(
                                formFields.MAX_PLAY_USER,
                                values[formFields.MAX_PLAY_USER]
                              )
                            }
                          } else {
                            setFieldValue(formFields.MAX_PLAY_USER, '')
                          }
                        }}
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
                              src={
                                values.logo_url && !logoOfCampaign.path
                                  ? values.logo_url
                                  : logoOfCampaign.path
                              }
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
                              height='120px'
                              width='120px'
                              style={{borderRadius: '10px'}}
                              src={
                                scratchBoxBackground.path
                                  ? scratchBoxBackground.path
                                  : isImage(values.prop_color)
                                  ? values.prop_color
                                  : getThemeStyle(values.template).scratchCardImage
                              }
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
                            <PickTheBox
                              img={
                                scratchBoxBackground.path
                                  ? scratchBoxBackground.path
                                  : isImage(values.prop_color)
                                  ? values.prop_color
                                  : getThemeStyle(values.template).pickTheBox
                              }
                            />

                            {/* <img
                              src={
                                scratchBoxBackground.path
                                  ? scratchBoxBackground.path
                                  : values.prop_color || getThemeStyle(values.template).pickTheBox
                              }
                            /> */}
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
                  <div
                    className='col-xxl-8 col-xl-8 col-lg-10 col-md-8 col-sm-12'
                    id='logo-div'
                    ref={logoReference}
                  >
                    <div className='row'>
                      <div className='col-xxl-3 col-lg-4 col-md-4 col-sm-4 col-4'>
                        <div className='form-label fw-bold mb-5'>
                          {' '}
                          Logo of campaign<sup className='text-danger'>*</sup>
                        </div>
                        <FileUpload
                          fileData={logoOfCampaign}
                          setFileData={setLogoOfCampaign}
                          showError={
                            touched.logo_url &&
                            ((!id && !logoOfCampaign.path) ||
                              (id && !logoOfCampaign.path && !values.logo_url))
                          }
                          setBinaryData={setLogoBinary}
                          setFieldValue={(file) => {
                            setFieldValue(formFields.LOGO, file)
                          }}
                          fieldValue={values.logo_url}
                          reference={logoReference}
                        />
                        {touched.logo_url &&
                          ((!id && !logoOfCampaign.path) ||
                            (id && !logoOfCampaign.path && !values.logo_url)) && (
                            <p className='text-danger'>Please select logo</p>
                          )}
                        <small>Width: 120px - Height: 120px</small>
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
                          reference=''
                        />
                        <small>Width: 1080px - Height: 100px</small>
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
                          reference=''
                        />
                        <small>Width: 1080px - Height: 100px</small>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-10 gy-5'>
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
                                  className='bi bi-x-lg text-dark fw-600 cursor-pointer cancel-icon'
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
                            onChange={(e) => handleFileChange(e, 'campaignBg')}
                          />
                        )}
                      </div>
                      <small>Width: 1920px - Height: 1080px</small>
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
                      {values.type === typeOfCampaigns.SPIN_THE_WHEEL ? (
                        <>
                          {' '}
                          <div className='col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-8'>
                            <label className='form-label fw-bold'>
                              Change Wheel Background Color
                            </label>
                          </div>
                          <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4'>
                            <input
                              type='color'
                              name={formFields.WHEEL_BACKGROUNDCOLOR}
                              value={values[formFields.WHEEL_BACKGROUNDCOLOR]}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {' '}
                          <div className='col-xxl-6 col-xl- col-lg-5 col-md-5 col-sm-5 col-5'>
                            <label className='form-label fw-bold'>
                              {values.type === typeOfCampaigns.CHOOSE_THE_BOX && 'Choose Box Image'}

                              {values.type === typeOfCampaigns.SCRATCH_THE_CARD &&
                                'Choose Scratch Card Image'}
                            </label>
                          </div>
                          <div className='col-xxl-6 col-xl-4 col-lg-5 col-md-5 col-sm-5 col-5'>
                            {!scratchBoxBackground?.details?.name &&
                              !scratchBoxBackground.path &&
                              !isImage(values.prop_color) && (
                                <input
                                  type='file'
                                  accept='image/*'
                                  ref={inputRef}
                                  onChange={(e) => handleFileChange(e, 'prop_color')}
                                />
                              )}

                            {!scratchBoxBackground?.details?.name &&
                              !scratchBoxBackground.path &&
                              isImage(values.prop_color) && (
                                <div
                                  className='card border py-2 px-0 mt-2'
                                  style={{width: '150px'}}
                                >
                                  <div className='d-flex justify-content-around align-items-center'>
                                    <div
                                      className='file-thumbnail'
                                      style={{
                                        backgroundImage: `url(${values.prop_color})`,
                                      }}
                                    />
                                    <div className='file-name'>
                                      <small>{values.prop_color}</small>
                                    </div>
                                    <div>
                                      <i
                                        className='bi bi-x-lg text-dark fw-600 cursor-pointer cancel-icon'
                                        onClick={() => {
                                          setScratchBoxBackground({
                                            details: {name: ''},
                                            path: '',
                                            binaryData: '',
                                          })
                                          setFieldValue(formFields.WHEEL_BACKGROUNDCOLOR, '')
                                        }}
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                              )}

                            {scratchBoxBackground?.details && scratchBoxBackground.path && (
                              <div
                                className='card border py-2 px-0 mt-2'
                                style={{width: 'fit-content'}}
                              >
                                <div className='d-flex justify-content-around align-items-center'>
                                  <div
                                    className='file-thumbnail'
                                    style={{
                                      backgroundImage: `url(${scratchBoxBackground.path})`,
                                    }}
                                  />
                                  <div className='file-name'>
                                    <small>{scratchBoxBackground?.details?.name}</small>
                                  </div>
                                  <div>
                                    <i
                                      className='bi bi-x-lg text-dark fw-600 cursor-pointer cancel-icon'
                                      onClick={() => {
                                        setScratchBoxBackground({
                                          details: {name: ''},
                                          path: '',
                                          binaryData: '',
                                        })
                                        setFieldValue(formFields.WHEEL_BACKGROUNDCOLOR, '')
                                      }}
                                    ></i>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <small>
                            {' '}
                            {values.type === typeOfCampaigns.CHOOSE_THE_BOX
                              ? 'Width: 100px - Height: 100px'
                              : 'Width: 120px - Height: 120px'}
                          </small>
                        </>
                      )}
                    </div>

                    <div className='col-xxl-6 col-xl-7 col-lg-8 col-md-6 col-sm-6 col-12 row align-items-center mt-5'>
                      <div className='col-xxl-6 col-xl- col-lg-5 col-md-5 col-sm-5 col-5'>
                        <label className='form-label fw-bold'>
                          Change Frontend Background Image
                        </label>
                        <small>Width: 1920px - Height: 1080px</small>
                      </div>
                      <div className='col-xxl-6 col-xl-4 col-lg-5 col-md-5 col-sm-5 col-5'>
                        {!frontendBackground?.details?.name &&
                          !frontendBackground.path &&
                          !values.frontend_img && (
                            <input
                              type='file'
                              accept='image/*'
                              ref={inputRef}
                              onChange={(e) => handleFileChange(e, 'frontendBg')}
                            />
                          )}

                        {!frontendBackground?.details?.name &&
                          !frontendBackground.path &&
                          id &&
                          values.frontend_img && (
                            <div
                              className='card border py-2 px-0 mt-2'
                              style={{width: 'fit-content'}}
                            >
                              <div className='d-flex justify-content-around align-items-center'>
                                <div
                                  className='file-thumbnail'
                                  style={{
                                    backgroundImage: `url(${values.frontend_img})`,
                                  }}
                                />
                                <div className='file-name'>
                                  <small>{values.frontend_img}</small>
                                </div>
                                <div>
                                  <i
                                    className='bi bi-x-lg text-dark fw-600 cursor-pointer cancel-icon'
                                    onClick={() => {
                                      setFrontendBackground({
                                        details: {name: ''},
                                        path: '',
                                        binaryData: '',
                                      })
                                      setFieldValue(formFields.FRONTEND_IMG, '')
                                    }}
                                  ></i>
                                </div>
                              </div>
                            </div>
                          )}

                        {frontendBackground?.details && frontendBackground.path && (
                          <div
                            className='card border py-2 px-0 mt-2'
                            style={{width: 'fit-content'}}
                          >
                            <div className='d-flex justify-content-around align-items-center'>
                              <div
                                className='file-thumbnail'
                                style={{
                                  backgroundImage: `url(${frontendBackground.path})`,
                                }}
                              />
                              <div className='file-name'>
                                <small>{frontendBackground?.details?.name}</small>
                              </div>
                              <div>
                                <i
                                  className='bi bi-x-lg text-dark fw-600 cursor-pointer cancel-icon'
                                  onClick={() => {
                                    setFrontendBackground({
                                      details: {name: ''},
                                      path: '',
                                      binaryData: '',
                                    })
                                    setFieldValue(formFields.FRONTEND_IMG, '')
                                  }}
                                ></i>
                              </div>
                            </div>
                          </div>
                        )}
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
                                  className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 row mb-5'
                                  key={index}
                                >
                                  <div className='col-xl-3 col-xl-3 col-lg-5 col-md-5 col-sm-5 col-6 d-flex align-items-center'>
                                    <div className='fw-bold px-3'>{index + 1}.</div>
                                    <input
                                      type='text'
                                      className='form-control'
                                      id='exampleFormControlInput1'
                                      name={`${formFields.WINNING_VALUES}.${index}.${formFields.LABEL}`}
                                      onChange={handleChange}
                                      value={item[formFields.LABEL]}
                                      disabled={id ? true : false}
                                    />
                                  </div>
                                  <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-2 col-sm-2 col-6'>
                                    <label className='form-label fw-bold mb-6'></label>

                                    <div className='input-group mb-3'>
                                      <input
                                        min={1}
                                        type='text'
                                        name={`${formFields.WINNING_VALUES}.${index}.${formFields.MAX_PERDAY}`}
                                        className='form-control'
                                        value={item[formFields.MAX_PERDAY]}
                                        // onChange={handleChange}
                                        disabled={id ? true : false}
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            if (numberRegex.test(e.target.value)) {
                                              setFieldValue(
                                                `${formFields.WINNING_VALUES}.${index}.${formFields.MAX_PERDAY}`,
                                                e.target.value
                                              )
                                            } else {
                                              setFieldValue(
                                                `${formFields.WINNING_VALUES}.${index}.${formFields.MAX_PERDAY}`,
                                                item[formFields.MAX_PERDAY]
                                              )
                                            }
                                          } else {
                                            setFieldValue(
                                              `${formFields.WINNING_VALUES}.${index}.${formFields.MAX_PERDAY}`,
                                              ''
                                            )
                                          }
                                        }}
                                      />
                                      <div className='input-group-append'>
                                        <span className='input-group-text' id='basic-addon2'>
                                          times/day
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-6'>
                                    <label className='form-label fw-bold'>Template ID</label>
                                    <input
                                      min={1}
                                      type='text'
                                      name={`${formFields.WINNING_VALUES}.${index}.${formFields.TEMPLATE_ID}`}
                                      // className='form-control'
                                      value={item[formFields.TEMPLATE_ID]}
                                      onChange={handleChange}
                                      className={clsx(
                                        'form-control ',
                                        {
                                          'is-invalid':
                                            touched &&
                                            touched['winning_values'] &&
                                            errors &&
                                            errors?.['winning_values'] &&
                                            errors?.['winning_values'][index]?.template_id,
                                        },

                                        {
                                          'is-valid':
                                            touched &&
                                            touched['winning_values'] &&
                                            touched?.['winning_values'][index]?.template_id &&
                                            errors &&
                                            errors?.['winning_values'] &&
                                            !errors?.['winning_values'][index]?.template_id,
                                        }
                                      )}
                                    />
                                  </div>
                                  <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-6'>
                                    <label className='form-label fw-bold'>Coupon Code</label>
                                    <input
                                      min={1}
                                      type='text'
                                      name={`${formFields.WINNING_VALUES}.${index}.${formFields.COUPON_CODE}`}
                                      className={clsx(
                                        'form-control ',
                                        {
                                          'is-invalid':
                                            touched &&
                                            touched['winning_values'] &&
                                            errors &&
                                            errors?.['winning_values'] &&
                                            errors?.['winning_values'][index]?.coupon_code,
                                        },

                                        {
                                          'is-valid':
                                            touched &&
                                            touched['winning_values'] &&
                                            touched?.['winning_values'][index]?.coupon_code &&
                                            errors &&
                                            errors?.['winning_values'] &&
                                            !errors?.['winning_values'][index]?.coupon_code,
                                        }
                                      )}
                                      value={item[formFields.COUPON_CODE]}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className='col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-3 col-6'>
                                    <label className='form-label fw-bold'>SMS Content</label>
                                    <textarea
                                      className={clsx(
                                        'form-control ',
                                        {
                                          'is-invalid':
                                            touched &&
                                            touched['winning_values'] &&
                                            errors &&
                                            errors?.['winning_values'] &&
                                            errors?.['winning_values'][index]?.sms_content,
                                        },

                                        {
                                          'is-valid':
                                            touched &&
                                            touched['winning_values'] &&
                                            touched?.['winning_values'][index]?.sms_content &&
                                            errors &&
                                            errors?.['winning_values'] &&
                                            !errors?.['winning_values'][index]?.sms_content,
                                        }
                                      )}
                                      name={`${formFields.WINNING_VALUES}.${index}.${formFields.SMS_CONTENT}`}
                                      value={item[formFields.SMS_CONTENT]}
                                      onChange={handleChange}
                                    >
                                      {' '}
                                    </textarea>
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
                      <div className='row'>
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

                        <div className='col-xxl-5 col-xl-5 col-md-5 col-lg-10 col-sm-5 col-5 mt-10'>
                          <label htmlFor='exampleFormControlInput1' className='form-label fw-bold'>
                            SMS Terms & Conditions<sup className='text-danger'>*</sup>
                          </label>
                          <textarea
                            id='floatingTextarea'
                            rows={5}
                            name={formFields.SMS_TNC}
                            value={values[formFields.SMS_TNC]}
                            onChange={handleChange}
                            className={clsx(
                              'form-control ',
                              {'is-invalid': touched.sms_tnc && errors.sms_tnc},
                              {
                                'is-valid': touched.sms_tnc && !errors.sms_tnc,
                              }
                            )}
                          ></textarea>
                        </div>
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
