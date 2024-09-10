import {useEffect, useState} from 'react'

// Context
import{ useUser } from '../context/UserContext'

// Package
import { RotatingLines } from "react-loader-spinner"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// UiKit
import { ExerciceHeader } from '../uikit/Blocks';
import { ActionButton } from '../uikit/Buttons';

// Utils
import { generateRandomNumber } from "../utils/functions"

const Date = () => {
  const { state, dispatch } = useUser();
  const user = state.user
  const navigate = useNavigate()

  const [generatedDate, setGeneratedDate] = useState()
  const [verify, setVerify] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

const days = {
  1: {
    japanese: 'ついたち',
    kanji: '一日',
    number: '1日'
  },
  2: {
    japanese: 'ふつか',
    kanji: '二日',
    number: '2日'
  },
  3: {
    japanese: 'みっか',
    kanji: '三日',
    number: '3日'
  },
  4: {
    japanese: 'よっか',
    kanji: '四日',
    number: '4日'
  },
  5: {
    japanese: 'いつか',
    kanji: '五日',
    number: '5日'
  },
  6: {
    japanese: 'むいか',
    kanji: '六日',
    number: '6日'
  },
  7: {
    japanese: 'なのか',
    kanji: '七日',
    number: '7日'
  },
  8: {
    japanese: 'ようか',
    kanji: '八日',
    number: '8日'
  },
  9: {
    japanese: 'ここのか',
    kanji: '九日',
    number: '9日'
  },
  10: {
    japanese: 'とおか',
    kanji: '十日',
    number: '10日'
  },
  11: {
    japanese: 'じゅういちにち',
    kanji: '十一日',
    number: '11日'
  },
  12: {
    japanese: 'じゅうににち',
    kanji: '十二日',
    number: '12日'
  },
  13: {
    japanese: 'じゅうさんにち',
    kanji: '十三日',
    number: '13日'
  },
  14: {
    japanese: 'じゅうよっか',
    kanji: '十四日',
    number: '14日'
  },
  15: {
    japanese: 'じゅうごにち',
    kanji: '十五日',
    number: '15日'
  },
  16: {
    japanese: 'じゅうろくにち',
    kanji: '十六日',
    number: '16日'
  },
  17: {
    japanese: 'じゅうしちにち',
    kanji: '十七日',
    number: '17日'
  },
  18: {
    japanese: 'じゅうはちにち',
    kanji: '十八日',
    number: '18日'
  },
  19: {
    japanese: 'じゅうくにち',
    kanji: '十九日',
    number: '19日'
  },
  20: {
    japanese: 'はつか',
    kanji: '二十日',
    number: '20日'
  },
  21: {
    japanese: 'にじゅういちにち',
    kanji: '二十一日',
    number: '21日'
  },
  22: {
    japanese: 'にじゅうににち',
    kanji: '二十二日',
    number: '22日'
  },
  23: {
    japanese: 'にじゅうさんにち',
    kanji: '二十三一',
    number: '23日'
  },
  24: {
    japanese: 'にじゅうよっか',
    kanji: '二十四日',
    number: '24日'
  },
  25: {
    japanese: 'にじゅうごにち',
    kanji: '二十五日',
    number: '25日'
  },
  26: {
    japanese: 'にじゅうろくにち',
    kanji: '二十六日',
    number: '26日'
  },
  27: {
    japanese: 'にじゅうしちにち',
    kanji: '二十七日',
    number: '27日'
  },
  28: {
    japanese: 'にじゅうはちにち',
    kanji: '二十八日',
    number: '28日'
  },
  29: {
    japanese: 'にじゅうくにち',
    kanji: '二十九日',
    number: '29日'
  },
  30: {
    japanese: 'さんじゅうにち',
    kanji: '三十日',
    number: '30日'
  },
  31: {
    japanese: 'さんじゅういちにち',
    kanji: '三十一日',
    number: '31日'
  }
}

const months = {
  1: {
    japanese: 'いちがつ',
    kanji: '一月',
    french: 'janvier',
    number: '1月'
  },
  2: {
    japanese: 'にがつ',
    kanji: '二月',
    french: 'février',
    number: '2月'
  },
  3: {
    japanese: 'さんがつ',
    kanji: '三月',
    french: 'mars',
    number: '3月'
  },
  4: {
    japanese: 'しがつ',
    kanji: '四月',
    french: 'avril',
    number: '4月'
  },
  5: {
    japanese: 'ごがつ',
    kanji: '五月',
    french: 'mai',
    number: '5月'
  },
  6: {
    japanese: 'ろくがつ',
    kanji: '六月',
    french: 'juin',
    number: '6月'
  },
  7: {
    japanese: 'しちがつ',
    kanji: '七月',
    french: 'juillet',
    number: '7月'
  },
  8: {
    japanese: 'はちがつ',
    kanji: '八月',
    french: 'août',
    number: '8月'
  },
  9: {
    japanese: 'くがつ',
    kanji: '九月',
    french: 'septembre',
    number: '9月'
  },
  10: {
    japanese: 'じゅうがつ',
    kanji: '十月',
    french: 'octobre',
    number: '10月'
  },
  11: {
    japanese: 'じゅういちがつ',
    kanji: '十一月',
    french: 'novembre',
    number: '11月'
  },
  12: {
    japanese: 'じゅうにがつ',
    kanji: '十二月',
    french: 'décembre',
    number: '12月'
  },
}

const generateDate = () => {
  const generatedYear = generateRandomNumber(150)
  const generatedMonth = generateRandomNumber(12);
  const generatedDays = generateRandomNumber(31);
  const fullGeneratedYear = (generatedYear + 1900)

  const newDate = {
    number: fullGeneratedYear + '年' + months[generatedMonth].number + days[generatedDays].number,
    kanji: fullGeneratedYear + '年' + months[generatedMonth].kanji + days[generatedDays].kanji,
    japanese: fullGeneratedYear + '年' + months[generatedMonth].japanese + days[generatedDays].japanese,
    alternative: fullGeneratedYear + '/' +generatedMonth + '/' + generatedDays
  };

  return newDate;
};

const handleNext = () => {
  dispatch({ type: 'UPDATE_TOKEN', payload: user.token - 1 });
  setVerify(false)
  setGeneratedDate(generateDate());
}

const handleVerify = () => {
    setVerify(!verify)
}

useEffect(() => {
  setGeneratedDate(generateDate());
  setIsLoading(false)
}, []);

useEffect(() => {
  if(user.token <= 0) {
    Swal.fire({
      title: "Jetons insuffisants",
      text: "Vous n'avez plus assez de jetons pour cet exercice",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#9d5f02",
      confirmButtonText: "Ajouter des jetons"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/shop')
      } else {
        navigate('/')
      }
    });
  }
}, [user])

  return (
    <section className='section-bottom flex flex-col'>
      <ExerciceHeader title="Quel jour est-il ?" />
      {isLoading ? (
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
        ) : (
      generatedDate && 
      <div className='flex flex-col bg-third text-white items-center'>
        <h2 className='font-bold text-3xl md:text-5xl my-5'>{generatedDate.alternative}</h2>
        {verify && <>
          <h4 className='font-bold text-2xl md:text-3xl'>{generatedDate.kanji}</h4>
          <p className='w-[90%] font-bold text-center text-xl my-5' >{generatedDate.japanese}</p>
        </>
        }
      </div>
      )}
      <div className='absolute bottom-10 w-full flex flex-row justify-center gap-10 md:gap-5 mt-10'>
      {generatedDate && 
        <ActionButton style="bg-gold" action={() => handleVerify()} text={verify ? 'Cacher' : 'Vérifier'} />
      }
      <ActionButton style="bg-blue-600" action={() => handleNext()} text={!generatedDate ? 'Commencer' : 'Suivant'} />
      </div>
    </section>
  )
}

export default Date