import React, { useEffect, useState } from 'react'

// Icons
import { AiOutlineSound } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa6';
import { GoEye, GoEyeClosed } from 'react-icons/go';

// Packages
import { RotatingLines } from "react-loader-spinner"

// Utils
import { Header } from '../../uikit/Blocks';

const Story = () => {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [data, setData] = useState()
  const [dataImages, setDataImages] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showFurigana, setShowFurigana] = useState(false)
  const [showText, setShowText] = useState(false)

const getStory = async () => {
  setIsLoading(true)
  try {
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const query = `${process.env.REACT_APP_API}/story/one`
    const response = await fetch(query, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setData(data[0])

    setIsLoading(false)
  } catch(err) {
    console.error(err)
  }
}

const handleNext = () => {
  setShowAnswer(true)
  setCurrentAudioTime(0)
  setTimeout(() => {
    setShowAnswer(false)
    getStory()
  }, 3000)
}

useEffect(() => {
  setIsLoading(true)
  getStory()
}, [])

useEffect(() => {
  if(data) {
    setCurrentAudio(new Audio(`${process.env.REACT_APP_API}/${data.audio_link}`))
    const imagesSplitted = data.images_basic_links.split(';')
    const imagesStatusSplitted = data.images_status_links.split(';')
    const imagesKanjiLabelsSplitted = data.images_labels_kanji ? data.images_labels_kanji.split(';') : []
    const imagesJapaneseLabelsSplitted = data.images_labels_japanese ? data.images_labels_japanese.split(';') : []
    const newImagesList = []
    imagesSplitted.forEach((element, index) => {
      const newImage = {
        id: index,
        link: element,
        statusLink: imagesStatusSplitted[index],
        labelsKanji: imagesKanjiLabelsSplitted[index] || null,
        labelsJapanese: imagesJapaneseLabelsSplitted[index] || null
      }
      newImagesList.push(newImage)
    });
    setDataImages(newImagesList)
    setIsLoading(false)
  }
}, [data])

const handlePlay = () => {
  if(isPlaying) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    setCurrentAudioTime(0)
    setIsPlaying(false)
  } else {
    setCurrentAudioTime(0)
    setIsPlaying(true)
    currentAudio.play()
    const currentAudioDuration = currentAudio.duration

    const progressBar = setInterval(() => {
      setCurrentAudioTime(prev => prev += (100 / currentAudioDuration))
      if(currentAudioDuration === currentAudioTime) {
        clearInterval(progressBar)
      }
    }, 1000)

    currentAudio.onended = () => {
      setIsPlaying(false)
      clearInterval(progressBar)
      setCurrentAudioTime(currentAudioDuration)
    }
  }
}

const handleHelp = (action) => {
  if(action === 'text') {
    if(showText) {
      setShowText(false)
      setShowFurigana(false)
    } else {
      setShowText(true)
    }
  } else if(action === 'furigana') {
    setShowFurigana(!showFurigana)
  }
}
 
  return (
    <section className='exerciceSection section-bottom flex flex-col gap-3 md:gap-5 items-center'>
      <Header title="Histoire de quiz" link='/exercices' />
      {isLoading ? 
        <div className="flex justify-center items-center h-96">
          <RotatingLines
            visible={true}
            width="96"
            strokeColor="#006FFF"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>
       : 
      data && currentAudio && dataImages && 
      <>
        <div className='flex flex-col gap-3 md:gap-5'>
          <button
            className='flex relative px-6 md:px-10 py-3 md:py-5 rounded-lg font-bold bg-medium-blue w-auto justify-center'
            onClick={() => handlePlay()}
          >
            {isPlaying ? 
              <span className='relative z-30 flex flex-row items-center gap-3 font-bold text-xl'>Écoutez <AiOutlineSound /></span>
              :
              <span className='relative z-30 flex flex-row items-center gap-3 font-bold text-xl'>Lecture <FaPlay /></span>
            }
            <div className='absolute z-20 bottom-0 left-0 h-[15%] rounded-b-lg rounded-e-lg transition-all ease-linear' style={{backgroundColor: isPlaying ? 'rgb(58,2,91)' : 'transparent', width: `${currentAudioTime}%`, transition: 'all 1s linear'}} />
          </button>
          <div className='flex flex-row gap-4'>
            <button 
              className='flex flex-row items-center gap-3 px-3 py-2 rounded-lg bg-blue-500 font-bold'
              onClick={() => handleHelp('text')}
            >
              {showText ? <GoEyeClosed className='text-base md:text-xl' /> : <GoEye className='text-base md:text-xl' />} Texte
            </button>
            <button
              className='flex flex-row items-center gap-3 px-3 py-2 rounded-lg bg-sky-blue font-bold'
              onClick={() => handleHelp('furigana')}
            >
              {showFurigana ? <GoEyeClosed className='text-base md:text-xl' /> : <GoEye className='text-base md:text-xl' />} Furigana
            </button>
          </div>
        </div>
        <div className='my-1 md:my-5 flex flex-col items-center md:min-h-20 w-full mx-auto px-10 '>
          {showText && 
            <>
              <p className='mb-1 font-bold text-base md:text-xl italic'>Question :</p>
              {showFurigana ? 
                <p className='text-sm md:text-xl text-medium-blue min-h-5 font-bold'>{data.question_text_japanese}</p>
                :
                <p className='min-h-5' />
              }
              <p className='text-lg md:text-3xl font-bold'>{data.question_text_kanji}</p>
            </>
          }
        </div>

        <div className='flex flex-row flex-wrap justify-center w-[95dvw] gap-3 md:gap-5'>
          {dataImages && dataImages.map(e => 
            <div className='flex flex-col items-center'>
              <img 
                src={showAnswer ? `${process.env.REACT_APP_API}/${e.statusLink}` : `${process.env.REACT_APP_API}/${e.link}`}
                key={e.id}
                className='rounded-3xl w-[150px] md:w-1/5 object-contain'
                onClick={() => handleNext()}
              />
              {showText &&
                <>
                  {showFurigana && <span className=''>{e.labelsJapanese}</span>}
                  <span className='text-xl font-bold'>{e.labelsKanji}</span>
                </>
              }
            </div>
          )}
        </div>
      </>
      }
    </section>
  )
}

export default Story