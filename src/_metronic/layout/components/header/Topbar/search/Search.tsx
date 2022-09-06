import React from 'react'
import './Search.scss'

export default function Search() {
  return (
    <div className='search-input'>
      <div className='input-group rounded-pill input-group-sm'>
        <span className='input-group-prepend'>
          <i className='fa fa-search'></i>
        </span>
        <input className='form-control rounded-pill' placeholder='Search here' type='search' id='example-search-input' />
      </div>
    </div>
  )
}
