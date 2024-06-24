// React
import { useEffect, useState } from "react"

// Icons
import { FaRegCircleQuestion } from "react-icons/fa6"

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useLocation } from "react-router-dom";

// UiKit
import { BackButton, ExerciceQuizButton, EyeButton } from "../uikit/Buttons";

// Utils
import { putApi } from "../utils/api"
import { manageScore, randomizeData } from "../utils/handlers"

const useSearchParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const Quiz = () => {

  // Params
  const searchParams = useSearchParams();
  const exerciceType = searchParams.get("type");
  const level = searchParams.get("level");
  const mainLanguage = searchParams.get("lang");

  // Platform
  let isSafari = false
  if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
    isSafari = true
  }

  // State
  const [answers, setAnswers] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState()
  const [data, setData] = useState([])
  const [isCorrect, setIsCorrect] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreMax, setScoreMax] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)
  const [showFurigana, setShowFurigana] = useState(false)

  const fetchData = async (dbType, level) => {
      try {
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        const query = `https://www.data.tsw.konecton.com/${dbType}?level=${level}&limit=4`
  
        const response = await fetch(query, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      const data = await response.json();
    if (data && data.length > 0) {
              for (const item of data) {
                item.isAnswer = false
              }
              data[0].isAnswer = true
              setData(data)
              setIsLoading(false)
            }
            setIsLoading(false)
      } catch (error) {
        console.error('error : ', error)
      }
  }

  const handleNext = (isCorrect) => {
    setShowAnswers(true)
    if (!isSafari) {
      navigator.vibrate([50])
    }
    setIsCorrect(isCorrect)
    if (isCorrect !== undefined) {
      manageScore(isCorrect, score, setScore, scoreMax, setScoreMax)
    }
    setTimeout(() => {
      if (level && exerciceType) {
        fetchData(exerciceType, level)
        setIsCorrect(undefined)
        setShowAnswers(false)
      }
    }, 1500)
  }

  const handleReport = async (id) => {
    try {
      if (exerciceType && id) {
        const results = await putApi(exerciceType, "reported", 1, id)
      }
    } catch (error) {
      console.error("error : ", error)
    }
  }

  useEffect(() => {
    if (level && exerciceType) {
      setIsLoading(true)
      fetchData(exerciceType, level)
    }
  }, [level])

  useEffect(() => {
    if (data.length > 0) {
      const dataToDisplay = randomizeData(data)
      const correctAnswerToDisplay = dataToDisplay.find((answer) => answer.isAnswer)
      setAnswers(dataToDisplay)
      setCorrectAnswer(correctAnswerToDisplay)
    }
  }, [data])

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {correctAnswer && <div className="absolute z-1 top-0 h-48 w-screen rounded-b-full" style={isCorrect !== undefined ? isCorrect ? { backgroundColor: 'green', filter: "blur(4px)" } : { backgroundColor: 'red', filter: "blur(4px)" } : {}} />}
      <div className="relative z-10 flex flex-row items-center justify-center w-full mb-3 px-3">
        <BackButton url="/exercices" />
        <h1 className="exerciceTitle">Quiz {exerciceType} {level && `N${level}`}</h1>
        <p>{score}/{scoreMax}</p>
      </div>
      <div className="exerciceContentBlock">
        {level &&
          <div className='absolute top-0 flex justify-end w-full h-auto -my-1 px-3'>
            <EyeButton state={showFurigana} setState={setShowFurigana} label="字" />
          </div>
        }
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
          <>
            {correctAnswer &&
              <div className="flex items-center justify-center text-center text-2xl md:text-4xl lg:text-5xl font-bold mb-2 mt-2 py-3">
                {mainLanguage === 'fr' ?
                  <h3>{correctAnswer.french}</h3>
                  :
                  correctAnswer.kanji ?
                    showFurigana ?
                      exerciceType !== 'sentence' ?
                        <ruby><span className="text-5xl">{correctAnswer.kanji}</span><rp>(</rp><rt className="mb-5">{correctAnswer.japanese}</rt><rp>)</rp></ruby>
                        :
                        <div className="flex flex-col items-center justify-center">
                          <h3>{correctAnswer.kanji}</h3>
                          <p className="text-lg mt-2 text-light">{correctAnswer.japanese}</p>
                        </div>
                      : <span className="text-5xl">{correctAnswer.kanji}</span>
                    : <span className="text-5xl">{correctAnswer.japanese}</span>
                }
              </div>
            }
            <div className="flex items-center justify-evenly flex-wrap w-full">
              {answers.length > 0 && answers.map((answer, index) => (
                answer.isAnswer !== undefined && exerciceType &&
                <ExerciceQuizButton key={index} content={answer} action={handleNext} isAnswer={answer.isAnswer} showAnswers={showAnswers} mainLanguage={mainLanguage || ""} showFurigana={showFurigana} exerciceType={exerciceType} />
              ))}
            </div>
            {correctAnswer && <button className="absolute -bottom-5 right-1 flex items-end justify-end" onClick={() => handleReport(correctAnswer.id)}><FaRegCircleQuestion color={'#653C87'} /></button>}
          </>
        }
      </div>
    </div>
  )
}

export default Quiz