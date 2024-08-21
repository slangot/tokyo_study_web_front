// React
import { useEffect, useMemo, useState } from "react"

// Icons
import { BiSolidHelpCircle } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { TbBulb } from "react-icons/tb";

// Packages
import { RotatingLines } from "react-loader-spinner"

// UiKit
import { ExerciceHeader } from '../uikit/Blocks';

// Able Letters
const WordCase = ({ letter, handleClick }) => {
  const style = {}
  return (
    <div onClick={() => handleClick(letter, 'add')} className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 m-1 bg-blue-400 text-white rounded-lg font-bold cursor-pointer" style={style}>{letter}</div>
  )
}

// Hidden Words Rows
const WordRows = ({ wordsList, answersList, selectedClueId, setSelectedClueId, setSelectedClue }) => {
  const handleClue = (clue, id) => {
    setSelectedClue(clue)
    setSelectedClueId(id)
  }

  const rowsDisplay = wordsList.map((word, index) => (
    <div key={index} className="flex justify-center items-center text-white font-bold cursor-pointer" onClick={() => handleClue(word.french, index + 1)}>
      <div className="flex items-center justify-center w-7 h-7 md:w-14 md:h-14 m-1 rounded-full font-bold" style={answersList?.includes(word.japanese) ? { backgroundColor: "rgb(34, 197, 94)" } : (selectedClueId == (index + 1)) ? { backgroundColor: "rgb(202, 138, 4)" } : { backgroundColor: "#653C87" }}>{index + 1}</div>
      {Array.from(word.japanese).map((_, i) => (
        <div key={i} className="flex items-center justify-center w-8 h-8 md:w-14 md:h-14 m-1 rounded-lg font-bold" style={answersList?.includes(word.japanese) ? { backgroundColor: "rgb(34, 197, 94)" } : { backgroundColor: "white" }}>
          {word.japanese[i]}
        </div>
      ))}
    </div>
  ));

  return (
    <div>
      {rowsDisplay}
    </div>
  );
}

const HiddenWords = () => {
  const [fetchedData, setFetchedData] = useState([])
  const [lettersList, setLettersList] = useState([])
  const [selectedLetters, setSelectedLetters] = useState([])
  const [answersList, setAnswersList] = useState([])
  const [selectedClue, setSelectedClue] = useState("")
  const [selectedClueId, setSelectedClueId] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Function to split the fetched data and get all the letters
  const splitWords = (data) => {
    const newsLettersList = []
    data.map(word => {
      for (let i = 0; i < word.japanese.length; i++) {
        if (!newsLettersList.includes(word.japanese[i])) {
          newsLettersList.push(word.japanese[i])
        }
      }
    })

    const sortedLettersList = newsLettersList.sort(() => Math.random() - 0.5)

    setLettersList(sortedLettersList)
  }

  // Function to add the selected letter to selectedLetters list
  const handleClick = (letter, action) => {
    if (action === "add") {
      setSelectedLetters([...selectedLetters, letter])
    }
  }

  // Function to verify and validate answer
  const handleValidate = () => {
    const isCorrect = fetchedData.some(word => word.japanese === selectedLetters.join(''))
    if (isCorrect) {
      setAnswersList([...answersList, selectedLetters.join('')])
      setSelectedLetters([])
      setSelectedClue("")
    }
  }

  // Function to add selected id clue answer to the list
  const handleHelp = (id) => {
    const wordHelp = fetchedData[id - 1].japanese
    setAnswersList([...answersList, wordHelp])
  }

  const handleClean = () => {
    setSelectedLetters([])
  }

  const handleNext = () => {
    setIsLoading(true)
    setSelectedClue("")
    setSelectedClueId(0)
    setAnswersList([])
    fetchData("vocabulary", "6")
  }

  // Function to fetch and ordered data
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
            const orderedWordsList = data.sort((a, b) => a.japanese.length - b.japanese.length);
            setFetchedData(orderedWordsList)
          }
          setIsLoading(false)
    } catch (error) {
      console.error("error : ", error)
    }
  }

  useEffect(() => {
    fetchData("vocabulary", "6")
  }, [])

  useEffect(() => {
    if (fetchedData) {
      splitWords(fetchedData)
    }
  }, [fetchedData])

  const isReady = useMemo(() => {
    if (lettersList.length > 0) {
      setIsLoading(false)
    }
  }, [lettersList])

  return (
    <div>
      <ExerciceHeader title="Mots cachés" />
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
        <div className="flex flex-col -mt-1 h-[90dvh] text-white w-full overflow-hidden">
          {/* WORDS LIST DISPLAY */}
          <div className="mt-1 md:mt-4">
            <WordRows wordsList={fetchedData} answersList={answersList} selectedClueId={selectedClueId} setSelectedClueId={setSelectedClueId} setSelectedClue={setSelectedClue} />
          </div>

          {/* CLUE */}
          <div className="flex items-center justify-center py-2 mt-2 md:mt-4 w-[95vw] md:w-3/4 mx-auto text-ellipsis bg-third rounded-lg">
            <><BiSolidHelpCircle className="mr-3 text-lg md:text-2xl" />{selectedClue ? <span className="text-lg md:text-2xl">{selectedClue}</span> : <span className="text-sm md:text-md">Cliquez sur un des nombre pour l&apos;indice</span>}</>
          </div>

          {/* SELECTED LETTERS */}
          <div className="flex flex-row justify-center items-center w-[95vw] md:w-3/4 mx-auto bg-primary mt-3 min-h-10 md:min-h-14 rounded-lg">
            {selectedLetters.map((letter, index) => (
              <div key={index} className="flex items-center justify-center w-8 h-8 md:w-14 md:h-14 m-1 bg-blue-400 text-white rounded-lg font-bold">{letter}</div>
            ))}
          </div>

          {/* ABLE LETTERS */}
          <div className="relative flex flex-1 flex-col items-center justify-between w-full min-h-40">
            <div className="relative w-full md:w-3/4 px-3 items-center justify-center h-auto flex flex-wrap mt-3 md:mt-5">
              {lettersList.map((letter, index) => (
                <WordCase key={index} letter={letter} handleClick={handleClick} />
              ))}
            </div>

            {/* ACTIONS BUTTONS */}
            {answersList.length === fetchedData.length ?
              <div className="absolute bottom-4 flex flex-row justify-center w-full px-1 md:px-5 my-3 ">
                <button className="flex items-center justify-center bg-primary px-4 py-2 gap-3 text-3xl rounded-lg uppercase" onClick={() => handleNext()}>Suivant <FaArrowRight /></button>
              </div>
              :
              <div className="absolute bottom-6 md:bottom-4 flex flex-row justify-between w-full px-1 md:px-5 my-3 ">
                <button className="flex items-center justify-center px-3 w-10 h-10 md:h-14 md:w-14 text-3xl rounded-full font-bold bg-wrong" onClick={() => handleClean()}><CgClose /></button>
                <button className="flex items-center justify-center px-3 w-10 h-10 md:h-14 md:w-14 rounded-full font-bold bg-success" onClick={() => handleValidate()}><FaCheck /></button>
                <button className="flex items-center justify-center px-3 w-10 h-10 md:h-14 md:w-14 text-3xl rounded-full font-bold" style={selectedClue ? { backgroundColor: "rgb(234,179,8)", color: "white" } : { backgroundColor: "grey", color: "silver" }} disabled={!selectedClue} onClick={() => handleHelp(selectedClueId)}><TbBulb /></button>
              </div>
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default HiddenWords