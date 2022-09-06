import React, {useRef} from 'react'
import {Button} from 'react-bootstrap'
import './FileUpload.scss'

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    // 👇️ open file input box on click of other element
    console.log('click')
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleFileChange = (event: any) => {
    console.log('🚀 ~ file: FileUpload.tsx ~ line 13 ~ handleFileChange ~ event', event)
    const fileObj = event.target.files && event.target.files[0]
    if (!fileObj) {
      return
    }

    console.log('fileObj is', fileObj)

    // 👇️ reset file input
    event.target.value = null

    // 👇️ is now empty
    console.log(event.target.files)

    // 👇️ can still access file object here
    console.log(fileObj)
    console.log(fileObj.name)
  }

  return (
    <div className='border border-gray-600 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3'>
      <div className='upload-files-container text-center'>
        <div className='text-center my-2'>
          <i className='bi bi-arrow-bar-up file-upload-icon'></i>
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
    </div>
  )
}
