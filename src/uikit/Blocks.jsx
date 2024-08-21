// UiKit
import { BackButton } from "./Buttons";

export const ExerciceHeader = ({ title, children = null }) => {
  return (
  <div className="relative z-10 flex flex-row items-center justify-center w-full mb-0 px-3 pb-2 border-third border-b-2">
    <BackButton url="/exercices" />
    <h1 className="exerciceTitle">{title}</h1>
    {children}
  </div>
  )
}