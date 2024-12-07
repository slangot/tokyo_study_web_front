import React, {useEffect, useState} from 'react'

import { RotatingLines } from "react-loader-spinner"

const FamilySentence = () => {

  const [basic, setBasic] = useState()
  const [dataList, setDataList] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const [masuPresentPositiveKanji, setMasuPresentPositiveKanji] = useState("")
  const [masuPresentPositiveJapanese, setMasuPresentPositiveJapanese] = useState("")
  const [masuPresentPositiveFrench, setMasuPresentPositiveFrench] = useState("")
  const [masuPresentPositiveGrammar, setMasuPresentPositiveGrammar] = useState("")
  const [masuPresentPositiveKanjiTag, setMasuPresentPositiveKanjiTag] = useState("")
  const [masuPresentPositiveJapaneseTag, setMasuPresentPositiveJapaneseTag] = useState("")
  const [masuPresentPositiveWords, setMasuPresentPositiveWords] = useState("")

  const [masuPresentNegativeKanji, setMasuPresentNegativeKanji] = useState("")
  const [masuPresentNegativeJapanese, setMasuPresentNegativeJapanese] = useState("")
  const [masuPresentNegativeFrench, setMasuPresentNegativeFrench] = useState("")
  const [masuPresentNegativeGrammar, setMasuPresentNegativeGrammar] = useState("")
  const [masuPresentNegativeKanjiTag, setMasuPresentNegativeKanjiTag] = useState("")
  const [masuPresentNegativeJapaneseTag, setMasuPresentNegativeJapaneseTag] = useState("")
  const [masuPresentNegativeWords, setMasuPresentNegativeWords] = useState("")

  const [masuPastPositiveKanji, setMasuPastPositiveKanji] = useState("")
  const [masuPastPositiveJapanese, setMasuPastPositiveJapanese] = useState("")
  const [masuPastPositiveFrench, setMasuPastPositiveFrench] = useState("")
  const [masuPastPositiveGrammar, setMasuPastPositiveGrammar] = useState("")
  const [masuPastPositiveKanjiTag, setMasuPastPositiveKanjiTag] = useState("")
  const [masuPastPositiveJapaneseTag, setMasuPastPositiveJapaneseTag] = useState("")
  const [masuPastPositiveWords, setMasuPastPositiveWords] = useState("")

  const [masuPastNegativeKanji, setMasuPastNegativeKanji] = useState("")
  const [masuPastNegativeJapanese, setMasuPastNegativeJapanese] = useState("")
  const [masuPastNegativeFrench, setMasuPastNegativeFrench] = useState("")
  const [masuPastNegativeGrammar, setMasuPastNegativeGrammar] = useState("")
  const [masuPastNegativeKanjiTag, setMasuPastNegativeKanjiTag] = useState("")
  const [masuPastNegativeJapaneseTag, setMasuPastNegativeJapaneseTag] = useState("")
  const [masuPastNegativeWords, setMasuPastNegativeWords] = useState("")

  const [dicoPresentPositiveKanji, setDicoPresentPositiveKanji] = useState("")
  const [dicoPresentPositiveJapanese, setDicoPresentPositiveJapanese] = useState("")
  const [dicoPresentPositiveFrench, setDicoPresentPositiveFrench] = useState("")
  const [dicoPresentPositiveGrammar, setDicoPresentPositiveGrammar] = useState("")
  const [dicoPresentPositiveKanjiTag, setDicoPresentPositiveKanjiTag] = useState("")
  const [dicoPresentPositiveJapaneseTag, setDicoPresentPositiveJapaneseTag] = useState("")
  const [dicoPresentPositiveWords, setDicoPresentPositiveWords] = useState("")

  const [dicoPresentNegativeKanji, setDicoPresentNegativeKanji] = useState("")
  const [dicoPresentNegativeJapanese, setDicoPresentNegativeJapanese] = useState("")
  const [dicoPresentNegativeFrench, setDicoPresentNegativeFrench] = useState("")
  const [dicoPresentNegativeGrammar, setDicoPresentNegativeGrammar] = useState("")
  const [dicoPresentNegativeKanjiTag, setDicoPresentNegativeKanjiTag] = useState("")
  const [dicoPresentNegativeJapaneseTag, setDicoPresentNegativeJapaneseTag] = useState("")
  const [dicoPresentNegativeWords, setDicoPresentNegativeWords] = useState("")

  const [dicoPastPositiveKanji, setDicoPastPositiveKanji] = useState("")
  const [dicoPastPositiveJapanese, setDicoPastPositiveJapanese] = useState("")
  const [dicoPastPositiveFrench, setDicoPastPositiveFrench] = useState("")
  const [dicoPastPositiveGrammar, setDicoPastPositiveGrammar] = useState("")
  const [dicoPastPositiveKanjiTag, setDicoPastPositiveKanjiTag] = useState("")
  const [dicoPastPositiveJapaneseTag, setDicoPastPositiveJapaneseTag] = useState("")
  const [dicoPastPositiveWords, setDicoPastPositiveWords] = useState("")

  const [dicoPastNegativeKanji, setDicoPastNegativeKanji] = useState("")
  const [dicoPastNegativeJapanese, setDicoPastNegativeJapanese] = useState("")
  const [dicoPastNegativeFrench, setDicoPastNegativeFrench] = useState("")
  const [dicoPastNegativeGrammar, setDicoPastNegativeGrammar] = useState("")
  const [dicoPastNegativeKanjiTag, setDicoPastNegativeKanjiTag] = useState("")
  const [dicoPastNegativeJapaneseTag, setDicoPastNegativeJapaneseTag] = useState("")
  const [dicoPastNegativeWords, setDicoPastNegativeWords] = useState("")

const fetchData = async (id) => {

    try {
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        const query = `${process.env.REACT_APP_API}/sentence/test?id=${id}`
  
        const response = await fetch(query, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data : ", data)
        if (data && data.length > 0) {
          setBasic(data[0])
        }
    } catch (error) {
      console.error('error : ', error)
    }
}

const handleFormatData = () => {
  const newDataToPost = []

  if (masuPresentPositiveJapanese) {
    const newData1 = {
      kanji: masuPresentPositiveKanji,
      japanese: masuPresentPositiveJapanese,
      french: masuPresentPositiveFrench,
      level: basic.level,
      grammar: masuPresentPositiveGrammar,
      kanjiTag: masuPresentPositiveKanjiTag,
      japaneseTag: masuPresentPositiveJapaneseTag,
      direction: "positive",
      tense: "present",
      form: "masu",
      words: masuPresentPositiveWords
    }
    newDataToPost.push(newData1)
  }

  if (masuPresentNegativeJapanese) {
    const newData2 = {
      kanji: masuPresentNegativeKanji,
      japanese: masuPresentNegativeJapanese,
      french: masuPresentNegativeFrench,
      level: basic.level,
      grammar: masuPresentNegativeGrammar,
      kanjiTag: masuPresentNegativeKanjiTag,
      japaneseTag: masuPresentNegativeJapaneseTag,
      direction: "negative",
      tense: "present",
      form: "masu",
      words: masuPresentNegativeWords
    }
    newDataToPost.push(newData2)
  }

  if (masuPastPositiveJapanese) {
    const newData3 = {
      kanji: masuPastPositiveKanji,
      japanese: masuPastPositiveJapanese,
      french: masuPastPositiveFrench,
      level: basic.level,
      grammar: masuPastPositiveGrammar,
      kanjiTag: masuPastPositiveKanjiTag,
      japaneseTag: masuPastPositiveJapaneseTag,
      direction: "positive",
      tense: "past",
      form: "masu",
      words: masuPastPositiveWords
    }
    newDataToPost.push(newData3)
  }

  if (masuPastNegativeJapanese) {
    const newData4 = {
      kanji: masuPastNegativeKanji,
      japanese: masuPastNegativeJapanese,
      french: masuPastNegativeFrench,
      level: basic.level,
      grammar: masuPastNegativeGrammar,
      kanjiTag: masuPastNegativeKanjiTag,
      japaneseTag: masuPastNegativeJapaneseTag,
      direction: "negative",
      tense: "past",
      form: "masu",
      words: masuPastNegativeWords
    }
    newDataToPost.push(newData4)
  }

  if (dicoPresentPositiveJapanese) {
    const newData5 = {
      kanji: dicoPresentPositiveKanji,
      japanese: dicoPresentPositiveJapanese,
      french: dicoPresentPositiveFrench,
      level: basic.level,
      grammar: dicoPresentPositiveGrammar,
      kanjiTag: dicoPresentPositiveKanjiTag,
      japaneseTag: dicoPresentPositiveJapaneseTag,
      direction: "positive",
      tense: "present",
      form: "dictionary",
      words: dicoPresentPositiveWords
    }
    newDataToPost.push(newData5)
  }

  if (dicoPresentNegativeJapanese) {
    const newData6 = {
      kanji: dicoPresentNegativeKanji,
      japanese: dicoPresentNegativeJapanese,
      french: dicoPresentNegativeFrench,
      level: basic.level,
      grammar: dicoPresentNegativeGrammar,
      kanjiTag: dicoPresentNegativeKanjiTag,
      japaneseTag: dicoPresentNegativeJapaneseTag,
      direction: "negative",
      tense: "present",
      form: "dictionary",
      words: dicoPresentNegativeWords
    }
    newDataToPost.push(newData6)
  }

  if (dicoPastPositiveJapanese) {
    const newData7 = {
      kanji: dicoPastPositiveKanji,
      japanese: dicoPastPositiveJapanese,
      french: dicoPastPositiveFrench,
      level: basic.level,
      grammar: dicoPastPositiveGrammar,
      kanjiTag: dicoPastPositiveKanjiTag,
      japaneseTag: dicoPastPositiveJapaneseTag,
      direction: "positive",
      tense: "past",
      form: "dictionary",
      words: dicoPastPositiveWords
    }
    newDataToPost.push(newData7)
  }

  if (dicoPastNegativeJapanese) {
    const newData8 = {
      kanji: dicoPastNegativeKanji,
      japanese: dicoPastNegativeJapanese,
      french: dicoPastNegativeFrench,
      level: basic.level,
      grammar: dicoPastNegativeGrammar,
      kanjiTag: dicoPastNegativeKanjiTag,
      japaneseTag: dicoPastNegativeJapaneseTag,
      direction: "negative",
      tense: "past",
      form: "dictionary",
      words: dicoPastNegativeWords
    }
    newDataToPost.push(newData8)
  }

  setDataList(newDataToPost)
}

const pushData = async (data) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: data})
      };
      const response = await fetch(`${process.env.REACT_APP_API}/sentence/new`, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const result = await response.json();
        console.log('result : ', result)
  } catch (err) {
    console.error(err)
  }
}

