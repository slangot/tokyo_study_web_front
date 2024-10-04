import React, { useState, useEffect } from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Icons
import { FaArrowDown, FaArrowUp, FaCoins, FaRegPenToSquare } from 'react-icons/fa6'
import { IoLogOutOutline, IoRocketOutline } from 'react-icons/io5'
import { RotatingLines } from 'react-loader-spinner'

// Package
import { Link } from 'react-router-dom'

// Utils
import { userPlanList  } from '../utils/list'
import { ImStatsDots } from 'react-icons/im'
import { PiBooks, PiStudent } from 'react-icons/pi'
import { TbCrown } from 'react-icons/tb'

const Profil = () => {
  const { state, dispatch } = useUser();
  const avatarWoman = require('../assets/profils/avatar_woman.png')
  const [userData, setUserData] = useState(null)
  const [senseiData, setSenseiData] = useState(null)
  const [studentsListData, setStudentsListData] = useState(null)
  const [currentPlanInfo, setCurrentPlanInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [openStudents, setOpenStudents] = useState(false)
  const [openPlan, setOpenPlan] = useState(false)

  const userId = sessionStorage.getItem('user_id')

  const getUserData = async (userId) => {
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const query = `${process.env.REACT_APP_API_LOCAL}/user/profil?id=${userId}`
      const response = await fetch(query , options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      if (data && data.length > 0) {
        setUserData(data[0])
        setSenseiData(data[1])
        if(data.length > 2) {
          setStudentsListData(data[2])
        }
      }
      setIsLoading(false)
    } catch (err) {
      console.error(err)
    }
  }
  
  const handleOpenStudents = () => {
    setOpenStudents(!openStudents)
    setOpenPlan(false)
  }

  const handleOpenPlans = () => {
    setOpenPlan(!openPlan)
    setOpenStudents(false)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    setIsLoading(true)
    getUserData(userId)
  }, [userId])

  useEffect(() => {
    if(userData) {
      const planId = userPlanList.findIndex(plan => plan.plan === userData.plan)
      setCurrentPlanInfo(userPlanList[planId])
    }
  }, [userData])

  console.log('userData : ', userData)
  console.log('currentPlanInfo : ', currentPlanInfo)

  return (
    <section className='section-bottom'>
      {isLoading ?
        <div className='flex justify-center items-center h-96'>
          <RotatingLines
            visible={true}
            width='96'
            strokeColor='#520380'
            strokeWidth='5'
            animationDuration='0.75'
            ariaLabel='rotating-lines-loading'
          />
        </div>
      :
      <>
      {userData ?
      <>
        {/* HEADER */}
        <article className='w-full flex flex-row px-10 py-5 justify-center items-center'>
          <div className='flex flex-1 justify-center text-center'>
            <img src={avatarWoman} className='w-32 h-32 object-contain bg-purple-700 rounded-full' />
          </div>
          <div className='flex flex-col justify-center items-center gap-2'>
            {userData.role === 'user' ?
              <Link to='/shop' className='flex flex-row items-center gap-1 bg-primary px-3 py-2 rounded-lg'>{userData.token}<FaCoins /></Link>
            :
              <Link to='' className='bg-primary px-3 py-2 rounded-lg text-center'><IoRocketOutline /></Link>
            }
            <Link to='' className='bg-primary px-3 py-3 rounded-lg text-center'><FaRegPenToSquare /></Link>
          </div>
        </article>

        {/* BODY */}
        <article className='flex flex-col w-full px-5 py-5 bg-fourth h-auto text-center items-center justify-center'>
          <div className='h-auto w-full md:w-1/2 mx-2 my-2 px-3 py-2 bg-primary rounded-lg'>Hello, {userData.nickname}</div>
          {userData.role === 'user' ?
            <div className='h-auto w-full md:w-1/2 mx-2 my-2 px-3 py-2 bg-primary rounded-lg'>{senseiData ? <span className='flex flex-row justify-center items-center gap-2'><PiBooks />Votre sensei : {senseiData.nickname}</span> : 'Vous n\'avez pas encore de sensei'}</div>
          :
          <>
            <button onClick={() => handleOpenStudents()} className='relative flex flex-row gap-3 justify-center items-center h-auto w-full md:w-1/2 mx-2 my-2 px-3 py-2 bg-primary rounded-lg'><PiStudent /> Vos {studentsListData.students.length} étudiants <span className='absolute right-2'>{openStudents ? <FaArrowUp /> : <FaArrowDown />}</span></button>
            {openStudents &&
              <div className='bg-third w-full px-2 py-2 my-2 rounded-md'>
                {studentsListData.students.map(e =>
                  <div key={e.id} className='flex flex-row justify-center items-center gap-3 bg-fourth w-full h-auto py-2 my-1 rounded-md'>
                    <span className=''>{e.nickname}</span>
                    <span className=''>({e.plan})</span>
                    <span className='flex flex-row gap-1 items-center'>{e.token} <FaCoins /></span>
                  </div>
                )}
              </div>
            }
          </>
          }
          <button onClick={() => handleOpenPlans()} className='relative flex flex-row gap-3 justify-center items-center h-auto w-full md:w-1/2 mx-2 my-2 px-3 py-2 bg-primary rounded-lg'><TbCrown /> Votre formule : <span className='font-bold'>{userData.plan}</span> <span className='absolute right-2'>{openPlan ? <FaArrowUp /> : <FaArrowDown />}</span></button>
          {openPlan &&
              <div className='bg-third w-full px-2 py-2 my-2 rounded-md'>
                <p><span className='italic'>Formule:</span> <span className='font-bold'>{currentPlanInfo.plan}</span></p>
                <p><span className='italic'>Prix:</span> <span className='font-bold'>{currentPlanInfo.price}</span></p>
                <p><span className='font-bold'>{currentPlanInfo.text}</span></p>
              </div>
            }
          <Link to='/statistics' className='flex flex-row items-center justify-center gap-3 h-auto w-full md:w-1/2 mx-2 my-2 px-3 py-2 bg-primary rounded-lg'><ImStatsDots /> Vos statistiques</Link>
          <button onClick={() => handleLogout()} className='flex flex-row items-center justify-center gap-3 h-auto w-full md:w-1/2 mx-2 my-2 px-3 py-2 bg-secondary rounded-lg font-bold'><IoLogOutOutline /> Se déconnecter</button>
        </article>
      </>
      :
        <p className='text-gold'>Erreur de chargement du profil</p>
      }
    </>
    }
    </section>
  )
}

export default Profil