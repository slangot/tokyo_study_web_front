// React
import { useState } from "react"

// Icons
import { FaBars, FaMagnifyingGlass, FaRegCircleXmark } from "react-icons/fa6"

const Nav = () => {
  // const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 500 || window.innerHeight < 500)
  const [toggleDropdown, setToggleDropdown] = useState(false)

  const logo = require('../assets/logo-v2.png')
  const isSmallScreen = window.innerWidth < 500 || window.innerHeight < 500
  console.log('isSmallScreen : ', isSmallScreen)
  return (
    <header>
    <nav className="relative z-30 flex flex-1 flex-between items-center w-screen pt-2 px-5 mb-2">
      <a href="/" className="flex flex-1 flex-center">
        {isSmallScreen ?
          <img src={logo} alt="Tokyo Study logo" width={100} height={50} className="object-contain" />
          :
          <img src={logo} alt="Tokyo Study logo" width={200} height={100} className="object-contain" />
        }
      </a>

      {/* Desktop Nav */}
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
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden flex">
        {toggleDropdown ? (
          <div className='dropdown'>
            <button className='dropdown_close' onClick={() => setToggleDropdown(false)}><FaRegCircleXmark /></button>
            <p href='/kana'
              className='dropdown_link'
              onClick={() => setToggleDropdown(false)}
              aria-disabled="true"
              title="available soon"
            >
              Kana
            </p>
            <p href='/kanji'
              className='dropdown_link'
              onClick={() => setToggleDropdown(false)}
              aria-disabled="true" title="available soon"
            >
              Kanji
            </p>
            <a href='/exercices'
              className='dropdown_link'
              onClick={() => setToggleDropdown(false)}>
              Exercices
            </a>
            <a href='/search'
              className='dropdown_link flex justify-center items-center gap-2'
              onClick={() => setToggleDropdown(false)}>
              <FaMagnifyingGlass /> Search
            </a>
          </div>)
          :
          <div className="flex items-end justify-center mr-3" onClick={() => setToggleDropdown(true)}>
            <FaBars size={25} />
          </div>
        }
      </div>
    </nav>
    </header>
  )
}

export default Nav