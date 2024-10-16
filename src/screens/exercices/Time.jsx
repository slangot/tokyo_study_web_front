import React, {useEffect, useState} from 'react'

// Api
import { updateStats, updateTokens } from "../../utils/api";

// Context
import{ useUser } from '../../context/UserContext'

// Packages
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { Header } from '../../uikit/Blocks';
import { ActionButton } from '../../uikit/Buttons';

// Utils
import { generateRandomNumber } from '../../utils/functions';
import { hours, minutes } from '../../utils/list';

const Time = () => {
  const { dispatch } = useUser();
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_tokens'))
  const daily_tokens = parseInt(sessionStorage.getItem('user_daily_tokens'))
  const userId = sessionStorage.getItem('user_id')

  const [generatedTime, setGeneratedTime] = useState()
  const [isCorrect, setIsCorrect] = useState(null)
  const [verify, setVerify] = useState(false)

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

  const handleNext = (status) => {
    setIsCorrect(status)
    handleStatsUpdate('time', status)
    setTimeout(() => {
      setIsCorrect(null)
      handleTokenUpdate(1)
      setVerify(false)
      setGeneratedTime(generateTime());
    }, 1000)
  }

  const handleStart = () => {
    handleTokenUpdate(1)
    setGeneratedTime(generateTime());
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
    } else {
      setGeneratedTime(generateTime());
    }
  }, [tokens])

  return (
    <section className='exerciceSection section-bottom flex flex-col'>
      <Header title="Quelle heure est-il ?" link='/exercices' />
      {generatedTime && 
      <div className='flex flex-col items-center'>
        <div className='w-full text-center bg-third text-white' style={isCorrect === true ? {backgroundColor: 'green'} : isCorrect === false ? {backgroundColor: 'red'} : {backgroundColor: '#653C87'}}>
          <h2 className='font-bold text-3xl md:text-5xl my-5'>{generatedTime.numbers}</h2>
        </div>
        {verify && 
        <div className='flex flex-col items-center py-4 first-letter:justify-center mt-5 bg-blue-500 w-full'>
          <h4 className='font-bold text-3xl'>{generatedTime.kanji}</h4>
          <p className='w-[90%] font-bold text-center text-xl md:text-2xl my-5' >{generatedTime.japanese}</p>
          {generatedTime.alternativeKanji && 
          <>
            <h5 className='border-t-2 border-fourth text-black w-full py-3 text-center text-xl font-bold'>Version alternative :</h5>
            <h4 className='font-bold text-3xl'>{generatedTime.alternativeKanji}</h4>
            <p className='w-[90%] font-bold text-center text-xl md:text-2xl my-2 md:my-5'>{generatedTime.alternativeJapanese}</p>
          </>}
        </div>
        }
      </div>}
      <div className='absolute bottom-10 w-full flex flex-col items-center justify-center gap-10 md:gap-5'>
        {!generatedTime ?
          <ActionButton style="bg-blue-500 text-white px-2 md:!py-1" action={() => handleStart()} text={!generatedTime ? 'Commencer' : 'Suivant'} />
        :
          <ActionButton style="bg-blue-500 text-white px-2 md:!py-1" action={() => handleVerify()} text={verify ? 'Cacher' : 'Vérifier'} />
        }
        <div className='relative flex flex-row justify-center gap-5'>
          <ActionButton style="bg-red-600 text-white min-w-[30dvw] md:min-w-[15dvw] md:!py-1" action={() => handleNext(false)} text='Faux' />
          <ActionButton style="bg-green-600 text-white min-w-[30dvw] md:min-w-[15dvw] md:!py-1" action={() => handleNext(true)} text='Correct' />
        </div>
      </div>
    </section>
  )
}

export default Time