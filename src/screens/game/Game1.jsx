import React, { useEffect, useRef } from 'react'

const Game1 = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    // if (window) {
    //   window.addEventListener('resize', () => {
    //     setIsSmallScreen(window.innerWidth < 500)
    //   });
    // }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const screenWidth = 300;
    const screenHeight = 300
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;
    canvas.style.backgroundColor = 'white'

    const context = canvas.getContext('2d');
    if (!context) return;

    // Draw the grid
    // setGrid()

    // Draw the user movement
    contextRef.current = context
    context.lineCap = 'round'
    context.strokeStyle = '#653C87'
    context.setLineDash([])
    context.lineWidth = 10
  }, [])

  return (
    <div className='relative w-full h-[100dvh]'>
      <h1>GAME 1</h1>
      <canvas
        className='absolute top-10 left-10 bg-white w-[300px] h-[300px]'
        ref={canvasRef}
        // onMouseDown={startDrawing}
        // onMouseMove={draw}
        // onMouseUp={stopDrawing}
        // onMouseLeave={stopDrawing}
        // onTouchStart={startDrawing}
        // onTouchMove={draw}
        // onTouchEnd={stopDrawing}
        // onTouchCancel={stopDrawing}
      >

      </canvas>
    </div>
  )
}

export default Game1