// Icons
import { TbCrown } from 'react-icons/tb'

// Packages
import { Link } from "react-router-dom"

const Exercices = () => {
  const logo = require('../assets/tsw-exercice.jpg')
  const planGrade = sessionStorage.getItem('user_plan_grade').replace('"', '').replace('"', '')

  return (
    <section className="section-bottom py-2">
      <div className="flex justify-center mx-auto w-1/3 md:w-1/6 mt-2">
        <img src={logo} className="object-contain rounded-lg"/>
      </div>
      <div className="flex flex-col items-center w-screen md:px-10">
        <h1 className="flex justify-center items-center gap-2 text-gold mt-3"><TbCrown className='text-gold text-xl'/> Exercices premium</h1>
        
        {/* Premium Exercices  */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-1 md:gap-2 w-full items-center mt-2">
          {/* Méli-Mélo */}
          <Link className="exerciceButton exerciceButtonPremium" to={planGrade !== 'Premium' ? null : `/exercices/melimelo`}>Méli-mélo</Link>

          {/* Drawing */}
          <Link className="exerciceButton exerciceButtonPremium" to={planGrade !== 'Premium' ? null : `/exercices/drawing`}>Dessin</Link>

          {/* Crosswords */}
          {/* <Link className="exerciceButton" to={planGrade !== 'Premium' ? null : `/exercices/crosswords`}><span className="flex flex-row items-center justify-center gap-2">Mots croisés <BsConeStriped color="orange" /></span></Link> */}

          {/* Hiddenwords */}
          <Link className="exerciceButton exerciceButtonPremium" to={planGrade !== 'Premium' ? null : `/exercices/hiddenwords`}><span className="flex flex-row items-center justify-center">Mots cachés</span></Link>

          {/* Grammar */}
          <Link className="exerciceButton exerciceButtonPremium" to={planGrade !== 'Premium' ? null : `/exercices/grammar`}>Conjugaison</Link>

          {/* Listening */}
          <Link className="exerciceButton exerciceButtonPremium" to={planGrade !== 'Premium' ? null : `/exercices/listening`}><span className="flex flex-row items-center justify-center">J'écoute</span></Link>
        </div>

        <div className="w-3/4 mx-auto h-1 bg-primary md:visible my-2 md:my-5 rounded-full" />

        {/* Standard Exercices */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-1 md:gap-2 w-full items-center">
          {/* Quiz */}
            {/* Vocabulary */}
            <Link className="exerciceButton exerciceButtonStandard py-4" to={`/exercices/quiz?type=vocabulary`}><span className="flex flex-row items-center justify-center">Quiz vocabulaire</span></Link>

            {/* Sentence */}
            <Link className="exerciceButton exerciceButtonStandard py-4" to={`/exercices/quiz?type=sentence`}><span className="flex flex-row items-center justify-center">Quiz phrase</span></Link>

          {/* Flashcard */}
            {/* Vocabulary */}
            <Link className="exerciceButton exerciceButtonStandard py-4" to={`/exercices/flashcard?type=vocabulary`}><span className="flex flex-row items-center justify-center">Flashcard vocabulaire</span></Link>

            {/* Sentence */}
            <Link className="exerciceButton exerciceButtonStandard py-4" to={`/exercices/flashcard?type=sentence`}><span className="flex flex-row items-center justify-center">Flashcard phrase</span></Link>

          {/* Numbers */}
          <Link className="exerciceButton exerciceButtonStandard py-4" to={`/exercices/numbers`}><span className="flex flex-row items-center justify-center">Ça fait combien ?</span></Link>

          {/* Time */}
          <Link className="exerciceButton exerciceButtonStandard py-4" to={`/exercices/time`}><span className="flex flex-row items-center justify-center">Quelle heure est-il ?</span></Link>

          {/* Date */}
          <Link className="exerciceButton exerciceButtonStandard py-4" to={`/exercices/date`}><span className="flex flex-row items-center justify-center">Quel jour est-il ?</span></Link>
        </div>
      </div>
    </section >
  )
}

export default Exercices