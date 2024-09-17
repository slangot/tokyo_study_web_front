// React
import { useState } from "react"

// Icons
import { FaPlus } from "react-icons/fa6"

// Packages
import { Link } from "react-router-dom"

const Exercices = () => {
  const [level, setLevel] = useState(0)
  const [openButton, setOpenButton] = useState({
    status: false,
    type: ""
  })

  const handleOpenButton = (type) => {
    setOpenButton({
      status: openButton.type === type ? !openButton.status : true,
      type: type
    })
  }
  return (
    <section className="section-bottom md:mx-2">
      <h1 className="title">Exercices</h1>
      <div className="flex flex-col items-center w-screen">

        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-2 w-full items-center mt-5">
          {/* Quiz */}
          {/* Vocabulary */}
          <Link className="exerciceButton py-4" to={`/exercices/quiz?type=vocabulary`}><span className="flex flex-row items-center justify-center gap-2">Quiz vocabulaire</span></Link>

          {/* Sentence */}
          <Link className="exerciceButton py-4" to={`/exercices/quiz?type=sentence`}><span className="flex flex-row items-center justify-center gap-2">Quiz phrase</span></Link>

          {/* Méli-Mélo */}
          <Link className="exerciceButton py-4" to={`/exercices/melimelo`}>Méli-mélo</Link>

          {/* Flashcard */}
          <div className="exerciceButton">
            <h2 className="w-full text-center py-4" onClick={() => handleOpenButton('flashcard')}>Flashcard</h2>
            {(openButton.type === 'flashcard' && openButton.status) && <>
              {/* Levels */}
              <h2 className="mb-2 text-center text-sm lowercase">Choix du niveau :</h2>
              <div className="flex items-center font-bold w-full md:w-3/4 mx-auto border-2 rounded-lg bg-light" onClick={null}>
                <div className="levelSelectButton rounded-l-md" style={level === 6 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevel(6)}><FaPlus /></div>
                <div className="levelSelectButton" style={level === 5 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevel(5)}>N5</div>
                <div className="levelSelectButton" style={level === 4 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevel(4)}>N4</div>
                <div className="levelSelectButton" style={level === 3 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevel(3)}>N3</div>
                <div className="levelSelectButton" style={level === 2 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevel(2)}>N2</div>
                <div className="levelSelectButton border-r-0 rounded-r-md" style={level === 1 ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setLevel(1)}>N1</div>
              </div>

              <div className="flex flex-row w-full my-3 justify-evenly">
                <div className="flex-1 text-center p-2 mx-2 border-2 border-fourth bg-third rounded-lg">
                  <h3>Vocabulaire</h3>
                  <Link className="exerciceButtonLanguage" to={`/exercices/flashcard?type=vocabulary&level=${level}&lang=fr`}>FR -&gt; JP</Link>
                  <Link className="exerciceButtonLanguage" to={`/exercices/flashcard?type=vocabulary&level=${level}&lang=jp`}>JP -&gt; FR</Link>
                </div>
                <div className="flex-1 text-center p-2 mx-2 border-2 border-fourth bg-third rounded-lg">
                  <h3>Phrase</h3>
                  <Link className="exerciceButtonLanguage" to={`/exercices/flashcard?type=sentence&level=${level}&lang=fr`}>FR -&gt; JP</Link>
                  <Link className="exerciceButtonLanguage" to={`/exercices/flashcard?type=sentence&level=${level}&lang=jp`}>JP -&gt; FR</Link>
                </div>
              </div>
            </>}
          </div>

          {/* Drawing */}
          <Link className="exerciceButton py-4" to={`/exercices/drawing`}>Dessin</Link>

          {/* Crosswords */}
          {/* <Link className="exerciceButton" to={`/exercices/crosswords`}><span className="flex flex-row items-center justify-center gap-2">Mots croisés <BsConeStriped color="orange" /></span></Link> */}

          {/* Hiddenwords */}
          <Link className="exerciceButton py-4" to={`/exercices/hiddenwords`}><span className="flex flex-row items-center justify-center gap-2">Mots cachés</span></Link>

          {/* Numbers */}
          <Link className="exerciceButton py-4" to={`/exercices/numbers`}><span className="flex flex-row items-center justify-center gap-2">Ça fait combien ?</span></Link>

          {/* Grammar */}
          <Link className="exerciceButton py-4" to={`/exercices/grammar`}>Conjugaison</Link>

          {/* Time */}
          <Link className="exerciceButton py-4" to={`/exercices/time`}><span className="flex flex-row items-center justify-center gap-2">Quelle heure est-il ?</span></Link>

          {/* Date */}
          <Link className="exerciceButton py-4" to={`/exercices/date`}><span className="flex flex-row items-center justify-center gap-2">Quel jour est-il ?</span></Link>

          {/* Listening */}
          <Link className="exerciceButton py-4" to={`/exercices/listening`}><span className="flex flex-row items-center justify-center gap-2">J'écoute</span></Link>
        </div>
      </div>
    </section >
  )
}

export default Exercices