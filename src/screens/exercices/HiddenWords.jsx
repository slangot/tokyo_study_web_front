import { useEffect, useMemo, useState } from "react"

// Context
import{ useUser } from '../../context/UserContext'

// Icons
import { BiSolidHelpCircle } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { TbBulb } from "react-icons/tb";

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { Header } from '../../uikit/Blocks';

// Able Letters
const WordCase = ({ letter, handleClick }) => {
  const style = {}
  return (
    <div onClick={() => handleClick(letter, 'add')} className="flex items-center justify-center w-11 h-11 md:w-10 md:h-10 m-1 bg-blue-400 text-white rounded-lg font-bold cursor-pointer" style={style}>{letter}</div>
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
      <div className="flex items-center justify-center w-7 h-7 m-1 rounded-full text-sm font-bold" style={answersList?.includes(word.japanese) ? { backgroundColor: "rgb(34, 197, 94)" } : (selectedClueId == (index + 1)) ? { backgroundColor: "rgb(202, 138, 4)" } : { backgroundColor: "#653C87" }}>{index + 1}</div>
      {Array.from(word.japanese).map((_, i) => (
        <div key={i} className="flex items-center justify-center w-8 h-8 m-1 rounded-lg text-sm font-bold" style={answersList?.includes(word.japanese) ? { backgroundColor: "rgb(34, 197, 94)" } : { backgroundColor: "white" }}>
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
  const { dispatch } = useUser();
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_tokens'))
  const daily_tokens = parseInt(sessionStorage.getItem('user_daily_tokens'))
  const userId = sessionStorage.getItem('user_id')

  const [fetchedData, setFetchedData] = useState([])
  const [lettersList, setLettersList] = useState([])
  const [selectedLetters, setSelectedLetters] = useState([])
  const [answersList, setAnswersList] = useState([])
  const [selectedClue, setSelectedClue] = useState("")
  const [selectedClueId, setSelectedClueId] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [wrongSelection, setWrongSelection] = useState("")

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
      setWrongSelection("")
    } else {
      setWrongSelection("wrong")
      setTimeout(() => {
        setWrongSelection("")
      }, 1500)
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

        const query = `${process.env.REACT_APP_API}/${dbType}?level=${level}&limit=4`

        const response = await fetch(query, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        if (data && data.length > 0) {
          const orderedWordsList = data.sort((a, b) => a.japanese.length - b.japanese.length);
          setFetchedData(orderedWordsList)
          updateTokens(1)
        } else {
          setFetchedData([])
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error("error : ", error)
    }
  }

  const updateTokens = async (number) => {
    try {
      if(daily_tokens > 0) {
        dispatch({ type: 'UPDATE_DAILY_TOKENS', payload: parseInt(daily_tokens) - number });
        sessionStorage.setItem('user_daily_tokens', parseInt(daily_tokens) - number)
      } else {
        const options = {
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tokenNumber: tokens - number,
            userId: userId,
          })
        }
        const query = `${process.env.REACT_APP_API}/user/tokenManager`
        const response = await fetch(query, options);
    
        if (!response.ok) {
          Swal.fire("Erreur lors de l'opération");
          throw new Error(`HTTP error! status: ${response.status}`);
        } else if (response.ok) {
          dispatch({ type: 'UPDATE_TOKENS', payload: tokens - number });
          sessionStorage.setItem('user_tokens', tokens - number)
        }
      }
    } catch(err) {
      console.error(err)
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
    <section className="exerciceSection md:section-bottom pt-5 md:pt-1">
      <Header title="Mots cachés" link='/exercices' />
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
       fetchedData.length > 0 ?
        <div className="flex flex-col mt-1 h-[90dvh] text-white w-full overflow-hidden">
          {/* WORDS LIST DISPLAY */}
          <div className="mt-1">
            <WordRows wordsList={fetchedData} answersList={answersList} selectedClueId={selectedClueId} setSelectedClueId={setSelectedClueId} setSelectedClue={setSelectedClue} />
          </div>

          {/* CLUE */}
          <div className="flex items-center justify-center py-2 mt-2 w-[95vw] md:w-2/4 mx-auto text-ellipsis bg-third rounded-lg">
            <><BiSolidHelpCircle className="mr-3 text-lg md:text-xl" />{selectedClue ? <span className="text-lg md:text-2xl">{selectedClue}</span> : <span className="text-sm md:text-md">Cliquez sur un des nombre pour l&apos;indice</span>}</>
          </div>

          {/* SELECTED LETTERS */}
          <div className="flex flex-row justify-center items-center w-[95vw] md:w-2/4 mx-auto bg-primary mt-3 min-h-10 rounded-lg" style={wrongSelection === 'wrong' ?  {backgroundColor: 'orange'} : {}}>
            {selectedLetters.map((letter, index) => (
              <div key={index} className="flex items-center justify-center w-8 h-8 m-1 bg-blue-400 text-white rounded-lg font-bold">{letter}</div>
            ))}
          </div>

          {/* ABLE LETTERS */}
          <div className="relative flex flex-1 flex-col items-center justify-between w-full">
            <div className="relative w-full md:w-3/4 px-3 items-center justify-center h-auto flex flex-wrap mt-3">
              {lettersList.map((letter, index) => (
                <WordCase key={index} letter={letter} handleClick={handleClick} />
              ))}
            </div>

            {/* ACTIONS BUTTONS */}
            {answersList.length === fetchedData.length ?
              <div className="absolute bottom-6 md:bottom-16 flex flex-row justify-center w-full px-1 md:px-5 my-3 md:my-0">
                <button className="flex items-center justify-center bg-primary px-4 py-2 gap-3 text-3xl md:text-sm rounded-lg uppercase" onClick={() => handleNext()}>Suivant <FaArrowRight /></button>
              </div>
              :
              <div className="absolute bottom-6 md:bottom-16 flex flex-row justify-between w-full px-1 md:px-5 my-3 md:my-0 ">
                <button className="flex items-center justify-center px-3 md:px-1 w-10 h-10 md:h-8 md:w-8 rounded-full font-bold bg-wrong" onClick={() => handleClean()}><CgClose className="text-3xl md:text-xl"/></button>
                <button className="flex items-center justify-center px-3 md:px-1 w-10 h-10 md:h-8 md:w-8 rounded-full font-bold bg-success" onClick={() => handleValidate()}><FaCheck className="md:text-sm" /></button>
                <button className="flex items-center justify-center px-3 md:px-1 w-10 h-10 md:h-8 md:w-8 rounded-full font-bold" style={selectedClue ? { backgroundColor: "rgb(234,179,8)", color: "white" } : { backgroundColor: "grey", color: "silver" }} disabled={!selectedClue} onClick={() => handleHelp(selectedClueId)}><TbBulb className="text-3xl md:text-xl" /></button>
              </div>
            }
          </div>
        </div>
        :
        <p className="text-yellow-500">Erreur de chargement, essayez de changer les paramètres de l'exercice</p>
      }
    </section>
  )
}

export default HiddenWords