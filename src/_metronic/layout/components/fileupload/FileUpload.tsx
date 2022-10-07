import clsx from 'clsx'
import React, {useEffect, useRef} from 'react'
import {Button} from 'react-bootstrap'
import {useParams} from 'react-router'
import {getUploadUrl, uploadFile} from '../../../../app/modules/auth/core/_requests'
import {getBase64} from '../../../../app/utils/common'
import {KTSVG} from '../../../helpers'
import './FileUpload.scss'

export default function FileUpload({
  setFileData,
  fileData,
  showError,
  setBinaryData,
  setFieldValue,
  fieldValue,
}) {
  console.log('🚀 ~ file: FileUpload.tsx ~ line 10 ~ FileUpload ~ fieldValue', fieldValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const {id} = useParams()

  const reader = new FileReader()

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  function getBinaryFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.addEventListener('load', () => resolve(reader.result))
      reader.addEventListener('error', (err) => reject(err))

      reader.readAsBinaryString(file)
    })
  }

  const handleFileChange = async (event: any) => {
    const fileObj = event.target.files && event.target.files[0]
    let file = event.target.files[0]
    // setFieldValue(file)

    let binary = await getBinaryFromFile(file)

    getBase64(file)
      .then((result) => {
        file['base64'] = result
        let payload = {
          usecase: 'CAMPAIGN_IMAGES',
          file_ext: fileExtension,
        }

        fetch(result as string)
          .then((res) => res.blob())
          .then((blob) => {
            setBinaryData(blob)
            getUploadUrl(payload).then((response) => {
              uploadFile(response.data.data.aws_signed_url, blob).then((resp) => {
                setFieldValue(response.data.data.aws_signed_url.split('?')[0])
              })
            })
          })
      })
      .catch((err) => {
        console.log(err)
      })
    setFileData({
      details: event.target.files[0],
      path: URL.createObjectURL(event.target.files[0]),
    })
    let fileExtension = event.target.files[0].name.split('.').pop()

    const formData = new FormData()
    formData.append('file', event.target.files[0])

    if (!fileObj) {
      return
    }

    event.target.value = null
  }

  const removeFile = () => {
    setFileData({details: null, path: ''})
    setFieldValue('')
  }

  return (
    <div
      className={clsx(
        'border border-gray-600 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3',
        {'error-border': showError}
      )}
    >
      <div className='upload-files-container text-center'>
        <div className='text-center my-2'>
          <KTSVG path='/media/icons/upload.svg' />
        </div>
        <input
          type='file'
          accept='image/*'
          ref={inputRef}
          onChange={handleFileChange}
          style={{display: 'none'}}
        />

        <Button
          onClick={handleClick}
          variant='outline-dark'
          className='rounded-pill bg-secondary file-upload-btn'
          size='sm'
        >
          Select
        </Button>
      </div>

      {fileData?.details && fileData.path && (
        <div className='card border py-2 px-0 mt-2'>
          <div className='d-flex justify-content-around align-items-center'>
            <div className='file-thumbnail' style={{backgroundImage: `url(${fileData.path})`}} />
            {/* <img className='h-20px w-20px mr-1 ' src={fileData.path} alt='logo' /> */}
            <div className='file-name'>
              <small>{fileData?.details?.name}</small>
            </div>
            <div>
              <i
                className='bi bi-x-lg text-dark fw-600 cursor-pointer'
                onClick={() => {
                  removeFile()
                }}
              ></i>
            </div>
          </div>
        </div>
      )}

      {fieldValue && id && !fileData?.details && !fileData?.path && (
        <div className='card border py-2 px-0 mt-2'>
          <div className='d-flex justify-content-around align-items-center'>
            <div className='file-thumbnail' style={{backgroundImage: `url(${fieldValue})`}} />
            {/* <img className='h-20px w-20px mr-1 ' src={fileData.path} alt='logo' /> */}
            <div className='file-name'>
              <small>{fieldValue}</small>
            </div>
            <div>
              <i
                className='bi bi-x-lg text-dark fw-600 cursor-pointer'
                onClick={() => {
                  removeFile()
                }}
              ></i>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
