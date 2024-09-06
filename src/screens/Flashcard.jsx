// React
import { useEffect, useState } from "react"

// Icons
import { FaArrowRight } from "react-icons/fa6"

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useLocation } from "react-router-dom";

// UiKit
import { ExerciceHeader } from '../uikit/Blocks';
import { ActionButton, ReadingDisplay } from "../uikit/Buttons";

const useSearchParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const Flashcard = () => {

  // Params
  const searchParams = useSearchParams()
  const exerciceType = searchParams.get("type")
  const level = searchParams.get("level")
  const mainLanguage = searchParams.get("lang")

  // State 
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reading, setReading] = useState('kanji')

  const fetchData = async (dbType, level) => {
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const query = `https://www.data.tsw.konecton.com/${dbType}?level=${level}&limit=1`


      const response = await fetch(query, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
        const data = await response.json();
      if (data && data.length > 0) {
        setData(data[0])
      }
      setIsLoading(false)
  
  
    } catch (error) {
      console.error('error : ', error)
    }
  }

  const handleNext = (action) => {
    if (action === 'next') {
      if (exerciceType && level) {
        setIsLoading(true)
        setShowAnswer(false)
        fetchData(exerciceType, level)
      }
    } else {
      setShowAnswer(true)
    }
  }

  useEffect(() => {
    if (exerciceType && level) {
      setIsLoading(true)
      fetchData(exerciceType, level)
    }
  }, [])

  console.log(data)

  return (
    <section className="section-bottom">
      <ExerciceHeader title={`Flashcard ${exerciceType} ${level && 'N' + level}`} />
      
      <div className="exerciceContentBlock">
        <ReadingDisplay state={reading} setState={setReading} />
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
            {data &&
              <>
                <div className="flex items-center justify-center text-center text-2xl md:text-4xl lg:text-5xl font-bold my-2 bg-third w-full md:w-1/2 h-40">
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
                <div className="flex w-full justify-center mt-5 ">
                  <ActionButton style="px-5" action={handleNext(showAnswer ? 'next' : 'answer')} text={showAnswer ? <span className="flex items-center">Suivant <FaArrowRight className="ml-3" /></span> : 'Vérifier'} />
                </div>
              </>
            }
          </>)}
      </div>
    </section>
  )
}

export default Flashcard