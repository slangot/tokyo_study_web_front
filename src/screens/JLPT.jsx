import React, { useState, useEffect } from 'react'

// Packages
import { RotatingLines } from 'react-loader-spinner'

const DashboardStats = ({allStats}) => {
  return (
    <div className='mx-auto my-3 w-2/3 md:w-1/2 font-bold text-center'>
      {allStats.map(stats => (
          <ul className='p-3 my-4 bg-fourth'>
            <li>Total kanji N{stats.level}: {stats.kanjiTotal}</li>
            <li>Total kanji N{stats.level} connu : {stats.kanjiKnown}</li>
            <li>Pourcentage avancement kanji N{stats.level}: {Math.floor(stats.kanjiPercent)}%</li>
            <li className='my-3'></li>
            <li>Total vocabulaire N{stats.level}: {stats.vocabularyTotal}</li>
            <li>Total vocabulaire N{stats.level} connu : {stats.vocabularyKnown}</li>
            <li>Pourcentage avancement vocabulaire N{stats.level}: {Math.floor(stats.vocabularyPercent)}%</li>
            <li className='my-3'></li>
            <li className='uppercase' style={(stats.kanjiPercent + stats.vocabularyPercent / 2) == 100 ? {color: 'green'} : (stats.kanjiPercent + stats.vocabularyPercent / 2) < 50 ? {color: 'red'} : {color: 'orange'}}>Total avancement N{stats.level}: {(Math.floor(stats.kanjiPercent + stats.vocabularyPercent) / 2)}%</li>
          </ul>
      ))}
    </div>
  )
}

