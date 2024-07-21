import React, { useState } from 'react'

// Icons
import { ImCheckmark } from 'react-icons/im'
import { CgClose } from 'react-icons/cg';

// Packages
import { RotatingLines } from 'react-loader-spinner'
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa6';

function List() {
  const [data, setData] = useState()
  const [exerciceType, setExerciceType] = useState('kanji')
  const [level, setLevel] = useState(5)
  const [revision, setRevision] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const fetchData = async (exerciceType, level, revision) => {
    try {
      const revisionMode = revision === 'all' ? '' : `&revision=${revision}`
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const query = `https://www.data.tsw.konecton.com/${exerciceType}?level=${level}${revisionMode}&limit=10`     

      const response = await fetch(query, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

    const data = await response.json();
  if (data && data.length > 0) {
            setData(data)
          }
          setIsLoading(false)
    } catch (error) {
      console.error('error : ', error)
    }
}

const handleNext = () => {
  setIsLoading(true)
  setData()
  setShowAnswer(false)
  fetchData(exerciceType, level, revision)
}

const handleRevision = (status) => {
    setRevision(status)
}

const handleAnswer = async (id, status) => {
  const options = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const query =`https://www.data.tsw.konecton.com/${exerciceType}/update?id=${id}&status=${status}`
  const response = await fetch(query, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

  return (
    <div className='flex flex-col justify-center items-center mt-3'>
      <h1>Exercice de Liste</h1>
      <div className='flex flex-row gap-5 my-3'>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={exerciceType === 'kanji' ? {backgroundColor: '#520380'} : {}} onClick={() => setExerciceType('kanji')}>Kanji</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={exerciceType === 'vocabulary' ? {backgroundColor: '#520380'} : {}} onClick={() => setExerciceType('vocabulary')}>Vocabulaire</button>
      </div>
      <div className='flex flex-row bg-fourth rounded-lg my-3'>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 6 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(6)}>+</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 5 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(5)}>N5</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 4 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(4)}>N4</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 3 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(3)}>N3</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 2 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(2)}>N2</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 1 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(1)}>N1</button>
      </div>
      <div className='flex flex-col gap-2 my-3 px-3 py-2 bg-secondary rounded-lg items-center justify-center'>
        <p>Mode révision :</p>
        <div className='flex flex-row gap-2 justify-center items-center'>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('all')} style={revision === 'all' ? {backgroundColor: 'blue'} : {}}>Tous</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('study')} style={revision === 'study' ? {backgroundColor: 'blue'} : {}}>En cours</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('correct')} style={revision === 'correct' ? {backgroundColor: 'blue'} : {}}>Correct</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('wrong')} style={revision === 'wrong' ? {backgroundColor: 'blue'} : {}}>Faux</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('new')} style={revision === 'new' ? {backgroundColor: 'blue'} : {}}>Nouveau</button>
        </div>
      </div>
      <button className='px-3 py-2 text-black font-bold bg-gold mb-4 rounded' disabled={!exerciceType || !level} onClick={() => handleNext()}>C'est parti !</button>
      {isLoading ?
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
  :
  <>
      <div className='flex flex-row flex-wrap justify-center items-center font-bold mb-5'>
        {data && data.map((word, index) => {
              return (
                    <div key={index} className='relative flex flex-col text-center px-5 py-3 m-3 min-w-[150px] bg-primary text-white rounded-lg'>
                    {word.status && <div className='absolute flex top-1 right-1' style={word.status === 'correct' ? {color: 'green'} : word.status === 'wrong' ? {color: 'red'} : {}}>{word.status === 'correct' ? <FaRegThumbsUp /> : word.status === 'wrong' ? <FaRegThumbsDown /> : ''}</div>}
                    {word.french || word.english}
                    {showAnswer && <div className='flex flex-col justify-center items-center mt-4'>
                      <span className='text-5xl'>{word.kanji}</span>
                      <span className='text-2xl text-gold'>{word.japanese}</span>
                      </div>}
                    <div className='flex flex-row justify-between w-full mt-4'>
                      <button onClick={() => handleAnswer(word.id, 'correct')} className='flex bg-success w-10 h-10 rounded-full text-white justify-center items-center'><ImCheckmark /></button>
                      <button onClick={() => handleAnswer(word.id, 'wrong')} className='flex bg-wrong w-10 h-10 rounded-full text-white font-bold text-2xl justify-center items-center'><CgClose /></button>
                    </div>
                  </div>
                )
              })}
      </div>
        {data && <button className='flex justify-center h-auto font-bold w-32 px-3 py-2 bg-blue-300 rounded-lg' onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? 'Masquer' : 'Vérifier'}</button>}
      </>}
    </div>
  )
}

export default List