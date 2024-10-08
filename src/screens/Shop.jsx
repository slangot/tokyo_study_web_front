import React, { useEffect, useRef, useState } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { FaCheck, FaCoins } from 'react-icons/fa6'
import { GoVideo } from 'react-icons/go'

// Packages
import Swal from 'sweetalert2'

// Utils
import { tokenPlanList, userPlanList } from '../utils/list'

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
  const logo = require('../assets/tsw-shop.jpg')
  const { dispatch } = useUser();
  const tokens = parseInt(sessionStorage.getItem('user_token'))
  const userId = sessionStorage.getItem('user_id')
  const currentUserPlan = sessionStorage.getItem('user_plan').replace('\"', '').replace('\"', '')
  const currentUserPlanGrade = sessionStorage.getItem('user_plan_grade').replace('\"', '').replace('\"', '')

  const [showAd, setShowAd] = useState(false)
  const [tokenPlan, setTokenPlan] = useState(null)
  const [userPlan, setUserPlan] = useState(null)
  const [showBuyOptions, setShowBuyOptions] = useState(false)

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
      const query = `${process.env.REACT_APP_API}/user/tokenManager`
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

  const updatePlan = async (plan) => {
    try {
      const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.plan,
          plan_grade: plan.planGrade,
          userId: userId,
        })
      }

      const query = `${process.env.REACT_APP_API}/user/plan`
      const response = await fetch(query, options);

      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
        sessionStorage.setItem('user_plan', plan.plan)
        sessionStorage.setItem('user_plan_grade', plan.planGrade)
        Swal.fire({
          title: "Opération réussie",
          text: "Vous pouvez désormais profiter des avantages de votre compte",
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

  const handleChangePlan = (planId) => {
    updatePlan(userPlanList[planId -1])
  }

  return (
    <section className='section-bottom'>
      {showAd && <Ad close={close} tokenHandler={handleAddTokens} />}
        <div className='mx-auto w-1/3 md:w-1/6 my-3'>
          <img src={logo} className='rounded-md'/>
        </div>
      <article className='flex flex-col items-center justify-center gap-7'>
        <h2 className='flex items-center gap-2'>Vous disposez de {tokens} jeton{tokens > 1 ? 's' : ''} <FaCoins className='text-gold' /></h2>
        <button className='flex items-center justify-center text-sm gap-2 py-2 px-4 font-bold bg-secondary text-white rounded-lg' onClick={() => showAdPage()}><GoVideo /> Regarder une pub (+3 jetons)</button>
        <div className='flex flex-col md:flex-row justify-evenly gap-5 md:gap-2'>
          {showBuyOptions ?
            <div className='flex flex-1 flex-col items-center mx-4 py-4 gap-2 rounded-lg bg-third'>
              <h2>Choix des tokens :</h2>
              <select className='text-black text-xs md:text-sm h-10 mb-3 md:h-8 w-2/3 md:w-1/2 rounded-lg' onChange={(e) => setTokenPlan(e.target.value)}>
                <option value={null} defaultChecked>- Choisir des tokens</option>
                {tokenPlanList.map(e => 
                  <option key={e.id} value={e.id}>{e.text}</option>
                )}
              </select>
              <button className='flex items-center justify-center gap-2 py-1 px-3 font-bold bg-blue-500 text-white rounded-lg' onClick={() => tokenPlan ? handleAddTokens(tokenPlanList[tokenPlan - 1].tokens) : null}>Confirmer les tokens <FaCheck /></button>
            </div>
          :
            <button className='flex items-center justify-center mx-4 gap-2 py-3 md:py-1 px-3 md:px-10 font-bold bg-primary text-white rounded-lg' onClick={() => setShowBuyOptions(true)}><FaCoins /> Acheter des jetons</button>
          }

          <div className='flex flex-1 flex-col items-center mx-4 py-4 gap-2 rounded-lg bg-third'>
            <h2 className='text-white font-bold'>Vous avez un compte : {currentUserPlan} ({currentUserPlanGrade})</h2>
            <select className='text-black text-xs md:text-sm h-10 mb-3 md:h-8 w-2/3 md:w-1/2 rounded-lg' onChange={(e) => setUserPlan(e.target.value)}>
              <option value={null} defaultChecked>- Choix des comptes</option>
              {userPlanList.map(e => 
                <option sttyle={{color: e.color}} key={e.id} value={e.id}>
                  <span className='font-bold'>{e.plan} : </span>
                  {e.text} ({e.price})
                </option>
              )}
            </select>
            <button className='flex items-center justify-center gap-2 py-1 px-3 font-bold bg-blue-500 text-white rounded-lg' onClick={() => userPlan ? handleChangePlan(userPlan) : null}>Changer de compte <FaCheck /></button>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Shop