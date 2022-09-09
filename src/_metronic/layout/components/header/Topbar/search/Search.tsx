import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {TRIGGER_SEARCH_KEYWORD} from '../../../../../../app/redux/actions/actionTypes'
import {useAppDispatch, useAppSelector} from '../../../../../../app/redux/hooks/hooks'
import './Search.scss'
import debounce from 'lodash.debounce'
import {KTSVG, toAbsoluteUrl} from '../../../../../helpers'

export default function Search() {
  const {searchKey} = useAppSelector((state) => state.searchReducer)

  const [searchTerm, setSearchTerm] = useState(searchKey)
  const dispatch = useAppDispatch()
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch({
        type: TRIGGER_SEARCH_KEYWORD,
        searchKey: searchTerm,
      })
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

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
    </div>
  )
}
