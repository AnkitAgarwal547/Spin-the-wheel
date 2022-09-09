import React, {useEffect, useRef} from 'react'
import {Button} from 'react-bootstrap'
import {KTSVG} from '../../../helpers'
import './FileUpload.scss'

export default function FileUpload({setFileData, fileData}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleFileChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0]
    setFileData({details: event.target.files[0], path: URL.createObjectURL(event.target.files[0])})
    if (!fileObj) {
      return
    }

    event.target.value = null
  }

  const removeFile = () => {
    setFileData({details: null, path: ''})
  }

  return (
    <div className='border border-gray-600 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3'>
      <div className='upload-files-container text-center'>
        <div className='text-center my-2'>
          <KTSVG path='/media/icons/upload.svg' />
        </div>
        <input type='file' ref={inputRef} onChange={handleFileChange} style={{display: 'none'}} />

        <Button
          onClick={handleClick}
          variant='outline-dark'
          className='rounded-pill file-upload-btn'
          size='sm'
        >
          Select
        </Button>
      </div>

      {fileData?.details && (
        <div className='card border py-2 px-0 mt-2'>
          <div className='d-flex justify-content-around align-items-center'>
            <img
              className='h-20px mr-1 '
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm9qUfU9tL5ypnST5dKQ_55r6uQNRSrDs61wtzL6M-0w&s'
              alt='logo'
            />
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
    </div>
  )
}
