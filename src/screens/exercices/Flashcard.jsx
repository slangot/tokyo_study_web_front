import { useEffect, useState } from "react"

// Context
import{ useUser } from '../../context/UserContext'

// Icons
import { FaArrowRight, FaGear, FaPlus } from "react-icons/fa6"

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { ExerciceHeader } from '../../uikit/Blocks';
import { ActionButton, ReadingDisplay } from "../../uikit/Buttons";

const useSearchParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const SettingsPanel = ({exerciceType, fetch, level, mainLanguage, setLevel, setMainLanguage, setShowSettingsPanel}) => {
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
    <div className="relative w-full">
      <div className='absolute flex flex-col z-40 w-full h-[100dvh] overflow-hidden bg-black px-2'>
        <button onClick={() => setShowSettingsPanel(false)} className="absolute z-50 top-4 right-3 text-white w-10 h-10">x</button>
        <div className='relative flex flex-col justify-center w-full h-[90%]'>
          <h1>Paramètre du quiz :</h1>
          <h2>Niveau JLPT :</h2>
          <div className="flex items-center font-bold w-full md:w-3/4 mx-auto border-2 rounded-lg bg-light text-blue-500">
            <div className="levelSelectButton rounded-l-md" style={levelChoice || level === 6 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(6)}><FaPlus /></div>
            <div className="levelSelectButton" style={levelChoice || level === 5 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(5)}>N5</div>
            <div className="levelSelectButton" style={levelChoice || level === 4 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(4)}>N4</div>
            <div className="levelSelectButton" style={levelChoice || level === 3 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(3)}>N3</div>
            <div className="levelSelectButton" style={levelChoice || level === 2 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(2)}>N2</div>
            <div className="levelSelectButton border-r-0 rounded-r-md" style={levelChoice || level === 1 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(1)}>N1</div>
          </div>
          <h2>Choix d'affichage :</h2>
          <div className="exerciceButtonLanguageContainer">
            <button 
              className="exerciceButtonLanguage" 
              onClick={() => setLanguageChoice('fr')}
              style={languageChoice || mainLanguage === 'fr' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}}
            >
              Français -&gt; Japonais
            </button>
            <button
              className="exerciceButtonLanguage" 
              onClick={() => setLanguageChoice('jp')}
              style={languageChoice || mainLanguage === 'jp' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}}
            >
              Japonais -&gt; Français
            </button>
          </div>
          <button onClick={() => handleChanges()}>Confirmer</button>
        </div>
      </div>
    </div>
  )
}

