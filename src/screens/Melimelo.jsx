// React
import { useEffect, useState } from "react"

// Icons
import { FaArrowRight } from "react-icons/fa6"

// Packages
import { RotatingLines } from "react-loader-spinner"

// UiKit
import { BackButton, ReadingDisplay } from "../uikit/Buttons";

// Utils
import { getApi } from "../utils/api"

const MeliMelo = () => {

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
      fetchData("sentence", "6")
      setAnswers([])
    } else {
      checkAnswers()
    }
  }

  const fetchData = async (dbType, level) => {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const query = `https://back.tsw.konecton.com/${dbType}?level=${level}&limit=1`

      fetch(query, options)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const fetchedData = {
              kanji: data[0].kanjiTag,
              japanese: data[0].japaneseTag
            }
            setCorrectAnswers(fetchedData)
            setSentence(data[0].french)
          }
          setIsLoading(false)
        })

    } catch (error) {
      console.error("error : ", error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchData("sentence", "6")
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

  return (
    <div className="flex flex-col w-[100dvw] min-h-[100dvh] ">
      <div className="relative z-10 flex flex-row items-center justify-center w-full mb-10 px-3">
        <BackButton url="/exercices" />
        <h1 className="exerciceTitle">Meli Melo</h1>
      </div>
      <div className="flex justify-center">
        <ReadingDisplay state={reading} setState={setReading} />
      </div>
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
        <div className="flex flex-col justify-around items-center relative z-20 px-10 py-10 min-w-96 min-h-[80dvh] md:mx-16 rounded-lg bg-fourth">
          <h3 className="text-xl mb-5 bg-medium-gray px-5 py-3 rounded-md">{sentence}</h3>
          <div className="flex flex-row flex-wrap gap-2 min-h-14 h-auto w-full mb-5 px-5 py-3 rounded-lg">
            {answers.map((answer, index) => (
              <button
                key={index}
                className="bg-primary px-4 py-2 text-xl flex justify-center items-center rounded-lg cursor-pointer font-bold hover:text-third"
                onClick={() => handleClick('remove', answer)}
              >
                {reading === 'kanji' ?
                  <p className="text-2xl">{answer.kanji}</p>
                  : reading === 'furigana' ?
                    <>
                      {answer.kanji !== answer.japanese ?
                        <div className="flex flex-col">
                          <p className="text-sm">{answer.japanese}</p>
                          <p className="text-2xl">{answer.kanji}</p>
                        </div>
                        :
                        <p className="text-2xl">{answer.japanese}</p>
                      }
                    </>
                    :
                    <p className="text-2xl">{answer.japanese}</p>
                }
              </button>
            ))
            }
          </div>
          <div className="mb-5">
            {verify === "correct" ? <div className="bg-success exerciceAnswerMessage">Bonne réponse</div> : verify === "wrong" ? <div className="bg-wrong exerciceAnswerMessage">Mauvaise réponse</div> : ""}
          </div>
          {verify === "wrong" && <div className="flex flex-row flex-wrap gap-2 min-h-14 w-full text-2xl justify-center items-center mb-5 px-5 py-3 font-bold rounded-lg bg-primary">
            {correctAnswers &&
              (reading === 'kanji' ?
                <p>{formatedData(splitData(correctAnswers), 'kanji')}</p>
                : reading === 'furigana' ?
                  <div className="flex flex-col text-center">
                    <p className="text-sm">{formatedData(splitData(correctAnswers), 'japanese')}</p>
                    <p className="text-2xl">{formatedData(splitData(correctAnswers), 'kanji')}</p>
                  </div>
                  :
                  <p className="text-2xl">{formatedData(splitData(correctAnswers), 'japanese')}</p>
              )
            }
          </div>
          }
          <div className="flex flex-row flex-wrap gap-2 mb-5 mt-5 min-h-14">
            {toDisplay.length > 0 && toDisplay.map((sentence, index) => (
              <button
                key={index}
                className="bg-primary text-xl px-4 py-2 flex justify-center items-center rounded-lg pointer-events-auto font-bold"
                onClick={() => handleClick('add', sentence)}
              >
                {reading === 'kanji' ?
                  <p className="text-2xl">{sentence.kanji}</p>
                  : reading === 'furigana' ?
                    <>
                      {sentence.kanji !== sentence.japanese ?
                        <div className="flex flex-col text-center">
                          <p className="text-sm">{sentence.japanese}</p>
                          <p className="text-2xl">{sentence.kanji}</p>
                        </div>
                        :
                        <p className="text-2xl">{sentence.japanese}</p>
                      }
                    </>
                    :
                    <p className="text-2xl">{sentence.japanese}</p>
                }
              </button>
            ))}
          </div>
          <button className="px-4 py-2 mt-4 rounded-lg uppercase font-bold  text-white w-40 mx-auto hover:bg-secondary " style={verify ? { backgroundColor: "rgb(202, 138, 4)" } : { backgroundColor: "#653C87" }} onClick={() => handleNext(verify ? 'next' : 'verify')}>{verify ? <span className="flex items-center justify-center">Suivant <FaArrowRight className="ml-3" /></span> : 'Vérifier'}</button>
        </div>
      )}
    </div>
  )
}

export default MeliMelo