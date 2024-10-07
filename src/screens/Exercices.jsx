// Packages
import { Link } from "react-router-dom"

const Exercices = () => {
  const logo = require('../assets/tsw-exercice.jpg')

  return (
    <section className="section-bottom md:mx-2 pt-2">
      <div className="flex justify-center mx-auto mt-2 w-full">
        <img src={logo} className="object-contain w-[40%] rounded-lg"/>
      </div>
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
            {/* Vocabulary */}
            <Link className="exerciceButton py-4" to={`/exercices/flashcard?type=vocabulary`}><span className="flex flex-row items-center justify-center gap-2">Flashcard vocabulaire</span></Link>

            {/* Sentence */}
            <Link className="exerciceButton py-4" to={`/exercices/flashcard?type=sentence`}><span className="flex flex-row items-center justify-center gap-2">Flashcard phrase</span></Link>

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