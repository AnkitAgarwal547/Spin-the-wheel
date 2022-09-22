import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router'
import {getUserCampaignDetailsRequest} from '../../../../../app/modules/auth/core/_requests'
import SpinTheWheel from './campaign-types/SpinTheWheel/SpinTheWheel'
import './UserCampaignWrapper.scss'

export default function UserCampaignWrapper() {
  const search = useLocation().search
  const id = new URLSearchParams(search).get('id')
  const [campaignDetails, setCampaignDetails] = useState<any>({})
  const [loading, setLoading] = useState(false)
  console.log(
    '🚀 ~ file: UserCampaignWrapper.tsx ~ line 9 ~ UserCampaignWrapper ~ campaignDetails',
    campaignDetails
  )
  console.log('🚀 ~ file: UserCampaignWrapper.tsx ~ line 8 ~ UserCampaignWrapper ~ id', id)
  useEffect(() => {
    setLoading(true)
    getUserCampaignDetailsRequest(id)
      .then((resp) => {
        setLoading(false)
        setCampaignDetails(resp.data.data)
        console.log('🚀 ~ file: CampaignDetailsWrapper.tsx ~ line 34 ~ .then ~ resp', resp)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <div
        className='user-campaign-spin-wheel'
        style={{
          backgroundImage: `url(${campaignDetails?.backimg})`,
        }}
      >
        {campaignDetails && campaignDetails.type === 'SPIN_THE_WHEEL' && (
          <SpinTheWheel details={campaignDetails} />
        )}
      </div>
    </>
  )
}
