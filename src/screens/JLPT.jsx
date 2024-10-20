import React, { useState, useEffect } from 'react'

// Packages
import { RotatingLines } from 'react-loader-spinner'
import Swal from 'sweetalert2'

// Statistics components
const DashboardStats = ({allStats}) => {
  return (
    <div className='mx-3 md:mx-auto my-3 w-full md:w-1/2 font-bold text-center'>
      {allStats.map((stats, index) => (
          <ul className='p-3 my-4 bg-fourth' key={index}>
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

// Dashboard components
const DashboardDisplay = ({datas, type, level, limit, updateData, columnToDisplay}) => {

  const smallScreen = window.innerWidth < 768

  const updateStatus = (id, status, type_status) => {
    updateData(type, level, id, status === 'correct' ? 'wrong' : 'correct', type_status)
  }

  return (
    <table className='border-collapse w-[98%] m-auto'>
      <caption className='uppercase font-bold text-lg'>{type} N{level}</caption>
      <thead className='bg-primary border-2 border-white'>
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
      {datas.map((data) => (
        <>

          <tr key={data.id} className='border-b-2 border-gray-500' style={type === 'kanji' ? data.id <= limit ? {backgroundColor: '#220135', borderColor: 'white'} : {} : type === 'vocabulary' ? data.id <= limit ? {backgroundColor: '#220135', borderColor: 'white'} : {} : {}}>
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

  const [stats, setStats] = useState([])
  const [kanjiLimit, setKanjiLimit] = useState(0)
  const [vocabularyLimit, setVocabularyLimit] = useState(0)
  const [displayChoice, setDisplayChoice] = useState()
  const [columnToDisplay, setColumnToDisplay] = useState(['kanji', 'japanese', 'french'])
  const [isLoading, setIsLoading] = useState(false)

  const userId = sessionStorage.getItem('user_id')

  // Function to update the JLPT or kanji status after checking the checkboxes
  const update = (id, status, type, level, type_status) => {

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
          if(type_status === 'kanjiStatus') {
            setN5DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN5DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '4':
          if(type_status === 'kanjiStatus') {
            setN4DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN4DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '3':
          if(type_status === 'kanjiStatus') {
            setN3DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN3DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '2':
          if(type_status === 'kanjiStatus') {
            setN2DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN2DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        case '1':
          if(type_status === 'kanjiStatus') {
            setN1DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN1DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, status: status} : item))
          }
          break;
        default:
          break;
      }
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
          setKanjiLimit(data[0].study_limit)
        } else if(data[0].type === 'vocabulary') {
          setVocabularyLimit(data[0].study_limit)
        }
      } else if(data.length === 2) {
        if(data[1].type === 'kanji') {
          setKanjiLimit(data[1].study_limit)
        } else if(data[1].type === 'vocabulary') {
          setVocabularyLimit(data[1].study_limit)
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

  const updateJlptLimits = async (action, limit, type, userId) => {
    try {

      if(type !== 'kanji' && type !== 'vocabulary') {
        Swal.fire("Merci de sélectionner Kanji ou Vocabulaire");
      } else {

        let newLimit
        if(action === 'add') {
          if(type === 'kanji') {
            newLimit = kanjiLimit + limit
          } else if(type === 'vocabulary') {
            newLimit = vocabularyLimit + limit
          }

        } else if (action === 'reduce') {
          if(type === 'kanji') {
            newLimit = kanjiLimit >= Math.abs(limit) ? kanjiLimit - limit : 0
          } else if(type === 'vocabulary') {
            newLimit = vocabularyLimit >= Math.abs(limit) ? vocabularyLimit - limit : 0
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
            limit: parseInt(newLimit),
            type: type,
            user_id: parseInt(userId),
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
            setKanjiLimit(newLimit)
          } else if(type === 'vocabulary') {
            setVocabularyLimit(newLimit)
          }
          Swal.fire("Mise à jour effectuée");
        }
    
        setIsLoading(false)
      }
    } catch (error) {
      console.error('error : ', error)
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

      const response = await fetch(query, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
  useEffect(() => {
    setIsLoading(true)
    fetchData('5', 'kanji', userId)
    fetchData('5', 'vocabulary', userId)
    fetchJlptLimits(userId)
    // fetchData('4', 'kanji', userId)
    // fetchData('4', 'vocabulary', userId)
  }, [])

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
      <h1 className='text-center text-3xl uppercase text-primary my-3 font-extrabold'>Suivi JLPT</h1>
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

        {/***** Stats display  */}
        {stats && <DashboardStats allStats={stats} />}

        {/***** Control buttons */}
        {/* Kanji or vocabulary choice buttons */}
        <div className='flex gap-3 my-4 justify-center'>
          <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={displayChoice === 'kanji' ? {backgroundColor: 'blue'} : {}} onClick={() => handleDisplayChoice("kanji")}>Kanji</button>
          <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={displayChoice === 'vocabulary' ? {backgroundColor: 'blue'} : {}} onClick={() => handleDisplayChoice("vocabulary")}>Vocabulaire</button>
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
        <div className="flex items-center font-bold w-[90%] md:w-3/4 mx-auto border-2 rounded-lg bg-fourth my-3 py-1 px-2">
          <div className="columnDisplayButton" style={columnToDisplay.includes('kanji') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('kanji')}>Kanji</div>
          <div className="columnDisplayButton" style={columnToDisplay.includes('japanese') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('japanese')}>Japonais</div>
          <div className="columnDisplayButton" style={columnToDisplay.includes('english') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('english')}>Anglais</div>
          <div className="columnDisplayButton" style={columnToDisplay.includes('french') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('french')}>Français</div>
        </div>

        {/* Buttons to update into studying */}
        <div className='flex gap-3 my-4 justify-center'>
          <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => updateJlptLimits('reduce', 10, displayChoice, userId)}>Réduire</button>
          <button className='px-3 py-2 text-white font-bold bg-fourth rounded' onClick={() => updateJlptLimits('add', 10, displayChoice, userId)}>Augmenter</button>
        </div>

        {/***** Kanji and Vocabulary display  */}
            {(displayChoice === "kanji" || displayChoice === '5') && <DashboardDisplay datas={n5DataKanji} type='kanji' level='5' limit={kanjiLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "kanji" || displayChoice === '4') && <DashboardDisplay datas={n4DataKanji} type='kanji' level='4' limit={kanjiLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "kanji" || displayChoice === '3') && <DashboardDisplay datas={n3DataKanji} type='kanji' level='3' limit={kanjiLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}

            {(displayChoice === "vocabulary" || displayChoice === '5') && <DashboardDisplay datas={n5DataVocabulary} type='vocabulary' level='5' limit={vocabularyLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "vocabulary" || displayChoice === '4') && <DashboardDisplay datas={n4DataVocabulary} type='vocabulary' level='4' limit={vocabularyLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "vocabulary" || displayChoice === '3') && <DashboardDisplay datas={n3DataVocabulary} type='vocabulary' level='3' limit={vocabularyLimit} updateData={updateData} columnToDisplay={columnToDisplay} />}
        </>
      }
    </section>
  )
}

export default JLPT