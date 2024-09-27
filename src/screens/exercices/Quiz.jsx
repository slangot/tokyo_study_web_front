import { useEffect, useState } from "react"

// Context
import{ useUser } from '../../context/UserContext'

// Icons
import { FaGear, FaGears, FaPlus, FaRegCircleQuestion } from "react-icons/fa6"

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { ExerciceHeader } from '../../uikit/Blocks';
import { ActionButton, ExerciceQuizButton, EyeButton, SettingsButton } from "../../uikit/Buttons";

// Utils
import { putApi } from "../../utils/api"
import { manageScore, randomizeData } from "../../utils/handlers"

const useSearchParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const SettingsPanel = ({exerciceType, fetch, setLevel, setMainLanguage, setShowSettingsPanel}) => {
  const [levelChoice, setLevelChoice] = useState()
  const [languageChoice, setLanguageChoice] = useState()

  const handleChanges = () => {
    if(languageChoice) {
      setMainLanguage(languageChoice)
    }

    if(levelChoice) {
      setLevel(levelChoice)
    }
    setShowSettingsPanel(false)
    setTimeout(() => {
      fetch(exerciceType, levelChoice)
    }, 500)
  }

  return (
    <>
      <div className='absolute flex flex-col z-50 w-full h-[100dvh] overflow-hidden bg-black'>
        <div className='relative flex flex-col justify-center w-full h-[90%]'>
          <h1>Paramètre du quiz :</h1>
          <h2>Niveau JLPT :</h2>
          <div className="flex items-center font-bold w-full md:w-3/4 mx-auto border-2 rounded-lg bg-light text-blue-500">
            <div className="levelSelectButton rounded-l-md" style={levelChoice === 6 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(6)}><FaPlus /></div>
            <div className="levelSelectButton" style={levelChoice === 5 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(5)}>N5</div>
            <div className="levelSelectButton" style={levelChoice === 4 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(4)}>N4</div>
            <div className="levelSelectButton" style={levelChoice === 3 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(3)}>N3</div>
            <div className="levelSelectButton" style={levelChoice === 2 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(2)}>N2</div>
            <div className="levelSelectButton border-r-0 rounded-r-md" style={levelChoice === 1 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(1)}>N1</div>
          </div>
          <h2>Choix d'affichage :</h2>
          <div className="exerciceButtonLanguageContainer">
            <button 
              className="exerciceButtonLanguage" 
              onClick={() => setLanguageChoice('fr')}
              style={languageChoice === 'fr' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}}
            >
              Français -&gt; Japonais
            </button>
            <button
              className="exerciceButtonLanguage" 
              onClick={() => setLanguageChoice('jp')}
              style={languageChoice === 'jp' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}}
            >
              Japonais -&gt; Français
            </button>
          </div>
          <button onClick={() => handleChanges()}>Confirmer</button>
        </div>
      </div>
    </>
  )
}

const Quiz = () => {

  const { state, dispatch } = useUser();
  const user = state.user
  const navigate = useNavigate()

  // Params
  const searchParams = useSearchParams();
  const exerciceType = searchParams.get("type");
  // const level = searchParams.get("level");
  // const mainLanguage = searchParams.get("lang");

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

  const [level, setLevel] = useState(5)
  const [mainLanguage, setMainLanguage] = useState('fr')
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)

  const fetchData = async (dbType, level) => {

    setIsLoading(true)
      try {
        if(user.token === 0) {
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
            updateTokens(1)
            setIsLoading(false)
          } else {
            setData([])
            setAnswers([])
            setCorrectAnswer(null)
            setIsLoading(false)
          }
          setIsLoading(false)
        }
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

  const updateTokens = async (number) => {
    try {
      const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenNumber: user.token - number,
          userId: user.id,
        })
      }
      const query = `https://www.data.tsw.konecton.com/user/tokenManager`
      const response = await fetch(query, options);
  
      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
        dispatch({ type: 'UPDATE_TOKEN', payload: user.token - number });
      }
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (level && exerciceType && (user.token >= 0)) {
      fetchData(exerciceType, level)
    }
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const dataToDisplay = randomizeData(data)
      const correctAnswerToDisplay = dataToDisplay.find((answer) => answer.isAnswer)
      setAnswers(dataToDisplay)
      setCorrectAnswer(correctAnswerToDisplay)
    }
  }, [data])

  useEffect(() => {
    if(user.token < 0) {
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
    }
  }, [user])

  return (
    <section className="section-bottom relative flex flex-col items-center justify-center w-full h-full">
      {showSettingsPanel && 
        <SettingsPanel exerciceType={exerciceType} fetch={fetchData} setLevel={setLevel} setMainLanguage={setMainLanguage} setShowSettingsPanel={setShowSettingsPanel} />
      }
      {correctAnswer && <div className="absolute z-1 top-0 h-48 w-screen rounded-b-full" style={isCorrect !== undefined ? isCorrect ? { backgroundColor: 'green', filter: "blur(4px)" } : { backgroundColor: 'red', filter: "blur(4px)" } : {}} />}
      <ExerciceHeader title={`Quiz ${exerciceType} ${level && `N${level}`}`} children={
        <p>{score}/{scoreMax}</p>
      }/>
      <div className="exerciceContentBlock">
        {level &&
          <div className='absolute top-2 md:top-2 flex justify-end items-center w-full h-auto px-3 md:px-5 gap-5'>
            <EyeButton state={showFurigana} setState={setShowFurigana} label="字" />
            <FaGear onClick={() => setShowSettingsPanel(true)} />
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
          {data.length > 0 ?
          <>
            {correctAnswer &&
              <div className="flex items-center justify-center text-center text-2xl md:text-4xl lg:text-5xl font-bold mb-2 mt-2 py-3">
                {mainLanguage === 'fr' ?
                  <h3 className="text-xl md:text-2xl">{correctAnswer.french}</h3>
                  :
                  correctAnswer.kanji ?
                    showFurigana ?
                      exerciceType !== 'sentence' ?
                        <ruby><span className="text-5xl">{correctAnswer.kanji}</span><rp>(</rp><rt className="mb-5">{correctAnswer.japanese}</rt><rp>)</rp></ruby>
                        :
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-xl md:text-2xl">{correctAnswer.kanji}</h3>
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
            {
              correctAnswer && <ActionButton action={() => handleReport(correctAnswer.id)} style="absolute -bottom-5 right-1 flex items-end justify-end" icon={<FaRegCircleQuestion color={'#653C87'} />} text="" />
            }
          </>
          :
            <p className="text-yellow-500">Erreur de chargement, essayez de changer les paramètres de l'exercice</p>
          }
          </>
        }
      </div>
    </section>
  )
}

export default Quiz