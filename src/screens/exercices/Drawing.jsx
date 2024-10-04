// React
import { useEffect, useMemo, useRef, useState } from 'react'

// Context
import{ useUser } from '../../context/UserContext'

// Icons
import { FaGear, FaPlus, FaRegEye } from "react-icons/fa6";

// Packages
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { Header } from '../../uikit/Blocks';
import { ActionButton } from '../../uikit/Buttons';

const SettingsPanel = ({fetch, level, setLevel, setShowSettingsPanel}) => {
  const [levelChoice, setLevelChoice] = useState(level)

  const handleChanges = () => {
    if(levelChoice) {
      setLevel(levelChoice)
    }
    setShowSettingsPanel(false)
    setTimeout(() => {
      fetch(levelChoice)
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
            <div className="levelSelectButton rounded-l-md" style={levelChoice === 6 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(6)}><FaPlus /></div>
            <div className="levelSelectButton" style={levelChoice === 5 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(5)}>N5</div>
            <div className="levelSelectButton" style={levelChoice === 4 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(4)}>N4</div>
            <div className="levelSelectButton" style={levelChoice === 3 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(3)}>N3</div>
            <div className="levelSelectButton" style={levelChoice === 2 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(2)}>N2</div>
            <div className="levelSelectButton border-r-0 rounded-r-md" style={levelChoice === 1 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevelChoice(1)}>N1</div>
          </div>
          <button onClick={() => handleChanges()}>Confirmer</button>
        </div>
      </div>
    </div>
  )
}

const Drawing = () => {
  const { state, dispatch } = useUser();
  const user = state.user
  const navigate = useNavigate()
  const tokens = parseInt(sessionStorage.getItem('user_token'))
  const userId = sessionStorage.getItem('user_id')

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [isSmallScreen, setIsSmallScreen] = useState(window && (window?.innerWidth < 500 || window?.innerHeight < 500))
  const [isDrawing, setIsDrawing] = useState(false)
  const [isCorrect, setIsCorrect] = useState(undefined)
  const [isVerify, setIsVerify] = useState("")
  const [kanji, setKanji] = useState()
  const [level, setLevel] = useState(5)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)

  // Data functions
  const fetchData = async (level) => {
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

        const query = `${process.env.REACT_APP_API_LOCAL}/kanji?level=${level}&limit=1`

        const response = await fetch(query, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

          const data = await response.json();
        if (data && data.length > 0) {
          const newKanji = {
            id: data[0].id,
            kanji: data[0].kanji,
            kunyomi: data[0].kunyomi,
            onyomi: data[0].onyomi,
            french: data[0].french,
            english: data[0].english,
          };
          setKanji(newKanji);
          updateTokens(1)
        }
      }
    } catch (error) {
      console.error("error : ", error)
    }
  }

  const handleVerify = (verify) => {
    setIsVerify(verify)
    setShowHelp(true)
  };

  const handleNext = (isCorrect) => {
    setIsCorrect(isCorrect)
    updateStats(kanji.id, isCorrect)
    setTimeout(() => {
      if (level) {
        fetchData(level)
        setIsCorrect(undefined)
        setIsVerify(false)
        setShowHelp(false)
        resetDrawing()
      }
    }, 1500)
  }

  // Drawing functions
  const preventTouchScroll = (event) => {
    if (canvasRef.current && canvasRef.current.contains(event.target)) {
      event.preventDefault();
    }
  };

  const startDrawing = (event) => {
    event.preventDefault()
    const { offsetX, offsetY } = getEventPosition(event);
    if (!contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (event) => {
    event.preventDefault()
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = getEventPosition(event);
    if (!contextRef.current) return;

    // Draw the user movement
    contextRef.current.lineCap = 'round'
    contextRef.current.strokeStyle = '#653C87'
    contextRef.current.lineWidth = 10
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = (event) => {
    event.preventDefault()
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const resetDrawing = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setShowHelp(false)

    // Draw the grid
    setGrid()
  }

  const setHelpDrawing = (kanjiToDisplay) => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current && kanji) {
      const context = contextRef.current;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const text = kanjiToDisplay;
      const fontSize = 200

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(imageData, 0, 0);
      context.fillStyle = "rgba(0, 0, 0, 0.1)"
      context.font = isSmallScreen ? `${fontSize}px helvetica` : `${fontSize}px helvetica`;
      context.fillText(text, ((canvas.width / 2) - (fontSize / 2)), (canvas.height / 2) + 80);
    }
  }

  const setGrid = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    if (canvas && context) {
      context.beginPath();
      context.moveTo(0, (canvas.height / 2) - 1);
      context.strokeStyle = 'silver'
      context.setLineDash([3, 6]);
      context.lineWidth = 1
      context.lineTo(canvas.width, canvas.height / 2);
      context.stroke();
      context.moveTo((canvas.width / 2) - 1, 0);
      context.lineTo((canvas.width / 2) - 1, canvas.height);
      context.stroke();
      context.closePath();
    }
  }

  const getEventPosition = (event) => {
    if ('touches' in event) {
      const touch = event.touches[0];
      const boundingRect = (event.target).getBoundingClientRect();
      return {
        offsetX: touch.clientX - boundingRect.left,
        offsetY: touch.clientY - boundingRect.top,
      };
    } else {
      return {
        offsetX: event.nativeEvent.offsetX,
        offsetY: event.nativeEvent.offsetY,
      };
    }
  };

  const updateTokens = async (number) => {
    try {
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
      const query = `${process.env.REACT_APP_API_LOCAL}/user/tokenManager`
      const response = await fetch(query, options);
  
      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
        dispatch({ type: 'UPDATE_TOKEN', payload: tokens - number });
        sessionStorage.setItem('user_token', tokens - number)
      }
    } catch(err) {
      console.error(err)
    }
  }

  const updateStats = async (exerciceId, status) => {
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
          type: 'kanji',
          userId: userId,
        })
      }
      const query = `${process.env.REACT_APP_API_LOCAL}/es/update`
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

  // UseMemo
  useMemo(() => {
    if (showHelp && kanji) {
      setHelpDrawing(kanji.kanji)
    }
  }, [showHelp])

  useMemo(() => {
    if (!kanji) {
      fetchData(level)
    }
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventTouchScroll);
    };
  }, [kanji]);

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

  useEffect(() => {
    if (window) {
      window.addEventListener('resize', () => {
        setIsSmallScreen(window.innerWidth < 500 || window.innerHeight < 500)
      });
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const screenWidth = isSmallScreen ? window.innerWidth : 500;
    const screenHeight = isSmallScreen ? 300 : 500;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;
    canvas.style.backgroundColor = 'white'

    const context = canvas.getContext('2d');
    if (!context) return;

    // Draw the grid
    setGrid()

    // Draw the user movement
    contextRef.current = context
    context.lineCap = 'round'
    context.strokeStyle = '#653C87'
    context.setLineDash([])
    context.lineWidth = 10
  }, [])

  return (
    <section className="exerciceSection md:section-bottom relative flex flex-col w-full">
      {showSettingsPanel && 
        <SettingsPanel fetch={fetchData} level={level} setLevel={setLevel} setShowSettingsPanel={setShowSettingsPanel} />
      }
      <Header title={`Écriture N${level}`} link='/exercices' children={
        <div className='flex flex-row gap-4 items-center'>
           <button className="flex justify-center items-center rounded-lg uppercase font-bold" onClick={() => setShowHelp(true)}>
            <FaRegEye />
          </button>
         <FaGear onClick={() => setShowSettingsPanel(true)} />
        </div>
      } />

      {/* WORD AND ANSWER */}
      <div className="relative flex flex-col h-auto justify-evenly items-center" style={isCorrect === true ? {backgroundColor: 'green'} : isCorrect === false ? {backgroundColor: 'red'} : {backgroundColor: 'transparent'}}>
        <div className="flex flex-col justify-center items-center gap-2 h-auto my-1 md:my-3">
          {kanji && <h2 className="text-lg md:text-3xl font-bold text-center text-ellipsis">{kanji.french || kanji.english}</h2>}
          {isVerify && kanji &&
            <p className="flex text-3xl md:text-5xl text-gold font-bold items-center justify-center">
              {kanji.kanji}
            </p>
          }
        </div>

        {/* DRAWING */}
        <div className="relative flex flex-col items-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
        </div>

        {/* ACTION BUTTONS */}
        {kanji &&
          <div className='relative top-10 w-full flex flex-col gap-10 md:gap-5'>
            <div className='relative flex flex-row justify-center gap-5'>
              <ActionButton style='bg-orange-500 text-white' action={() => resetDrawing()} text='Effacer' />
              <ActionButton style='bg-blue-500 text-white' action={() => handleVerify('show')} text={'Vérifier'} />
            </div>
            <div className='relative flex flex-row justify-center gap-5 mb-10'>
              <ActionButton style='bg-red-600 text-white min-w-[30dvw]' action={() => handleNext(false)} text='Faux' />
              <ActionButton style='bg-green-600 text-white min-w-[30dvw]' action={() => handleNext(true)} text='Correct' />
            </div>
          </div>
        }
      </div>
    </section>
  )
}

export default Drawing