import React, { useState } from 'react'

// Packages
import { RotatingLines } from "react-loader-spinner"

function List() {
  const [data, setData] = useState()
  const [exerciceType, setExerciceType] = useState("kanji")
  const [level, setLevel] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const fetchData = async (exerciceType, level) => {
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const query = `https://www.data.tsw.konecton.com/${exerciceType}?level=${level}&limit=10`
      // const query = `http://localhost:3001/${exerciceType}?level=${level}&limit=10`

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

  return (
    <div className='flex flex-col justify-center items-center mt-3'>
      <h1>Exercice de Liste</h1>
      <div className='flex flex-row gap-5 my-3'>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={exerciceType === 'kanji' ? {backgroundColor: '#520380'} : {}} onClick={() => setExerciceType('kanji')}>Kanji</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={exerciceType === 'vocabulary' ? {backgroundColor: '#520380'} : {}} onClick={() => setExerciceType('vocabulary')}>Vocabulaire</button>
      </div>
      <div className='flex flex-row bg-fourth rounded-lg mb-5'>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 6 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(6)}>+</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 5 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(5)}>N5</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 4 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(4)}>N4</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 3 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(3)}>N3</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 2 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(2)}>N2</button>
        <button className='px-3 py-2 mx-2 text-white font-bold' style={level === 1 ? {backgroundColor: '#520380'} : {}} onClick={() => setLevel(1)}>N1</button>
      </div>
      <button className='px-3 py-2 text-black font-bold bg-gold mb-4 rounded' disabled={!exerciceType || !level} onClick={() => fetchData(exerciceType, level)}>C'est parti !</button>
      {isLoading ?
    <div className="flex justify-center items-center h-96">
    <RotatingLines
      visible={true}
      width="96"
      strokeColor="#520380"
      strokeWidth="5"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
    />
  </div>
  :
  <>
      <div className='flex flex-row flex-wrap font-bold mb-5'>
        {data && data.map((word, index) => {
              return (
                  <div key={index} className='flex flex-col text-center w-auto px-5 py-3 m-3 bg-primary text-white rounded-lg'>
                    {word.french}
                  {showAnswer && <div className='text-5xl mt-4'>{word.kanji}</div>}
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