import React, {useEffect, useState} from 'react'

function Kanji() {
  const [data, setData] = useState()
  const kanjiSearch = '日'

  const fetchData = async () => {
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const query = `https://www.data.tsw.konecton.com/kanji/detailed?search=${kanjiSearch}`
      
      const response = await fetch(query, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
        const data = await response.json();
      if (data) {
        setData(data)
      }

    } catch (error) {
      console.error('error : ', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [kanjiSearch])


  return (
    <section className='section-bottom flex flex-col items-center justify-center'>
      <h1 className='font-bold text-5xl'>SOON</h1>
      {/* <h1 className='text-primary'>Kanji</h1>
      {data && 
      <>
      <div className='bg-blue-200 text-gold'>
        <h1>{data.kanji.kanji}</h1>
        <h3>Kun: {data.kanji.kunyomi}</h3>
        <h3>On: {data.kanji.onyomi}</h3>
        <h4>{data.kanji.french || data.kanji.english}</h4>
        <h5>N{data.kanji.level}</h5>
        </div>
        <div className='bg-red-400'>
          {data.vocabulary.map((word, index) => {
            return (
              <div key={index}>
                <h1>{word.kanji}</h1>
                <h2>{word.japanese}</h2>
                <h4>{word.french || word.english}</h4>
                <h5>N{word.level}</h5>
              </div>
            )
          })}
        </div>
        <div className='bg-red-400'>
          {data.sentences.map((sentence, index) => {
            return (
              <div key={index}>
                <h1>{sentence.kanji}</h1>
                <h2>{sentence.japanese}</h2>
                <h4>{sentence.french || sentence.english}</h4>
                <h5>N{sentence.level}</h5>
              </div>
            )
          })}
        </div>
      </>
      } */}
    </section>
  )
}

export default Kanji