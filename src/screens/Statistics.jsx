import React, { useState } from 'react'

// Packages
import { RotatingLines } from "react-loader-spinner"

// UiKit
import { Header } from '../uikit/Blocks'

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <section className='exerciceSection md:section-bottom flex flex-col'>
    <Header title="Vos statistiques" link='/profil'/>
    {isLoading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <RotatingLines
            visible={true}
            width="96"
            strokeColor="#520380"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>
      ) : (
        <div>
          LES STATISTIQUES
        </div>
      )}
      </section>
  )
}

export default Statistics