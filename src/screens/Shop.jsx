import React, { useEffect, useRef, useState } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { FaCheck, FaCoins } from 'react-icons/fa6'
import { GoVideo } from 'react-icons/go'

// Packages
import Swal from 'sweetalert2'

const Ad = ({close, tokenHandler}) => {
  const ad_video = require('../assets/videos/apple_fake_ad.mp4')
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    video?.play()

    const updateProgress = () => {
      if (video.duration > 0) {
        const percentage = (video.currentTime / video.duration) * 100;
        setProgress(percentage);
      }
    };

    if(video) {
      video.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
    };
  }, [])

  const handleAdEnd = () => {
    tokenHandler(3)
    close()
  }

  const showConfirmButton = () => {
    Swal.fire({
      title: "Vous avez gagné +3 jetons !",
      text: "Récupérez vos jetons pour continuer de vous entraîner",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "rgb(34,197,94)",
      confirmButtonText: "Ok"
    }).then((result) => {
      if (result.isConfirmed) {
        handleAdEnd()
      }
    });
  }

  return (
    <div className='absolute flex flex-col z-50 w-full h-[100dvh] overflow-hidden bg-black'>
      {showButton ? 
        showConfirmButton()
      :
        <div className='relative flex flex-col justify-center w-full h-[90%]'>
          <video 
            controls={false}
            ref={videoRef}
            onEnded={() => setShowButton(true)}
            className="relative z-20 w-auto h-auto object-cover"
          >
            <source src={ad_video} type="video/mp4" />
            <p>
              Votre navigateur ne supporte pas la vidéo.
            </p>
          </video>
          <div className='absolute z-40 flex items-center left-0 bottom-1 w-full h-5 rounded-2xl bg-fourth'>
            <div
              className='h-4 bg-primary transition-all duration-300 rounded-2xl ease-linear'
              style={{width: `${progress}%`}}
            />
          </div>
        </div>
      }
    </div>
  )
}

const Shop = () => {
  const { state, dispatch } = useUser();
  const user = state.user
  const tokens = parseInt(sessionStorage.getItem('user_token'))
  const userId = sessionStorage.getItem('user_id')

  const [showAd, setShowAd] = useState(false)
  const [tokenPlan, setTokenPlan] = useState(null)
  const [showBuyOptions, setShowBuyOptions] = useState(false)

const tokenPlanList = [
  {
    id: 1,
    price: 0.99,
    tokens: 10,
    text: "10 jetons : 0,99€",
  },
  {
    id: 2,
    price: 3.99,
    tokens: 50,
    text: "50 jetons : 3,99€ (10 offerts)",
  },
  {
    id: 3,
    price: 7.99,
    tokens: 200,
    text: "200 jetons : 7,99€ - Meilleur offre - (120 offerts)",
  },
  {
    id: 4,
    price: 17.99,
    tokens: 400,
    text: "400 jetons : 17,99€ (220 offerts)",
  },
]

  const close = () => {
    setShowAd(false)
  }

  const updateTokens = async (number) => {
    try {
      const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenNumber: tokens + number,
          userId: userId,
        })
      }
      const query = `${process.env.REACT_APP_API_LOCAL}/user/tokenManager`
      const response = await fetch(query, options);

      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
        dispatch({ type: 'UPDATE_TOKEN', payload: tokens + number });
        sessionStorage.setItem('user_token', tokens + number)
        Swal.fire({
          title: "Opération réussie",
          text: "Vous pouvez désormais à nouveau faire des exercices",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#027800",
          confirmButtonText: "Ok"
        })
      }
    } catch(err) {
      console.error(err)
    }
  }

  const showAdPage = () => {
    setShowBuyOptions(false)
    setShowAd(true)
  }

  const handleAddTokens = (tokensNumber) => {
    updateTokens(tokensNumber)
  }

  return (
    <section className='relative flex flex-col items-center w-full h-[100dvh] gap-3'>
      {showAd && <Ad close={close} tokenHandler={handleAddTokens} />}
      <article className='flex flex-col items-center justify-center gap-10 w-[80dvw] md:w-1/2 h-[70dvh] md:h-1/2'>
        <h1>LE SHOOOOOOP</h1>
        <h2 className='flex items-center gap-2'>Vous disposez de {tokens} jeton{tokens > 1 ? 's' : ''} <FaCoins className='text-gold' /></h2>
        {showBuyOptions ?
          <div className='flex flex-col gap-5'>
            <h2>Choisissez une formule qui vous convient :</h2>
            <select className='text-black h-10' onChange={(e) => setTokenPlan(e.target.value)}>
              <option value={null} defaultChecked>- Choix des formules</option>
              {tokenPlanList.map(e => 
                <option key={e.id} value={e.id}>{e.text}</option>
              )}
            </select>
            <button className='flex items-center justify-center gap-2 py-3 px-5 bg-blue-500 text-white rounded-xl' onClick={() => tokenPlan ? handleAddTokens(tokenPlanList[tokenPlan - 1].tokens) : null}>Confirmer la formule <FaCheck /></button>
          </div>
        :
          <button className='flex items-center justify-center gap-2 py-3 px-5 bg-primary text-white rounded-xl' onClick={() => setShowBuyOptions(true)}><FaCoins /> Acheter des jetons</button>
        }
        <button className='flex items-center justify-center gap-2 py-3 px-5 bg-secondary text-white rounded-xl' onClick={() => showAdPage()}><GoVideo /> Regarder une pub (+3 jetons)</button>
      </article>
    </section>
  )
}

export default Shop