/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import {FC} from 'react'
import {useQuery} from 'react-query'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {CampaignTable} from '../../modules/campaign/CampaignTable'
import {CountWidget} from '../../modules/campaign/countWidget/CountWidget'

const DashboardPage: FC = () => (
  <>
    <div className='row gy-5 g-xl-8'></div>
    <div className='row g-5'>
      <div className='col-xxl-12'>
        <CountWidget className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xxl-12'>
        <CampaignTable className='card-xxl-stretch mb-5 mb-xxl-8' showButtons={false} />
      </div>
    </div>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()

  return (
    <>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
