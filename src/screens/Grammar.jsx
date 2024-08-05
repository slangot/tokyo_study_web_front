import React, { useEffect, useState } from 'react'

// Packages
import { RotatingLines } from 'react-loader-spinner'

const Grammar = () => {
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
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch('http://localhost:3001/vocabulary/verb', options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const data = await response.json();
        setVerb(data[0])
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

useEffect(() => {
  handleSelections()
  fetchData()
}, [])

useEffect(() => {
  if(verb) {
    handleAnswerSetter(verb)
  }
}, [verb])

  return (
    <div>
      <h1 className='flex justify-center text-center text-3xl uppercase text-primary my-3 font-extrabold'>Grammar Exercice</h1>
      <div className='flex flex-col items-center bg-third py-5'>
        {verb ? 
        <>
          <h2 className='text-5xl text-center mb-4 font-bold'>
            {verb.kanji ? 
              <ruby>{verb?.kanji}<rp>(</rp><rt>{verb.japanese}</rt><rp>)</rp></ruby>
            :
              verb.japanese
            }
            <p className='text-xl'>{verb.french}</p>
          </h2>
          <ul className='bg-fourth px-4 py-2 my-4 rounded-xl'>
            <li className='underline font-bold text-center mb-4'>Objectif : </li>
            {teFormSelection ?
              <li className='flex justify-between gap-5'>Forme :<span className='font-bold uppercase'>~て</span></li>
            :
            <>
              <li className='flex justify-between gap-5'>Temps : <span className='font-bold uppercase'>{tenseSelection}</span></li>
              <li className='flex justify-between gap-5'>Forme : <span className='font-bold uppercase'>{positiveSelection}</span></li>
              <li className='flex justify-between gap-5'>Structure : <span className='font-bold uppercase'>{formSelection}</span></li>
            </>
            }
          </ul>
          <input type='text' className='px-3 py-2 rounded-lg my-2 text-black font-bold' value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='votre réponse'/>
          <h3 className='flex items-center justify-center h-20 w-full font-bold text-2xl' style={answerStatus === 'correct' ? {backgroundColor: 'green'} : answerStatus === 'wrong' ? {backgroundColor: 'red'} : {backgroundColor: 'transparent'}}>{answerStatus !== undefined && answer}</h3>
          <button className='bg-dark-purple px-4 py-2 rounded-lg uppercase font-bold my-5'　style={answerStatus !== undefined ? {backgroundColor: 'rgb(29,78,216)'} : {}} onClick={() => handleButton()}>{answerStatus !== undefined ? 'Suivant' : 'Vérifier'}</button>
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
    </div>
  )
}

export default Grammar