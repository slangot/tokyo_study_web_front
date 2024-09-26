// React
import React from "react"

// Icons
import { FaArrowLeft, FaEye, FaEyeSlash, FaGear } from "react-icons/fa6";

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
    <div className="flex items-center font-bold w-[300px] md:w-3/4 mx-5 my-2 md:mb-5 md:mx-auto border-2 border-medium-dark rounded-lg bg-dark">
      <div className="readingChoiceButton rounded-l-md" style={state === 'kanji' ? { backgroundColor: 'white', color: 'black', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleClick('kanji')}>字</div>
      <div className="readingChoiceButton" style={state === 'kana' ? { backgroundColor: 'white', color: 'black', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleClick('kana')}>かな</div>
      <div className="readingChoiceButton rounded-r-md" style={state === 'furigana' ? { backgroundColor: 'white', color: 'black', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleClick('furigana')}>ふりがな</div>
    </div>
  )
}

export const ActionButton = ({action, icon = null, text, style = null, extraStyle = null}) => {

  return (
    <button className={`px-3 py-2 text-gold rounded-lg uppercase font-bold ${style}`} style={extraStyle} onClick={() => action()}>
      {icon}{text}
    </button>
  )
}