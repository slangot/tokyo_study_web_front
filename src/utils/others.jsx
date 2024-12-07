// Vocabulary and Kanji useStates
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
const [levelToUpdate, setLevelToUpdate] = useState([])

// Function to update kanji_level
const updateLevel = async () => {
  try {
    const options = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    levelToUpdate.forEach(async upda => {
      const query =`${process.env.REACT_APP_API}/vocabulary/updatelevel?id=${upda.id}&level=${upda.level}`
      const response = await fetch(query, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })

  } catch (error) {
    console.error('error : ', error)
  }
}

// UseEffect to update kanji_level
useEffect(() => {
  if(n5DataKanji.length > 0 && n5DataVocabulary.length > 0 && n3DataKanji.length > 0 && n2DataKanji.length > 0) {
    handleJlptLevel()
  }    
}, [n5DataKanji, n5DataVocabulary, n3DataKanji, n2DataKanji])

// Function to check if the vocabulary contains a kanji and which level
const handleJlptLevel = () => {
  let jlptLevel = []
  let n5Kanji = []
  let n4Kanji = []
  let n3Kanji = []
  let n2Kanji = []
  let n1Kanji = []

  n5DataKanji.forEach(kanji => {
    n5Kanji.push(kanji.kanji)
  });

  n4DataKanji.forEach(kanji => {
    n4Kanji.push(kanji.kanji)
  })

  n3DataKanji.forEach(kanji => {
    n3Kanji.push(kanji.kanji)
  })

  n2DataKanji.forEach(kanji => {
    n2Kanji.push(kanji.kanji)
  })

  n1DataKanji.forEach(kanji => {
    n1Kanji.push(kanji.kanji)
  })

  n5DataVocabulary.forEach(voc => {
    n5Kanji.forEach(kanji => {
      if(voc.kanji.includes(kanji)) {
        const newLevel = {
          id: voc.id,
          kanji: kanji,
          vocabulary: voc.kanji,
          level: 5
        }

        const isDuplicate = jlptLevel.find(({id}) => id === voc.id)
        if(!isDuplicate) {
          jlptLevel.push(newLevel)
        }
      }
    })

    n4Kanji.forEach(kanji => {
      if(voc.kanji.includes(kanji)) {
        const newLevel = {
          id: voc.id,
          kanji: kanji,
          vocabulary: voc.kanji,
          level: 4
        }

        const isDuplicate = jlptLevel.find(({id}) => id === voc.id)
        if(!isDuplicate) {
          jlptLevel.push(newLevel)
        }
      }
    })

    n3Kanji.forEach(kanji => {
      if(voc.kanji.includes(kanji)) {
        const newLevel = {
          id: voc.id,
          kanji: kanji,
          vocabulary: voc.kanji,
          level: 3
        }

        const isDuplicate = jlptLevel.find(({id}) => id === voc.id)
        if(!isDuplicate) {
          jlptLevel.push(newLevel)
        }
      }
    })

    n2Kanji.forEach(kanji => {
      if(voc.kanji.includes(kanji)) {
        const newLevel = {
          id: voc.id,
          kanji: kanji,
          vocabulary: voc.kanji,
          level: 2
        }

        const isDuplicate = jlptLevel.find(({id}) => id === voc.id)
        if(!isDuplicate) {
          jlptLevel.push(newLevel)
        }
      }
    })

  })
  setLevelToUpdate(jlptLevel)
  console.log(jlptLevel)
}




////////// Function to create verb SQL lines
const handleSqlVerbs = (verbs) => {
  const list = []

  function checkIsFrenchVerb(word) {
    // Exemple simple : vérifie si le mot se termine par "er", "ir" ou "re".
    const verbEndings = ['er', 'ir', 're', 'oir'];
    return verbEndings.some(ending => word.endsWith(ending));
  }

  verbs.forEach(element => {
    const verbEnd = element.japanese[element.japanese.length - 1]
    const verbBeforeEnd = element.japanese[element.japanese.length - 2]
    let kanjiRoot
    let japaneseRoot
    if(verbEnd === 'る' && verbBeforeEnd === 'す') {
      kanjiRoot = element.kanji.slice(0, -2)
      japaneseRoot = element.japanese.slice(0, -2)
    } else {
      kanjiRoot = element.kanji.slice(0, -1)
      japaneseRoot = element.japanese.slice(0, -1)
    }
    kanjiRoot.replace('/', '').replace(' ', '')
    japaneseRoot.replace('/', '').replace(' ', '')

    const isFrenchVerb = checkIsFrenchVerb(element.french)

    if(isFrenchVerb) {
      console.log('kanjiRoot, japaneseRoot, verbEnd : ', element.french, kanjiRoot, japaneseRoot, verbEnd)
      const line = `INSERT INTO \`verb\` (\`kanji_root\`, \`japanese_root\`, \`english\`, \`french\`, \`suru\`, \`nai\`, \`ta\`, \`nakatta\`, \`masu\`, \`masen\`, \`mashita\`, \`masendeshita\`, \`te\`) VALUES ("${kanjiRoot}","${japaneseRoot}","${element.english}","${element.french}","${element.japanese}","${element.japanese}k","${element.japanese}p","${element.japanese}m","${element.japanese}n","${element.japanese}q","${element.japanese}s","${element.japanese}z","${element.japanese}w");`
      list.push(line)
    }
  });
  return list
} 




////////// Function to create a new line to insert extra vocabulary
const handleToInsert = (word) => {
  let newLine = ` INSERT INTO \`vocabulary_extra\` (\`kanji\`, \`japanese\`, \`english\`, \`french\`, \`romaji\`, \`categories\`, \`level\`, \`reported\`) VALUES ('${word.kanji}', '${word.japanese}', '', '${word.french}', '', '${word.categories}', ${word.level}, 0);`
  return newLine
}



////////// Render to optimise the copy-paste code to insert extra vocabulary (80 lines by 80 lines)
<div className=''>
        {
          toInsert.map((e, index) => (
            index <= 80 ?
            <p className='bg-blue-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 80 && index <= 160) ?
            <p className='bg-yellow-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 160 && index <= 240) ?
            <p className='bg-pink-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 240 && index <= 320) ?
            <p className='bg-orange-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 320 && index <= 400) ?
            <p className='bg-yellow-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 400 && index <= 480) ?
            <p className='bg-red-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 480 && index <= 560) ?
            <p className='bg-green-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 560 && index <= 640) ?
            <p className='bg-blue-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 640 && index <= 720) ?
            <p className='bg-green-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 720 && index <= 800) ?
            <p className='bg-pink-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 800 && index <= 880) ?
            <p className='bg-yellow-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 880 && index <= 960) ?
            <p className='bg-red-500'>
              {handleToInsert(e)}
            </p>
            :
            (index > 960 && index <= 1040) ?
            <p className='bg-green-500'>
              {handleToInsert(e)}
            </p>
            :
            <p className='bg-blue-500'>
              {handleToInsert(e)}
            </p>
          ))
        }
      </div>



////////// TEST WEB SPEECH 

  const [recognizedText, setRecognizedText] = useState('');
  const [responseText, setResponseText] = useState('');

  // Reconnaissance vocale (Speech-to-Text)
  const startRecognition = () => {
    console.log('----- FUNCTION START RECOGNITION')
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ja-JP'; // Paramétrer la langue pour le japonais
    recognition.interimResults = false; // Ne pas afficher les résultats intermédiaires
    recognition.maxAlternatives = 1; // Limiter à une seule alternative

console.log('recognition : ', recognition)

    recognition.onresult = (event) => {
      console.log(',,,,,, RECOGNITION on result :')
      console.log('on result event : ', event)
      const spokenText = event.results[0][0].transcript;
      console.log('spokenText ON RESULT : ', spokenText)
      setRecognizedText(spokenText);
      // getChatGPTResponse(spokenText); // Envoyer le texte reconnu à ChatGPT
    };

    // Arrêter la reconnaissance vocale lorsque la voix n'est plus détectée
    recognition.onspeechend = () => {
      console.log('SPEECH END')
      recognition.stop();
    };

    // Gérer les erreurs éventuelles
    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      recognition.stop();
    };

    recognition.start();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    window.speechSynthesis.speak(utterance)
  } 

  // Simulation de l'appel à ChatGPT (à remplacer par un appel API réel)
  const getChatGPTResponse = (userInput) => {
    // Remplace cette partie par un appel API à OpenAI pour obtenir une vraie réponse
    const response = "これは日本の四季についての簡単な説明です。"; // Exemple de réponse en japonais
    setResponseText(response);
    speak(response); // Lire la réponse à haute voix
  };

  useEffect(() => {
    console.log('USE EFFECT -------')
    if(recognizedText) {
      console.log('--- USE EFFECT IN IF ---')
      speak(recognizedText)
    }
  }, [recognizedText])