const handlePushData = async () => {
  setIsLoading(true);
  for (const e of dataList) {
    await pushData(e);
  }
  setIsLoading(false);
}

useEffect(() => {
  fetchData(3)
}, []) 



console.log('BASIC : ', basic)
// console.log('Data : ', dataList)

  return (
    <section className='flex flex-col text-xs'>
      <div className='flex flex-col bg-blue-800 px-2 py-1 mb-0 text-white'>
      <h2 className='font-bold text-white underline'>Basique : </h2>
        {basic && 
        <>
          <p className='text-white'>Kanji :</p>
          <p className='bg-white text-black px-2 py-1 mb-1 rounded-md'>{basic.kanji}</p>
          
          <p className='text-white'>Japanese :</p>
          <p className='bg-white text-black px-2 py-1 mb-1 rounded-md'>{basic.japanese}</p>

          <p className='text-white'>French :</p>
          <p className='bg-white text-black px-2 py-1 mb-1 rounded-md'>{basic.french}</p>

          <p className='text-white'>Grammar :</p>
          <p className='bg-white text-black px-2 py-1 mb-1 rounded-md'>{basic.grammar}</p>

          <p className='text-white'>Kanji Tag :</p>
          <p className='bg-white text-black px-2 py-1 mb-1 rounded-md'>{basic.kanjiTag}</p>

          <p className='text-white'>Japanese Tag :</p>
          <p className='bg-white text-black px-2 py-1 mb-1 rounded-md'>{basic.japaneseTag}</p>

          <p className='text-white'>Words :</p>
          <p className='bg-white text-black px-2 py-1 mb-1 rounded-md'>{basic.words}</p>
        </>}
      </div>


      {/*** MASU PRESENT POSITIVE */}
      <div className='bg-purple-600 mt-1 py-1 px-1 text-black'>
        <h2 className='text-xs font-bold text-white'>MASU PRESENT POSITIVE</h2>
        <div className='flex flex-row gap-3 px-2 py-0'>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPresentPositiveKanji">Forme Masu Present Positive Kanji : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPresentPositiveKanji" onChange={(e) => setMasuPresentPositiveKanji(e.target.value)} placeholder='Forme Masu Present Positif'></textarea>
          </div>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPresentPositiveJapanese">Forme Masu Present Positive Japanese : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPresentPositiveJapanese" onChange={(e) => setMasuPresentPositiveJapanese(e.target.value)} placeholder='Forme Masu Present Positif'></textarea>
          </div>
        </div>
        <div className='flex flex-row gap-3 px-2 py-2'>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPresentPositiveFrench">Forme Masu Present Positive French : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPresentPositiveFrench" onChange={(e) => setMasuPresentPositiveFrench(e.target.value)} placeholder='Forme Masu Present Positif'></textarea>
          </div>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPresentPositiveGrammar">Forme Masu Present Positive Grammar : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPresentPositiveGrammar" onChange={(e) => setMasuPresentPositiveGrammar(e.target.value)} placeholder='Forme Masu Present Positif'></textarea>
          </div>
        </div>
        <div className='flex flex-row gap-3 px-2 py-2'>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPresentPositiveKanjiTag">Forme Masu Present Positive Kanji Tag : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPresentPositiveKanjiTag" onChange={(e) => setMasuPresentPositiveKanjiTag(e.target.value)} placeholder='Forme Masu Present Positif'></textarea>
          </div>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPresentPositiveJapaneseTag">Forme Masu Present Positive Japanese Tag : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPresentPositiveJapaneseTag" onChange={(e) => setMasuPresentPositiveJapaneseTag(e.target.value)} placeholder='Forme Masu Present Positif'></textarea>
          </div>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentPositiveWords">Forme Masu Present Positive Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentPositiveWords" onChange={(e) => setMasuPresentPositiveWords(e.target.value)} placeholder='Forme Masu Present Positif'></textarea>
        </div>
      </div>
      

      {/*** MASU PRESENT NEGATIVE */}
      <div className='bg-green-400 mt-2 px-1 py-1 text-black'>
      <h2 className='text-xs font-bold text-white'>MASU PRESENT NEGATIVE</h2>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentNegativeKanji">Forme Masu Present Negative Kanji : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentNegativeKanji" onChange={(e) => setMasuPresentNegativeKanji(e.target.value)} placeholder='Forme Masu Present Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentNegativeJapanese">Forme Masu Present Negative Japanese : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentNegativeJapanese" onChange={(e) => setMasuPresentNegativeJapanese(e.target.value)} placeholder='Forme Masu Present Negatif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentNegativeFrench">Forme Masu Present Negative French : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentNegativeFrench" onChange={(e) => setMasuPresentNegativeFrench(e.target.value)} placeholder='Forme Masu Present Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentNegativeGrammar">Forme Masu Present Negative Grammar : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentNegativeGrammar" onChange={(e) => setMasuPresentNegativeGrammar(e.target.value)} placeholder='Forme Masu Present Negatif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentNegativeKanjiTag">Forme Masu Present Negative Kanji Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentNegativeKanjiTag" onChange={(e) => setMasuPresentNegativeKanjiTag(e.target.value)} placeholder='Forme Masu Present Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentNegativeJapaneseTag">Forme Masu Present Negative Japanese Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentNegativeJapaneseTag" onChange={(e) => setMasuPresentNegativeJapaneseTag(e.target.value)} placeholder='Forme Masu Present Negatif'></textarea>
        </div>
      </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPresentNegativeWords">Forme Masu Present Negative Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPresentNegativeWords" onChange={(e) => setMasuPresentNegativeWords(e.target.value)} placeholder='Forme Masu Present Negatif'></textarea>
        </div>
      </div>


       {/*** MASU PAST POSITIVE */}
       <div className='bg-red-400 mt-2 px-1 py-1 text-black'>
       <h2 className='text-xs font-bold text-white'>MASU PAST POSITIVE</h2>
        <div className='flex flex-row gap-3 px-2 py-2'>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPastPositiveKanji">Forme Masu Past Positive Kanji : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPastPositiveKanji" onChange={(e) => setMasuPastPositiveKanji(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
          </div>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPastPositiveJapanese">Forme Masu Past Positive Japanese : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPastPositiveJapanese" onChange={(e) => setMasuPastPositiveJapanese(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
          </div>
        </div>
        <div className='flex flex-row gap-3 px-2 py-2'>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPastPositiveFrench">Forme Masu Past Positive French : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPastPositiveFrench" onChange={(e) => setMasuPastPositiveFrench(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
          </div>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPastPositiveGrammar">Forme Masu Past Positive Grammar : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPastPositiveGrammar" onChange={(e) => setMasuPastPositiveGrammar(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
          </div>
        </div>
        <div className='flex flex-row gap-3 px-2 py-2'>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPastPositiveKanjiTag">Forme Masu Past Positive Kanji Tag : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPastPositiveKanjiTag" onChange={(e) => setMasuPastPositiveKanjiTag(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
          </div>
          <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
            <label htmlFor="masuPastPositiveJapaneseTag">Forme Masu Past Positive Japanese Tag : </label>
            <textarea className='px-2 py-1 rounded-md' id="masuPastPositiveJapaneseTag" onChange={(e) => setMasuPastPositiveJapaneseTag(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
          </div>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastPositiveWords">Forme Masu Past Positive Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastPositiveWords" onChange={(e) => setMasuPastPositiveWords(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
      </div>


      {/*** MASU PAST NEGATIVE */}
      <div className='bg-yellow-400 mt-2 px-1 py-1 text-black'>
      <h2 className='text-xs font-bold text-white'>MASU PAST NEGATIVE</h2>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastNegativeKanji">Forme Masu Past Negative Kanji : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastNegativeKanji" onChange={(e) => setMasuPastNegativeKanji(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastNegativeJapanese">Forme Masu Past Negative Japanese : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastNegativeJapanese" onChange={(e) => setMasuPastNegativeJapanese(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastNegativeFrench">Forme Masu Past Negative French : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastNegativeFrench" onChange={(e) => setMasuPastNegativeFrench(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastNegativeGrammar">Forme Masu Past Negative Grammar : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastNegativeGrammar" onChange={(e) => setMasuPastNegativeGrammar(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastNegativeKanjiTag">Forme Masu Past Negative Kanji Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastNegativeKanjiTag" onChange={(e) => setMasuPastNegativeKanjiTag(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastNegativeJapaneseTag">Forme Masu Past Negative Japanese Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastNegativeJapaneseTag" onChange={(e) => setMasuPastNegativeJapaneseTag(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
      </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="masuPastNegativeWords">Forme Masu Past Negative Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="masuPastNegativeWords" onChange={(e) => setMasuPastNegativeWords(e.target.value)} placeholder='Forme Masu Past Positif'></textarea>
        </div>
      </div>


      {/*** DICO PRESENT POSITIVE */}
      <div className='bg-pink-400 mt-2 px-1 py-1 text-black'>
      <h2 className='text-xs font-bold text-white'>DICO PRESENT POSITIVE</h2>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentPositiveKanji">Forme Dico Present Positive Kanji : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentPositiveKanji" onChange={(e) => setDicoPresentPositiveKanji(e.target.value)} placeholder='Forme Dico Present Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentPositiveJapanese">Forme Dico Present Positive Japanese : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentPositiveJapanese" onChange={(e) => setDicoPresentPositiveJapanese(e.target.value)} placeholder='Forme Dico Present Positif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentPositiveFrench">Forme Dico Present Positive French : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentPositiveFrench" onChange={(e) => setDicoPresentPositiveFrench(e.target.value)} placeholder='Forme Dico Present Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentPositiveGrammar">Forme Dico Present Positive Grammar : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentPositiveGrammar" onChange={(e) => setDicoPresentPositiveGrammar(e.target.value)} placeholder='Forme Dico Present Positif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentPositiveKanjiTag">Forme Dico Present Positive Kanji Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentPositiveKanjiTag" onChange={(e) => setDicoPresentPositiveKanjiTag(e.target.value)} placeholder='Forme Dico Present Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentPositiveJapaneseTag">Forme Dico Present Positive Japanese Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentPositiveJapaneseTag" onChange={(e) => setDicoPresentPositiveJapaneseTag(e.target.value)} placeholder='Forme Dico Present Positif'></textarea>
        </div>
      </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentPositiveWords">Forme Dico Present Positive Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentPositiveWords" onChange={(e) => setDicoPresentPositiveWords(e.target.value)} placeholder='Forme Dico Present Positif'></textarea>
        </div>
      </div>


      {/*** DICO PRESENT NEGATIVE */}
      <div className='bg-gray-400 mt-2 px-1 py-1 text-black'>
      <h2 className='text-xs font-bold text-white'>DICO PRESENT NEGATIVE</h2>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentNegativeKanji">Forme Dico Present Negative Kanji : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentNegativeKanji" onChange={(e) => setDicoPresentNegativeKanji(e.target.value)} placeholder='Forme Dico Present Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentNegativeJapanese">Forme Dico Present Negative Japanese : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentNegativeJapanese" onChange={(e) => setDicoPresentNegativeJapanese(e.target.value)} placeholder='Forme Dico Present Negatif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentNegativeFrench">Forme Dico Present Negative French : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentNegativeFrench" onChange={(e) => setDicoPresentNegativeFrench(e.target.value)} placeholder='Forme Dico Present Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentNegativeGrammar">Forme Dico Present Negative Grammar : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentNegativeGrammar" onChange={(e) => setDicoPresentNegativeGrammar(e.target.value)} placeholder='Forme Dico Present Negatif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentNegativeKanjiTag">Forme Dico Present Negative Kanji Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentNegativeKanjiTag" onChange={(e) => setDicoPresentNegativeKanjiTag(e.target.value)} placeholder='Forme Dico Present Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentNegativeJapaneseTag">Forme Dico Present Negative Japanese Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentNegativeJapaneseTag" onChange={(e) => setDicoPresentNegativeJapaneseTag(e.target.value)} placeholder='Forme Dico Present Negatif'></textarea>
        </div>
      </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPresentNegativeWords">Forme Dico Present Negative Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPresentNegativeWords" onChange={(e) => setDicoPresentNegativeWords(e.target.value)} placeholder='Forme Dico Present Negatif'></textarea>
        </div>
      </div>


      {/*** DICO PAST POSITIVE */}
      <div className='bg-blue-800 mt-2 px-1 py-1 text-black'>
      <h2 className='text-xs font-bold text-white'>DICO PAST POSITIVE</h2>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastPositiveKanji">Forme Dico Past Positive Kanji : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastPositiveKanji" onChange={(e) => setDicoPastPositiveKanji(e.target.value)} placeholder='Forme Dico Past Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastPositiveJapanese">Forme Dico Past Positive Japanese : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastPositiveJapanese" onChange={(e) => setDicoPastPositiveJapanese(e.target.value)} placeholder='Forme Dico Past Positif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastPositiveFrench">Forme Dico Past Positive French : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastPositiveFrench" onChange={(e) => setDicoPastPositiveFrench(e.target.value)} placeholder='Forme Dico Past Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastPositiveGrammar">Forme Dico Past Positive Grammar : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastPositiveGrammar" onChange={(e) => setDicoPastPositiveGrammar(e.target.value)} placeholder='Forme Dico Past Positif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastPositiveKanjiTag">Forme Dico Past Positive Kanji Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastPositiveKanjiTag" onChange={(e) => setDicoPastPositiveKanjiTag(e.target.value)} placeholder='Forme Dico Past Positif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastPositiveJapaneseTag">Forme Dico Past Positive Japanese Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastPositiveJapaneseTag" onChange={(e) => setDicoPastPositiveJapaneseTag(e.target.value)} placeholder='Forme Dico Past Positif'></textarea>
        </div>
      </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastPositiveWords">Forme Dico Past Positive Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastPositiveWords" onChange={(e) => setDicoPastPositiveWords(e.target.value)} placeholder='Forme Dico Past Positif'></textarea>
        </div>
      </div>


      {/*** DICO PAST NEGATIVE */}
      <div className='bg-red-800 mt-2 px-1 py-1 text-black'>
      <h2 className='text-xs font-bold text-white'>DICO PAST NEGATIVE</h2>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastNegativeKanji">Forme Dico Past Negative Kanji : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastNegativeKanji" onChange={(e) => setDicoPastNegativeKanji(e.target.value)} placeholder='Forme Dico Past Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastNegativeJapanese">Forme Dico Past Negative Japanese : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastNegativeJapanese" onChange={(e) => setDicoPastNegativeJapanese(e.target.value)} placeholder='Forme Dico Past Negatif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastNegativeFrench">Forme Dico Past Negative French : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastNegativeFrench" onChange={(e) => setDicoPastNegativeFrench(e.target.value)} placeholder='Forme Dico Past Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastNegativeGrammar">Forme Dico Past Negative Grammar : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastNegativeGrammar" onChange={(e) => setDicoPastNegativeGrammar(e.target.value)} placeholder='Forme Dico Past Negatif'></textarea>
        </div>
      </div>
      <div className='flex flex-row gap-3 px-2 py-2'>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastNegativeKanjiTag">Forme Dico Past Negative Kanji Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastNegativeKanjiTag" onChange={(e) => setDicoPastNegativeKanjiTag(e.target.value)} placeholder='Forme Dico Past Negatif'></textarea>
        </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastNegativeJapaneseTag">Forme Dico Past Negative Japanese Tag : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastNegativeJapaneseTag" onChange={(e) => setDicoPastNegativeJapaneseTag(e.target.value)} placeholder='Forme Dico Past Negatif'></textarea>
        </div>
      </div>
        <div className='flex flex-col bg-blue-300 rounded-md flex-1 px-2 py-1'>
          <label htmlFor="dicoPastNegativeWords">Forme Dico Past Negative Words : </label>
          <textarea className='px-2 py-1 rounded-md' id="dicoPastNegativeWords" onChange={(e) => setDicoPastNegativeWords(e.target.value)} placeholder='Forme Dico Past Negatif'></textarea>
        </div>
      </div>

      {isLoading && 
        <div className="flex flex-col justify-center items-center h-96">
          <RotatingLines
            visible={true}
            width="96"
            strokeColor="#520380"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>
      }
      <div className='flex flex-row justify-center'>
        <button className='px-3 py-1 my-3 mx-2 bg-blue-400 w-[30vw] rounded-sm' onClick={() => handleFormatData()}>Formatage des données</button>
        <button className='px-3 py-1 my-3 mx-2 bg-yellow-500 w-[30vw] rounded-sm' onClick={() => handlePushData()}>Ajout des données</button>
      </div>
    </section>
  )
}

export default FamilySentence