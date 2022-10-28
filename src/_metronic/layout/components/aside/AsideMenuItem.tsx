import {FC} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTSVG, toAbsoluteUrl, WithChildren} from '../../../helpers'
import {useLayout} from '../../core'
import {
  TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
  TRIGGER_CAMPAIGN_TABLE_CURRENT_PAGE,
  TRIGGER_QUESTIONNAIRE_CURRENT_PAGE,
} from '../../../../app/redux/actions/actionTypes'
import {useDispatch} from 'react-redux'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  request?: any
  activeIcon?: any
  className?: string
}

const AsideMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  request,
  activeIcon,
  className,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {aside} = config
  const dispatch = useDispatch()

  return (
    <div className='menu-item'>
      <Link
        className={clsx('menu-link without-sub', {active: isActive})}
        to={to}
        onClick={(e) => {
          if (!to) {
            e.preventDefault()
            request()
          }

          dispatch({
            type: TRIGGER_CAMPAIGN_DETAILS_CURRENT_PAGE,
            campaignDetailsTableCurrentPage: 1,
          })

          dispatch({
            type: TRIGGER_CAMPAIGN_TABLE_CURRENT_PAGE,
            campaignTableCurrentPage: 1,
          })
          dispatch({
            type: TRIGGER_QUESTIONNAIRE_CURRENT_PAGE,
            questionnaireCurrentPage: 1,
          })
        }}
      >
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && aside.menuIcon === 'svg' && (
          <span className='menu-icon'>
            {isActive ? (
              <img src={toAbsoluteUrl(activeIcon)} height='20px' alt={title} />
            ) : (
              <img src={toAbsoluteUrl(icon)} height='20px' alt={title} />
            )}
          </span>
        )}
        <span className='menu-title pt-1'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {AsideMenuItem}
