import React, {useEffect, useState} from 'react'

// Api
import { updateStats, updateTokens } from "../../utils/api";

// Context
import{ useUser } from '../../context/UserContext'

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { Header } from '../../uikit/Blocks';
import { ActionButton } from "../../uikit/Buttons";

// Utils
import { generateRandomNumber } from '../../utils/functions';
import { hiraganaNumbers, hiraganaUnits } from '../../utils/list';

const Numbers = () => {
  const { dispatch } = useUser();
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_tokens'))
  const daily_tokens = parseInt(sessionStorage.getItem('user_daily_tokens'))
  const userId = sessionStorage.getItem('user_id')

  const [generatedNumber, setGeneratedNumber] = useState()
  const [isCorrect, setIsCorrect] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verify, setVerify] = useState(false)

// Function to concatenate the correct reading
const addUnitReading = (number, unit, type) => {
  let unitReading
    
    switch(number){
      case 3:
        unitReading = type === 'japanese' ? 
          'さん' + hiraganaUnits[unit === 100 ? 300 : 3000].japanese 
        : 
          hiraganaNumbers[number].kanji + hiraganaUnits[unit].kanji
        break
      case 6:
        unitReading = type === 'japanese' ? 
          unit === 100 ? 
            'ろ' + hiraganaUnits[600].japanese 
          :
            'ろく' + hiraganaUnits[1000].japanese 
        :
          hiraganaNumbers[number].kanji + hiraganaUnits[unit].kanji
        break
      case 8:
        unitReading = type === 'japanese' ? 
          'は' + hiraganaUnits[unit === 100 ? 800 : 8000].japanese
        :
          hiraganaNumbers[number].kanji + hiraganaUnits[unit].kanji
        break
      default:
        unitReading = type === 'japanese' ? 
          hiraganaNumbers[number].japanese + hiraganaUnits[unit].japanese 
        : 
          hiraganaNumbers[number].kanji + hiraganaUnits[unit].kanji
        break
    }
  return unitReading
}

const convertNumber = (number) => {
  if (number === 0) return hiraganaNumbers[0];
  let currentNumber = number
  let japanese = ''
  let kanji = ''
  let man
  let sen
  let hyaku
  let juu

  if(currentNumber >= 10000) {
    man = Math.floor(currentNumber / 10000)
    if(man >= 10) {
      const manConverted = convertNumber(man)
      japanese += manConverted.japanese + hiraganaUnits[10000].japanese
      kanji += manConverted.kanji + hiraganaUnits[10000].kanji
    } else {
      japanese += hiraganaNumbers[man].japanese + hiraganaUnits[10000].japanese
      kanji += hiraganaNumbers[man].kanji + hiraganaUnits[10000].kanji
    }
    currentNumber %= 10000
  }

  if(currentNumber >= 1000) {
    sen = Math.floor(currentNumber / 1000)
    if(sen === 1) {
      japanese += hiraganaUnits[1000].japanese
      kanji += hiraganaUnits[1000].kanji
    } else {
      japanese += addUnitReading(sen, 1000, 'japanese')
      kanji += addUnitReading(sen, 1000, 'kanji')
    }
    currentNumber %= 1000
  }

  if(currentNumber >= 100) {
    hyaku = Math.floor(currentNumber / 100)
    if(hyaku === 1) {
    japanese += hiraganaUnits[100].japanese
    kanji += hiraganaUnits[100].kanji
    } else {
      japanese += addUnitReading(hyaku, 100, 'japanese')
      kanji += addUnitReading(hyaku, 100, 'kanji')
    }
    currentNumber %= 100
  }

  if(currentNumber >= 10) {
    juu = Math.floor(currentNumber / 10)
    if(juu === 1) {
      japanese += hiraganaUnits[10].japanese
      kanji += hiraganaUnits[10].kanji
    } else {
      japanese += hiraganaNumbers[juu].japanese + hiraganaUnits[10].japanese
      kanji += hiraganaNumbers[juu].kanji + hiraganaUnits[10].kanji
    }
    currentNumber %= 10
  }

  if (currentNumber >= 1) {
    japanese += hiraganaNumbers[currentNumber].japanese
    kanji += hiraganaNumbers[currentNumber].kanji
  }

  return {number, japanese, kanji}
}

const handleNext = (status) => {
  setIsCorrect(status)
  handleStatsUpdate('number', status)
  setTimeout(() => {
    setIsCorrect(null)
    setVerify(false)
    const newNumber = generateRandomNumber(999999)
    const newNumberFormated = convertNumber(newNumber)
    setGeneratedNumber(newNumberFormated)
    handleTokenUpdate(1)
  }, [1000])
}

const handleStart = () => {
  const newNumber = generateRandomNumber(999999)
  const newNumberFormated = convertNumber(newNumber)
  setGeneratedNumber(newNumberFormated)
  handleTokenUpdate(1)
}

const handleVerify = () => {
    setVerify(!verify)
}

const handleTokenUpdate = async (number) => {
  await updateTokens(number, daily_tokens, tokens, userId, dispatch, "reduce");
};

const handleStatsUpdate = async (type, status) => {
  await updateStats(type, status, userId);
};

useEffect(() => {
  if(tokens < 0) {
    Swal.fire({
      title: "Jetons insuffisants",
      text: "Vous n'avez plus assez de jetons pour cet exercice",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#9d5f02",
      confirmButtonText: "Ajouter des jetons"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/shop')
      } else {
        navigate('/')
      }
    });
  }
}, [tokens])

useEffect(() => {
  handleStart()
  setIsLoading(false)
}, [])

  return (
    <section className='exerciceSection md:section-bottom flex flex-col'>
      <Header title="Ça fait combien ?" link='/exercices' />
      {isLoading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <RotatingLines
              visible={true}
              width="96"
              strokeColor="#006FFF"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        ) : (
        generatedNumber && 
        <div className='flex flex-col items-center text-center'>
          <div className='w-full text-center bg-light-blue text-white' style={isCorrect === true ? {backgroundColor: 'green'} : isCorrect === false ? {backgroundColor: 'red'} : {backgroundColor: '#009DFF'}}>
            <h2 className='font-bold text-3xl md:text-5xl my-5'>{generatedNumber.number} 円</h2>
          </div>
          {verify && 
          <div className='flex flex-col items-center py-4 first-letter:justify-center mt-5 bg-blue-500 w-full'>
            <h4 className='font-bold text-3xl mt-5'>{generatedNumber.kanji}円</h4>
            <p className='w-[90%] font-bold text-xl md:text-2xl my-10 md:my-5' >{generatedNumber.japanese}円</p>
          </div>
          }
        </div>
        )}
      <div className='absolute bottom-10 w-full flex flex-col items-center justify-center gap-10 md:gap-5'>
      {!generatedNumber ?
        <ActionButton style="bg-blue-500 text-white px-2 md:!py-1" action={() => handleStart()} text={!generatedNumber ? 'Commencer' : 'Suivant'} />
      :
        <ActionButton style="bg-blue-500 text-white px-2 md:!py-1" action={handleVerify} text={verify ? 'Cacher' : 'Vérifier'} />
      }
       <div className='relative flex flex-row justify-center gap-5'>
          <ActionButton style="bg-red-600 text-white min-w-[30dvw] md:min-w-[15dvw] md:!py-1" action={() => handleNext(false)} text='Faux' />
          <ActionButton style="bg-green-600 text-white min-w-[30dvw] md:min-w-[15dvw] md:!py-1" action={() => handleNext(true)} text='Correct' />
        </div>
      </div>
    </section>
  )
}

export default Numbers