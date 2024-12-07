import React, { useEffect, useState } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { IoPerson } from 'react-icons/io5'
import { CgCloseO, CgProfile } from "react-icons/cg"
import { FaCoins, FaMagnifyingGlass } from "react-icons/fa6"
import { TbCrown } from 'react-icons/tb'
import { FaDumbbell, FaHome } from "react-icons/fa"

// Router
import { Link, useLocation } from 'react-router-dom'

// Utils
import { mobileChecker } from '../utils/functions'

const MobileNavButton = ({currentLocation, icon, link, planGrade, token = null}) => {
  
  let isActiveButton 
  if(link === '/') {
    isActiveButton = currentLocation === link
  } else {
    isActiveButton = currentLocation.includes(link)
  }

  // Active button style
  const activeButton = {
    color: '#006FFF'
  }
  return (
    <Link to={link} className='relative navbarButton' style={isActiveButton ? activeButton : {}}>
      {planGrade === 'Premium' && 
        <div className='absolute top-0 right-3'>
          <TbCrown className='text-medium-grey text-sm'/>
        </div>
      }
      {token !== null ?
        <span className='flex flex-row items-center gap-1'>
          <span className='text-medium-grey font-bold text-xs'>{token <= 99 ? token : "99+"}</span>
            {icon}
          </span>
      :
        <span>{icon}</span>
      } 
    </Link>
  )
}

const MobileNav = ({currentLocation, planGrade, token}) => {
  return (
    <nav className='navbarMobileBlock'>
      <MobileNavButton icon={<FaHome className='navbarButtonIcon'/>} link='/' currentLocation={currentLocation} />
      <MobileNavButton icon={<FaMagnifyingGlass className='navbarButtonIcon'/>} link='/search' currentLocation={currentLocation} />
      <MobileNavButton icon={<FaDumbbell className='navbarButtonIcon'/>} link='/exercices' currentLocation={currentLocation} />
      <MobileNavButton icon={<FaCoins className='navbarButtonIcon'/>} link='/shop' token={token} currentLocation={currentLocation} />
      <MobileNavButton icon={<IoPerson className='navbarButtonIcon'/>} link={'/profil'} currentLocation={currentLocation} planGrade={planGrade} />
    </nav>
  )
}

const DesktopNav = ({token, planGrade}) => {
  const logo = require('../assets/logo-v2.png')
  const { dispatch } = useUser()

  const handleLogout = () => {
    sessionStorage.clear()
    dispatch({ type: 'LOGOUT' })
  };

  return (
    <nav className="relative z-30 flex flex-1 flex-between items-center w-screen pt-2 px-5 mb-2">
      <Link to="/" className="flex flex-1 flex-center">
        <img src={logo} alt="Tokyo Study logo" width={200} height={100} className="object-contain" />
      </Link>
      <div className="sm:flex flex-1 items-center justify-center hidden">
        <div className="flex flex-1 justify-evenly">
          <p to="/" className="nav-button" aria-disabled="true" title="available soon">
            Révisions
          </p>
          {/* <p to="/kanji" className="nav-button" aria-disabled="true" title="available soon">
            Kanji
          </p> */}
          <Link to="/exercices" className="nav-button">
            Exercices
          </Link>
          <Link to="/jlpt/dashboard" className="nav-button" aria-disabled="false" title="available soon">
            JLPT
          </Link>
          <Link to="/list" className="nav-button" aria-disabled="true" title="available soon">
            Liste
          </Link>
          <Link to="/search" className="flex items-center justify-center nav-button">
            <FaMagnifyingGlass />
          </Link>
          <Link to='/shop' className='flex items-center justify-center nav-button gap-1 text-white'>
            {token || 0}
            <FaCoins className='text-medium-grey'/>
          </Link>
          <Link to={'/profil'} className="relative flex items-center justify-center nav-button gap-1">
            <CgProfile />
            {planGrade === 'Premium' && 
              <div className='absolute top-0 -right-2'>
                <TbCrown className='text-medium-grey text-xs'/>
              </div>
            }
          </Link>
          <button onClick={() => handleLogout()} className="flex items-center justify-center nav-button gap-1"><CgCloseO /></button>
        </div>
      </div>
    </nav>
  )
}

const Nav = () => {
  const [isOnMobile, setIsOnMobile] = useState(mobileChecker())
  const location = useLocation()
  const [userTokens, setUserTokens] = useState(sessionStorage.getItem('user_tokens'))
  const [displayNavbar, setDisplayNavbar] = useState(false)
  const planGrade = sessionStorage.getItem('user_plan_grade')?.replace('"', '')?.replace('"', '')
  const { state } = useUser()
  const user = state.user

  useEffect(() => {
    let navbarLocation
    if(location.pathname.includes('/register')) {
      navbarLocation = false
    } else if(location.pathname === '/login' || location.pathname === '/test') {
      navbarLocation = false
    } else if(location.pathname.includes('/exercices/') && isOnMobile) {
      navbarLocation = false
    } else {
      navbarLocation = true
    }
    setDisplayNavbar(navbarLocation)
  }, [location])

  useEffect(() => {
    setUserTokens(parseInt(sessionStorage.getItem('user_tokens')) + parseInt(sessionStorage.getItem('user_daily_tokens')))
  }, [user])

  return (
    <header>
        {displayNavbar ?
          isOnMobile ?
            <MobileNav currentLocation={location.pathname} token={user?.token || userTokens} planGrade={planGrade} />
        :
          <DesktopNav token={userTokens} planGrade={planGrade}/>  
        :
        <></>
      }
    </header>
  )
}

export default Nav