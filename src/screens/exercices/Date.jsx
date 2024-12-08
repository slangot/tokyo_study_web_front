import {useEffect, useState} from 'react'

// Api
import { updateStats, updateTokens } from "../../utils/api";

// Context
import{ useUser } from '../../context/UserContext'

// Package
import { RotatingLines } from "react-loader-spinner"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { Header } from '../../uikit/Blocks';
import { ActionButton } from '../../uikit/Buttons';

// Utils
import { generateRandomNumber } from "../../utils/functions"
import { days, months } from '../../utils/list'

const Date = () => {
  const { dispatch } = useUser();
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_tokens'))
  const daily_tokens = parseInt(sessionStorage.getItem('user_daily_tokens'))
  const userId = sessionStorage.getItem('user_id')

  const [generatedDate, setGeneratedDate] = useState()
  const [isCorrect, setIsCorrect] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verify, setVerify] = useState(false)

const generateDate = () => {
  const generatedYear = generateRandomNumber(150)
  const generatedMonth = generateRandomNumber(12);
  const generatedDays = generateRandomNumber(31);
  const fullGeneratedYear = (generatedYear + 1900)

  const newDate = {
    number: fullGeneratedYear + '年' + months[generatedMonth].number + days[generatedDays].number,
    kanji: fullGeneratedYear + '年' + months[generatedMonth].kanji + days[generatedDays].kanji,
    japanese: fullGeneratedYear + '年' + months[generatedMonth].japanese + days[generatedDays].japanese,
    alternative: fullGeneratedYear + '/' +generatedMonth + '/' + generatedDays
  };

  return newDate;
};

const handleNext = (status) => {
  setIsCorrect(status)
  handleStatsUpdate('date', status)
  setTimeout(() => {
    setIsCorrect(null)
    handleTokenUpdate(1)
    setVerify(false)
    setGeneratedDate(generateDate());
  }, 1000)
}

const handleStart = () => {
  handleTokenUpdate(1)
  setGeneratedDate(generateDate());
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
  setGeneratedDate(generateDate());
  setIsLoading(false)
}, []);

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

  return (
    <section className='exerciceSection md:section-bottom flex flex-col'>
      <Header title="Quel jour est-il ?" link='/exercices'/>
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
      generatedDate && 
      <div className='flex flex-col items-center'>
        <div className='w-full text-center bg-light-blue text-white' style={isCorrect === true ? {backgroundColor: 'green'} : isCorrect === false ? {backgroundColor: 'red'} : {backgroundColor: '#009DFF'}}>
          <h2 className='font-bold text-3xl md:text-5xl my-5'>{generatedDate.alternative}</h2>
        </div>
        {verify && 
        <div className='flex flex-col items-center py-4 first-letter:justify-center mt-5 bg-blue-500 w-full'>
          <h4 className='font-bold text-2xl md:text-3xl'>{generatedDate.kanji}</h4>
          <p className='w-[90%] font-bold text-center text-xl my-5' >{generatedDate.japanese}</p>
        </div>
        }
      </div>
      )}
      <div className='absolute bottom-10 w-full flex flex-col items-center justify-center gap-10 md:gap-5'>
        {!generatedDate ?
          <ActionButton style="bg-blue-500 text-white px-2 md:!py-1" action={() => handleStart()} text={!generatedDate ? 'Commencer' : 'Suivant'} />
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

export default Date