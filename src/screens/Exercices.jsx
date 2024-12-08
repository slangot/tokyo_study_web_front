import { useEffect, useState } from "react"

// Icons
import { TbCrown } from "react-icons/tb"

// Packages
import { Link } from "react-router-dom"

// UiKit
import { ChallengeBannerButton, ExercicesButton } from "../uikit/Buttons"

// Utils
import { exercicesCategoriesList } from "../utils/list"

const Exercices = () => {
  const planGrade = sessionStorage.getItem("user_plan_grade").replaceAll("\"", "").toLowerCase()

  const [filterSelection, setFilterSelection] = useState("all")
  const [exerciceList, setExerciceList] = useState([])

  const filterExercicesList = (choice) => {
    if(choice === "all") {
      setExerciceList(exercicesCategoriesList)
    } else {
      setExerciceList(exercicesCategoriesList.filter(exercice => exercice.type === choice))
    }
  }

  useEffect(() => {
    filterExercicesList(filterSelection)
  }, [filterSelection])

  return (
    <article className="section-bottom">
      {/* PREMIUM ACCOUNT INFORMATION */}
      {planGrade !== "premium" ?
        <Link to="/shop" className="flex justify-center my-5 mx-5 bg-gradient-to-r from-white to-gold border-2 border-black px-2 py-3 font-semibold shadow-md rounded-lg">
          Devenez premium pour un accès complet
        </Link>
      :
        <h2 className="flex justify-center items-center gap-3 my-5 mx-5 bg-gradient-to-r from-white to-gold px-2 py-3 font-semibold shadow-md rounded-lg">
         <TbCrown /> Accès complet débloqué
        </h2>
      }

      {/* EXERCICES FILTER BUTTONS */}
      <section className="flex justify-evenly w-auto mx-10">
        <button 
          onClick={() => setFilterSelection("all")}
          className="exerciceFilterButtons"
          style={filterSelection === "all" ? {backgroundColor: "#006FFF", color: "white"} : {backgroundColor: "white", color: "#63C2FD"}}
        >
          TOUS
        </button>
        <button 
          onClick={() => setFilterSelection("free")}
          className="exerciceFilterButtons"
          style={filterSelection === "free" ? {backgroundColor: "#006FFF", color: "white"} : {backgroundColor: "white", color: "#63C2FD"}}
        >
          GRATUIT
        </button>
        <button 
          onClick={() => setFilterSelection("premium")}
          className="exerciceFilterButtons"
          style={filterSelection === "premium" ? {backgroundColor: "#006FFF", color: "white"} : {backgroundColor: "white", color: "#63C2FD"}}
        >
          PREMIUM
        </button>
      </section>

      {/* CHALLENGE */}
      <section className="mb-8">
        <ChallengeBannerButton theme={"autumn"} link={"/exercices/flashcard?type=vocabulary"} text={"Flashcard"} />
      </section>

      {/* EXERCICES LIST DISPLAY */}
      <section>
        {exerciceList.map(e => 
          <ExercicesButton key={e.text} type={e.type} isUnlocked={planGrade === 'premium'} link={e.link} text={e.text} />
        )}
      </section>
    </article>
  )
}

export default Exercices