import React, {useEffect, useState} from 'react'

// UiKit
import { ExerciceHeader } from '../uikit/Blocks';
import { ActionButton } from '../uikit/Buttons';

// Utils
import { generateRandomNumber } from '../utils/functions';

const Time = () => {
  const [generatedTime, setGeneratedTime] = useState()
  const [verify, setVerify] = useState(false)

const hours = {
  1: {
    number: '1h',
    japanese: 'いちじ',
    kanji: '一時',
  },
  2: {
    number: '2h',
    japanese: 'にじ',
    kanji: '二時',
  },
  3: {
    number: '3h',
    japanese: 'さんじ',
    kanji: '三時',
  },
  4: {
    number: '4h',
    japanese: 'よじ',
    kanji: '四時',
  },
  5: {
    number: '5h',
    japanese: 'ごじ',
    kanji: '五時',
  },
  6: {
    number: '6h',
    japanese: 'ろくじ',
    kanji: '六時',
  },
  7: {
    number: '7h',
    japanese: 'しちじ',
    kanji: '七時',
  },
  8: {
    number: '8h',
    japanese: 'はちじ',
    kanji: '八時',
  },
  9: {
    number: '9h',
    japanese: 'くじ',
    kanji: '九時',
  },
  10: {
    number: '10h',
    japanese: 'じゅうじ',
    kanji: '十時',
  },
  11: {
    number: '11h',
    japanese: 'じゅういちじ',
    kanji: '十一時',
  },
  12: {
    number: '12h',
    japanese: 'じゅうにじ',
    kanji: '十二時',
  }
};

const minutes = {
  0: {
    japanese: '',
    kanji: '',
    unit: 'ぷん',
  },
  1: {
    japanese: 'いっ',
    kanji: '一',
    unit: 'ぷん',
  },
  2: {
    japanese: 'に',
    kanji: '二',
    unit: 'ふん',
  },
  3: {
    japanese: 'さん',
    kanji: '三',
    unit: 'ぷん',
  },
  4: {
    japanese: 'よん',
    kanji: '四',
    unit: 'ぷん',
  },
  5: {
    japanese: 'ご',
    kanji: '五',
    unit: 'ふん',
  },
  6: {
    japanese: 'ろっ',
    kanji: '六',
    unit: 'ぷん',
  },
  7: {
    japanese: 'なな',
    kanji: '七',
    unit: 'ふん',
  },
  8: {
    japanese: 'はっ',
    kanji: '八',
    unit: 'ぷん',
  },
  9: {
    japanese: 'きゅう',
    kanji: '九',
    unit: 'ふん',
  },
  10: {
    japanese: 'じゅっ',
    kanji: '十',
    unit: 'ぷん',
  },
};

const formatHours = (generatedHours) => {
  return {
    kanji: generatedHours > 0 ? hours[parseInt(generatedHours)].kanji : '',
    japanese: generatedHours > 0 ? hours[parseInt(generatedHours)].japanese : ''
  };
};

const formatMinutes = (generatedMinutes) => {
  const minutesSplitted = generatedMinutes.toString().padStart(2, '0').split('');

  const minutesDecimalKanji = minutesSplitted[0] === '0' ? '' : minutesSplitted[0] === '1' ? '十' : minutes[parseInt(minutesSplitted[0])]?.kanji + '十';
  const minutesDecimalJapanese = minutesSplitted[0] === '0' ? '' : minutesSplitted[0] === '1' ? 'じゅう' : minutes[parseInt(minutesSplitted[0])]?.japanese + 'じゅう';
  const minutesUnitKanji = minutes[parseInt(minutesSplitted[1])].kanji + '分';
  const minutesUnitJapanese = minutes[parseInt(minutesSplitted[1])].japanese + minutes[parseInt(minutesSplitted[1])].unit;

  return {
    decimalJapanese: minutesDecimalJapanese,
    decimalKanji: minutesDecimalKanji,
    unitJapanese: minutesUnitJapanese,
    unitKanji: minutesUnitKanji,
  };
};

const generateTime = () => {
  const generatedHour = generateRandomNumber(12);
  const generatedMinutes = generateRandomNumber(59);

  let newTime = {
    numbers: null,
    kanji: null,
    japanese: null,
    alternativeKanji: null,
    alternativeJapanese: null
  };

  const minutesFormatted = formatMinutes(generatedMinutes);
  const formatedHours = formatHours(generatedHour === 0 ? 12 : generatedHour)
  const timeToDisplay = `${generatedHour}h${generatedMinutes < 10 ? '0' + generatedMinutes : generatedMinutes}`;

  const formatedMinutesKanji = minutesFormatted.decimalKanji + minutesFormatted.unitKanji;
  const formatedMinutesJapanese = minutesFormatted.decimalJapanese + minutesFormatted.unitJapanese;

  // If midnight
  if (generatedHour === 0 && generatedMinutes === 0) {
    newTime.numbers = timeToDisplay;
    newTime.kanji = '夜中';
    newTime.japanese = 'よなか';
  } 
  
  // Else if noon
  else if (generatedHour === 12 && generatedMinutes === 0) {
    newTime.numbers = timeToDisplay;
    newTime.kanji = '正午';
    newTime.japanese = 'しょうご';
  } 
  
  // Else if half hour
  else if (generatedMinutes === 30) {
    newTime.numbers = timeToDisplay;
    newTime.kanji = formatedHours.kanji + formatedMinutesKanji;
    newTime.japanese = formatedHours.japanese + formatedMinutesJapanese;
    newTime.alternativeKanji = formatedHours.kanji + '半';
    newTime.alternativeJapanese = formatedHours.japanese + 'はん';
  } 
  
  // Else if hour minus less than 30 minutes
  else if (generatedMinutes > 30 && generatedMinutes < 60) {
    let minutesLeft = 60 - generatedMinutes;
    let hourRounded = (generatedHour + 1) % 13;

    let minutesLeftFormated = formatMinutes(minutesLeft);
    let hoursFormated = formatHours(hourRounded);

    newTime.numbers = timeToDisplay;
    newTime.kanji = formatedHours.kanji + formatedMinutesKanji;
    newTime.japanese = formatedHours.japanese + formatedMinutesJapanese;
    newTime.alternativeKanji = hoursFormated.kanji + minutesLeftFormated.decimalKanji + minutesLeftFormated.unitKanji + '前';
    newTime.alternativeJapanese = hoursFormated.japanese + minutesLeftFormated.decimalJapanese + minutesLeftFormated.unitJapanese + 'まえ';
  } 

   // Else if hour passed 30 minutes (between 30 and 40)
   else if (generatedMinutes > 30 && generatedMinutes < 40) {
    let minutesLeft = 60 - generatedMinutes;
    let hourRounded = (generatedHour + 1) % 13;

    newTime.numbers = timeToDisplay;
    newTime.kanji = formatedHours.kanji + formatedMinutesKanji;
    newTime.japanese = formatedHours.japanese + formatedMinutesJapanese;
    newTime.alternativeKanji = formatedHours.kanji + '半すぎ';
    newTime.alternativeJapanese = formatedHours.japanese + 'はんすぎ';
  } 
  
  // Else if hour is full
  else if (generatedMinutes === 0) {
    newTime.numbers = timeToDisplay;
    newTime.kanji = formatedHours.kanji;
    newTime.japanese = formatedHours.japanese;
  } 
  
  else {
    newTime.numbers = timeToDisplay;
    newTime.kanji = formatedHours.kanji + formatedMinutesKanji;
    newTime.japanese = formatedHours.japanese + formatedMinutesJapanese;
  }

  return newTime;
};

const handleTime = () => {
  setVerify(false)
  setGeneratedTime(generateTime());
}

const handleVerify = () => {
    setVerify(!verify)
}

useEffect(() => {
  setGeneratedTime(generateTime());
}, []);

  return (
    <section className='section-bottom flex flex-col'>
      <ExerciceHeader title="Quelle heure est-il ?" />
      {generatedTime && 
      <div className='flex flex-col bg-third text-white items-center'>
        <h2 className='font-bold text-3xl md:text-5xl my-5'>{generatedTime.numbers}</h2>
        {verify && <>
          <h4 className='font-bold text-3xl'>{generatedTime.kanji}</h4>
          <p className='w-[90%] font-bold text-center text-xl md:text-2xl my-5' >{generatedTime.japanese}</p>
          {generatedTime.alternativeKanji && 
          <>
          <h5 className='border-t-2 border-fourth text-gold w-full py-3 text-center text-xl font-bold'>Version alternative :</h5>
          <h4 className='font-bold text-3xl'>{generatedTime.alternativeKanji}</h4>
          <p className='w-[90%] font-bold text-center text-xl md:text-2xl my-2 md:my-5'>{generatedTime.alternativeJapanese}</p>
          </>}
        </>
        }
      </div>}
      <div className='absolute bottom-10 w-full flex flex-row justify-center gap-10 md:gap-5 mt-10'>
        {generatedTime && 
          <ActionButton style="bg-gold" action={() => handleVerify()} text={verify ? 'Cacher' : 'Vérifier'} />
        }
        <ActionButton style="bg-blue-600" action={() => handleTime()} text={!generatedTime ? 'Commencer' : 'Suivant'} />
      </div>
    </section>
  )
}

export default Time