const Flashcard = () => {
  const { state, dispatch } = useUser();
  const user = state.user
  const navigate = useNavigate()

  // Params
  const searchParams = useSearchParams()
  const exerciceType = searchParams.get("type")

  // State 
  const [data, setData] = useState(null)
  const [isCorrect, setIsCorrect] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reading, setReading] = useState('kanji')

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

        const query = `${process.env.REACT_APP_API_LOCAL}/${dbType}?level=${level}&limit=1`

        const response = await fetch(query, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        if (data && data.length > 0) {
          setData(data[0])
          updateTokens(1)
          setIsLoading(false)
        } else {
          setData(null)
          setIsLoading(false)
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error('error : ', error)
    }
  }

  const handleNext = (isCorrect) => {
    setIsCorrect(isCorrect)
    updateStats(data.id, exerciceType, isCorrect)
    setTimeout(() => {
      if (level && exerciceType) {
        fetchData(exerciceType, level)
        setIsCorrect(undefined)
        setShowAnswer(false)
      }
    }, 1500)
  }

  const handleStart = () => {
    fetchData(exerciceType, level)
  }

  const handleVerify = () => {
    setShowAnswer(!showAnswer)
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
      const query = `${process.env.REACT_APP_API_LOCAL}/user/tokenManager`
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

  const updateStats = async (exerciceId, type, status) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciceId: exerciceId,
          status: status ? 'correct' : 'wrong',
          type: type,
          userId: user.id,
        })
      }
      const query = `${process.env.REACT_APP_API_LOCAL}/es/`
      const response = await fetch(query, options);
  
      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
      }
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (exerciceType && level && (user.token >= 0)) {
      fetchData(exerciceType, level)
    }
  }, [])

  useEffect(() => {
    if(user.token < 0) {
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
  }, [user])

  return (
    <section className="exerciceSection md:section-bottom flex flex-col">
      {showSettingsPanel && 
        <SettingsPanel exerciceType={exerciceType} fetch={fetchData} level={level} mainLanguage={mainLanguage} setLevel={setLevel} setMainLanguage={setMainLanguage} setShowSettingsPanel={setShowSettingsPanel} />
      }
      <ExerciceHeader title={`Flashcard ${exerciceType} ${level && 'N' + level}`} />
      
      <div className="exerciceContentBlock">
        {level &&
          <div className='absolute top-2 md:top-2 flex justify-end items-center w-full h-auto px-3 md:px-5 gap-5'>
            <ReadingDisplay state={reading} setState={setReading} />
            <FaGear onClick={() => setShowSettingsPanel(true)} />
          </div>
        }
        {isLoading ? (
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
        ) : (
          <>
            {data ?
              <>
                <div className="flex items-center justify-center text-center text-2xl md:text-4xl lg:text-5xl font-bold mt-20 px-2 md:my-2 w-full md:w-1/2 h-40" style={isCorrect === true ? {backgroundColor: 'green'} : isCorrect === false ? {backgroundColor: 'red'} : {backgroundColor: '#3A025B'}}>
                  {mainLanguage === 'fr' ?
                    <h3>{data.french}</h3>
                    :
                    reading === 'furigana' ?
                      exerciceType !== 'sentence' ?
                        <div className="flex flex-col items-center justify-center">
                          {data.kanji ?
                            <p className="text-lg text-light">{data.japanese}</p>
                            :
                            <p className="text-5xl text-light">{data.japanese}</p>
                          }
                          <h3 className="text-5xl">{data.kanji}</h3>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center">
                          <h3>{data.kanji}</h3>
                          <p className="text-lg mt-2 text-light">{data.japanese}</p>
                        </div>
                      : reading === 'kana' ?
                        <span className="text-5xl">{data.japanese}</span>
                        :
                        <span className="text-5xl">{data.kanji || data.japanese}</span>
                  }
                </div>
                <div className="flex items-center justify-evenly flex-wrap w-full md:w-1/2 min-h-40 my-2" style={showAnswer ? { backgroundColor: '#653C87' } : { backgroundColor: 'transparent' }}>
                  {showAnswer &&
                    <h3>{mainLanguage === 'fr' ?
                      <span className="flex flex-col justify-center items-center">
                        {reading === 'furigana' ?
                          <>
                            <span>{data.japanese}</span>
                            <span className="text-5xl">{data.kanji}</span>
                          </>
                          :
                          reading === 'kanji' ?
                            <span className="text-5xl px-2">{data.kanji || data.japanese}</span>
                            :
                            <span className="text-3xl px-2">{data.japanese}</span>
                        }
                      </span> : <span className="text-3xl">{data.french}</span>
                    }</h3>
                  }
                </div>
                <div className='absolute bottom-10 w-full flex flex-col items-center justify-center gap-10 md:gap-5'>
                  {!data ?
                    <ActionButton style="bg-blue-500 text-white" action={() => handleStart()} text={!data ? 'Commencer' : 'Suivant'} />
                  :
                    <ActionButton style="bg-blue-500 text-white" action={() => handleVerify()} text={showAnswer ? 'Cacher' : 'Vérifier'} />
                  }
                  <div className='relative flex flex-row justify-center gap-5'>
                    <ActionButton style="bg-red-600 text-white min-w-[30dvw]" action={() => handleNext(false)} text='Faux' />
                    <ActionButton style="bg-green-600 text-white min-w-[30dvw]" action={() => handleNext(true)} text='Correct' />
                  </div>
                </div>
              </>
              :
              <p className="text-yellow-500">Erreur de chargement, essayez de changer les paramètres de l'exercice</p>
            }
          </>)}
      </div>
    </section>
  )
}

export default Flashcard