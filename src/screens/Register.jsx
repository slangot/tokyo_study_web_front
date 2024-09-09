import React, { useState } from 'react'

// Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

// Packages
import { RotatingLines } from "react-loader-spinner"
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

// Utils
import { mobileChecker } from '../utils/functions'

const Register = () => {
  const logo = require('../assets/logo-v2.png')
  const { role, id } = useParams()

  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [confirmationEmail, setConfirmationEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [plan, setPlan] = useState('')

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [sameEmail, setSameEmail] = useState(null)
  const [samePassword, setSamePassword] = useState(null)

  const inputChecker = (type, firstInput, secondInput) => {
    if(type === 'email') {
      firstInput === secondInput ? setSameEmail('correct') : setSameEmail('wrong')
    } else if(type === 'password') {
      firstInput === secondInput ? setSamePassword('correct') : setSamePassword('wrong')
    }
  }

  const inputsFilled = () => {
    let allFiled = (name.length > 0 && nickname.length > 0 && email.length > 0 && confirmationEmail.length > 0 && password.length > 0 && confirmationPassword.length > 0)
    if(role === 'pro') {
      allFiled = allFiled && phone.length > 0 && plan.length > 0
    }
    return allFiled
  } 

  const handleSubmit = () => {
    setIsSubmitted(true)
    inputChecker('email', email, confirmationEmail)
    inputChecker('password', password, confirmationPassword)
    const isReady = inputsFilled() && sameEmail && samePassword
    if(isReady) {
      setIsLoading(true)
      register()
    }
  }

  const register = async () => {
    try {  
      if(role === 'pro') {
          const responsePro = await fetch('https://www.data.tsw.konecton.com/pro/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              plan: plan,
              phone: phone,
            })
          })
  
        if (!responsePro.ok) {
          Swal.fire("Erreur lors de l'inscription");
          throw new Error(`HTTP error! status: ${responsePro.status}`);
        }
          const dataPro = await responsePro.json();
  
          const responseUser = await fetch('https://www.data.tsw.konecton.com/user/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pro_id: dataPro.insertId,
              name: name,
              nickname: nickname,
              email: email,
              password: password,
              role: 'pro',
              plan: plan
            })
          })
  
          if (!responseUser.ok) {
            Swal.fire("Erreur lors de l'inscription");
            throw new Error(`HTTP error! status: ${responseUser.status}`);
          }
          const dataUser = await responseUser.json();
          setIsLoading(false)
          if(dataUser) {
            Swal.fire({
              title: "Inscription réussie",
              text: "Vous pouvez désormais vous connecter",
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#027800",
              confirmButtonText: "Ok"
            }).then((result) => {
              if (result.isConfirmed) {
                moveToLogin()
              }
            });
          }
  
      } else {
        const responseUser = await fetch('https://www.data.tsw.konecton.com/user/register', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pro_id: id || null,
            name: name,
            nickname: nickname,
            email: email,
            password: password,
            role: 'user',
            plan: 'freemium'
          })
        })
  
        if (!responseUser.ok) {
          Swal.fire("Erreur lors de l'inscription");
          throw new Error(`HTTP error! status: ${responseUser.status}`);
        }
        const dataUser = await responseUser.json();
        setIsLoading(false)
        if(dataUser) {
          Swal.fire({
            title: "Inscription réussie",
            text: "Vous pouvez désormais vous connecter",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#027800",
            confirmButtonText: "Ok"
          }).then((result) => {
            if (result.isConfirmed) {
              moveToLogin()
            }
          });
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const moveToLogin = () => {
    window.location.replace('/login')
  }

  const handleOnChangeInput = (type, value) => {
    setIsSubmitted(false)
    switch(type) {
      case 'name':
        setName(value)
        break;
      case 'nickname':
        setNickname(value)
        break;
      case 'email':
        setEmail(value)
        break;
      case 'confirmEmail':
        setConfirmationEmail(value)
        break;
      case 'password':
        setPassword(value)
        break;
      case 'confirmPassword':
        setConfirmationPassword(value)
        break;
      case 'phone':
        setPhone(value)
        break;
      case 'plan':
        setPlan(value)
        break;
      default:
        break;
    }
  }

  return (
    <section className='section-bottom flex flex-col justify-center items-center min:h-[100dvh]'>
      {isLoading ?
        <div className="flex justify-center items-center h-20">
          <RotatingLines
            visible={true}
            width="20"
            strokeColor="blue"
            strokeWidth="3"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>
        :  
        <>
        <img src={logo} alt="Tokyo Study logo" width={mobileChecker() ? '80%' : '50%'} height={'auto'} className="object-contain mt-0 mb-5" />
        <div className='flex flex-col mx-auto w-[90vw] md:w-[60vw] bg-primary px-3 md:px-10 py-5 rounded-lg'>
        <h1 className='mb-5'>Inscription {role === 'pro' ? 'Pro' : 'Étudiant'} :</h1>
          <div className='flex flex-col'>
            <input className='loginRegisterInputs' type='text' onChange={(e) => handleOnChangeInput('name', e.target.value)} placeholder='Votre nom' />
            {(isSubmitted && !name) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
          </div>

          <div className='flex flex-col'>
            <input className='loginRegisterInputs' type='text' onChange={(e) => handleOnChangeInput('nickname', e.target.value)} placeholder='Votre pseudo' />
            {(isSubmitted && !nickname) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
          </div>

          <div className='flex flex-col'>
            <input className='loginRegisterInputs' type='email' onChange={(e) => handleOnChangeInput('email', e.target.value)} placeholder='Votre email' />
            {sameEmail === 'wrong' && <span className='loginRegisterWrongInfo'>Les emails ne correspondent pas</span>}
            {(isSubmitted && !email) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
          </div>

          <div className='flex flex-col'>
            <input className='loginRegisterInputs' type='email' onChange={(e) => handleOnChangeInput('confirmEmail', e.target.value)} placeholder='Confirmez votre email' />
            {sameEmail === 'wrong' && <span className='loginRegisterWrongInfo'>Les emails ne correspondent pas</span>}
            {(isSubmitted && !confirmationEmail) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
          </div>

          <div className='flex flex-col my-3'>
            <div className='relative flex flex-row w-full h-10 items-center'>
              <input type={showPassword ? 'text' :'password'} id='password' className='loginRegisterPasswordInputs' placeholder='Votre mot de passe' onChange={(e) => handleOnChangeInput('password', e.target.value)} />
              <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
            </div>
            {samePassword === 'wrong' && <span className='loginRegisterWrongInfo'>Les mots de passe ne correspondent pas</span>}
            {(isSubmitted && !password) && <span className='loginRegisterWrongInfo !mt-0 md:!mt-1'>Champ manquant</span>}
          </div>

          <div className='flex flex-col my-3'>
            <div className='relative flex flex-row w-full h-10 items-center'>
              <input type={showPassword ? 'text' :'password'} id='password' className='loginRegisterPasswordInputs' placeholder='Confirmez votre mot de passe' onChange={(e) => handleOnChangeInput('confirmPassword', e.target.value)} />
              <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
            </div>
            {samePassword === 'wrong' && <span className='loginRegisterWrongInfo'>Les mots de passe ne correspondent pas</span>}
            {(isSubmitted && !confirmationPassword) && <span className='loginRegisterWrongInfo !mt-0 md:!mt-1'>Champ manquant</span>}
          </div>

          {role === 'pro' && 
          <>
            <div className='flex flex-col'>
              <input className='loginRegisterInputs' type='tel' onChange={(e) => handleOnChangeInput('phone', e.target.value)} placeholder='Votre téléphone' />
              {(isSubmitted && !phone) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
            </div>

            <div className='flex flex-col'>
              <select className='h-10 px-3 py-2 text-black my-3 border-2 border-gray-200' onChange={(e) => handleOnChangeInput('plan', e.target.value)}>
                <option value={null} defaultChecked>- Choisissez une formule</option> 
                <option value={1}>Formule 1 Accès pro + 10€ par élèves par mois (limite de 10 élèves) : 100€ / mois</option>
                <option value={2}>Formule 2 Accès pro + 7€ par élèves par mois (limite de 25 élèves) : 300€ / mois</option>
                <option value={3}>Formule 3 Accès pro premium (IA) + 5€ par élèves par mois (élèves illimités) : 500€ / mois</option>
              </select>
              {(isSubmitted && !plan) && <span className='loginRegisterWrongInfo'>Formule manquante</span>}
            </div>
          </>
          }
          <div className='mt-2 mb-4 text-sm'>
            Vous avez déjà un compte ? <Link to='/login' className='text-blue-500 underline font-bold'>Connectez-vous</Link>
          </div>
          <button onClick={() => handleSubmit()} className='bg-third py-4 px-7 w-auto mx-auto rounded-xl font-bold uppercase'>S'inscrire</button>
        </div>
        </>
      }
    </section>
  )
}

export default Register