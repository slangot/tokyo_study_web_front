import React, { useState } from 'react'

// Icons
import { CgClose } from 'react-icons/cg';
import { FaGear, FaRegThumbsDown, FaRegThumbsUp, FaXmark } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { ImCheckmark } from 'react-icons/im'

// Packages
import { RotatingLines } from 'react-loader-spinner'

const DesktopExerciceDisplay = ({word, showChoice, showFurigana, showAnswer, handleAnswer}) => {
  return (
    <div key={word.id} className='relative flex flex-col text-center px-5 py-3 m-3 min-w-[150px] bg-primary text-white rounded-lg'>
      {word.status && <div className='absolute flex top-1 right-1' style={word.status === 'correct' ? {color: 'green'} : word.status === 'wrong' ? {color: 'red'} : {}}>{word.status === 'correct' ? <FaRegThumbsUp /> : word.status === 'wrong' ? <FaRegThumbsDown /> : ''}</div>}
      {showChoice ? 
        word.french || word.english 
      : word.kanji ? 
        <>
        {showFurigana === 'show' &&  <span className='text-xl'>{word.japanese}</span>}
          <span className='text-5xl' style={!word.kanji_level === word.level ? {color: 'red'} : {}}>{word.kanji}</span>
        </>
        :
          <span className='text-3xl'>{word.japanese}</span>
      }
      {showAnswer && <div className='flex flex-col justify-center items-center mt-4'>
        {showChoice ? 
          <>
            <span className='text-5xl' style={!word.kanji_level === word.level ? {color: 'red'} : {}}>{word.kanji}</span>
            <span className='text-2xl text-gold'>{word.japanese}</span>
          </>
        :
          <span className='text-xl max-w-52'>{word.french || word.english}</span>
        }
        </div>}
        <h3 className='text-2xl text-yellow-400'>{showFurigana}</h3>
      <div className='flex flex-row justify-between w-full mt-4'>
        <button onClick={() => handleAnswer(word.id, 'correct')} className='flex bg-success w-10 h-10 rounded-full text-white justify-center items-center'><ImCheckmark /></button>
        <button onClick={() => handleAnswer(word.id, 'wrong')} className='flex bg-wrong w-10 h-10 rounded-full text-white font-bold text-2xl justify-center items-center'><CgClose /></button>
      </div>
    </div>
  )
}

const MobileExerciceDisplay = ({word, showChoice, showFurigana, showAnswer, handleAnswer, setShowKanjiZoomed, setDetailKanjiZoomed}) => {
  const handleKanjiClick = (kanji) => {
    setShowKanjiZoomed(true)
    setDetailKanjiZoomed(kanji)
  }

 return (
  <div key={word.id} className='relative flex flex-row text-center px-0 py-1 m-1 w-full bg-primary text-white rounded-lg'>
      {word.status && <div className='absolute flex top-1 left-1' style={word.status === 'correct' ? {color: 'green'} : word.status === 'wrong' ? {color: 'red'} : {}}>{word.status === 'correct' ? <FaRegThumbsUp className='text-xs'/> : word.status === 'wrong' ? <FaRegThumbsDown  className='text-xs'/> : ''}</div>}
      <div className='flex flex-1 flex-row'>
        <div className='flex flex-1 items-center justify-center text-sm'>
          {showChoice ? 
            <span className='text-xs pl-1 flex flex-1 justify-center'>{word.french || word.english}</span>
          : word.kanji ? 
            <div className='flex flex-col'>
            {showFurigana === 'show' &&  <span className='text-base text-blue-200'>{word.japanese}</span>}
              <span className='text-2xl' onClick={() => handleKanjiClick(word.kanji)} style={!word.kanji_level === word.level ? {color: 'red'} : {}}>{word.kanji}</span>
            </div>
            :
              <span className='text-base'>{word.japanese}</span>
          }
        </div>
        {showAnswer && <div className='flex flex-1 flex-col justify-center items-center'>
          {showChoice ? 
            <>
              <span className='text-base text-blue-200'>{word.japanese}</span>
              <span className='text-2xl' onClick={() => handleKanjiClick(word.kanji)} style={!word.kanji_level === word.level ? {color: 'red'} : {}}>{word.kanji}</span>
            </>
          :
            <span className='text-xs max-w-52'>{word.french || word.english}</span>
          }
        </div>}
      </div>
      <div className='flex flex-row justify-end items-center gap-3 pr-2'>
        <button onClick={() => handleAnswer(word.id, 'correct')} className='flex text-success w-7 h-7 rounded-full justify-center items-center'><ImCheckmark /></button>
        <button onClick={() => handleAnswer(word.id, 'wrong')} className='flex text-wrong w-7 h-7 rounded-full font-bold text-2xl justify-center items-center'><CgClose /></button>
      </div>
    </div>
 )
}

