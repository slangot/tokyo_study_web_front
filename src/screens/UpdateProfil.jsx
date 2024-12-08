import React, { useEffect, useState } from 'react'

// Icons
import { TbCrown } from 'react-icons/tb'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

// Package
import { RotatingLines } from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

// UiKit
import { Header } from '../uikit/Blocks'

const UpdateProfil = () => {
  const avatarWoman = require('../assets/profils/avatar_woman.png')

  const [newName, setNewName] = useState()
  const [newNickname, setNewNickname] = useState('')
  const [newPassword, setNewPassword] = useState()
  const [newConfirmationPassword, setNewConfirmationPassword] = useState('')
  const [newEmail, setNewEmail] = useState()
  const [userData, setUserData] = useState(null)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [samePassword, setSamePassword] = useState(null)

  const userId = sessionStorage.getItem('user_id')

  const inputChecker = (type, firstInput, secondInput) => {
    if(type === 'password') {
      firstInput === secondInput ? setSamePassword('correct') : setSamePassword('wrong')
    }
  }

  const isChange = () => {
    return newName || newNickname || newPassword || newEmail
  }

  const getUserData = async (userId) => {
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const query = `${process.env.REACT_APP_API}/user/profil?id=${userId}`
      const response = await fetch(query , options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      if (data && data.length > 0) {
        setUserData(data[0])
        // setSenseiData(data[1])
        // if(data.length > 2) {
        //   setStudentsListData(data[2])
        // }
      }
      setIsLoading(false)
    } catch (err) {
      console.error(err)
    }
  }
 
  const columnsToUpdate = () => {
    const toUpdate = {}
    if(newName) {
      toUpdate['name'] = newName
    }

    if(newNickname) {
      toUpdate['nickname'] = newNickname
    }

    if(newPassword) {
      toUpdate['password'] = newPassword
    }

    if(newEmail) {
      toUpdate['email'] = newEmail
    }

    return toUpdate
  }

  const handleSubmit = () => {
    const isChangeToUpdate = isChange()

    if(isChangeToUpdate) {
      setIsSubmitted(true)
      if(newPassword) {
        inputChecker('password', newPassword, newConfirmationPassword)
      }
      const toUpdate = columnsToUpdate()
  
      if(samePassword && samePassword === 'wrong') {
        setIsSubmitted(false)
        Swal.fire({
          title: "Mot de passe incorrect",
          icon: "wrong",
          showCancelButton: false,
          confirmButtonColor: "#c90404",
          confirmButtonText: "Ok"
        })
      }
      setIsLoading(true)
      update(toUpdate)
    }
  }

  const handleOnChangeInput = (type, value) => {
    setIsSubmitted(false)
    switch(type) {
      case 'name':
        setNewName(value)
        break;
      case 'nickname':
        setNewNickname(value)
        break;
      case 'email':
        setNewEmail(value)
        break;
      case 'password':
        setNewPassword(value)
        break;
      case 'confirmPassword':
        setNewConfirmationPassword(value)
        break;
      default:
        break;
    }
  }

  const update = async (toUpdate) => {
    try {  
        const responseUser = await fetch(`${process.env.REACT_APP_API}/user/update?id=${userId}`, {
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toUpdate)
        })
  
        if (!responseUser.ok) {
          Swal.fire("Erreur lors de la mise à jour du profil");
          setIsLoading(false)
          setIsSubmitted(false)
          throw new Error(`HTTP error! status: ${responseUser.status}`);
        }
        const dataUser = await responseUser.json();
        setIsLoading(false)
        setIsSubmitted(false)

        if(dataUser) {
          Swal.fire({
            title: "Mise à jour réussie",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#027800",
            confirmButtonText: "Ok"
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.replace('/profil')
            }
          });
        }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    getUserData(userId)
  }, [userId])

  return (
    <section className='section-bottom flex flex-col justify-center items-center min:h-[100dvh]'>
    <Header title="Mettre à jour votre profil" link='/profil'/>
    {isLoading || isSubmitted ?
      <div className="flex justify-center items-center h-20">
        <RotatingLines
          visible={true}
          width="20"
          strokeColor="#006FFF"
          strokeWidth="3"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
      :  
      userData ? <article className='flex flex-col items-center w-full md:w-1/2 px-10 py-4 text-center'>
        <div className='relative bg-purple-700 rounded-full w-20 h-20 md:w-32 md:h-32 justify-center text-center'>
          <div className='absolute top-2 md:top-1 right-1'>
            <TbCrown className='text-gold text-2xl'/>
          </div>
          <img src={avatarWoman} className='object-contain' />
        </div>
        <div className='flex flex-col w-full'>
          <input className='loginRegisterInputs' type='text' onChange={(e) => handleOnChangeInput('name', e.target.value)} placeholder='Votre nom et prénom' value={newName || userData.name} />
        </div>

        <div className='flex flex-col w-full'>
          <input className='loginRegisterInputs' type='text' onChange={(e) => handleOnChangeInput('nickname', e.target.value)} placeholder='Votre pseudo' value={newNickname || userData.nickname}/>
        </div>

        <div className='flex flex-col w-full'>
          <input className='loginRegisterInputs' type='email' onChange={(e) => handleOnChangeInput('email', e.target.value)} placeholder='Votre email' value={newEmail || userData.email}/>
        </div>

        <div className='flex flex-col w-full my-3'>
          <h2 className='font-bold mb-1'>Changer de mot de passe :</h2>
          <div className='relative flex flex-row w-full items-center'>
            <input type={showPassword ? 'text' :'password'} id='password' className='loginRegisterPasswordInputs' placeholder='Votre nouveau mot de passe' onChange={(e) => handleOnChangeInput('password', e.target.value)} />
            <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
          </div>
          {samePassword === 'wrong' && <span className='text-wrong mb-1 md:mb-3'>Les mots de passe ne correspondent pas</span>}
        </div>

        <div className='flex flex-col w-full my-3'>
          <div className='relative flex flex-row w-full items-center'>
            <input type={showPassword ? 'text' :'password'} id='password' className='loginRegisterPasswordInputs' placeholder='Confirmez votre nouveau mot de passe' onChange={(e) => handleOnChangeInput('confirmPassword', e.target.value)} />
            <div onClick={() => setShowPassword(!showPassword)} className='absolute ml-3 text-black'>{showPassword ? <FaEyeSlash /> : <FaEye />}</div>
          </div>
          {samePassword === 'wrong' && <span className='text-wrong mb-1 md:mb-3'>Les mots de passe ne correspondent pas</span>}
        </div>

        <div className='flex flex-col justify-center items-center md:flex-row gap-3 md:mt-2 w-full'>
          <button onClick={() => handleSubmit()} className='px-10 py-2 bg-success rounded-lg font-bold'>Valider</button>
          <Link to='/profil' className='px-10 py-2 bg-wrong rounded-lg font-bold'>Annuler</Link>
        </div>
      </article>
      :
      <p className='text-wrong'>Erreur de chargement du profil</p>
    }
    </section>
  )
}

export default UpdateProfil