//   <button className='px-3 py-2 bg-yellow-400 text-black w-auto' onClick={() => speak('夏休み、友達と飛行機で友達の家に行った。とても楽しかったんです。')}>TEST AUDIO</button>
//   <button onClick={startRecognition}>Parler</button>
// <p>Vous avez dit : <span>{recognizedText}</span></p>
// <p>Réponse du bot : <span>{responseText}</span></p>


////////// KANJI ALIVE API FETCH
const getJlpt = async () => {
  setIsLoading(true)
  try {
    var options = {
      method: "GET",
      headers: {
        "x-rapidapi-host": "kanjialive-api.p.rapidapi.com",
        "x-rapidapi-key": "c517579b20msh63e501ae7b97cbbp1cd781jsn9316dfcc66ca",
      },
    };
    const response = await fetch('https://kanjialive-api.p.rapidapi.com/api/public/search/advanced/?grade=6', options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dataJlpt = await response.json();
    if(dataJlpt) {
      SetJlpt(dataJlpt)
      setIsLoading(false)
    }
  } catch(err) {
    console.error(err)
  }
}  

const getKanji = async (kanji) => {
  try {
    var options = {
      method: "GET",
      // url: `https://kanjialive-api.p.rapidapi.com/api/public/kanji/月`,
      headers: {
        "x-rapidapi-host": "kanjialive-api.p.rapidapi.com",
        "x-rapidapi-key": "c517579b20msh63e501ae7b97cbbp1cd781jsn9316dfcc66ca",
      },
    };
    // 満  月
    const response = await fetch(`https://kanjialive-api.p.rapidapi.com/api/public/kanji/${kanji}`, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if(data) {
      const radicalHistoryList = []
      const strokesImagesList = []

      const kanjiModel = {
        kanji: data.kanji.character,
        kunyomi: data.kanji.kunyomi.hiragana,
        onyomi: data.kanji.onyomi.katakana,
        english: data.kanji.meaning.english,
        french: "",
        italian: "",
        german: "",
        spanish: "",
        romaji: "",
        strokes: data.kanji.strokes.count,
        strokes_images: null,
        video_poster: data.kanji.video.poster,
        video_mp4: data.kanji.video.mp4,
        video_webm: data.kanji.video.webm,
        radical: data.radical.character,
        radical_history_images: null,
        hint: data.mn_hint,
        level: (parseInt(data.grade) + 5) - parseInt(data.grade),
        grade: data.grade,
      }

      data.radical.animation.forEach(e => {
        radicalHistoryList.push(e)
      })

      data.kanji.strokes.images.forEach(e => {
        strokesImagesList.push(e)
      })

      kanjiModel.radical_history_images = radicalHistoryList.join('; ')
      kanjiModel.strokes_images = strokesImagesList.join('; ')

      data.examples.forEach(e => {
        const newExample = {
          japanese: e.japanese,
          english: e.meaning.english,
          audio_mp3: e.audio.mp3,
          audio_opus: e.audio.opus,
          audio_aac: e.audio.aac,
          audio_ogg: e.audio.ogg,
        }
        setExamples(prev => [...prev, newExample])
      }) 
      setKanjiList(prev => [...prev, kanjiModel])
    }
  } catch(err) {
    console.error(err)
  }
}  

const submitList = async (kanjiList) => {
  setIsLoading(true)
  try {
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({newKanji: kanjiList})
    };
    const response = await fetch('${process.env.REACT_APP_API}/kanji/kanji', options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      const result = await response.json();
      console.log('result : ', result)
      setIsLoading(false)
  } catch(err) {
    console.error(err)
  }
}

const submitUniqueList = async (kanji) => {
  try {
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({newKanji: kanji})
    };
    const response = await fetch('${process.env.REACT_APP_API}/kanji/kanjiOnce', options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      const result = await response.json();
      console.log('result : ', result)
  } catch(err) {
    console.error(err)
  }
}

const Line = ({kanji, index}) => {
  let colorStyle
  if(index < 11) {
    colorStyle = "yellow"
  } else if(index < 22) {
    colorStyle = "red"
  } else if(index < 33) {
    colorStyle = "blue"
  } else if(index < 44) {
    colorStyle = "pink"
  } else if(index < 55) {
    colorStyle = "green"
  } else if(index < 66) {
    colorStyle = "orange"
  } else if(index < 77) {
    colorStyle = "purple"
  } else if(index < 88) {
    colorStyle = "purple"
  } else if(index < 99) {
    colorStyle = "purple"
  }

  return (
    <p style={{color: colorStyle}}>INSERT INTO `new_kanji` (`kanji`,`kunyomi`,`onyomi`,`english`,`french`,`italian`,`german`,`spanish`,`romaji`,`strokes`,`strokes_images`,`video_poster`,`video_mp4`,`video_webm`,`radical`,`radical_history_images`,`hint`,`level`,`grade`) VALUES (`{kanji.kanji}`,`{kanji.kunyomi}`,`{kanji.onyomi}`,`{kanji.english}`,`{kanji.french}`,`{kanji.italian}`,`{kanji.german}`,`{kanji.spanish}`,`{kanji.romaji}`,{parseInt(kanji.strokes)},`{kanji.strokes_images}`,`{kanji.video_poster}`,`{kanji.video_mp4}`,`{kanji.video_webm}`,`{kanji.radical}`,`{kanji.radical_history_images}`,`{kanji.hint}`,{parseInt(kanji.level)},{parseInt(kanji.grade)});</p>
  )
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchKanjiDetails = async () => {
  if (jlpt.length > 0) {
    setIsLoading(true);
    let counter = 0
    for (const e of jlpt) {
      counter += 1
      await getKanji(e.kanji.character);
      await sleep(200)
      if(counter % 10 === 0) {
        await sleep(3000)
      }
    }

    setIsLoading(false);
  }
}

const submitEachKanji = async () => {
  setIsLoading(true);
  for (const e of kanjiList) {
    await submitUniqueList(e);
  }
  setIsLoading(false);
}

const updateKanji = async (kanjiProps, translationProps) => {
  try {
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kanji: kanjiProps,
        level: 3,
        translation: translationProps
      })
    }

    const response = await fetch('${process.env.REACT_APP_API}/kanji/updateKanjiOnce', options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      const result = await response.json();
      console.log('result : ', result)
  } catch(err) {
    console.error(err)
  }
}

// LIENS BACK:
// ${process.env.REACT_APP_API}
// ${process.env.REACT_APP_API}

// INSERT INTO `story`(`audio_link`, `answer_id`, `images_basic_links`, `images_status_links`, `images_labels_japanese`, `images_labels_kanji`, `question_text_kanji`, `question_text_japanese`, `level`, `original_link`, `original_author`) VALUES ('[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-11]','[value-13]','[value-15]','[value-16]')
// INSERT INTO `story`(`audio_link`, `answer_id`, `images_basic_links`, `images_status_links`, `images_labels_japanese`, `images_labels_kanji`, `question_text_kanji`, `question_text_japanese`, `level`, `original_link`, `original_author`) VALUES ('assets/audio/audio-jlpt-n5-11.mp3', 2,'assets/images/jlpt-n5-q11/q-jlpt-n5-11-1.jpg;assets/images/jlpt-n5-q11/q-jlpt-n5-11-2.jpg;assets/images/jlpt-n5-q11/q-jlpt-n5-11-3.jpg;assets/images/jlpt-n5-q11/q-jlpt-n5-11-4.jpg','assets/images/jlpt-n5-q11/q-jlpt-n5-11-1-s.jpg;assets/images/jlpt-n5-q11/q-jlpt-n5-11-2-s.jpg;assets/images/jlpt-n5-q11/q-jlpt-n5-11-3-s.jpg;assets/images/jlpt-n5-q11/q-jlpt-n5-11-4-s.jpg', 'りょうしん;あね;いもうと;おとうと', '両親;姉;妹;弟','男の学生は誰と住んでいますか。','おとこのがくせいはだれとすんでいますか。', 5, 'https://www.youtube.com/watch?v=2aqVJS6QOoY','Japanichiwa')
