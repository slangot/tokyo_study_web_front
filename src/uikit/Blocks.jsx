// UiKit
import { ActionButton, BackButton } from "./Buttons";

export const Header = ({ title, link, children = null }) => {
  return (
  <div className="relative z-10 flex flex-row items-center justify-center w-full mb-0 px-3 pb-2 border-third border-b-2">
    <BackButton url={link} />
    <h1 className="headerTitle">{title}</h1>
    {children}
  </div>
  )
}

// export const LocalExercice = ({handleNext, handleStart, handleVerify }) => {

//   return (
//     <section className='exerciceSection section-bottom flex flex-col'>
//       <Header title="Quelle heure est-il ?" />
//       {generatedTime && 
//       <div className='flex flex-col items-center'>
//         <div className='w-full text-center bg-third text-white' style={isCorrect === true ? {backgroundColor: 'green'} : isCorrect === false ? {backgroundColor: 'red'} : {backgroundColor: '#653C87'}}>
//           <h2 className='font-bold text-3xl md:text-5xl my-5'>{generatedTime.numbers}</h2>
//         </div>
//         {verify && 
//         <div className='flex flex-col items-center py-4 first-letter:justify-center mt-5 bg-blue-500 w-full'>
//           <h4 className='font-bold text-3xl'>{generatedTime.kanji}</h4>
//           <p className='w-[90%] font-bold text-center text-xl md:text-2xl my-5' >{generatedTime.japanese}</p>
//           {generatedTime.alternativeKanji && 
//           <>
//             <h5 className='border-t-2 border-fourth text-black w-full py-3 text-center text-xl font-bold'>Version alternative :</h5>
//             <h4 className='font-bold text-3xl'>{generatedTime.alternativeKanji}</h4>
//             <p className='w-[90%] font-bold text-center text-xl md:text-2xl my-2 md:my-5'>{generatedTime.alternativeJapanese}</p>
//           </>}
//         </div>
//         }
//       </div>}
//       <div className='absolute bottom-10 w-full flex flex-col items-center justify-center gap-10 md:gap-5'>
//         {!generatedTime ?
//           <ActionButton style="bg-blue-500 text-white" action={() => handleStart()} text={!generatedTime ? 'Commencer' : 'Suivant'} />
//         :
//           <ActionButton style="bg-blue-500 text-white" action={() => handleVerify()} text={verify ? 'Cacher' : 'Vérifier'} />
//         }
//         <div className='relative flex flex-row justify-center gap-5'>
//           <ActionButton style="bg-red-600 text-white min-w-[30dvw]" action={() => handleNext(false)} text='Faux' />
//           <ActionButton style="bg-green-600 text-white min-w-[30dvw]" action={() => handleNext(true)} text='Correct' />
//         </div>
//       </div>
//     </section>
//   )
// }