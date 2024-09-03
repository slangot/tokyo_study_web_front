import React, { useState } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

// Packages
import { Link } from 'react-router-dom';

const Login = () => {
  const { state, dispatch } = useUser();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

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
      const response = await fetch('http://localhost:3001/auth/login', options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const result = await response.json();
        if(result.data) {
          dispatch({ type: 'SET_USER', payload: result.data })
        }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <section className='flex items-center h-[100dvh]'>
      {state.user ? (
          <>
            <h1>Bienvenue {state.user.nickname}</h1>
            <button onClick={() => handleLogout()}>Se déconnecter</button>
          </>
        )
        :
        (
          <div className='flex flex-col mx-auto w-[80vw] md:w-[50vw] bg-primary px-3 py-5 rounded-lg'>
            <h1 className='mb-5'>Connectez-vous :</h1>
            <input type='text' className='w-full py-3 pl-2 mb-5 border-2 border-light-gray rounded-xl text-black' onChange={(e) => setEmail(e.target.value)} placeholder='Votre email' />
            <div className='relative flex flex-row w-full h-10 items-center mb-3'>
              <input type={showPassword ? 'text' :'password'} id='password' className='w-full py-3 mb-0 border-2 border-light-gray rounded-xl text-black pl-10' placeholder='Votre mot de passe' onChange={(e) => setPassword(e.target.value)} />
              <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
            </div>
            <div className='mt-0 mb-3'>
              Pas encore de compte ? <Link to='/register' className='text-blue-500 underline font-bold'>Inscrivez-vous</Link>
            </div>
            <button className='bg-third py-2 px-2 w-auto mx-auto rounded-xl font-bold uppercase' onClick={() => connection()}>Se connecter</button>
          </div>
        )
      }
    </section>
  )
}

export default Login