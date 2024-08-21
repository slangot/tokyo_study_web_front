// React
import { useEffect, useMemo, useRef, useState } from "react"

// Icons
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

// UiKit
import { ExerciceHeader } from '../uikit/Blocks';
import { ActionButton } from '../uikit/Buttons';

const Drawing = () => {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isSmallScreen, setIsSmallScreen] = useState(window && (window?.innerWidth < 500 || window?.innerHeight < 500))
  const [isDrawing, setIsDrawing] = useState(false)
  const [isVerify, setIsVerify] = useState("")
  const [kanji, setKanji] = useState()
  const [showHelp, setShowHelp] = useState(false)

  // Data functions
  const fetchData = async (level) => {
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const query = `https://www.data.tsw.konecton.com/kanji?level=${level}&limit=1`

      const response = await fetch(query, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      const data = await response.json();
    if (data && data.length > 0) {
      const newKanji = {
        kanji: data[0].kanji,
        kunyomi: data[0].kunyomi,
        onyomi: data[0].onyomi,
        french: data[0].french,
        english: data[0].english,
      };
      setKanji(newKanji);
    }
    } catch (error) {
      console.error("error : ", error)
    }
  }

  const handleVerify = (action) => {
    if (action === "next") {
      fetchData("5")
      setIsVerify("")
      setShowHelp(false)
      resetDrawing()
      return
    }
    setIsVerify(action);
  };

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

  // UseMemo
  useMemo(() => {
    if (showHelp && kanji) {
      setHelpDrawing(kanji.kanji)
    }
  }, [showHelp])

  useMemo(() => {
    if (!kanji) {
      fetchData("5")
    }
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventTouchScroll);
    };
  }, [kanji]);


  // UseEffect
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
    <div className="relative flex flex-col overflow-hidden w-full">
      <ExerciceHeader title="Écriture" children={
        <button className="flex justify-center items-center bg-secondary px-3 py-1 rounded-lg uppercase font-bold" onClick={() => setShowHelp(true)}>
          {showHelp ? <FaRegEyeSlash /> : <FaRegEye />} <span className="ml-3">Kanji</span>
        </button>
      } />

      {/* WORD AND ANSWER */}
      <div className="relative flex flex-col h-auto justify-evenly items-center">
        <div className="flex flex-col justify-center items-center gap-2 h-auto my-1 md:my-3">
          {kanji && <h2 className="text-lg md:text-3xl font-bold text-center text-ellipsis">{kanji.french || kanji.english}</h2>}
          {isVerify && kanji &&
            <p className="flex text-3xl md:text-5xl text-gold font-bold items-center justify-center">
              {kanji.kanji}
            </p>
          }
        </div>

        {/* DRAWING */}
        <div className="flex flex-col items-center">
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

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <ActionButton style="bg-blue-500 mt-3 md:mt-5" action={() => resetDrawing()} text='Effacer' />
            <ActionButton style="bg-primary px-3 md:px-5 py-1 md:py-3 mt-3 md:mt-5" action={() => handleVerify(isVerify === "show" ? "next" : "show")} text={isVerify === "show" ? "Suivant" : "Vérifier"} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Drawing