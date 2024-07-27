import React, { useState, useEffect } from 'react'
import { CgCheckR, CgCloseR } from 'react-icons/cg'

// Packages
import { RotatingLines } from 'react-loader-spinner'

// Statistics components
const DashboardStats = ({allStats}) => {
  return (
    <div className='mx-auto my-3 w-2/3 md:w-1/2 font-bold text-center'>
      {allStats.map(stats => (
          <ul className='p-3 my-4 bg-fourth'>
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
            <li className='uppercase' style={(stats.kanjiPercent + stats.vocabularyPercent / 2) == 100 ? {color: 'green'} : (stats.kanjiPercent + stats.vocabularyPercent / 2) < 50 ? {color: 'red'} : {color: 'orange'}}>Total avancement N{stats.level}: {(Math.floor(stats.kanjiPercent + stats.vocabularyPercent) / 2)}%</li>
          </ul>
      ))}
    </div>
  )
}

// Dashboard components
const DashboardDisplay = ({datas, type, level, updateData, columnToDisplay}) => {

  const updateStatus = (id, status) => {
    updateData(type, level, id, status === 'done' ? '' : 'done')
  }

  const updateKanjiStatus = (id, status) => {
    updateData(type, level, id, status === 'done' ? '' : 'done', 1)
  }

  return (
    <table className='border-collapse w-[95%] m-auto'>
      <caption className='uppercase font-bold text-lg'>{type} N{level}</caption>
      <thead className='bg-primary border-2 border-white'>
      <tr>
        <th className='border-r-2 border-white'>ID</th>
        <th className='uppercase'>Kanji</th>
        {type === 'kanji' ?
        <>
        <th className='border-2 border-white'>Kunyomi</th>
        <th className='border-2 border-white'>Onyomi</th>
        </>:
        <th className='border-2 border-white'>Japonais</th>
      }
      <th className='border-2 border-white'>Anglais</th>
      <th className='border-2 border-white'>Français</th>
      <th className='border-2 border-white'>漢字 lvl</th>
      <th className='border-2 border-white'>Status</th>
      <th className='border-2 border-white'>JLPT Status</th>
      <th className='border-2 border-white'>漢字 ok</th>
      </tr>
      </thead>
      <tbody>
      {datas.map((data) => (
        <>
          <tr key={data.id} className='border-b-2 border-gray-500' style={data.is_studied ? {backgroundColor: 'rgb(107,114,128)', borderColor: 'white'} : {}}>
          <td className='px-5 py-2 border-x-2 border-gray-700 font-bold text-center'>{data.id}</td>
          {columnToDisplay.includes('kanji') ?
             <td className='px-5 py-2 flex-auto border-x-2 border-gray-700 font-bold text-2xl hover:text-5xl text-center' style={data.kanji_level === data.level ? {color: 'white'} : {color: 'orange'}}>{data.kanji}</td>
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
              <td className='px-5 py-2 border-x-2 border-gray-700 font-bold text-center'>{data.japanese}</td>
            :
              <td></td>
            }
            {columnToDisplay.includes('english') ?
              <td className='px-5 py-2 border-x-2 border-gray-700' style={data.kanji_level === data.level ? {color: 'white'} : {color: 'orange'}}>{data.english}</td>
             :
              <td></td> 
            }
            {columnToDisplay.includes('french') ?
              <td className='px-5 py-2 border-x-2 border-gray-700' style={data.kanji_level === data.level ? {color: 'white'} : {color: 'orange'}}>{data.french}</td>
            :
              <td></td>
            }
            <td className='px-5 py-2 border-x-2 border-gray-700 text-center' style={data.kanji_level === data.level ? {color: 'white'} : {color: 'orange'}}>{data.kanji_level}</td>
            <td className='px-5 py-2 border-x-2 border-gray-700 text-center text-xl'>{data.status === 'correct' ? <CgCheckR /> : <CgCloseR /> }</td>
            <td className='px-5 py-2 border-x-2 border-gray-700'>
              <input
                type="checkbox"
                onChange={() => updateStatus(data.id, data.jlpt_status)}
                checked={data.jlpt_status === 'done' ? true : false}
                style={data.jlpt_status === 'done' ? {accentColor: 'green', transform: 'scale(2)'} : {transform: 'scale(2)'}}
              />
            </td>
            <td className='px-5 py-2 border-x-2 border-gray-700'>
              <input
                type="checkbox"
                onChange={() => updateKanjiStatus(data.id, data.kanji_status)}
                checked={data.kanji_status === 'done' ? true : false}
                style={data.kanji_status === 'done' ? {accentColor: 'purple', transform: 'scale(2)'} : {transform: 'scale(2)'}}
              />
            </td>
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
  const [displayChoice, setDisplayChoice] = useState()
  const [columnToDisplay, setColumnToDisplay] = useState(['kanji', 'japanese', 'english', 'french'])
  const [isLoading, setIsLoading] = useState(false)

  // Function to update the JLPT or kanji status after checking the checkboxes
  const update = (id, status, type, level, kanji_status) => {
    if(type === 'kanji') {
      switch(level) {
        case '5':
          setN5DataKanji((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '4':
          setN4DataKanji((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '3':
          setN3DataKanji((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '2':
          setN2DataKanji((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '1':
          setN1DataKanji((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        default:
          break;
      }
    } else if (type === 'vocabulary') {
      switch(level) {
        case '5':
          if(kanji_status) {
            setN5DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN5DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          }
          break;
        case '4':
          if(kanji_status) {
            setN4DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN4DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          }
          break;
        case '3':
          if(kanji_status) {
            setN3DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN3DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          }
          break;
        case '2':
          if(kanji_status) {
            setN2DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN2DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          }
          break;
        case '1':
          if(kanji_status) {
            setN1DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, kanji_status: status} : item))
          } else {
            setN1DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          }
          break;
        default:
          break;
      }
    }
  }

  const fetchData = async (type, level) => {
    try {
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const query =`https://www.data.tsw.konecton.com/${type}?level=${level}`
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

  // API call to update the JLPT status or the kanji status
  const updateData = async (type, level, id, status, kanji_status) => {
    try {
      const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      let query
      if(kanji_status) {
        query =`https://www.data.tsw.konecton.com/${type}/update?id=${id}&status=${status}&kanjiStatus=1`
      } else {
        query =`https://www.data.tsw.konecton.com/${type}/update?id=${id}&status=${status}&jlptStatus=1`
      }

      const response = await fetch(query, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // Update the current datas
        update(id, status, type, level, kanji_status)
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
    fetchData('kanji', '5')
    fetchData('vocabulary', '5')
    fetchData('kanji', '4')
    fetchData('vocabulary', '4')
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

  console.log(n5DataVocabulary)

  return (
    <div className='pb-5'>
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
        <div className="flex items-center font-bold w-full md:w-3/4 mx-auto border-2 rounded-lg bg-light my-3">
          <div className="levelSelectButton" style={displayChoice === '5' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('5')}>N5</div>
          <div className="levelSelectButton" style={displayChoice === '4' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('4')}>N4</div>
          <div className="levelSelectButton" style={displayChoice === '3' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('3')}>N3</div>
          <div className="levelSelectButton" style={displayChoice === '2' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('2')}>N2</div>
          <div className="levelSelectButton border-r-0 rounded-r-md" style={displayChoice === '1' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('1')}>N1</div>
        </div>

        {/* Columns to display buttons */}
        <div className="flex items-center font-bold w-full md:w-3/4 mx-auto border-2 rounded-lg bg-fourth my-3 py-1">
          <div className="columnDisplayButton" style={columnToDisplay.includes('kanji') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('kanji')}>Kanji</div>
          <div className="columnDisplayButton" style={columnToDisplay.includes('japanese') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('japanese')}>Japonais</div>
          <div className="columnDisplayButton" style={columnToDisplay.includes('english') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('english')}>Anglais</div>
          <div className="columnDisplayButton" style={columnToDisplay.includes('french') ? { backgroundColor: '#653C87', color: 'white', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => handleColumnToDisplay('french')}>Français</div>
        </div>

        {/***** Kanji and Vocabulary display  */}
            {(displayChoice === "kanji" || displayChoice === '5') && <DashboardDisplay datas={n5DataKanji} type='kanji' level='5' updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "kanji" || displayChoice === '4') && <DashboardDisplay datas={n4DataKanji} type='kanji' level='4' updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "kanji" || displayChoice === '3') && <DashboardDisplay datas={n3DataKanji} type='kanji' level='3' updateData={updateData} columnToDisplay={columnToDisplay} />}

            {(displayChoice === "vocabulary" || displayChoice === '5') && <DashboardDisplay datas={n5DataVocabulary} type='vocabulary' level='5' updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "vocabulary" || displayChoice === '4') && <DashboardDisplay datas={n4DataVocabulary} type='vocabulary' level='4' updateData={updateData} columnToDisplay={columnToDisplay} />}
            {(displayChoice === "vocabulary" || displayChoice === '3') && <DashboardDisplay datas={n3DataVocabulary} type='vocabulary' level='3' updateData={updateData} columnToDisplay={columnToDisplay} />}
        </>
      }
    </div>
  )
}
