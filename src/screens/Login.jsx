import React, { useState } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

// Packages
import { Link, useNavigate } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner"

// Utils
import { mobileChecker } from '../utils/functions';

const Login = () => {
  const logo = require('../assets/logo-v2.png')
  const { state, dispatch } = useUser();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const navigate = useNavigate()

  const currentLatestConnection = sessionStorage.getItem('user_latest_connection')
  const currentDate = new Date().toISOString().split('T')[0]


  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const connection = async () => {
    try {

      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      };
      const response = await fetch(`${process.env.REACT_APP_API}/auth/login`, options)

      if (!response.ok) {
        setLoginError(true)
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const result = await response.json();
        if(result.data) {
          dispatch({ type: 'SET_USER', payload: result.data })
          sessionStorage.setItem('user_session', JSON.stringify(result.data.connectionToken))
          sessionStorage.setItem('user_id', parseInt(JSON.stringify(result.data.id)))
          sessionStorage.setItem('user_pro_id', parseInt(JSON.stringify(result.data.pro_id)))
          sessionStorage.setItem('user_name', JSON.stringify(result.data.nickname))
          sessionStorage.setItem('user_role', JSON.stringify(result.data.role))
          sessionStorage.setItem('user_plan', JSON.stringify(result.data.plan))
          sessionStorage.setItem('user_plan_grade', JSON.stringify(result.data.plan_grade))
          sessionStorage.setItem('user_tokens', parseInt(JSON.stringify(result.data.tokens)))
          if(currentLatestConnection !== currentDate) {
            sessionStorage.setItem('user_daily_tokens', parseInt(JSON.stringify(result.data.daily_tokens)))
          }
          sessionStorage.setItem('user_latest_connection', currentDate)
          setTimeout(() => {
            navigate('/')
          },1000)
        }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <section className='section-bottom flex flex-col justify-center items-center h-[100dvh]'>
      {state.user ? (
          <>
            <h1>Bienvenue {state.user.nickname} sur la version <span className='text-gold'>Beta</span></h1>
            <div className="flex justify-center items-center h-20">
              <RotatingLines
                visible={true}
                width="50"
                strokeColor="#520380"
                strokeWidth="3"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
            <button onClick={() => handleLogout()}>Se déconnecter</button>
          </>
        )
        :
        (
          <>
            <img src={logo} alt="Tokyo Study logo" width={mobileChecker() ? '50%' : '30%'} height={'auto'} className="object-contain mt-0 mb-5" />
            <div className='flex flex-col mx-auto w-[80vw] md:w-[50vw] bg-primary px-10 py-5 rounded-lg'>
              <h1 className='mb-5'>Connectez-vous à la version Beta :</h1>
              <input type='text' className='w-full py-2 pl-2 mb-5 border-2 border-light-gray rounded-lg text-black' onChange={(e) => setEmail(e.target.value)} placeholder='Votre email' />
              <div className='relative flex flex-row w-full py-2 items-center mb-3'>
                <input type={showPassword ? 'text' :'password'} id='password' className='loginRegisterPasswordInputs' placeholder='Votre mot de passe' onChange={(e) => setPassword(e.target.value)} />
                <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
              </div>
              {loginError && <div className='border-2 border-red-600 text-red-500 px-5 py-3'>Erreur de connection</div>}
              <div className='mt-2 mb-4 text-sm'>
                Pas encore de compte ? <Link to='/register/user' className='text-blue-500 underline font-bold'>Inscrivez-vous</Link>
              </div>
              <button className='bg-third !py-2 md:py-1 px-3 w-auto mx-auto rounded-lg text-sm md:text-base font-bold uppercase' onClick={() => connection()}>Se connecter</button>
            </div>
          </>
        )
      }
    </section>
  )
}

export default Login