const DashboardDisplay = ({datas, type, level, update}) => {

  const updateStatus = (id, status) => {
    update(type, level, id, status === 'done' ? '' : 'done')
  }

  return (
    <table className='border-collapse w-5/6 m-auto'>
      <caption className='uppercase font-bold text-lg'>{type} N{level}</caption>
      <thead className='bg-primary'>
      <tr>
        <th className='uppercase'>Kanji</th>
        {type === 'kanji' ?
        <>
        <th>Kunyomi</th>
        <th>Onyomi</th>
        </>:
        <th>Japonais</th>
      }
      <th>Anglais</th>
      <th>Français</th>
      <th>Status</th>
      </tr>
      </thead>
      <tbody>
      {datas.map((data) => (
        <>
          <tr key={data.id} className='border-b-2 border-gray-500'>
            <td className='px-5 py-2 border-x-2 border-gray-700 font-bold text-2xl'>{data.kanji}</td>
            {type === 'kanji' ?
              <>
                <td className='px-5 py-2 border-x-2 border-gray-700 font-bold'>{data.kunyomi}</td>
                <td className='px-5 py-2 border-x-2 border-gray-700 font-bold'>{data.onyomi}</td>
              </>
            :
            <td className='px-5 py-2 border-x-2 border-gray-700 font-bold'>{data.japanese}</td>
            }
            <td className='px-5 py-2 border-x-2 border-gray-700'>{data.english}</td>
            <td className='px-5 py-2 border-x-2 border-gray-700'>{data.french}</td>
            <td className='px-5 py-2 border-x-2 border-gray-700'>
              <input
                type="checkbox"
                onChange={() => updateStatus(data.id, data.jlpt_status)}
                checked={data.jlpt_status === 'done' ? true : false}
                style={data.jlpt_status === 'done' ? {accentColor: 'green', transform: 'scale(2)'} : {transform: 'scale(2)'}}
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
  const [isLoading, setIsLoading] = useState(false)

  const update = (id, status, type, level) => {
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
          setN5DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '4':
          setN4DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '3':
          setN3DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '2':
          setN2DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
          break;
        case '1':
          setN1DataVocabulary((prev) => prev.map(item => item.id === id ? { ...item, jlpt_status: status} : item))
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

    const query =`http://localhost:3001/${type}?level=${level}`
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

  const updateData = async (type, level, id, status) => {
    try {
      const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const query =`http://localhost:3001/${type}/update?id=${id}&status=${status}&jlpt=1`
      const response = await fetch(query, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        update(id, status, type, level)
      }
    } catch (error) {
      console.error('error : ', error)
    }
  }

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
    // setStats(prev => [...prev, newStats])
    setStats(currentStats)
  }

  const handleDisplayChoice = (choice) => {
    if(displayChoice === choice) {
      setDisplayChoice("")
    } else {
      setDisplayChoice(choice)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchData('kanji', '5')
    fetchData('vocabulary', '5')
    fetchData('kanji', '4')
    fetchData('vocabulary', '4')
  }, [])

  useEffect(() => {
    if(n5DataKanji.length > 0 && n5DataVocabulary.length > 0) {
      updateStatistics(5, n5DataKanji, n5DataVocabulary)
    }

    if(n4DataKanji.length > 0 && n4DataVocabulary.length > 0) {
      updateStatistics(4, n4DataKanji, n4DataVocabulary)
    }

    if(n3DataKanji.length > 0 && n3DataVocabulary.length > 0) {
      updateStatistics(3, n3DataKanji, n3DataVocabulary)
    }
  }, [n5DataKanji, n5DataVocabulary, n4DataKanji, n4DataVocabulary, n3DataKanji, n3DataVocabulary])

  return (
    <div>
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
  <div className='flex gap-3 my-4 justify-center'>
    <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={displayChoice === 'kanji' ? {backgroundColor: 'blue'} : {}} onClick={() => handleDisplayChoice("kanji")}>Kanji</button>
    <button className='px-3 py-2 text-white font-bold bg-fourth rounded' style={displayChoice === 'vocabulary' ? {backgroundColor: 'blue'} : {}} onClick={() => handleDisplayChoice("vocabulary")}>Vocabulaire</button>
  </div>
  <div className="flex items-center font-bold w-full md:w-3/4 mx-auto border-2 rounded-lg bg-light">
    <div className="levelSelectButton" style={displayChoice === '5' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('5')}>N5</div>
    <div className="levelSelectButton" style={displayChoice === '4' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('4')}>N4</div>
    <div className="levelSelectButton" style={displayChoice === '3' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('3')}>N3</div>
    <div className="levelSelectButton" style={displayChoice === '2' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('2')}>N2</div>
    <div className="levelSelectButton border-r-0 rounded-r-md" style={displayChoice === '1' ? { backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 3px rgba(0,0,0,0.3)', height: '35px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '5px', marginLeft: '2px', marginRight: '2px' } : {}} onClick={() => setDisplayChoice('1')}>N1</div>
  </div>

  {/***** Kanji and Vocabulary display  */}
      {(displayChoice === "kanji" || displayChoice === '5') && <DashboardDisplay datas={n5DataKanji} type='kanji' level='5' update={updateData} />}
      {(displayChoice === "kanji" || displayChoice === '4') && <DashboardDisplay datas={n4DataKanji} type='kanji' level='4' update={updateData} />}
      {(displayChoice === "kanji" || displayChoice === '3') && <DashboardDisplay datas={n3DataKanji} type='kanji' level='3' update={updateData} />}

      {(displayChoice === "vocabulary" || displayChoice === '5') && <DashboardDisplay datas={n5DataVocabulary} type='vocabulaire' level='5' update={updateData} />}
      {(displayChoice === "vocabulary" || displayChoice === '4') && <DashboardDisplay datas={n4DataVocabulary} type='vocabulaire' level='4' update={updateData} />}
      {(displayChoice === "vocabulary" || displayChoice === '3') && <DashboardDisplay datas={n3DataVocabulary} type='vocabulaire' level='3' update={updateData} />}

  {/* {n5DataKanji.length > 0 && <DashboardDisplay datas={n5DataKanji} type='kanji' level='5' update={updateData} />}
  <div className='my-7 h-2 w-full bg-white' />
  {n5DataVocabulary.length > 0 && <DashboardDisplay datas={n5DataVocabulary} type='vocabulary' level='5' update={updateData} />}
  <div className='my-7 h-2 w-full bg-white' />
  {n4DataKanji.length > 0 && <DashboardDisplay datas={n4DataKanji} type='kanji' level='4' update={updateData} />}
  <div className='my-7 h-2 w-full bg-white' />
  {n4DataVocabulary.length > 0 && <DashboardDisplay datas={n4DataVocabulary} type='vocabulary' level='4' update={updateData} />} */}
  </>
}
    </div>
  )
}
