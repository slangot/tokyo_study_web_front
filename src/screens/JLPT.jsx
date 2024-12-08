import React, { useState, useEffect } from 'react'

// Packages
import { RotatingLines } from 'react-loader-spinner'
import Swal from 'sweetalert2'

// Statistics components
const DashboardStats = ({allStats}) => {
  return (
    <div className='mx-3 md:mx-auto my-3 w-full md:w-1/2 font-bold text-center'>
      {allStats.map((stats, index) => (
          <ul className='p-3 my-4 bg-medium-grey' key={index}>
            <li>Total kanji N{stats.level}: {stats.kanjiTotal}</li>
            <li>Total kanji N{stats.level} connu : {stats.kanjiKnown}</li>
            <li>Kanji restants : {stats.kanjiTotal - stats.kanjiKnown}</li>
            <li className='mt-2 font-bold'>Pourcentage avancement kanji N{stats.level}: {Math.floor(stats.kanjiPercent)}%</li>
            <li className='my-3'></li>
            <li>Total vocabulaire N{stats.level}: {stats.vocabularyTotal}</li>
            <li>Total vocabulaire N{stats.level} connu : {stats.vocabularyKnown}</li>
            <li>Vocabulaire restant : {stats.vocabularyTotal - stats.vocabularyKnown}</li>
            <li className='mt-2 font-bold'>Pourcentage avancement vocabulaire N{stats.level}: {Math.floor(stats.vocabularyPercent)}%</li>
            <li className='my-3'></li>
            <li className='uppercase' style={(stats.kanjiPercent + stats.vocabularyPercent / 2) === 100 ? {color: 'green'} : (stats.kanjiPercent + stats.vocabularyPercent / 2) < 50 ? {color: 'red'} : {color: 'orange'}}>Total avancement N{stats.level}: {(Math.floor(stats.kanjiPercent + stats.vocabularyPercent) / 2)}%</li>
          </ul>
      ))}
    </div>
  )
}