function List() {
  const [data, setData] = useState()
  const [detailKanjiZoomed, setDetailKanjiZoomed] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(window && (window?.innerWidth < 500 || window?.innerHeight < 500))
  
  // Displayers
  const [showAnswer, setShowAnswer] = useState(false)
  const [showChoice, setShowChoice] = useState(1)
  const [showFurigana, setShowFurigana] = useState('show')
  const [showKanjiZoomed, setShowKanjiZoomed] = useState(false)
  const [showParams, setShowParams] = useState(false)

  // Params
  const [level, setLevel] = useState(5)
  const [revision, setRevision] = useState('')
  const [exerciceType, setExerciceType] = useState('kanji')

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
  if(showParams) {
    setShowParams(false)
  }
  setIsLoading(true)
  setData()
  setShowAnswer(false)
  setShowChoice(Math.round(Math.random()))
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

const handleFurigana = () => {
  if(showFurigana === 'show') {
    setShowFurigana('hide')
    } else {
    setShowFurigana('show')
  }
}

  return (
    <div className='flex flex-col justify-center items-center mt-3'>

      {/***** Mobile Params Popup  */}
      {showParams && 
        <div className='absolute top-0 left-0 z-40 h-screen w-screen bg-secondary'>
          <button className='absolute z-50 right-4 top-4' onClick={() => setShowParams(false)}><FaXmark className='text-xl text-white'/></button>
          <div className='flex w-full justify-center gap-5 mt-14 mb-8'>
            <button className='px-3 py-2 min-w-[150px] text-white font-bold bg-blue-800 rounded' style={exerciceType === 'kanji' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}} onClick={() => setExerciceType('kanji')}>Kanji</button>
            <button className='px-3 py-2 min-w-[150px] text-white font-bold bg-blue-800 rounded' style={exerciceType === 'vocabulary' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}} onClick={() => setExerciceType('vocabulary')}>Vocabulaire</button>
          </div>
          <div className='flex flex-col items-center w-[90%] rounded-lg mt-5 mb-2'>
            <label htmlFor='level' className='mb-3 font-bold text-white'>Choix du niveau: </label>
            <select id="level" className='w-auto h-10 text-center justify-center mx-auto bg-blue-800 text-white font-bold' onChange={(e) => setLevel(e.target.value)} aria-placeholder='Level'>
              <option value="">Liste des niveaux</option>
              <option value={6} className='text-center'>Extra</option>
              <option value={5}>N5</option>
              <option value={4}>N4</option>
              <option value={3}>N3</option>
              <option value={2}>N2</option>
              <option value={1}>N1</option>
            </select>
          </div>
          <div className='flex flex-col gap-2 my-2 px-3 py-5 rounded-lg items-center justify-center'>
            <p className='text-white font-bold mb-3'>Mode de révision :</p>
            <div className='flex flex-row flex-wrap gap-2 justify-center items-center'>
            <button className='px-3 py-2 text-white font-bold bg-blue-800 rounded' onClick={() => handleRevision('all')} style={revision === 'all' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}}>Tous</button>
            <button className='px-3 py-2 text-white font-bold bg-blue-800 rounded' onClick={() => handleRevision('study')} style={revision === 'study' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}}>En cours</button>
            <button className='px-3 py-2 text-white font-bold bg-blue-800 rounded' onClick={() => handleRevision('correct')} style={revision === 'correct' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}}>Correct</button>
            <button className='px-3 py-2 text-white font-bold bg-blue-800 rounded' onClick={() => handleRevision('wrong')} style={revision === 'wrong' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}}>Faux</button>
            <button className='px-3 py-2 text-white font-bold bg-blue-800 rounded' onClick={() => handleRevision('new')} style={revision === 'new' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}}>Nouveau</button>
            <button className='flex items-center gap-2 px-3 py-2 text-white font-bold bg-blue-800 rounded' onClick={() => handleRevision('jlpt')} style={revision === 'jlpt' ? {backgroundColor: 'rgb(191,219,254)', color: 'black'} : {}}>JLPT <FaCheck /></button>
            </div>
          </div>
          <button className='flex px-3 py-2 font-bold bg-gold text-white mt-2 w-auto justify-center mx-auto rounded' disabled={!exerciceType || !level} onClick={() => handleNext()}>C'est parti !</button>
        </div>
      }

      {/***** Kanji zoomed  */}
      {showKanjiZoomed && 
        <div className='absolute flex justify-center items-center z-40 bg-black opacity-90 h-[110vh] w-screen top-0 left-0'>
          <button className='absolute z-50 right-4 top-10' onClick={() => setShowKanjiZoomed(false)}><FaXmark className='text-xl text-white'/></button>
          <div className='relative text-9xl z-50 font-bold text-white opacity-100 -mt-20'>{detailKanjiZoomed}</div>
        </div>
      }

      {/***** Main component */}
      <div className='flex flex-row items-center gap-4'>
        <h1 className='text-2xl md:text-xl'>Exercice de Liste</h1>
        {isSmallScreen &&
          <>
            <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => setShowParams(true)}><FaGear /></button>
            <button className='px-3 py-2 font-bold rounded bg-fourth text-white' onClick={() => handleFurigana()}>{showFurigana === 'show' ? <span className='flex items-center gap-2'> <GoEyeClosed /></span>: <span className='flex items-center gap-2'> <GoEye /></span>}</button>
          </>
        }
      </div>

      {/***** Desktop Settings  */}
      {!isSmallScreen && <>
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
      <div className='flex flex-row bg-fourth rounded-lg my-3'>
        <button className='px-3 py-2 font-bold rounded bg-blue-700 text-white' onClick={() => handleFurigana()}>{showFurigana === 'show' ? <span className='flex items-center gap-2'> <GoEyeClosed /> Masquer les furigana</span>: <span className='flex items-center gap-2'> <GoEye /> Afficher les furigana</span>}</button>
      </div>
      <div className='flex flex-col gap-2 my-3 px-3 py-2 bg-secondary rounded-lg items-center justify-center'>
        <p>Mode de révision :</p>
        <div className='flex flex-row flex-wrap gap-2 justify-center items-center'>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('all')} style={revision === 'all' ? {backgroundColor: 'blue'} : {}}>Tous</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('study')} style={revision === 'study' ? {backgroundColor: 'blue'} : {}}>En cours</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('correct')} style={revision === 'correct' ? {backgroundColor: 'blue'} : {}}>Correct</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('wrong')} style={revision === 'wrong' ? {backgroundColor: 'blue'} : {}}>Faux</button>
        <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('new')} style={revision === 'new' ? {backgroundColor: 'blue'} : {}}>Nouveau</button>
        <button className='flex items-center gap-2 px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => handleRevision('jlpt')} style={revision === 'jlpt' ? {backgroundColor: 'blue'} : {}}>JLPT <FaCheck /></button>
        </div>
      </div>
      </>}

      {/***** Start button  */}
      {!data && <button className='px-3 py-2 text-black font-bold bg-gold mt-4 m:mt-0 mb-4 rounded' disabled={!exerciceType || !level} onClick={() => handleNext()}>C'est parti !</button>}
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
        {/***** Exercice List Display  */}
          <div className='flex flex-row flex-wrap justify-center items-center font-bold my-5'>
            {data && data.map((word) => {
              return (!isSmallScreen ?
                <DesktopExerciceDisplay word={word} showChoice={showChoice} showFurigana={showFurigana} showAnswer={showAnswer} handleAnswer={handleAnswer} />
              :
                <MobileExerciceDisplay word={word} showChoice={showChoice} showFurigana={showFurigana} showAnswer={showAnswer} handleAnswer={handleAnswer} setShowKanjiZoomed={setShowKanjiZoomed} setDetailKanjiZoomed={setDetailKanjiZoomed} />
              )
            })}
          </div>

          {/***** Actions buttons  */}
          {data && 
            <div className='flex gap-5 mb-5'>
              <button className='flex justify-center h-auto font-bold w-32 px-3 py-2 bg-blue-300 rounded-lg' onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? 'Masquer' : 'Vérifier'}</button>
              <button className='flex w-32 px-3 py-2 font-bold bg-gold text-white justify-center mx-auto rounded' disabled={!exerciceType || !level} onClick={() => handleNext()}>Suivant</button>
            </div>
          }
        </>
      }
    </div>
  )
}

export default List