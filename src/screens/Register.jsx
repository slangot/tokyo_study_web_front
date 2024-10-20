import React, { useState } from 'react'

// Icons
import { FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { CgClose } from 'react-icons/cg'

// Packages
import { RotatingLines } from "react-loader-spinner"
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

// Utils
import { mobileChecker } from '../utils/functions'
import { teacherPlanList } from '../utils/list'

const Register = () => {
  const logo = require('../assets/logo-v2.png')
  const { teacherID } = useParams()
  
  // PAGE 1 USE STATES
  const [confirmationEmail, setConfirmationEmail] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [roleChoice, setRoleChoice] = useState('')

  // PAGE 2 USE STATES
  const [planChoice, setPlanChoice] = useState(null)
  const [userTeacher, setUserTeacher] = useState(teacherID ? 'yes' : undefined)
  const [userTeacherID, setUserTeacherID] = useState(teacherID)

  // PAGE 3 USE STATES
  const [preferences, setPreferences] = useState([])

  // GLOBAL USE STATES
  const [missingFields, setMissingFields] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [sameEmail, setSameEmail] = useState(null)
  const [samePassword, setSamePassword] = useState(null)

  const emailAndPasswordChecker = (type, firstInput, secondInput) => {
    if(type === 'email') {
      firstInput === secondInput ? setSameEmail('correct') : setSameEmail('wrong')
    } else if(type === 'password') {
      firstInput === secondInput ? setSamePassword('correct') : setSamePassword('wrong')
    }
    return firstInput === secondInput
  }

  const checkInputs = () => {
    let allFiled
    if(pageCount === 1) {
      const correctEmails = emailAndPasswordChecker('email', email, confirmationEmail)
      const correctPasswords = emailAndPasswordChecker('password', password, confirmationPassword)
      const teacherPhone = roleChoice === 'teacher' ? phone ? true : false : true

      allFiled = correctEmails && correctPasswords && name && nickname && teacherPhone && roleChoice
    } else if(pageCount === 2) {
      if(roleChoice === 'student') {
        if(userTeacher === 'yes') {
          allFiled =  userTeacher && userTeacherID
        } else {
          allFiled = userTeacher !== undefined
        }
      } else {
        allFiled = true
      }
    }
    return allFiled
  }

  const handlePage = (action) => {
    let prevCount = pageCount
    if(action === 'next') {
      if(checkInputs()) {
        setMissingFields(false)
        setPageCount(prevCount += 1)
      } else {
        setMissingFields(true)
      }
    } else if(action === 'previous') {
      setMissingFields(false)
      setPageCount(prevCount -= 1)
    }
  }

  const handlePreferences = (action, preference) => {
    if(action === 'insert') {
      setPreferences(prev => [...prev, preference])
    } else if(action === 'remove') {
      setPreferences(prev => prev.filter(pref => pref !== preference))
    }
  }

  const handleSubmit = () => {
    setIsLoading(true)
    register()
  }

  const register = async () => {
    try {  
      if(roleChoice === 'teacher') {
        const responsePro = await fetch(`${process.env.REACT_APP_API}/pro/register`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: planChoice,
            phone: phone,
          })
        })

      if (!responsePro.ok) {
        Swal.fire("Erreur lors de l'inscription");
        throw new Error(`HTTP error! status: ${responsePro.status}`);
      }
        const dataPro = await responsePro.json();

        const responseUser = await fetch(`${process.env.REACT_APP_API}/user/register`, {
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
            plan: planChoice,
            plan_grade: 'Pro',
            preferences: preferences.join(';')
          })
        })

        if (!responseUser.ok) {
          Swal.fire("Erreur lors de l'inscription");
          throw new Error(`HTTP error! status: ${responseUser.status}`);
        }
        const dataUser = await responseUser.json();

        const responseUpdateProID = await fetch(`${process.env.REACT_APP_API}/pro/update-id`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pro_id: dataPro.insertId,
            user_id: dataUser.insertId,
          })
        })
        
        if (!responseUpdateProID.ok) {
          Swal.fire("Erreur lors de l'inscription");
          throw new Error(`HTTP error! status: ${responseUpdateProID.status}`);
        }
        
        const dataUpdateIdPro = await responseUpdateProID.json();

        setIsLoading(false)
        if(dataUser && dataUpdateIdPro) {
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
        const responseUser = await fetch(`${process.env.REACT_APP_API}/user/register`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pro_id: userTeacherID,
            name: name,
            nickname: nickname,
            email: email,
            password: password,
            role: 'user',
            plan: 'Freemium',
            plan_grade: 'Cuivre',
            preferences:  preferences.join(';')
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
        setPlanChoice(value)
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
        <img src={logo} alt="Tokyo Study logo" width={mobileChecker() ? '50%' : '30%'} height={'auto'} className="object-contain mt-0 mb-0 md:mb-5" />
        <div className='flex flex-col mx-auto w-[90vw] md:w-[80vw] bg-primary px-3 md:px-10 py-5 rounded-lg'>
        <h1 className='mb-0 text-center font-bold'>Inscription {roleChoice === 'teacher' ? 'Professeur' : 'Étudiant'} à la version Beta :</h1>

        {/* PAGE 1 (name; nickname; email; password; phone (pro)) */}
        {pageCount === 1 && 
        <>
          <div className='flex flex-row gap-4 justify-center items-center my-3'>
            <button className='px-3 py-2 md:px-5 md:py-3 rounded-lg bg-fourth font-bold uppercase' style={roleChoice === 'student' ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 4px 1px rgba(0,0,0,0.5)'} : {}} onClick={() => setRoleChoice('student')}>Étudiant</button>
            <button className='px-3 py-2 md:px-5 md:py-3 rounded-lg bg-fourth font-bold uppercase' style={roleChoice === 'teacher' ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 4px 1px rgba(0,0,0,0.5)'} : {}} onClick={() => setRoleChoice('teacher')}>Professeur</button>
          </div>
          {(missingFields && !roleChoice) && <span className='loginRegisterWrongInfo -mt-2'>Veuillez sélectionner un type de compte</span>}
          <article className=''>
            <div className='flex flex-col my-3'>
              <input className='loginRegisterInputs' type='text' onChange={(e) => handleOnChangeInput('name', e.target.value)} placeholder='Votre nom et prénom' value={name} />
              {(missingFields && !name) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
            </div>

            <div className='flex flex-col my-3'>
              <input className='loginRegisterInputs' type='text' onChange={(e) => handleOnChangeInput('nickname', e.target.value)} placeholder='Votre pseudo' value={nickname} />
              {(missingFields && !nickname) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
            </div>

            <div className='flex flex-col my-3'>
              <input className='loginRegisterInputs' type='email' onChange={(e) => handleOnChangeInput('email', e.target.value)} placeholder='Votre email' value={email} />
              {sameEmail === 'wrong' && <span className='loginRegisterWrongInfo'>Les emails ne correspondent pas</span>}
              {(missingFields && !email) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
            </div>

            <div className='flex flex-col my-3'>
              <input className='loginRegisterInputs' type='email' onChange={(e) => handleOnChangeInput('confirmEmail', e.target.value)} placeholder='Confirmez votre email' value={confirmationEmail} />
              {sameEmail === 'wrong' && <span className='loginRegisterWrongInfo'>Les emails ne correspondent pas</span>}
              {(missingFields && !confirmationEmail) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
            </div>

            <div className='flex flex-col my-3'>
              <div className='relative flex flex-row w-full items-center'>
                <input type={showPassword ? 'text' :'password'} id='password' className='loginRegisterPasswordInputs' placeholder='Votre mot de passe' onChange={(e) => handleOnChangeInput('password', e.target.value)} value={password} />
                <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
              </div>
              {samePassword === 'wrong' && <span className='loginRegisterWrongInfo'>Les mots de passe ne correspondent pas</span>}
              {(missingFields && !password) && <span className='loginRegisterWrongInfo !mt-0 md:!mt-1'>Champ manquant</span>}
            </div>

            <div className='flex flex-col my-3'>
              <div className='relative flex flex-row w-full items-center'>
                <input type={showPassword ? 'text' :'password'} id='confirmPassword' className='loginRegisterPasswordInputs' placeholder='Confirmez votre mot de passe' onChange={(e) => handleOnChangeInput('confirmPassword', e.target.value)} value={confirmationPassword} />
                <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
              </div>
              {samePassword === 'wrong' && <span className='loginRegisterWrongInfo'>Les mots de passe ne correspondent pas</span>}
              {(missingFields && !confirmationPassword) && <span className='loginRegisterWrongInfo !mt-0 md:!mt-1'>Champ manquant</span>}
            </div>

            {roleChoice === 'teacher' && 
              <div className='flex flex-col my-3'>
                <input className='loginRegisterInputs' type='tel' onChange={(e) => handleOnChangeInput('phone', e.target.value)} placeholder='Votre téléphone' value={phone} />
                {(missingFields && !phone) && <span className='loginRegisterWrongInfo'>Champ manquant</span>}
              </div>
            }
          </article>
          <div className='my-2 text-sm'>
            Vous avez déjà un compte ? <Link to='/login' className='text-blue-500 underline font-bold'>Connectez-vous</Link>
          </div>
        </>
        }

        {/* PAGE 2 (students: userTeacher ; userTeacherID | teacher: planChoice)  */}
        {pageCount === 2 &&
          <article>
            {roleChoice === 'student' && 
              <>
                <div className='flex flex-col gap-4 justify-center items-center my-3'>
                  <p className='italic'>Avez-vous un professeur sur l'app ?</p>
                  <div className='flex flex-row gap-4 justify-center items-center'>
                    <button className='px-4 py-2 rounded-lg bg-fourth font-bold' style={userTeacher === 'yes' ? {backgroundColor: 'white', color: 'rgb(82,3,128)', boxShadow: '1px 1px 4px 1px rgba(0,0,0,0.5)'} : {}} onClick={() => setUserTeacher('yes')}>Oui</button>
                    <button className='px-4 py-2 rounded-lg bg-fourth font-bold' style={userTeacher === 'no' ? {backgroundColor: 'white', color: 'rgb(82,3,128)', boxShadow: '1px 1px 4px 1px rgba(0,0,0,0.5)'} : {}} onClick={() => setUserTeacher('no')}>Non</button>
                  </div>
                  {(missingFields && !userTeacher) && <span className='loginRegisterWrongInfo -mt-2'>Veuillez sélectionner une réponse</span>}
                </div>
                {userTeacher === 'yes' && 
                  <div className='flex flex-col gap-2 w-full md:w-1/2 justify-center mx-auto my-5'>
                    <label htmlFor='userTeacherID'>Identifiant du professeur :</label>
                    <input id='userTeacherID' type='text' className='loginRegisterInputs' onChange={(e) => setUserTeacherID(e.target.value)} placeholder='Identifiant du professeur' value={userTeacherID} />
                  </div>
                }
              </>
            }
            {roleChoice === 'teacher' && 
            <>
              <div className='flex flex-col gap-3 my-3'>
                <p className='italic'>Choisissez une formule :</p>
                <div className='flex flex-col md:flex-row gap-3'>
                  {teacherPlanList.map(plan => (
                    <div
                      key={plan.title}
                      onClick={() => handleOnChangeInput('plan', plan.planNumber)}
                      className='flex px-3 py-2 flex-col gap-3 justify-evenly bg-third rounded-lg cursor-pointer'
                      style={planChoice === plan.planNumber ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 3px 1px rgba(0,0,0,0.3)', transform: 'translateY(5px)', transition: 'all 0.2s linear'} : {}}
                    >
                      <h2 className='font-bold text-center'>{plan.title}</h2>
                      <ul>
                        {plan.contentList.map(content => (
                          <li className='flex flex-row items-center gap-2'>{content.included ? <FaCheck className='text-xl' /> : <CgClose className='text-xl' />} {content.text}</li>
                        ))}
                      </ul>
                      <h3 className='text-xl font-bold text-center'>{plan.price}</h3>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex justify-end w-full text-right text-fourth mb-1'>
                <p className='cursor-pointer w-auto px-3 py-1 rounded-lg'  style={planChoice === 0 ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 3px 1px rgba(0,0,0,0.3)', transform: 'translateY(1px)', transition: 'all 0.1s linear'} : {}} onClick={() => handleOnChangeInput('plan', 0)}>Pas pour le moment</p>
              </div>
            </>
            }
          </article>
        }

        {/* PAGE 3 preferences */}
        {pageCount === 3 &&
          <article className='my-3'>
            <h2 className='my-2 italic'>Vos préférences :</h2>
            <div className='flex flex-row justify-evenly gap-2'>
              <ul className='flex flex-col justify-evenly gap-2'>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('manga') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('manga') ? handlePreferences('remove', 'manga') : handlePreferences('insert', 'manga')}
                >
                  Manga
                </li>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('j-pop') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('j-pop') ? handlePreferences('remove', 'j-pop') : handlePreferences('insert', 'j-pop')}
                >
                  J-Pop
                </li>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('aikido') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('aikido') ? handlePreferences('remove', 'aikido') : handlePreferences('insert', 'aikido')}
                >
                  Aikido
                </li>
              </ul>

              <ul className='flex flex-col justify-evenly gap-2'>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('jeux vidéo') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('jeux vidéo') ? handlePreferences('remove', 'jeux vidéo') : handlePreferences('insert', 'jeux vidéo')}
                >
                  Jeux vidéo
                </li>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('anime') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('anime') ? handlePreferences('remove', 'anime') : handlePreferences('insert', 'anime')}
                >
                  Anime
                </li>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('lecture') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('lecture') ? handlePreferences('remove', 'lecture') : handlePreferences('insert', 'lecture')}
                >
                  Lecture
                </li>
              </ul>

              <ul className='flex flex-col justify-evenly gap-2'>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('voyage') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('voyage') ? handlePreferences('remove', 'voyage') : handlePreferences('insert', 'voyage')}
                >
                  Voyage
                </li>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('jeux de société') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('jeux de société') ? handlePreferences('remove', 'jeux de société') : handlePreferences('insert', 'jeux de société')}
                >
                  Jeux de société
                </li>
                <li 
                  className='px-3 py-1 text-center rounded-lg cursor-pointer'
                  style={preferences.includes('cinéma') ? {backgroundColor: 'white', color: 'black', boxShadow: '1px 1px 2px 2px rgba(0,0,0,0.3)', transform: 'translateY(3px)', transition: 'all 0.2s linear'} : {backgroundColor: 'rgb(34,1,53)', transform: 'translateY(0px)', transition: 'all 0.2s linear'}}
                  onClick={() => preferences.includes('cinéma') ? handlePreferences('remove', 'cinéma') : handlePreferences('insert', 'cinéma')}
                >
                  Cinéma
                </li>
              </ul>
            </div>
            
          </article>
        }
        
        <div className='flex justify-center w-full mb-1 gap-3 text-xs'>{pageCount} / 3</div>
        <div className='flex justify-center w-full my-1 md:my-2 gap-2'>
          {pageCount > 1 &&<button onClick={() => pageCount > 1 ? handlePage('previous') : handleSubmit()} className='bg-third py-2 px-4 md:py-4 md:px-7 min-w-1/2 mx-auto rounded-xl font-bold uppercase'>Précédent</button>}
          <button onClick={() => pageCount < 3 ? handlePage('next') : handleSubmit()} className='bg-third  py-2 px-4 md:py-4 md:px-7 min-w-1/2 mx-auto rounded-xl font-bold uppercase'>{pageCount < 3 ? 'Suivant' : 'Je m\'inscris'}</button>
        </div>
      </div>
      </>
      }
    </section>
  )
}

export default Register