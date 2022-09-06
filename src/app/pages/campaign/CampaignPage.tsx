/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { CampaignTable } from '../../modules/campaign/CampaignTable'
// import Tableview from './table/Tableview'

type Props = {
  className?: string
}

const CampaignPage: React.FC<Props> = () => {
  return (
    <>
      <CampaignTable className='card-xxl-stretch mb-5 mb-xxl-8' showButtons={true} />
    </>
  )
}

export {CampaignPage}
