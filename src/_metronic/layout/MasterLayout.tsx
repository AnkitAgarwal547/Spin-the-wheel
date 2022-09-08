import {createContext, useEffect, useRef} from 'react'
import {Outlet} from 'react-router-dom'
import {AsideDefault} from './components/aside/AsideDefault'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {PageDataProvider} from './core'
import {useLocation} from 'react-router-dom'
import {UpgradePlan, ThemeModeProvider} from '../partials'
import {MenuComponent} from '../assets/ts/components'

export const AsideContext = createContext({asideRef: {}, minimize: () => {}})
const MasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])

  const asideRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const minimize = () => {
    console.log('dajsgh')
    asideRef.current?.classList.add('animating')
    setTimeout(() => {
      asideRef.current?.classList.remove('animating')
    }, 300)
  }

  return (
    <PageDataProvider>
      <ThemeModeProvider>
        <AsideContext.Provider
          value={{
            asideRef: asideRef,
            minimize: minimize,
          }}
        >
          <div className='page d-flex flex-row flex-column-fluid'>
            <AsideDefault asideRef={asideRef} minimize={minimize} />

            <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
              <HeaderWrapper asideRef={asideRef} minimize={minimize} />
              <div id='kt_content' className='d-flex flex-column flex-column-fluid'>
                <div className='post d-flex flex-column-fluid' id='kt_post'>
                  <Content>
                    <Outlet />
                  </Content>
                </div>
              </div>
            </div>
          </div>
        </AsideContext.Provider>
      </ThemeModeProvider>
    </PageDataProvider>
  )
}

export {MasterLayout}
