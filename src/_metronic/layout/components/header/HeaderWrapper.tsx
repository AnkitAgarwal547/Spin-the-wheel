/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import React from 'react'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {Header} from './Header'
import {DefaultTitle} from './page-title/DefaultTitle'
import {Topbar} from './Topbar/Topbar'

export function HeaderWrapper() {
  const {config, classes, attributes} = useLayout()
  const {header, aside} = config

  return (
    <div
      id='kt_header'
      className={clsx('header bg-light', classes.header.join(' '), 'd-block align-items-stretch')}
      {...attributes.headerMenu}
    >
      <Topbar />
    </div>
  )
}
