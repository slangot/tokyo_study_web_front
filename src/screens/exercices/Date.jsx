import {useEffect, useState} from 'react'

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
  updateStats('date', status)
  setTimeout(() => {
    setIsCorrect(null)
    updateTokens(1)
    setVerify(false)
    setGeneratedDate(generateDate());
  }, 1000)
}

const handleStart = () => {
  updateTokens(1)
  setGeneratedDate(generateDate());
}

const handleVerify = () => {
    setVerify(!verify)
}

const updateTokens = async (number) => {
  try {
    if(daily_tokens > 0) {
      dispatch({ type: 'UPDATE_DAILY_TOKENS', payload: parseInt(daily_tokens) - number });
      sessionStorage.setItem('user_daily_tokens', parseInt(daily_tokens) - number)
    } else {
      const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenNumber: parseInt(tokens) - number,
          userId: userId,
        })
      }
      const query = `${process.env.REACT_APP_API}/user/tokenManager`
      const response = await fetch(query, options);

      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
        dispatch({ type: 'UPDATE_TOKENS', payload: parseInt(tokens) - number });
        sessionStorage.setItem('user_tokens', parseInt(tokens) - number)
      }
    }
  } catch(err) {
    console.error(err)
  }
}

const updateStats = async (type, status) => {
  try {
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status ? 'correct' : 'wrong',
        type: type,
        userId: userId,
      })
    }
    const query = `${process.env.REACT_APP_API}/egs/`
    const response = await fetch(query, options);

    if (!response.ok) {
      Swal.fire("Erreur lors de l'opération");
      throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.ok) {
    }
  } catch(err) {
    console.error(err)
  }
}

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
              strokeColor="#520380"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        ) : (
      generatedDate && 
      <div className='flex flex-col items-center'>
        <div className='w-full text-center bg-third text-white' style={isCorrect === true ? {backgroundColor: 'green'} : isCorrect === false ? {backgroundColor: 'red'} : {backgroundColor: '#653C87'}}>
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