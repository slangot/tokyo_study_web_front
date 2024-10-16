import React, { useEffect, useState } from 'react'

// Api
import { updateStats, updateTokens } from "../../utils/api";

// Context
import{ useUser } from '../../context/UserContext'

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { HiOutlineSpeakerWave } from 'react-icons/hi2'

// Packages
import { RotatingLines } from "react-loader-spinner"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

// UiKit
import { Header } from '../../uikit/Blocks'
import { ActionButton } from '../../uikit/Buttons'

const Listening = () => {
  const { state, dispatch } = useUser();
  const user = state.user
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_tokens'))
  const daily_tokens = parseInt(sessionStorage.getItem('user_daily_tokens'))
  const userId = sessionStorage.getItem('user_id')

  const [question, setQuestion] = useState()
  const [questionAnswer, setQuestionAnswer] = useState()
  const [answersList, setAnswersList] = useState()

  const [showSentence, setShowSentence] = useState(false)
  const [showFurigana, setShowFurigana] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const AnswerButton = ({id, kanji, isCorrect, japanese, listen, showFurigana, showIsCorrect, verify}) => {
    return (
      <div className='flex flex-row justify-center items-center gap-3 w-auto'>
        <button onClick={() => verify(id)} className='flex flex-1 flex-col items-center px-3 md:px-5 py-2 md:py-3 font-bold text-lg md:text-2xl bg-primary text-white rounded-xl min-w-[40vw]' style={showIsCorrect ? isCorrect ? {backgroundColor: 'green'} : {backgroundColor: 'red'} : {}} >
          {showFurigana && <span className='text-fourth text-sm md:text-lg'>{japanese}</span>}
          {kanji}
        </button>
        <button onClick={() => listen(kanji)} className='flex justify-center items-center bg-third w-10 h-10 rounded-full'><HiOutlineSpeakerWave /></button>
      </div>
    )
  }

  const sentenceListen = (sentence) => {
    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.lang = 'ja-JP'

    ////// TEST DIFFERENTS VOICES
    // const test = '田中さんはかぎを落としました。彼の鍵がどこにありますか。'
    // const testVoice = window.speechSynthesis.getVoices()
    // const utterance = new SpeechSynthesisUtterance(test)
    // utterance.rate = 0.7
    // utterance.pitch = 1.3
    // utterance.voice = testVoice[73]
    // // VOIX JAPONAISES : 73 (femme) ; 64 (homme) ; 167 (femme google) ; 

    window.speechSynthesis.speak(utterance)
  }

  const getData = async () => {
    setIsCorrect(null)
    setIsLoading(true)
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
  
        const query = `${process.env.REACT_APP_API}/uqa`
  
        const response = await fetch(query, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if(data) {
          setQuestionAnswer(data.questionAnswerId)
          setQuestion(data.question[0])
          const newAnswers = []
          newAnswers.push(data.answer[0])
          data.other_sentences.forEach(sentence => {
            newAnswers.push(sentence)
          });
  
          const randomizedAnswers = newAnswers.sort(() => Math.random() - 0.5)
          setAnswersList(randomizedAnswers)
          handleTokenUpdate(1)
          setIsLoading(false)
        } else {
          setQuestionAnswer(null)
          setQuestion(null)
          setAnswersList(null)
          setIsLoading(false)
        }
        setIsLoading(false)
      }
    } catch (error) {
        console.error('error : ', error)
    }
  }

  const handleTokenUpdate = async (number) => {
    await updateTokens(number, daily_tokens, tokens, userId, dispatch, "reduce");
  };

  const handleStatsUpdate = async (type, status, exerciceId) => {
    await updateStats(type, status, userId, exerciceId);
  };

  const verify = (id) => {
    if(questionAnswer.answer_id === id) {
      sentenceListen("ピポーン")
      setIsCorrect('correct')
      handleStatsUpdate('listening', true, question.id)
    } else {
      sentenceListen("ブーブーウウウ")
      setIsCorrect('wrong')
      handleStatsUpdate('listening', false, question.id)
    }
    setTimeout(() => {
      handleQuestion()
    }, [2000])
  }

  const handleQuestion = () => {
    handleTokenUpdate(1)
    getData()
  }

  const handleShowSentence = () => {
    setShowSentence(!showSentence)
  }

  const handleShowFurigana = () => {
    setShowFurigana(!showFurigana)
  }

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
    <section className='exerciceSection md:section-bottom flex flex-col items-center'>
      <Header title="Exercice d'écoute" link='/exercices' />
      {isLoading ?
        <div className="flex items-center justify-center w-full h-full">
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
        (question && answersList) &&
          <>
          <article className='flex flex-col items-center gap-4 w-full h-auto py-3'>
            <div className='flex flex-row gap-5'>
              <button className='px-3 py-2 w-auto bg-blue-500 text-white rounded-lg' onClick={() => sentenceListen(question.kanji)}><span className='flex flex-row items-center gap-3'><HiOutlineSpeakerWave /> Écouter</span></button>
              <button className='px-3 py-2 w-auto bg-blue-900 text-white rounded-lg' onClick={() => handleShowSentence()}>{showSentence ? <span className='flex flex-row items-center gap-3'><FaRegEyeSlash /> Cacher la phrase</span> : <span className='flex flex-row items-center gap-3'><FaRegEye /> Afficher la phrase</span>}</button>
            </div>
            {showSentence ?
              <p className='flex justify-center items-center font-bold px-5 py-3 text-base md:text-2xl rounded-lg bg-white text-black'>{question.kanji}</p>
            :
              <p className='flex justify-center items-center h-1 md:h-14 bg-transparent text-black' />
            }
          </article>
          <div className='my-1 md:my-3 w-1/2 md:w-1/3 mx-auto h-1 rounded-lg bg-primary' />
          <article className='flex flex-col gap-5 mt-3 min-h-[100dvh] px-5 py-4 md:px-10 md:py-8 rounded-md'>
            <button className='flex flex-row justify-end' onClick={() => handleShowFurigana()}>{showFurigana ? <span className='flex flex-row items-center gap-3 text-sm px-2 py-1 bg-secondary rounded-lg'><FaRegEyeSlash /> Furigana</span> : <span className='flex flex-row items-center gap-3 text-sm px-2 py-1 bg-secondary rounded-lg'><FaRegEye /> Furigana</span>}</button>
            {answersList.map(e => {
              return <AnswerButton key={e.kanji} id={e.id} kanji={e.kanji} japanese={e.japanese} listen={sentenceListen} showFurigana={showFurigana} verify={verify} showIsCorrect={isCorrect} isCorrect={questionAnswer.answer_id === e.id} />
            })}
          </article>
        </>
      }
      {!question && <ActionButton style="bg-blue-600 mt-10" action={handleQuestion} text={'Commencer'} />}
    </section>
  )
}

export default Listening