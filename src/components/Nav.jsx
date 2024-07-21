// React
import { useState } from "react"

// Icons
import { FaBars, FaMagnifyingGlass, FaRegCircleXmark } from "react-icons/fa6"

const Nav = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false)

  const logo = require('../assets/logo-v2.png')

  return (
    <header>
    <nav className="relative z-30 flex flex-1 flex-between items-center w-screen pt-2 px-5 pb-0 mb-2">
      <a href="/" className="flex flex-1 flex-center">
        <img src={logo} alt="Tokyo Study logo" width={80} height={80} className="object-contain" />
      </a>

      {/* Desktop Nav */}
      <div className="sm:flex flex-1 items-center justify-center hidden">
        <div className="flex flex-1 justify-evenly">
          <a href="/kana" className="">
            Kana
          </a>
          <a href="/kanji" className="">
            Kanji
          </a>
          <a href="/exercices" className="">
            Exercices
          </a>
          <a href="/jlpt/dashboard" className="">
            JLPT
          </a>
          <a href="/list" className="">
            Liste
          </a>
          <a href="/search" className="flex items-center justify-center">
            <FaMagnifyingGlass />
          </a>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden flex">
        {toggleDropdown ? (
          <div className='dropdown'>
            <button className='dropdown_close' onClick={() => setToggleDropdown(false)}><FaRegCircleXmark /></button>
            <a href='/kana'
              className='dropdown_link'
              onClick={() => setToggleDropdown(false)}>
              Kana
            </a>
            <a href='/kanji'
              className='dropdown_link'
              onClick={() => setToggleDropdown(false)}>
              Kanji
            </a>
            <a href='/exercices'
              className='dropdown_link'
              onClick={() => setToggleDropdown(false)}>
              Exercices
            </a>
            <a href='/dictionnary'
              className='dropdown_link'
              onClick={() => setToggleDropdown(false)}>
              Dictionnaire
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