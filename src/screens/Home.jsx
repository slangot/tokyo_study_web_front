import { useRef, useState } from "react"

// Icons
import { FaCoins, FaLock } from "react-icons/fa6"

// Packages
import { Link } from "react-router-dom"
import { ChallengeBannerButton, SliderButtons } from "../uikit/Buttons"

export default function Home() {
  const ad = require("../assets/ads/mobile-ad-1.png")
  const avatarWoman = require("../assets/profils/avatar_woman.png")
  const fujisan = require("../assets/decorations/fujisan.png")
  const greenTea = require("../assets/decorations/the-vert.png")
  const logo = require("../assets/logo-v3.png")
  const momijiLeaves = require("../assets/decorations/momiji-revert-leaves.png")
  const momijiLeaf = require("../assets/decorations/momiji-single-leaf.png")
  const shibaHero = require("../assets/decorations/shiba-hero.png")

  const buttonsRef = useRef(null)
  const isSmallScreen = window.innerWidth < 500 || window.innerHeight < 500

  const [userName, setUserName] = useState("Nanashi")
  const [userTokens, setUserTokens] = useState(102)
  const [userPlan, setUserPlan] = useState("freemium")

  return (
    <>
      <article className="relative flex flex-col justify-evenly pt-10 min-h-[90dvh]">
        {/* HEADER DECORATION */}
        <section className="absolute z-0 right-2 top-4 flex">
          <div className="w-28">
            <img src={momijiLeaves} className="object-contain" />
          </div>
        </section>

        {/* USER INFORMATIONS */}
        <section className="relative flex items-center justify-evenly w-full py-2">
          <div className="w-12 bg-white border-2 border-medium-blue rounded-full shadow-md">
            <img src={avatarWoman} className="object-contain" />
          </div>
          <p className="flex items-center bg-white border-2 border-medium-blue h-12 px-3 text-sm font-semibold text-medium-blue rounded-xl shadow-md">Hello, {userName}</p>
          <div className="flex items-center gap-2 bg-white border-2 border-medium-blue h-12 px-3 text-medium-blue rounded-xl shadow-md">
            {userTokens > 99 ? <span className="flex items-center">99<span className="text-xs font-semibold">+</span></span> : userTokens} <FaCoins />
          </div>
        </section>

        {/* CHALLENGE */}
        <section>
          <ChallengeBannerButton theme={"autumn"} link={"/exercices/flashcard?type=vocabulary"} text={"Flashcard"} />
        </section>

        {/* SUPPORT US */}
        <section>
          <Link to="/shop" className="relative flex justify-evenly items-center w-auto h-14 mx-10 py-2 rounded-xl border-medium-blue border-2 bg-white shadow-md">
            <div className="absolute left-3 w-8">
              <img src={greenTea} className="object-contain" />
            </div>
            <p className="text-medium-blue font-semibold">Soutenez-nous</p>
          </Link>
        </section>

        {/* MIDDLE DECORATION */}
        <section className="w-1/2 mx-auto h-20 drop-shadow-md">
          <img src={fujisan} className="object-contain" />
        </section>

        {/* EXERCICES SLIDER */}
        <section className="flex flex-col mx-5 w-auto">
          <p className="text-medium-blue font-semibold mb-2">Exercices populaires</p>
          <div className="flex flex-row w-auto overflow-scroll hide-scrollbar gap-2">
            <SliderButtons link={"/exercices/quiz?type=vocabulary"} text={"Quiz"} />
            <SliderButtons isLocked={userPlan !== "premium" ? true : false} link={"/exercices/hiddenwords"} text={"Mots cachés"} />
            <SliderButtons isLocked={userPlan !== "premium" ? true : false} link={"/exercices/story"} text={"Histoire"} />
            <SliderButtons link={"/exercices/flashcard?type=vocabulary"} text={"Flashcard"} />
            <SliderButtons link={"/exercices"} text={"Tous"} />
          </div>
        </section>

        {/* AD */}
        <section>
          <div className="w-auto mx-5">
            <img src={ad} className="object-contain" />
          </div>
        </section>
      </article>
    </>
  )
}
