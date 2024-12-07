import React, { useState } from 'react'

// UiKit
import { Header } from '../../uikit/Blocks';

const Pronunciation = () => {
  const [recognizedText, setRecognizedText] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null)

  const test = "今日は雨です"

  const startRecognition = (action) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ja-JP'; 
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setRecognizedText(spokenText);
    };

    // recognition.onspeechend = () => {
    //   recognition.stop();
    //   handleMatching()
    // };

    recognition.onaudioend = () => {
      recognition.stop();
      handleMatching()
    };

    recognition.onend = () => {
      // clearTimeout(recognitionTimeout);
      handleMatching()
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      recognition.stop();
    };

    // Stop the recognition after 10 seconds
    const recognitionTimeout = setTimeout(() => {
      recognition.stop();
      handleMatching();
    }, 10000); // 10 seconds

    recognition.onend = () => {
      clearTimeout(recognitionTimeout);
    };

    if(action === 'start') {
      recognition.start();
    } else if(action === 'stop') {
      clearTimeout(recognitionTimeout);
      recognition.stop();
      handleMatching()
    }
  };

  const handleMatching = () => {
    if(test === recognizedText) {
      setIsCorrect('correct')
    } else {
      setIsCorrect('wrong')
    }
  }

  const handleStart = (action) => {
    // setRecognizedText(null)
    // setIsCorrect(null)
    startRecognition(action)
  }

  return (
    <section className='flex flex-col justify-center gap-5'>
      <Header title="Exerice de prononciation" link='/exercices' />
      {recognizedText && 
        <p className='py-5 bg-white text-primary'>{recognizedText}</p>
      }
      {isCorrect &&
        isCorrect === 'correct' ?
          <p className='px-5 py-3 bg-green-600 text-white font-bold text-xl'>Bonne réponse</p>
        :
        isCorrect === 'wrong' ? <p className='px-5 py-3 bg-red-600 text-white font-bold text-xl'>Mauvaise réponse</p>
        :
        null
      }
      <button className='px-3 py-2 bg-primary' onClick={() => handleStart('start')}>Parler</button>
      <button className='px-3 py-2 bg-red-400' onClick={() => handleStart('stop')}>Stopper</button>
    </section>
  )
}

export default Pronunciation