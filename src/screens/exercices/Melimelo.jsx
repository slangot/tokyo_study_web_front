import { useEffect, useState } from "react"

// Api
import { fetchData, updateTokens } from "../../utils/api";

// Context
import{ useUser } from '../../context/UserContext'

// Icons
import { FaArrowRight } from "react-icons/fa6"

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { Header } from '../../uikit/Blocks';
import { ReadingDisplay } from "../../uikit/Buttons";

const MeliMelo = () => {
  const { dispatch } = useUser();
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_tokens'))
  const daily_tokens = parseInt(sessionStorage.getItem('user_daily_tokens'))
  const userId = sessionStorage.getItem('user_id')

  const [correctAnswers, setCorrectAnswers] = useState()
  const [answers, setAnswers] = useState([])
  const [toDisplay, setToDisplay] = useState([])
  const [sentence, setSentence] = useState("")
  const [verify, setVerify] = useState("")
  const [reading, setReading] = useState('kanji')
  const [isLoading, setIsLoading] = useState(false)

  const splitData = (data) => {
    const splittedKanji = data.kanji && data.kanji.split('<tswi>')
    const splittedJapanese = data.japanese.split('<tswi>')
    let newSplittedList = []
    for (let i = 0; i < splittedJapanese.length; i++) {
      newSplittedList.push({
        kanji: splittedKanji[i],
        japanese: splittedJapanese[i]
      })
    }
    return newSplittedList
  }

  const formatedData = (data, type) => {
    let formatedSentence = ""
    data.forEach((sentence) => {
      if (type === 'kanji') {
        formatedSentence += sentence.kanji
      } else if (type === 'japanese') {
        formatedSentence += sentence.japanese
      }
    })
    return formatedSentence
  }

  const handleClick = (action, value) => {
    let newAnswers = []
    let newDataToDisplay = []
    if (action === "add") {
      newAnswers = [...answers, value]
      newDataToDisplay = toDisplay.filter(sentence => sentence.japanese !== value.japanese)
    } else if (action === "remove") {
      newAnswers = answers.filter(answer => answer.japanese !== value.japanese)
      newDataToDisplay = [...toDisplay, value]
    }
    setAnswers(newAnswers)
    setToDisplay(newDataToDisplay)
  }

  const checkAnswers = () => {
    if (correctAnswers) {
      const answersJoined = formatedData(answers, "japanese")
      const correctAnswersSplitted = splitData(correctAnswers)
      const correctAnswersFormated = formatedData(correctAnswersSplitted, "japanese")

      if (answersJoined === correctAnswersFormated) {
        setVerify("correct")
      } else {
        setVerify("wrong")
      }
    }
  }

  const handleNext = (action) => {
    if (action === "next") {
      setIsLoading(true)
      setVerify("")
      handleFetchData("sentence", 6)
      setAnswers([])
    } else {
      checkAnswers()
    }
  }

  const handleFetchData = async (dbType, level) => {
    setIsLoading(true)
    const data = await fetchData(dbType, level, 1, tokens, navigate);
    if (data && data.length > 0) {
      const fetchedData = {
        kanji: data[0].kanjiTag,
        japanese: data[0].japaneseTag
      }
      setCorrectAnswers(fetchedData)
      setSentence(data[0].french)
      handleTokenUpdate(1)
    } else {
      setCorrectAnswers(null)
      setSentence("")
      setAnswers([])
    }
    setIsLoading(false)
  };

  const handleTokenUpdate = async (number) => {
    await updateTokens(number, daily_tokens, tokens, userId, dispatch, "reduce");
  };

  useEffect(() => {
    setIsLoading(true)
    handleFetchData("sentence", 6)
  }, [])

  useEffect(() => {
    if (toDisplay) {
      if (correctAnswers) {
        const splittedData = splitData(correctAnswers)
        const shuffledData = splittedData.sort(() => Math.random() - 0.5)
        setToDisplay(shuffledData)
      }
    }
  }, [correctAnswers])

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
    <section className="exerciceSection md:section-bottom flex flex-col w-[100dvw]">
      <Header title="Meli Melo" link='/exercices' />
      <div className="flex justify-center mt-3">
        <ReadingDisplay state={reading} setState={setReading} />
      </div>
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
        correctAnswers ? 
          <div className="flex flex-col justify-center gap-4 md:gap-4 items-center relative z-20 px-10 py-3 md:py-2 w-full mt-5">
            <h3 className="text-base md:text-xl mb-0 bg-blue-500 px-5 py-1 rounded-md">{sentence}</h3>
            <div className="flex flex-row flex-wrap gap-2 min-h-10 h-auto w-[90%] bg-third md:mb-1 px-1 md:px-5 py-3 rounded-lg">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  className="bg-primary text-white px-2 md:px-2 py-1 md:py-1 text-base md:text-lg flex justify-center items-center rounded-lg cursor-pointer font-bold hover:text-third"
                  onClick={() => handleClick('remove', answer)}
                >
                  {reading === 'kanji' ?
                    <p className="text-base md:text-xl">{answer.kanji || answer.japanese}</p>
                    : reading === 'furigana' ?
                      <>
                        {answer.kanji !== answer.japanese ?
                          <div className="flex flex-col">
                            <p className="text-sm">{answer.japanese}</p>
                            <p className="text-base md:text-xl">{answer.kanji}</p>
                          </div>
                          :
                          <p className="text-base md:text-xl">{answer.japanese}</p>
                        }
                      </>
                      :
                      <p className="text-base md:text-xl">{answer.japanese}</p>
                  }
                </button>
              ))
              }
            </div>
            <div className="mb-1">
              {verify === "correct" ? <div className="bg-success exerciceAnswerMessage">Bonne réponse</div> : verify === "wrong" ? <div className="bg-wrong exerciceAnswerMessage">Mauvaise réponse</div> : ""}
            </div>
            {verify === "wrong" && <div className="flex flex-row flex-wrap gap-2 min-h-10 w-full text-base md:text-xl justify-center items-center px-5 py-3 font-bold rounded-lg bg-primary text-white">
              {correctAnswers &&
                (reading === 'kanji' ?
                  <p>{formatedData(splitData(correctAnswers), 'kanji')}</p>
                  : reading === 'furigana' ?
                    <div className="flex flex-col text-center">
                      <p className="text-sm">{formatedData(splitData(correctAnswers), 'japanese')}</p>
                      <p className="text-base md:text-xl">{formatedData(splitData(correctAnswers), 'kanji')}</p>
                    </div>
                    :
                    <p className="text-base md:text-xl">{formatedData(splitData(correctAnswers), 'japanese')}</p>
                )
              }
            </div>
            }
            <div className="flex flex-row flex-wrap justify-center gap-2 md:min-h-10">
              {toDisplay.length > 0 && toDisplay.map((sentence, index) => (
                <button
                  key={index}
                  className="bg-primary text-white px-3 md:px-2 py-2 md:py-0 text-2xl flex justify-center items-center rounded-lg pointer-events-auto font-bold"
                  onClick={() => handleClick('add', sentence)}
                >
                  {reading === 'kanji' ?
                    <p className="">{sentence.kanji || sentence.japanese}</p>
                    : reading === 'furigana' ?
                      <>
                        {sentence.kanji !== sentence.japanese ?
                          <div className="flex flex-col text-center">
                            <p className="text-sm">{sentence.japanese}</p>
                            <p className="">{sentence.kanji}</p>
                          </div>
                          :
                          <p className="">{sentence.japanese}</p>
                        }
                      </>
                      :
                      <p className="">{sentence.japanese}</p>
                  }
                </button>
              ))}
            </div>
            <button className="px-4 py-2 md:mt-2 rounded-lg uppercase font-bold  text-white w-40 mx-auto hover:bg-secondary " style={verify ? { backgroundColor: "rgb(202, 138, 4)" } : { backgroundColor: "#653C87" }} onClick={() => handleNext(verify ? 'next' : 'verify')}>{verify ? <span className="flex items-center justify-center">Suivant <FaArrowRight className="ml-3" /></span> : 'Vérifier'}</button>
          </div>
        :
        <p className="text-yellow-500">Erreur de chargement, essayez de changer les paramètres de l'exercice</p>
      }
    </section>
  )
}

export default MeliMelo