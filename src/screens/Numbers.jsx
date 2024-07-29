import React, {useState} from 'react'

// UiKit
import { BackButton } from "../uikit/Buttons";

const Numbers = () => {
  const [generatedNumber, setGeneratedNumber] = useState()
  const [verify, setVerify] = useState(false)

const hiraganaNumbers = {
  0: {
    japanese: 'ゼーロ',
    kanji: '',
  },
  1: {
    japanese: 'いち',
    kanji: '一',
  },
  2: {
    japanese: 'に',
    kanji: '二',
  },
  3: {
    japanese: 'さん',
    kanji: '三',
  },
  4: {
    japanese: 'よん',
    kanji: '四',
  },
  5: {
    japanese: 'ご',
    kanji: '五',
  },
  6: {
    japanese: 'ろく',
    kanji: '六',
  },
  7: {
    japanese: 'なな',
    kanji: '七',
  },
  8: {
    japanese: 'はち',
    kanji: '八',
  },
  9: {
    japanese: 'きゅう',
    kanji: '九',
  }
};

const hiraganaUnits = {
  10: {
    japanese: 'じゅう',
    kanji: '十',
  },
  100: {
    japanese: 'ひゃく',
    kanji: '百',
  },
  300: {
    japanese: 'びゃく',
    kanji: '百',
  },
  600: {
    japanese: 'っぴゃく',
    kanji: '百',
  },
  800: {
    japanese: 'っぴゃく',
    kanji: '百',
  },
  1000: {
    japanese: 'せん',
    kanji: '千',
  },
  3000: {
    japanese: 'ぜん',
    kanji: '千',
  },
  8000: {
    japanese: 'っせん',
    kanji: '千',
  },
  10000: {
    japanese: 'まん',
    kanji: '万',
  },
};

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 999999) + 1;
}

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

const handleNumber = () => {
  setVerify(false)
  const newNumber = generateRandomNumber()
  const newNumberFormated = convertNumber(newNumber)
  setGeneratedNumber(newNumberFormated)
}

const handleVerify = () => {
    setVerify(!verify)
}

  return (
    <div className='flex flex-col'>
      <div className="relative z-10 flex flex-row items-center justify-center w-full mb-0 px-3 pb-2 border-third border-b-2">
        <BackButton url="/exercices" />
        <h1 className="exerciceTitle">Ça fait combien ?</h1>
      </div>
      {generatedNumber && 
      <div className='flex flex-col bg-third text-white items-center'>
        <h2 className='font-bold text-5xl my-5'>{generatedNumber.number}円</h2>
        {verify && <>
          <h4 className='font-bold text-3xl'>{generatedNumber.kanji}円</h4>
          <p className='font-bold text-2xl my-5' >{generatedNumber.japanese}円</p>
        </>
        }
      </div>}
      <div className='flex flex-row justify-center gap-5 mt-10'>
      {generatedNumber && <button className='px-3 py-2 bg-gold rounded-lg uppercase font-bold'  onClick={() => handleVerify()}>{verify ? 'Cacher' : 'Vérifier'}</button>}
      <button className='px-3 py-2 bg-blue-600 rounded-lg uppercase font-bold' onClick={() => handleNumber()}>{!generatedNumber ? 'Commencer' : 'Suivant'}</button>
      </div>
    </div>
  )
}

export default Numbers