// Dashboard kanji and vocabulary datas components
const DashboardDisplay = ({datas, type, level, startLimit, endLimit, updateData, columnToDisplay}) => {

  const smallScreen = window.innerWidth < 768

  const updateStatus = (id, status, typeStatus) => {
    updateData(type, level, id, status === 'correct' ? 'wrong' : 'correct', typeStatus)
  }

  return (
    <table className='border-collapse w-[98%] m-auto'>
      <caption className='uppercase font-bold text-lg'>{type} N{level}</caption>
      <thead className='bg-medium-blue border-2 border-white'>
      <tr className='text-xs md:text-sm'>
        {!smallScreen && <th className='border-r-2 border-white'>ID</th>}
        <th className=''>Kanji</th>
        {type === 'kanji' ?
        <>
        <th className='border-2 border-white '>Kunyomi</th>
        <th className='border-2 border-white'>Onyomi</th>
        </>:
        <th className='border-2 border-white'>Japonais</th>
      }
      {!smallScreen && columnToDisplay.includes('english') && <th className='border-2 border-white'>Anglais</th>}
      <th className='border-2 border-white'>Français</th>
      {!smallScreen && <th className='border-2 border-white'>漢字 lvl</th>}
      <th className='border-2 border-white'>{!smallScreen ? 'Status' : 'Sts'}</th>
      {!smallScreen && type !== 'kanji' && <th className='border-2 border-white'>漢字 ok</th>}
      </tr>
      </thead>
      <tbody>
      {datas.map((data, index) => (
        <>
          <tr key={data.id} className='border-b-2 border-gray-500' style={(data.id >= startLimit && data.id <= endLimit) ? {backgroundColor: '#220135', borderColor: 'white'} : data.id < startLimit ? {backgroundColor: 'blue', borderColor: 'white'} : {}}>
          {!smallScreen && <td className='px-5 py-2 border-x-2 border-gray-700 font-bold text-center'>{data.id}</td>}
          {columnToDisplay.includes('kanji') ?
             <td className='px-5 py-2 flex-auto border-x-2 border-gray-700 font-bold text-2xl hover:md:text-5xl text-center'>{data.kanji}</td>
            :
            <td></td>
          }
            {type === 'kanji' ?
              columnToDisplay.includes('kanji') ? 
                <>
                  <td className='px-5 py-2 border-x-2 border-gray-700 font-bold text-center'>{data.kunyomi}</td>
                  <td className='px-5 py-2 border-x-2 border-gray-700 font-bold text-center'>{data.onyomi}</td>
                </>
              :
                <td></td>
            :
            columnToDisplay.includes('japanese') ?
              <td className='text-xs md:text-base flex-1 text-wrap px-5 py-2 border-x-2 border-gray-700 font-bold text-center'>{data.japanese}</td>
            :
              <td></td>
            }
            {columnToDisplay.includes('english') ?
              !smallScreen && <td className='text-xs md:text-sm text-wrap px-5 py-2 border-x-2 border-gray-700'>{data.english}</td>
             :
              null
            }
            {columnToDisplay.includes('french') ?
              <td className='text-xs md:text-sm text-wrap px-5 py-2 border-x-2 border-gray-700'>{data.french}</td>
            :
              <td></td>
            }
            {!smallScreen && <td className='text-xs md:text-sm px-5 py-2 border-x-2 border-gray-700 text-center' style={data.kanji_level === data.level ? {color: 'white'} : {color: 'orange'}}>{data.kanji_level || data.level}</td>}
            <td className='px-5 py-2 border-x-2 border-gray-700'>
              <div onClick={() => updateStatus(data.id, data.status, 'vocabularyStatus')} className={'w-3 h-3 md:w-5 md:h-5 rounded-md'} style={data.status === 'correct' ? {backgroundColor: 'green'} : data.status === 'not done' ? {backgroundColor: 'orange'} : {backgroundColor: 'red'}} />
            </td>
            {!smallScreen && type !== 'kanji' && <td className='px-2 py-2 border-x-2 border-gray-700'>
              <div onClick={() => updateStatus(data.id, data.kanji_status, 'kanjiStatus')} className={'w-3 h-3 md:w-5 md:h-5 rounded-md'} style={data.kanji_status === 'correct' ? {backgroundColor: 'green'} : {backgroundColor: 'red'}} />
            </td>}
          </tr>
        </>
      ))}
      </tbody>
    </table>
  )
}

// Dashboard grammar components
const DashboardGrammarDisplay = ({datas, updateGrammarData, columnToDisplay}) => {

  const smallScreen = window.innerWidth < 768

  const updateStatus = (id, status) => {
    updateGrammarData(id, status)
  }

  return (
    <div className='flex flex-col bg-medium-blue rounded-xl gap-2 w-auto mx-5 my-3 px-2 md:px-4 py-3'>
      <div className='flex flex-row items-center'>
        <div className='flex justify-center items-center w-7 h-7 md:w-9 md:h-9 text-sm md:text-base rounded-full font-bold bg-blue-500'>N{datas.level}</div>
        <div className='flex flex-1 justify-center font-bold text-md md:text-2xl'>{datas.base}</div>
        <div 
          className='w-5 h-5 md:w-8 md:h-8 bg-gray-500 rounded-lg'
          style={datas.status === 'not yet' ? {backgroundColor: 'orange'} : datas.status === 'wrong' ? {backgroundColor: 'red'} : {backgroundColor: 'green'}}
          onClick={() => updateStatus(datas.id, (datas.status === 'not yet' || datas.status === 'wrong') ? 'correct' : 'wrong')}
        />
      </div>
      <div className='text-sm md:text-base font-bold my-2'>
        Catégorie: {datas.form}
      </div>
      {columnToDisplay.includes('english') && 
        <div className='flex flex-col gap-2 mb-3 px-1 md:px-2 py-2 bg-light-blue rounded-lg font-semibold'>
          <p className='font-normal italic text-medium-blue'>Rule: </p>
          <p>{datas.rule_english}</p>
          <div className='h-1 w-auto bg-sky-blue rounded-full' />
          <p>{datas.subrule_english}</p>
        </div>
      }
      <div className='flex flex-col gap-2 mb-3 px-1 md:px-2 py-2 bg-light-blue rounded-lg font-semibold text-sm md:text-base'>
        <p className='font-normal italic text-medium-blue text-xs md:text-sm'>Règle: </p>
        <p>{datas.rule_french}</p>
        <div className='h-1 w-auto bg-sky-blue rounded-full' />
        <p>{datas.subrule_french}</p>
      </div>

      <div className='flex flex-col gap-2 px-1 md:px-2 py-2 bg-light-blue rounded-lg font-semibold text-sm md:text-base'>
        <p className='font-normal italic text-medium-blue text-xs md:text-sm'>Example: </p>
        <p className='text-lg md:text-xl font-bold'>{datas.example_kanji}</p>
        <p className='text-lg md:text-xl font-bold'>{datas.example_japanese}</p>
        {columnToDisplay.includes('english') && 
          <p>{datas.example_english}</p>
        }
        <p>{datas.example_french}</p>
      </div>
    </div>
  )
}

