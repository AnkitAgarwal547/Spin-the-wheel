/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import React from 'react'
import {useLayout} from '../../core'
import {Topbar} from './Topbar/Topbar'
type Props = {
  asideRef: any
  minimize: any
}

export const HeaderWrapper: React.FC<Props> = ({asideRef, minimize}) => {
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
