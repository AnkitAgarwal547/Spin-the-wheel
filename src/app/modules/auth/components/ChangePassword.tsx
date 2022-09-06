import React from 'react'
import {Button} from 'react-bootstrap'

export default function ChangePassword() {
  return (
    <div>
      <div className='card-body'>
        <h1 className=''>Change Password</h1>
        <hr />

        <div className='my-8 row'>
          <div className='col-xxl-4 col-xl-4 col-lg-6 col-md-5 col-sm-5 col-6'>
            <label className='form-label fw-bold'>Create a New Password</label>
            <div className='my-5'>
              <input
                type='password'
                className='form-control'
                id='exampleFormControlInput1'
                placeholder='Password'
              />
            </div>
            <div className='mb-5'>
              <input
                type='password'
                className='form-control'
                id='exampleFormControlInput1'
                placeholder='Confirm Password'
              />
            </div>
          </div>
          <div className='row my-10'>
            <div className='col-5'>
              <Button variant='dark' size='sm'>
                Set Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
