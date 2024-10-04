import { useEffect, useState } from 'react'

// Context
import{ useUser } from '../../context/UserContext'

// Packages
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { ActionButton } from '../../uikit/Buttons';
import { Header } from '../../uikit/Blocks';

const Grammar = () => {
  const { state, dispatch } = useUser();
  const user = state.user
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_token'))
  const userId = sessionStorage.getItem('user_id')

  // Present, past or futur
  const [tenseSelection, setTenseSelection] = useState('')

  //  Positive or negative
  const [positiveSelection, setPositiveSelection] = useState('')

  // Polite or neutral form
  const [formSelection, setFormSelection] = useState('')

  // Te form
  const [teFormSelection, setTeFormSelection] = useState()

  const [verb, setVerb] = useState()
  const [inputValue, setInputValue] = useState('')
  const [answer, setAnswer] = useState('')
  const [answerStatus, setAnswerStatus] = useState()

  const handleReset = () => {
    setVerb(undefined)
    setInputValue('')
    setAnswer('')
    setAnswerStatus(undefined)
    setTenseSelection('')
    setPositiveSelection('')
    setFormSelection('')
  }

  const handleAnswerSetter = (verb) => {
    if(teFormSelection) {
      setAnswer(verb.te)
    } 
    else if(tenseSelection === 'passé') {

      if(positiveSelection === 'positive') {
        setAnswer(formSelection === 'polie' ? verb.mashita : verb.ta)
      }
      else {
        setAnswer(formSelection === 'polie' ? verb.masendeshita : verb.nakatta)
      }
    }
    else if(tenseSelection === 'présent' || tenseSelection === 'futur') {

      if(positiveSelection === 'positive') {
        setAnswer(formSelection === 'polie' ? verb.masu : verb.suru)
      }
      else {
        setAnswer(formSelection === 'polie' ? verb.masen : verb.nai)
      }
    }
  }

  const handleSelections = () => {
    const tense = Math.floor(Math.random() * 3) + 1
    const positive = Math.floor(Math.random() * 2)
    const form = Math.floor(Math.random() * 2)
    const teForm = Math.floor(Math.random() * 2)

    if(teForm) {
      setTeFormSelection(true)
    } else {
      setTeFormSelection(false)
      setTenseSelection(tense === 1 ? 'passé' : tense === 2 ? 'présent' : 'futur')
      setPositiveSelection(positive ? 'positive' : 'négative')
      setFormSelection(form ? 'polie' : 'neutre')
    }
  }

  const fetchData = async () => {
    try {
      if(tokens === 0) {
        Swal.fire({
          title: "Jetons insuffisants",
          text: "Vous n'avez plus assez de jetons pour cet exercice",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#653C87",
          confirmButtonText: "Ajouter des jetons"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/shop')
          } else {
            navigate('/')
          }
        });
      } else {
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const response = await fetch(`${process.env.REACT_APP_API_LOCAL}/vocabulary/verb`, options)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setVerb(data[0])
          updateTokens(1)
        } else {
          setVerb(null)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

const handleButton = () => {
  if(answerStatus !== undefined) {
    handleReset()
    handleSelections()
    fetchData()
  } else {
      setAnswerStatus(answer === inputValue ? 'correct' : 'wrong')
    }
}

const updateTokens = async (number) => {
  try {
    const options = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenNumber: tokens - number,
        userId: userId,
      })
    }
    const query = `${process.env.REACT_APP_API_LOCAL}/user/tokenManager`
    const response = await fetch(query, options);

    if (!response.ok) {
      Swal.fire("Erreur lors de l'opération");
      throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.ok) {
      dispatch({ type: 'UPDATE_TOKEN', payload: tokens - number });
      sessionStorage.setItem('user_token', tokens - number)
    }
  } catch(err) {
    console.error(err)
  }
}

useEffect(() => {
  handleSelections()
  fetchData()
}, [])

useEffect(() => {
  if(verb) {
    handleAnswerSetter(verb)
  }
}, [verb])

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
      <Header title="Conjugaison" link='/exercices' />

      <div className='text-white flex flex-col items-center h-screen bg-third py-5'>
        {verb ? 
        <>
          <h2 className='text-3xl md:text-3xl text-center mb-2 md:mb-4 font-bold'>
            {verb.kanji ? 
              <ruby>{verb?.kanji}<rp>(</rp><rt>{verb.japanese}</rt><rp>)</rp></ruby>
            :
              verb.japanese
            }
            <p className='text-lg'>{verb.french}</p>
          </h2>
          <ul className='bg-fourth w-[90vw] md:w-1/2 px-4 py-2 my-2 rounded-xl'>
            <li className='underline font-bold text-center'>Objectif : </li>
            {teFormSelection ?
              <li className='flex justify-between gap-5'>Forme :<span className='font-bold uppercase'>~て</span></li>
            :
            <>
              <li className='flex justify-between gap-5'>Temps : <span className='font-bold text-blue-500 uppercase'>{tenseSelection}</span></li>
              <li className='flex justify-between gap-5'>Forme : <span className='font-bold text-purple-500 uppercase'>{positiveSelection}</span></li>
              <li className='flex justify-between gap-5'>Structure : <span className='font-bold text-orange-500 uppercase'>{formSelection}</span></li>
            </>
            }
          </ul>
          <input type='text' className='px-3 py-2 w-[90vw] md:w-1/2 rounded-lg my-2 text-black font-bold' value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='votre réponse'/>
          <h3 className='flex items-center justify-center h-20 w-full font-bold text-2xl' style={answerStatus === 'correct' ? {backgroundColor: 'green'} : answerStatus === 'wrong' ? {backgroundColor: 'red'} : {backgroundColor: 'transparent'}}>{answerStatus !== undefined && answer}</h3>
          <ActionButton style="bg-dark-purple px-4 md:py-2 my-1 mt-5 md:mt-0" extraStyle={answerStatus !== undefined ? {backgroundColor: 'rgb(29,78,216)'} : {}} action={handleButton} text={answerStatus !== undefined ? 'Suivant' : 'Vérifier'} />
        </>
        :
          <div className='flex justify-center items-center h-96'>
            <RotatingLines
              visible={true}
              width='96'
              strokeColor='#520380'
              strokeWidth='5'
              animationDuration='0.75'
              ariaLabel='rotating-lines-loading'
            />
          </div>
        }
      </div>
      <h2></h2>
    </section>
  )
}

export default Grammar