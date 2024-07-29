import React, {useEffect, useState} from 'react'

// Packages
import { RotatingLines } from 'react-loader-spinner'

export default function Search() {
  const [search, setSearch] = useState('')
  const [dataVocabulary, setDataVocabulary] = useState([])
  const [dataKanji, setDataKanji] = useState([])
  const [dataSentence, setDataSentence] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const updateSearch = (word) => {
    setSearch(word)
  }
  
// Function to fetch and to sort data
const fetchData = async (dbType, word) => {
  try {
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const query = `https://www.data.tsw.konecton.com/${dbType}/search?word=${word}`

    const response = await fetch(query, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      const data = await response.json();
      if(dbType === 'vocabulary') {
        setDataVocabulary(data)
      } else if(dbType === 'kanji') {
        setDataKanji(data)
      } else if(dbType === 'sentence') {
        setDataSentence(data)
      }
      setIsLoading(false)
  } catch (error) {
    console.error('error : ', error)
  }
}

  useEffect(() => {
    if(search) {
      setIsLoading(true)
      fetchData('vocabulary', search)
      fetchData('kanji', search)
      fetchData('sentence', search)
    } else {
      setDataVocabulary([])
      setDataKanji([])
      setDataSentence([])
    }
  }, [search])

  return (
    <div>
      <div className='flex-col my-3 w-1/2 mx-auto bg-primary px-3 py-2 text-center rounded-lg'>
      <h1>
        Search :&nbsp;&nbsp; {search}
      </h1>
      <input type='text' placeholder='Your research' className='text-black px-2 py-1 rounded-lg' value={search} onChange={(e) => {updateSearch(e.target.value)}} />
      </div>
      {isLoading ? (
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
      ) :
      <>
      {/* VOCABULARY */}
      {dataVocabulary.length > 0 &&
        <table className='w-full py-5 mt-10'>
          <caption className='text-primary font-bold uppercase'>
            Vocabulaire :
          </caption>
          <thead>
          <tr className='text-center border-b-2 border-gray-400 border-opacity-50'>
            <th>ID</th>
            <th>Kanji</th>
            <th>Japanese</th>
            <th>English</th>
            <th>French</th>
            <th>Romaji</th>
            </tr>
          </thead>
          <tbody>
        
         {dataVocabulary.map((result, index) => (
              <tr key={index} className='text-center border-b-2 border-gray-400 border-opacity-15'>
                <td>{result.id}</td>
                <td>{result.kanji}</td>
                <td>{result.japanese}</td>
                <td>{result.english}</td>
                <td>{result.french}</td>
                <td>{result.romaji}</td>
              </tr>
        ))}
        
        {dataVocabulary.length >= 50 &&
          <p className='bg-warning px-3 py-2 rounded-lg w-[300px] text-center mt-3 font-bold'>Plus de 50 résultats ... </p>
        }
        </tbody>
        </table>
      }

        {/* KANJI */}
        {dataKanji.length > 0 && 
        <table className='w-full py-5 mt-10'>
          <caption className='text-primary font-bold uppercase'>
            Kanji :
          </caption>
          <thead>
          <tr className='text-center border-b-2 border-gray-400 border-opacity-50'>
            <th>ID</th>
            <th>Kanji</th>
            <th>Kunyomu</th>
            <th>Onyomi</th>
            <th>English</th>
            <th>French</th>
            </tr>
          </thead>
          <tbody>
          {dataKanji.map((result, index) => (
              <tr key={index} className='text-center border-b-2 border-gray-400 border-opacity-15'>
                <td>{result?.id}</td>
                <td>{result?.kanji}</td>
                <td>{result?.kunyomi}</td>
                <td>{result?.onyomi}</td>
                <td>{result?.english}</td>
                <td>{result?.french}</td>
              </tr>
        ))}
        {dataKanji.length >= 50 &&
          <p className='bg-warning px-3 py-2 rounded-lg w-[300px] text-center mt-3 font-bold'>Plus de 50 résultats ... </p>
        }
        </tbody>
        </table>
        }

        {/* SENTENCE */}
        {dataSentence.length > 0 && 
        <table className='w-full py-5 mt-10'>
          <caption className='text-primary font-bold uppercase'>
            Sentence :
          </caption>
          <thead>
          <tr className='text-center border-b-2 border-gray-400 border-opacity-50'>
            <th>ID</th>
            <th>Kanji</th>
            <th>Japanese</th>
            <th>English</th>
            <th>French</th>
            <th>Romaji</th>
            <th>Words</th>
            </tr>
          </thead>
          <tbody>
        {dataSentence.map((result, index) => (
              <tr key={index} className='text-center border-b-2 border-gray-400 border-opacity-15'>
                <td>{result?.id}</td>
                <td>{result?.kanji}</td>
                <td>{result?.japanese}</td>
                <td>{result?.english}</td>
                <td>{result?.french}</td>
                <td>{result?.romaji}</td>
                <td>{result?.words}</td>
              </tr>
        ))}
        {dataSentence.length >= 50 &&
          <p className='bg-warning px-3 py-2 rounded-lg w-[300px] text-center mt-3 font-bold'>Plus de 50 résultats ... </p>
        }
        </tbody>
        </table>
        }
        </>
      }
    </div>
  )
}
