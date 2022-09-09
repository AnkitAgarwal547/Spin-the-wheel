import {FC} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTSVG, toAbsoluteUrl, WithChildren} from '../../../helpers'
import {useLayout} from '../../core'

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
              // <KTSVG path={activeIcon} className={className} />
              <img src={toAbsoluteUrl(activeIcon)} height='20px' alt={title} />
            ) : (
              // <KTSVG path={icon} className={className} />
              <img src={toAbsoluteUrl(icon)} height='20px' alt={title} />
            )}
          </span>
        )}
        {/* {fontIcon && <i className={clsx('fa fs-3 me-5', fontIcon)}></i>} */}
        <span className='menu-title pt-1'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {AsideMenuItem}
