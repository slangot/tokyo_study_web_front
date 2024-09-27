import React, { useState } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { IoBarbell } from 'react-icons/io5'
import { CgProfile } from "react-icons/cg"
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
      <MobileNavButton icon={<CgProfile className='navbarButtonIcon'/>} text='mon profil' link={`/profil/${userId}`} currentLocation={currentLocation} />
    </nav>
  )
}

const DesktopNav = ({token, userId}) => {
  const logo = require('../assets/logo-v2.png')

  return (
    <nav className="relative z-30 flex flex-1 flex-between items-center w-screen pt-2 px-5 mb-2">
      <Link to="/" className="flex flex-1 flex-center">
        <img src={logo} alt="Tokyo Study logo" width={200} height={100} className="object-contain" />
      </Link>
      <div className="sm:flex flex-1 items-center justify-center hidden">
        <div className="flex flex-1 justify-evenly">
          <p href="/kana" className="nav-button" aria-disabled="true" title="available soon">
            Kana
          </p>
          <p href="/kanji" className="nav-button" aria-disabled="true" title="available soon">
            Kanji
          </p>
          <Link to="/exercices" className="nav-button">
            Exercices
          </Link>
          <p href="/jlpt/dashboard" className="nav-button" aria-disabled="true" title="available soon">
            JLPT
          </p>
          <p href="/list" className="nav-button" aria-disabled="true" title="available soon">
            Liste
          </p>
          <Link to="/search" className="flex items-center justify-center nav-button">
            <FaMagnifyingGlass />
          </Link>
          <Link to='/shop' className='flex items-center justify-center nav-button gap-1 text-white'>
            {token || 0}
            <FaCoins className='text-gold'/>
          </Link>
          <Link to={`/profil/${userId}`} className="flex items-center justify-center nav-button gap-1">
            <CgProfile />
          </Link>
        </div>
      </div>
    </nav>
  )
}

const Nav = () => {
  const [isOnMobile, setIsOnMobile] = useState(mobileChecker())
  const location = useLocation()
  const { state, dispatch } = useUser();
  const user = state.user
  
  return (
    <header>
      {(!location.pathname.includes('/register') && location.pathname !== '/login') ?
        isOnMobile ?
          <MobileNav currentLocation={location.pathname} token={user?.token} userId={user?.id} />
        :
          <DesktopNav token={user?.token} userId={user?.id}/>  
        :
        <></>
      }
    </header>
  )
}

export default Nav