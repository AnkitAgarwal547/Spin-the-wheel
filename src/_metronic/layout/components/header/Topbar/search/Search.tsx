import React, {useEffect, useMemo, useState} from 'react'
import {TRIGGER_SEARCH_KEYWORD} from '../../../../../../app/redux/actions/actionTypes'
import {useAppDispatch, useAppSelector} from '../../../../../../app/redux/hooks/hooks'
import './Search.scss'
import debouce from 'lodash.debounce'
import {KTSVG, toAbsoluteUrl} from '../../../../../helpers'

export default function Search() {
  const {searchKey} = useAppSelector((state) => state.searchReducer)

  const [searchTerm, setSearchTerm] = useState(searchKey)
  const dispatch = useAppDispatch()
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.currentTarget.value) {
      dispatch({
        type: TRIGGER_SEARCH_KEYWORD,
        searchKey: searchTerm,
      })
    } else {
      dispatch({
        type: TRIGGER_SEARCH_KEYWORD,
        searchKey: '',
      })
    }
  }

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300)
  }, [])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  return (
    <div className='search-input'>
      <div className='form-group has-search'>
        <span className='form-control-feedback'>
          <img src={toAbsoluteUrl('/media/icons/search.png')} height='12px' alt='Search' />
        </span>
        <input
          type='text'
          className='form-control rounded-pill'
          placeholder='Search here'
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      {/* <div className='input-group rounded-pill input-group-sm'>
        <span className='input-group-prepend'>
          <KTSVG path='/media/icons/search.svg' />
        </span>
        <input
          className='form-control rounded-pill'
          placeholder='Search here'
          type='search'
          id='example-search-input'
          value={searchTerm}
          onChange={handleChange}
        />
      </div> */}
    </div>
  )
}
