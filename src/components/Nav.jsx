import React, { useState } from 'react'

// Icons
import { IoBarbell } from 'react-icons/io5'
import { CgProfile } from "react-icons/cg"
import { FaMagnifyingGlass } from "react-icons/fa6"
import { TbLanguageKatakana } from 'react-icons/tb'

// Router
import { Link, useLocation } from 'react-router-dom'

// Utils
import { mobileChecker } from '../utils/functions'

const MobileNavButton = ({currentLocation, icon, link, text}) => {
  
  let isActiveButton 
  if(link === '/') {
    isActiveButton = currentLocation === link
  } else {
    isActiveButton = currentLocation.includes(link)
  }

  // Active button style
  const activeButton = {
    color: '#653C87'
  }

  return (
    <Link to={link} className='navbarButton' style={isActiveButton ? activeButton : {}}>
      {icon}
      <span className='navbarButtonText'>{text}</span>
    </Link>
  )
}

const MobileNav = ({currentLocation}) => {

  return (
    <nav className='fixed z-50 w-full flex flex-row  justify-evenly items-center bottom-0 border-t-4 bg-fourth border-black border-opacity-15 '>
      <MobileNavButton icon={<TbLanguageKatakana className='navbarButtonIcon'/>} text='kana' link='/' currentLocation={currentLocation} />
      <MobileNavButton icon={<span className='navbarButtonIcon !-mb-1'>字</span>} text='kanji' link='/kanji' currentLocation={currentLocation} />
      <MobileNavButton icon={<IoBarbell className='navbarButtonIcon'/>} text='exercices' link='/exercices' currentLocation={currentLocation} />
      <MobileNavButton icon={<FaMagnifyingGlass className='navbarButtonIcon'/>} text='chercher' link='/search' currentLocation={currentLocation} />
      <MobileNavButton icon={<CgProfile className='navbarButtonIcon'/>} text='mon profil' link='/profil' currentLocation={currentLocation} />
    </nav>
  )
}

const DesktopNav = () => {
  const logo = require('../assets/logo-v2.png')

  return (
    <nav className="relative z-30 flex flex-1 flex-between items-center w-screen pt-2 px-5 mb-2">
      <a href="/" className="flex flex-1 flex-center">
        <img src={logo} alt="Tokyo Study logo" width={200} height={100} className="object-contain" />
      </a>
      <div className="sm:flex flex-1 items-center justify-center hidden">
        <div className="flex flex-1 justify-evenly">
          <p href="/kana" className="nav-button" aria-disabled="true" title="available soon">
            Kana
          </p>
          <p href="/kanji" className="nav-button" aria-disabled="true" title="available soon">
            Kanji
          </p>
          <a href="/exercices" className="nav-button">
            Exercices
          </a>
          <p href="/jlpt/dashboard" className="nav-button" aria-disabled="true" title="available soon">
            JLPT
          </p>
          <p href="/list" className="nav-button" aria-disabled="true" title="available soon">
            Liste
          </p>
          <a href="/search" className="flex items-center justify-center nav-button">
            <FaMagnifyingGlass />
          </a>
          <a href="/profil" className="flex items-center justify-center nav-button gap-1">
            <CgProfile />
          </a>
        </div>
      </div>
    </nav>
  )
}

const Nav = () => {
  const [isOnMobile, setIsOnMobile] = useState(mobileChecker())
  const location = useLocation()

  return (
    <header>
      {(!location.pathname.includes('/register') && location.pathname !== '/login') ?
        isOnMobile ?
          <MobileNav currentLocation={location.pathname} />
        :
          <DesktopNav />  
        :
        <></>
      }
    </header>
  )
}

export default Nav