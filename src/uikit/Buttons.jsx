// React
import React from "react"

// Icons
import { FaArrowLeft, FaEye, FaEyeSlash, FaGear, FaLock, FaUnlock } from "react-icons/fa6";

// Packages
import { Link } from "react-router-dom";

export const BackButton = ({ url }) => {

  return (
    <Link to={url} className="flex items-center justify-center"><FaArrowLeft /></Link>
  )
}

export const ExerciceQuizButton = ({ content, action, isAnswer, showAnswers, mainLanguage, showFurigana, exerciceType }) => {
  const isSmallScreen = window.innerWidth < 500 || window.innerHeight < 500
  const isLongContent = exerciceType === "sentence"
  return (
    <div
      onClick={() => action(isAnswer)}
      className={isLongContent ? 'exerciceLongContentDisplay' : 'exerciceShortContentDisplay'}
      style={showAnswers ? isAnswer ? { backgroundColor: "rgba(37, 161, 31, 0.8)" } : { backgroundColor: "rgba(186, 36, 9, 0.8)" } : { backgroundColor: 'rgb(31 41 55)' }}
    >
      {mainLanguage === 'fr' ?
        showFurigana ?
          content.kanji ?
            <>
              <p className="flex text-center flex-col text-lg md:text-4xl w-full text-wrap break-words text-ellipsis">
                {content.kanji}
              </p>
              <p className="flex text-center flex-col w-full text-wrap break-words text-ellipsis md:mt-2" style={{ color: 'orange' }}>
                {content.japanese}
              </p>
            </>
            :
            <p>{content.japanese}</p>
          :
          <p className="flex flex-col w-full text-center text-wrap break-words text-ellipsis" style={isSmallScreen ? {fontSize: '1.5rem', lineHeight: '1.5rem'} : content.kanji ? {fontSize: '2.3rem', lineHeight: '2.5rem'} : {fontSize: '1.2rem', lineHeight: '1.5rem'}}>
            {content.kanji || content.japanese}
          </p>
        :
        <p className="text-center">{content.french}</p>
      }
    </div>
  )
}

export const EyeButton = ({ state, setState, label }) => {
  const isSmallScreen = window.innerWidth < 500 || window.innerHeight < 500
  // const color = isSmallScreen ? 'black' : 'white'
  const color = 'white'
  const handleClick = () => {
    setState(!state)
  }
  return (
    <button onClick={() => handleClick()}>
      {state ? <FaEyeSlash color={color} size={20} /> : <FaEye color={color} size={20} />}
    </button>
  )
}

export const SettingsButton = ({ state, setState }) => {
  const handleClick = () => {
    setState(!state)
  }
  return (
    <button onClick={() => handleClick()}>
      <FaGear />
    </button>
  )
}

export const SelectButton = ({ setState, values, labels, type }) => {
  const handleSelectChange = (value) => {
    if (type === "number") {
      parseInt(value)
    }
    setState(value)
  }

  return (
    <select className="text-dark bg-dark w-1/2 h-10" onChange={(e) => handleSelectChange(e.target.value)}>
      {values.map((value, index) => (
        <option key={index} value={value} className="text-dark">{labels[index]}</option>
      ))}
    </select>
  )
}

export const ReadingDisplay = ({ state, setState }) => {
  const handleClick = (choice) => {
    setState(choice)
  }
  return (
    <div className="flex items-center font-bold w-[300px] md:w-2/4 mx-5 my-2 md:my-0 md:mb-2 md:mx-auto border-2 border-medium-dark rounded-lg">
      <div className="readingChoiceButton rounded-l-md" style={state === 'kanji' ? { backgroundColor: 'white', color: 'black', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleClick('kanji')}>字</div>
      <div className="readingChoiceButton" style={state === 'kana' ? { backgroundColor: 'white', color: 'black', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleClick('kana')}>かな</div>
      <div className="readingChoiceButton rounded-r-md" style={state === 'furigana' ? { backgroundColor: 'white', color: 'black', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleClick('furigana')}>ふりがな</div>
    </div>
  )
}

export const ActionButton = ({action, icon = null, text, style = null, extraStyle = null}) => {

  return (
    <button className={`px-3 py-2 text-white rounded-lg uppercase font-bold ${style}`} style={extraStyle} onClick={() => action()}>
      {icon}{text}
    </button>
  )
}

export const SliderButtons = ({isLocked = false, link, text}) => {
  return (
    <Link to={isLocked ? null : link} className="relative flex flex-col w-[100px] h-[130px] bg-medium-blue rounded-xl border-medium-blue border-2 shadow-md">
      <div className="w-[90px] h-[90px] bg-white rounded-xl" />
      <p className="flex w-[90px] h-[40px] justify-center items-center text-sm text-white">{text}</p>
      {isLocked && 
        <div className="absolute top-2 right-2 text-medium-grey">
          <FaLock />
        </div>
      }
    </Link>
  )
}

export const ChallengeBannerButton = ({theme, link, text}) => {
  const shibaHero = require("../assets/decorations/shiba-hero.png")

  let appliedColor
  let appliedLeftDecoration
  let appliedRightDecoration

  if(theme === "autumn") {
    appliedColor = "#EB6323"
    appliedLeftDecoration = require("../assets/decorations/momiji-single-leaf.png")
    appliedRightDecoration = require("../assets/decorations/momiji-revert-leaves.png")
  } else if(theme === "spring") {
    appliedColor = "#FF8DC3"
  } else {
    appliedColor = "#006FFF"
  }

  const themeStyle = {
    backgroundColor: appliedColor,
    border: `2px solid ${appliedColor}`
  }

  return (
    <Link to={link} className="relative flex flex-col w-auto mx-10 shadow-md h-24 mt-10 rounded-xl" style={themeStyle}>
      <p className="relative z-10 text-sm font-semibold text-medium-grey pt-3 pl-5">Challenge du jour</p>
      <h2 className="relative z-20 text-white text-center font-extrabold italic text-3xl text-light-shadow">{text.toUpperCase()}</h2>
      <div className="absolute w-16 right-0 -top-3">
        <img src={shibaHero} className="relative z-20 object-contain" />
        <div className="absolute z-10 w-20 right-0 -bottom-4">
          <img src={appliedRightDecoration} className="object-contain" />
        </div>
      </div>
      <div className="absolute w-8 left-1 top-1">
        <img src={appliedLeftDecoration} className="object-contain" />
      </div>
    </Link>
  )
}

export const ExercicesButton = ({type, isUnlocked = false, link, text}) => {
  const isPremium = type === "premium"
  return (
    <Link 
      to={isPremium && !isUnlocked ? null : link} 
      className="relative flex flex-col w-auto mx-10 shadow-sm h-auto py-3 my-4 bg-white rounded-xl"
      style={{}}
    >
      <h2 className="relative z-20 text-medium-grey text-center text-lg text-light-shadow">{text.toUpperCase()}</h2>
      {isPremium && 
        <div className="absolute right-3 top-1/3">
          {isUnlocked ? 
            <FaUnlock className="text-sky-blue"/>
          :
            <FaLock />
          }
        </div>
      }
    </Link>
  )
}