export const JLPT = () => {
  const [n5DataKanji, setN5DataKanji] = useState([])
  const [n5DataVocabulary, setN5DataVocabulary] = useState([])
  const [n4DataKanji, setN4DataKanji] = useState([])
  const [n4DataVocabulary, setN4DataVocabulary] = useState([])
  const [n3DataKanji, setN3DataKanji] = useState([])
  const [n3DataVocabulary, setN3DataVocabulary] = useState([])
  const [n2DataKanji, setN2DataKanji] = useState([])
  const [n2DataVocabulary, setN2DataVocabulary] = useState([])
  const [n1DataKanji, setN1DataKanji] = useState([])
  const [n1DataVocabulary, setN1DataVocabulary] = useState([])
  const [fetchedDataGrammar, setFetchedDataGrammar] = useState([])

  const [stats, setStats] = useState([])
  const [kanjiEndLimit, setKanjiEndLimit] = useState(0)
  const [kanjiStartLimit, setKanjiStartLimit] = useState(0)
  const [vocabularyEndLimit, setVocabularyEndLimit] = useState(0)
  const [vocabularyStartLimit, setVocabularyStartLimit] = useState(0)
  const [increaseLimitSelected, setIncreaseLimitSelected] = useState(null)
  const [displayChoice, setDisplayChoice] = useState()
  const [columnToDisplay, setColumnToDisplay] = useState(['kanji', 'japanese', 'french'])
  const [isLoading, setIsLoading] = useState(false)

  const isSmallScreen = window.innerWidth < 500 || window.innerHeight < 500
  const userId = sessionStorage.getItem('user_id')

  // Function to update the JLPT or kanji status after checking the checkboxes
  const update = (id, status, type, level, typeStatus) => {

    if(type === 'kanji') {
      switch(level) {
        case '5':
          setN5DataKanji((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          break;
        case '4':
          setN4DataKanji((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          break;
        case '3':
          setN3DataKanji((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          break;
        case '2':
          setN2DataKanji((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          break;
        case '1':
          setN1DataKanji((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          break;
        default:
          break;
      }
    } else if (type === 'vocabulary') {
      switch(level) {
        case '5':
          if(typeStatus === 'kanjiStatus') {
            setN5DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN5DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '4':
          if(typeStatus === 'kanjiStatus') {
            setN4DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN4DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '3':
          if(typeStatus === 'kanjiStatus') {
            setN3DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN3DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '2':
          if(typeStatus === 'kanjiStatus') {
            setN2DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN2DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '1':
          if(typeStatus === 'kanjiStatus') {
            setN1DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN1DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        default:
          break;
      }
    } else if (type === 'grammar') {
      setFetchedDataGrammar((prev) => prev.map(item => item.id === id ? {...item, status: status} : item))
    }
  }

  const fetchJlptLimits = async (userId) => {
    try {
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const query =`${process.env.REACT_APP_API}/jlpt/list-manager?userId=${userId}`
    const response = await fetch(query, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    if (data) {

      if(data.length === 1) {
        if(data[0].type === 'kanji') {
          setKanjiEndLimit(data[0].study_end)
          setKanjiStartLimit(data[0].study_start)
        } else if(data[0].type === 'vocabulary') {
          setVocabularyEndLimit(data[0].study_end)
          setVocabularyStartLimit(data[0].study_start)
        }
      } 
      if(data.length === 2) {
        if(data[0].type === 'kanji') {
          setKanjiEndLimit(data[0].study_end)
          setKanjiStartLimit(data[0].study_start)
          setVocabularyEndLimit(data[1].study_end)
          setVocabularyStartLimit(data[1].study_start)
        } else if(data[0].type === 'vocabulary') {
          setKanjiEndLimit(data[1].study_end)
          setKanjiStartLimit(data[1].study_start)
          setVocabularyEndLimit(data[0].study_end)
          setVocabularyStartLimit(data[0].study_start)
        }
      }
    }
      
    setIsLoading(false)
    } catch (error) {
      console.error('error : ', error)
    }
  }

  const fetchData = async (level, type, userId) => {
    try {
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const query =`${process.env.REACT_APP_API}/${type}/jlpt?level=${level}&userId=${userId}`
    const response = await fetch(query, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    if (data && data.length > 0) {
      if(type === 'kanji') {
        switch(level) {
          case '5':
            setN5DataKanji(data)
            break;
          case '4':
            setN4DataKanji(data)
            break;
          case '3':
            setN3DataKanji(data)
            break;
          case '2':
            setN2DataKanji(data)
            break;
          case '1':
            setN1DataKanji(data)
            break;
          default:
            break;
        }
      } else if (type === 'vocabulary')
        switch(level) {
          case '5':
            setN5DataVocabulary(data)
            break;
          case '4':
            setN4DataVocabulary(data)
            break;
          case '3':
            setN3DataVocabulary(data)
            break;
          case '2':
            setN2DataVocabulary(data)
            break;
          case '1':
            setN1DataVocabulary(data)
            break;
          default:
            break;
        }
      }
        setIsLoading(false)
      } catch (error) {
        console.error('error : ', error)
      }
  }

  const fetchGrammarData = async (level, type, userId) => {
    try {
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const query =`${process.env.REACT_APP_API}/${type}/jlpt?level=${level}&userId=${userId}`
    const response = await fetch(query, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    if (data && data.length > 0) {
      setFetchedDataGrammar(data)
    }
      setIsLoading(false)
    } catch (error) {
      console.error('error : ', error)
    }
  }

  const updateJlptLimits = async (action, limit, type, userId, mode = null) => {
    try {

      if(type !== 'kanji' && type !== 'vocabulary') {
        Swal.fire("Merci de sélectionner Kanji ou Vocabulaire");
      } else if((mode === 'decrease' || mode === 'increase') && increaseLimitSelected === null) {
        Swal.fire("Merci de sélectionner une valeur à mettre à jour");
      } else {

        let newEndLimit
        let newStartLimit
        if(action === 'add') {
          if(type === 'kanji') {
            newEndLimit = kanjiEndLimit + parseInt(limit)
            newStartLimit = kanjiStartLimit + parseInt(limit)
          } else if(type === 'vocabulary') {
            newEndLimit = vocabularyEndLimit + parseInt(limit)
            newStartLimit = vocabularyStartLimit + parseInt(limit)
          }

        } else if (action === 'reduce') {
          if(type === 'kanji') {
            newEndLimit = kanjiEndLimit >= Math.abs(limit) ? kanjiEndLimit - parseInt(limit) : 0
            newStartLimit = kanjiStartLimit >= Math.abs(limit) ? kanjiStartLimit - parseInt(limit) : 0
          } else if(type === 'vocabulary') {
            newEndLimit = vocabularyEndLimit >= Math.abs(limit) ? vocabularyEndLimit - parseInt(limit) : 0
            newStartLimit = vocabularyStartLimit >= Math.abs(limit) ? vocabularyStartLimit - parseInt(limit) : 0
          }
        }

        const options = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
          {
            mode: mode,
            studyEnd: parseInt(newEndLimit),
            studyStart: parseInt(newStartLimit),
            type: type,
            userId: parseInt(userId),
          })
        };

        const query =`${process.env.REACT_APP_API}/jlpt/update-list-manager`
        const response = await fetch(query, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        if (data) {

          if(type === 'kanji') {
            setKanjiEndLimit(newEndLimit)
            if(mode !== 'increase') {
              setKanjiStartLimit(newStartLimit)
            }
          } else if(type === 'vocabulary') {
            setVocabularyEndLimit(newEndLimit)
            if(mode !== 'increase') {
              setVocabularyStartLimit(newStartLimit)
            }
          }
          setIncreaseLimitSelected(null)
          Swal.fire("Mise à jour effectuée");
        }
    
        setIsLoading(false)
      }
    } catch (error) {
      console.error('error : ', error)
    }
  }

  const updatGrammarStatus = async (grammar_id, status) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            grammarId: grammar_id,
            status: status,
            userId: userId
          }
        )
      }
        const query = `${process.env.REACT_APP_API}/grammar/jlpt/status`

        const response = await fetch(query, options)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        } else {
          update(grammar_id, status, 'grammar', null, null)
        }
    } catch (err) {
      console.error(err)
    }
  }

  // API call to update the JLPT status or the kanji status
  const updateData = async (type, level, id, status, type_status) => {

    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
          status: status,
          type_status: type_status,
          type: type,
          element_id: id,
          user_id: parseInt(userId),
        })
      };

      const query = `${process.env.REACT_APP_API}/es/update-status`

      const response = await fetch(query, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else {
        // Update the current datas
        update(id, status, type, level, type_status)
      }
    } catch (error) {
      console.error('error : ', error)
    }
  }

  // Update the statistics
  const updateStatistics = (level, kanji, vocabulary) => {
    const kanjiTotal = kanji.length
    const kanjiKnown = kanji.filter(item => item.jlpt_status === 'done').length
    const kanjiPercent = kanjiTotal > 0 ? (kanjiKnown / kanjiTotal) * 100 : 0
    const vocabularyTotal = vocabulary.length
    const vocabularyKnown = vocabulary.filter(item => item.jlpt_status === 'done').length
    const vocabularyPercent = vocabularyTotal > 0 ? (vocabularyKnown / vocabularyTotal) * 100 : 0
    const newStats = {
      level: level,
      kanjiTotal: kanjiTotal,
      kanjiKnown: kanjiKnown,
      kanjiPercent: kanjiPercent,
      vocabularyTotal: vocabularyTotal,
      vocabularyKnown: vocabularyKnown,
      vocabularyPercent: vocabularyPercent
    }
    const currentStats = stats.filter(e => e.level.toString() !== level.toString())
    currentStats.push(newStats)
    setStats(currentStats)
  }

  // Handle the loading states to display
  const handleDisplayChoice = (choice) => {
    if(displayChoice === choice) {
      setDisplayChoice("")
    } else {
      setDisplayChoice(choice)
    }
  }

  // Handle which columns to display
  const handleColumnToDisplay = (column) => {
    if(columnToDisplay.includes(column)) {
      setColumnToDisplay(columnToDisplay.filter(col => col !== column))
    } else {
      setColumnToDisplay(prev => [...prev, column])
    }
  }

  // Initial loading
  // useEffect(() => {
  //   setIsLoading(true)
  //   fetchData('5', 'kanji', userId)
  //   fetchData('5', 'vocabulary', userId)
  //   fetchJlptLimits(userId)
  //   // fetchData('4', 'kanji', userId)
  //   // fetchData('4', 'vocabulary', userId)
  // }, [])
    useEffect(() => {
    setIsLoading(true)
    fetchJlptLimits(userId)
  }, [])

  useEffect(() => {
    if(displayChoice) {
      setIsLoading(true)
      if(displayChoice === 'vocabulary' || displayChoice === 'kanji') {
        fetchData('5', displayChoice, userId)
      } else if(displayChoice === 'grammar') {
        fetchGrammarData('5', displayChoice, userId)
      }
    }
  }, [displayChoice])

  // useEffect to update statistics
  useEffect(() => {
    if(n5DataKanji.length > 0 && n5DataVocabulary.length > 0) {
      updateStatistics(5, n5DataKanji, n5DataVocabulary)
    }
  }, [n5DataKanji, n5DataVocabulary])

  useEffect(() => {
    if(n4DataKanji.length > 0 && n4DataVocabulary.length > 0) {
      updateStatistics(4, n4DataKanji, n4DataVocabulary)
    }
  }, [n4DataKanji, n4DataVocabulary])

  useEffect(() => {
    if(n3DataKanji.length > 0 && n3DataVocabulary.length > 0) {
      updateStatistics(3, n3DataKanji, n3DataVocabulary)
    }
  }, [n3DataKanji, n3DataVocabulary])

  return (
    <section className='section-bottom'>
      <h1 className='text-center text-3xl uppercase text-medium-blue my-3 font-extrabold'>Suivi JLPT</h1>
      {isLoading ?
        <div className='flex justify-center items-center h-96'>
          <RotatingLines
            visible={true}
            width='96'
            strokeColor='#006FFF'
            strokeWidth='5'
            animationDuration='0.75'
            ariaLabel='rotating-lines-loading'
          />
        </div>
      :
      <>

        {/***** Stats display  */}
        {stats && <DashboardStats allStats={stats} />}

        {/***** Control buttons */}
        {/* Kanji, vocabulary, grammar choice buttons */}
        <div className='flex gap-3 my-4 justify-center'>
          <button className='px-3 py-2 text-white font-bold bg-medium-grey rounded' style={displayChoice === 'kanji' ? {backgroundColor: 'blue'} : {}} onClick={() => handleDisplayChoice("kanji")}>Kanji</button>
          <button className='px-3 py-2 text-white font-bold bg-medium-grey rounded' style={displayChoice === 'vocabulary' ? {backgroundColor: 'blue'} : {}} onClick={() => handleDisplayChoice("vocabulary")}>Vocabulaire</button>
          <button className='px-3 py-2 text-white font-bold bg-medium-grey rounded' style={displayChoice === 'grammar' ? {backgroundColor: 'blue'} : {}} onClick={() => handleDisplayChoice("grammar")}>Grammaire</button>
        </div>

        {/* Level choice buttons */}
        <div className="flex items-center font-bold w-3/4 mx-auto border-2 rounded-lg bg-light my-3">
          <div className="levelSelectButton" style={displayChoice === '5' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('5')}>N5</div>
          <div className="levelSelectButton" style={displayChoice === '4' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('4')}>N4</div>
          <div className="levelSelectButton" style={displayChoice === '3' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('3')}>N3</div>
          <div className="levelSelectButton" style={displayChoice === '2' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('2')}>N2</div>
          <div className="levelSelectButton border-r-0 rounded-r-md" style={displayChoice === '1' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('1')}>N1</div>
        </div>

        {/* Columns to display buttons */}
        {displayChoice !== "grammar" && 
          <div className="flex items-center font-bold w-[90%] md:w-3/4 mx-auto border-2 rounded-lg bg-medium-grey my-3 py-1 px-2">
            <div className="columnDisplayButton" style={columnToDisplay.includes('kanji') ? { backgroundColor: '#009DFF', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('kanji')}>Kanji</div>
            <div className="columnDisplayButton" style={columnToDisplay.includes('japanese') ? { backgroundColor: '#009DFF', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('japanese')}>Japonais</div>
            <div className="columnDisplayButton" style={columnToDisplay.includes('english') ? { backgroundColor: '#009DFF', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('english')}>Anglais</div>
            <div className="columnDisplayButton" style={columnToDisplay.includes('french') ? { backgroundColor: '#009DFF', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('french')}>Français</div>
          </div>
        }

        {/* Buttons to update into studying */}
       {(displayChoice && displayChoice !== "grammar") && 
        <div className='flex flex-col gap-3 w-[90%] md:w-3/4 mx-auto my-4 items-center text-xs md:text-base'>
            <p className='font-bold'>Gérer les éléments étudiés :</p>
            <div className='flex flex-row gap-3 justify-center items-center'>
              <button className='px-3 py-2 text-white font-bold bg-medium-grey rounded-lg' onClick={() => updateJlptLimits('reduce', 10, displayChoice, userId)}>{isSmallScreen ? '<' : 'Précédent'}</button>
              <div className='flex flex-row gap-2 justify-center items-center mx-2 bg-light-blue px-2 py-1 rounded-lg'>
                <select className='text-black h-auto md:h-10' onChange={(e) => setIncreaseLimitSelected(e.target.value)}>
                  <option value={null} defaultChecked >--</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                </select>
                <div className='flex flex-col justify-center items-center gap-1'>
                  <button className='px-2 py-1 text-white font-bold bg-medium-grey rounded-lg' onClick={() => updateJlptLimits('reduce', increaseLimitSelected, displayChoice, userId, 'decrease')}>- Réduire</button>
                  <button className='px-2 py-1 text-white font-bold bg-medium-grey rounded-lg' onClick={() => updateJlptLimits('add', increaseLimitSelected, displayChoice, userId, 'increase')}>+ Augmenter</button>
                </div>
              </div>
              <button className='px-3 py-2 text-white font-bold bg-medium-grey rounded-lg' onClick={() => updateJlptLimits('add', 10, displayChoice, userId)}>{isSmallScreen ? '>' : 'Suivant'}</button>
            </div>
          </div>
        }

        {/***** Kanji, Vocabulary, Grammar display  */}
            {(displayChoice === "kanji" || displayChoice === '5') && <DashboardDisplay datas={n5DataKanji} type='kanji' level='5' endLimit={kanjiEndLimit} startLimit={kanjiStartLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "kanji" || displayChoice === '4') && <DashboardDisplay datas={n4DataKanji} type='kanji' level='4' endLimit={kanjiEndLimit} startLimit={kanjiStartLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "kanji" || displayChoice === '3') && <DashboardDisplay datas={n3DataKanji} type='kanji' level='3' endLimit={kanjiEndLimit} startLimit={kanjiStartLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}

            {(displayChoice === "vocabulary" || displayChoice === '5') && <DashboardDisplay datas={n5DataVocabulary} type='vocabulary' level='5' endLimit={vocabularyEndLimit} startLimit={vocabularyStartLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "vocabulary" || displayChoice === '4') && <DashboardDisplay datas={n4DataVocabulary} type='vocabulary' level='4' endLimit={vocabularyEndLimit} startLimit={vocabularyStartLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "vocabulary" || displayChoice === '3') && <DashboardDisplay datas={n3DataVocabulary} type='vocabulary' level='3' endLimit={vocabularyEndLimit} startLimit={vocabularyStartLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            
            {displayChoice === "grammar" && 
              fetchedDataGrammar.map((e) => (
                <DashboardGrammarDisplay datas={e} updateGrammarData={updatGrammarStatus} columnToDisplay={columnToDisplay} />
              ))
            }
        </>
      }
    </section>
  )
}

export default JLPT