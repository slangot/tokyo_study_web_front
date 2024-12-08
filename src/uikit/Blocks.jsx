// UiKit
import { BackButton } from "./Buttons";

export const Header = ({ title, link, children = null }) => {
  return (
  <div className="relative z-10 flex flex-row items-center justify-center w-full mb-0 px-3 pb-2 border-medium-grey border-b-2">
    <BackButton url={link} />
    <h1 className="headerTitle">{title}</h1>
    {children}
  </div>
  )
}