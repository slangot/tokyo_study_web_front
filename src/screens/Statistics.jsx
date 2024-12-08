import React, { useEffect, useState } from 'react'

// Icons
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx'

// Packages
import { RotatingLines } from "react-loader-spinner"

// UiKit
import { Header } from '../uikit/Blocks'

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)
  const [openDetailsLvl, setOpenDetailsLvl] = useState(null)
  const [userStats, setUserStats] = useState()
  const [managedStats, setManagedStats] = useState(null)

  const userId = sessionStorage.getItem('user_id')

  const handleOpenDetails = (lvl) => {
    if(!openDetails) {
      setOpenDetails(true)
    }
    if(lvl === openDetailsLvl) {
      setOpenDetailsLvl(null)
      setOpenDetails(false)
    } else {
      setOpenDetailsLvl(lvl)
    }
  }

  const getStats = async (userId) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId
        })
      }

      const query = `${process.env.REACT_APP_API}/jlpt/stats`
      const response = await fetch(query , options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      if (data) {
        setUserStats(data)
      }
      setIsLoading(false)

    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if(userId) {
      setIsLoading(true)
      getStats(userId)
    }
  }, [userId])

  useEffect(() => {
    if(userStats) {
      const calculatedStats = {
        allN5: calculateStatistics((userStats.allN5Voc + userStats.allN5Kanji), (userStats.userN5VocStudied + userStats.userN5KanjiStudied)),
        allN4: calculateStatistics((userStats.allN4Voc + userStats.allN4Kanji), (userStats.userN4VocStudied + userStats.userN4KanjiStudied)),
        allN3: calculateStatistics((userStats.allN3Voc + userStats.allN3Kanji), (userStats.userN3VocStudied + userStats.userN3KanjiStudied)),
        vocN5: calculateStatistics(userStats.allN5Voc, userStats.userN5VocStudied),
        vocN4: calculateStatistics(userStats.allN4Voc, userStats.userN4VocStudied),
        vocN3: calculateStatistics(userStats.allN3Voc, userStats.userN3VocStudied),
        kanjiN5: calculateStatistics(userStats.allN5Kanji, userStats.userN4KanjiStudied),
        kanjiN4: calculateStatistics(userStats.allN4Kanji, userStats.userN5KanjiStudied),
        kanjiN3: calculateStatistics(userStats.allN3Kanji, userStats.userN3KanjiStudied)
      }

      setManagedStats(calculatedStats)
    }
  }, [userStats])

  const calculateStatistics = (total, current) => {
    if(total && current) {
      return ((current * 100) / total).toFixed(2)
    } else {
      return 0
    }
  }

  return (
    <section className='exerciceSection md:section-bottom flex flex-col'>
    <Header title="Vos statistiques" link='/profil'/>
    {isLoading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <RotatingLines
            visible={true}
            width="96"
            strokeColor="#006FFF"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>
      ) : (
        managedStats && 
        <div className='w-full mt-10'>
          <article className='w-full mx-auto md:w-1/2 px-3 my-2'>
            <h2 
              className='relative flex flex-row justify-center font-bold items-center px-1 py-1 rounded-lg'
              style={openDetails && openDetailsLvl === 5 ? {backgroundColor: 'rgb(82,3,128)'} : {backgroundColor: 'rgb(101,60,135)'}}
              onClick={() => handleOpenDetails(5)}
            >
              JLPT N5 : {managedStats.allN5}%
              <span className='absolute right-3'>{openDetails && openDetailsLvl === 5 ? <RxTriangleUp /> : <RxTriangleDown />}</span>
            </h2>
            {openDetails && openDetailsLvl === 5 &&
             <aside className='bg-light-blue rounded-lg'>
              <div className='my-2 px-2'>
                <h3 className='text-center font-bold text-gold'><span className='underline'>N5 Kanji</span> : {managedStats.kanjiN5}%</h3>
                <h5>Kanji étudiés : {userStats.userN5KanjiStudied} / {userStats.allN5Kanji}</h5>
                <h5>Kanji corrects : {userStats.userN5KanjiCorrect} / {userStats.allN5Kanji}</h5>
                <h5>Kanji faux : {userStats.userN5KanjiWrong} / {userStats.allN5Kanji}</h5>
              </div>
              <div className='mx-auto h-1 w-1/2 bg-medium-blue my-1 rounded-full' />
              <div className='my-2 px-2'>
                <h3 className='text-center font-bold text-gold'><span className='underline'>N5 Vocabulaire</span> : {managedStats.vocN5}%</h3>
                <h5>Vocabulaire étudié : {userStats.userN5VocStudied} / {userStats.allN5Voc}</h5>
                <h5>Vocabulaire correct : {userStats.userN5VocCorrect} / {userStats.allN5Voc}</h5>
                <h5>Vocabulaire faux : {userStats.userN5VocWrong} / {userStats.allN5Voc}</h5>
              </div>
             </aside>
            }
          </article>

          <article className='w-full mx-auto md:w-1/2 px-3 my-2'>
            <h2 
            className='relative flex flex-row justify-center font-bold items-center px-1 py-1 rounded-lg' 
            style={openDetails && openDetailsLvl === 4 ? {backgroundColor: 'rgb(82,3,128)'} : {backgroundColor: 'rgb(101,60,135)'}}
            onClick={() => handleOpenDetails(4)}
            >
              JLPT N4 : {managedStats.allN4}%
              <span className='absolute right-3'>{openDetails && openDetailsLvl === 4 ? <RxTriangleUp /> : <RxTriangleDown />}</span>
            </h2>
            {openDetails && openDetailsLvl === 4 &&
             <aside className='bg-light-blue rounded-lg'>
              <div className='my-2 px-2'>
                <h3 className='text-center font-bold text-gold'><span className='underline'>N4 Kanji</span> : {managedStats.kanjiN4}%</h3>
                <h5>Kanji étudiés : {userStats.userN4KanjiStudied} / {userStats.allN4Kanji}</h5>
                <h5>Kanji corrects : {userStats.userN4KanjiCorrect} / {userStats.allN4Kanji}</h5>
                <h5>Kanji faux : {userStats.userN4KanjiWrong} / {userStats.allN4Kanji}</h5>
              </div>
              <div className='mx-auto h-1 w-1/2 bg-medium-blue my-1 rounded-full' />
              <div className='my-2 px-2'>
                <h3 className='text-center font-bold text-gold'><span className='underline'>N4 Vocabulaire</span> : {managedStats.vocN4}%</h3>
                <h5>Vocabulaire étudié : {userStats.userN4VocStudied} / {userStats.allN4Voc}</h5>
                <h5>Vocabulaire correct : {userStats.userN4VocCorrect} / {userStats.allN4Voc}</h5>
                <h5>Vocabulaire faux : {userStats.userN4VocWrong} / {userStats.allN4Voc}</h5>
              </div>
             </aside>
            }
          </article>

          <article className='w-full mx-auto md:w-1/2 px-3 my-2'>
            <h2 
              className='relative flex flex-row justify-center font-bold items-center px-1 py-1 rounded-lg' 
              style={openDetails && openDetailsLvl === 3 ? {backgroundColor: 'rgb(82,3,128)'} : {backgroundColor: 'rgb(101,60,135)'}}
              onClick={() => handleOpenDetails(3)}
            >
              JLPT N3 : {managedStats.allN3}%
              <span className='absolute right-3'>{openDetails && openDetailsLvl === 3 ? <RxTriangleUp /> : <RxTriangleDown />}</span>
            </h2>
            {openDetails && openDetailsLvl === 3 &&
             <aside className='bg-light-blue rounded-lg'>
              <div className='my-2 px-2'>
                <h3 className='text-center font-bold text-gold'><span className='underline'>N3 Kanji</span> : {managedStats.kanjiN3}%</h3>
                <h5>Kanji étudiés : {userStats.userN3KanjiStudied} / {userStats.allN3Kanji}</h5>
                <h5>Kanji corrects : {userStats.userN3KanjiCorrect} / {userStats.allN3Kanji}</h5>
                <h5>Kanji faux : {userStats.userN3KanjiWrong} / {userStats.allN3Kanji}</h5>
              </div>
              <div className='mx-auto h-1 w-1/2 bg-medium-blue my-1 rounded-full' />
              <div className='my-2 px-2'>
                <h3 className='text-center font-bold text-gold'><span className='underline'>N3 Vocabulaire</span> : {managedStats.vocN3}%</h3>
                <h5>Vocabulaire étudié : {userStats.userN3VocStudied} / {userStats.allN3Voc}</h5>
                <h5>Vocabulaire correct : {userStats.userN3VocCorrect} / {userStats.allN3Voc}</h5>
                <h5>Vocabulaire faux : {userStats.userN3VocWrong} / {userStats.allN3Voc}</h5>
              </div>
             </aside>
            }
          </article>
        </div>
      )}
      </section>
  )
}

export default Statistics