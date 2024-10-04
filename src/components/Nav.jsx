import React, { useEffect, useState } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { IoBarbell, IoClose } from 'react-icons/io5'
import { CgCloseO, CgProfile } from "react-icons/cg"
import { FaCoins, FaMagnifyingGlass } from "react-icons/fa6"
import { FiBook } from 'react-icons/fi'

// Router
import { Link, useLocation } from 'react-router-dom'

// Utils
import { mobileChecker } from '../utils/functions'

const MobileNavButton = ({currentLocation, icon, link, text, token = null}) => {
  
  let isActiveButton 
  if(link === '/') {
    isActiveButton = currentLocation === link
  } else {
    isActiveButton = currentLocation.includes(link)
  }

  // Active button style
  const activeButton = {
    color: 'rgb(234,179,8)',
  }
  return (
    <Link to={link} className='navbarButton' style={isActiveButton ? activeButton : {}}>
      {isActiveButton && <div className='navbarButtonDecoration' />}
      {token !== null ?
        <span className='flex flex-row items-center gap-1'>
          <span className='text-gold font-bold text-xs'>{token <= 99 ? token : "99+"}</span>
            {icon}
          </span>
      :
        <span>{icon}</span>
      } 
      <span className='navbarButtonText'>{text}</span>
    </Link>
  )
}

const MobileNav = ({currentLocation, token, userId}) => {
  return (
    <nav className='fixed z-40 w-full flex flex-row  justify-evenly items-center bottom-0 border-t-4 bg-fourth border-black border-opacity-15 '>
      <MobileNavButton icon={<FiBook className='navbarButtonIcon'/>} text='cours' link='/lessons' currentLocation={currentLocation} />
      <MobileNavButton icon={<FaMagnifyingGlass className='navbarButtonIcon'/>} text='chercher' link='/search' currentLocation={currentLocation} />
      <MobileNavButton icon={<IoBarbell className='navbarButtonIcon'/>} text='exercices' link='/exercices' currentLocation={currentLocation} />
      <MobileNavButton icon={<FaCoins className='navbarButtonIcon'/>} text='boutique' link='/shop' token={token} currentLocation={currentLocation} />
      <MobileNavButton icon={<CgProfile className='navbarButtonIcon'/>} text='mon profil' link={'/profil'} currentLocation={currentLocation} />
    </nav>
  )
}

const DesktopNav = ({token, userId}) => {
  const logo = require('../assets/logo-v2.png')
  const { state, dispatch } = useUser();

  const handleLogout = () => {
    sessionStorage.clear()
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <nav className="relative z-30 flex flex-1 flex-between items-center w-screen pt-2 px-5 mb-2">
      <Link to="/" className="flex flex-1 flex-center">
        <img src={logo} alt="Tokyo Study logo" width={200} height={100} className="object-contain" />
      </Link>
      <div className="sm:flex flex-1 items-center justify-center hidden">
        <div className="flex flex-1 justify-evenly">
          <p to="/kana" className="nav-button" aria-disabled="true" title="available soon">
            Kana
          </p>
          <p to="/kanji" className="nav-button" aria-disabled="true" title="available soon">
            Kanji
          </p>
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
            {token || 0}
            <FaCoins className='text-gold'/>
          </Link>
          <Link to={'/profil'} className="flex items-center justify-center nav-button gap-1">
            <CgProfile />
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
  const [userTokens, setUserTokens] = useState(sessionStorage.getItem('user_token'))
  const token = sessionStorage.getItem('user_token')
  // const userId = sessionStorage.getItem('user_user_id')
  const userId = sessionStorage.getItem('user_id')

  const { state, dispatch } = useUser();
  const user = state.user

  useEffect(() => {
    setUserTokens(sessionStorage.getItem('user_token'))
  }, [user])
  
  return (
    <header>
      {(!location.pathname.includes('/register') && location.pathname !== '/login' && location.pathname !== '/test') ?
        isOnMobile ?
          !location.pathname.includes('/exercices/') &&
            <MobileNav currentLocation={location.pathname} token={user?.token || userTokens} userId={userId} />
        :
          <DesktopNav token={userTokens} userId={userId}/>  
        :
        <></>
      }
    </header>
  )
}

export default Nav