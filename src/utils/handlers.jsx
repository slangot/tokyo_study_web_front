export const randomizeNumber = (length) => {
  const randomNumbers = [];

  while (randomNumbers.length < 4) {
    const randomNum = Math.floor(Math.random() * length);
    if (!randomNumbers.includes(randomNum)) {
      randomNumbers.push(randomNum);
    }
  }
  return randomNumbers;
}

export const randomizeData = (data) => {
  const randomData = data.sort(() => Math.random() - 0.5);
  return randomData;
}

export const manageScore = (isCorrect, score, setScore, scoreMax, setScoreMax) => {
  if (isCorrect) {
    setScore(score + 1);
    setScoreMax(scoreMax + 1);
  } else {
    setScoreMax(scoreMax + 1);
  }
}

export const dbType = (exerciceType, level) => {
  switch (exerciceType) {
    case "vocabulary":
      return level === "6" ? "vocabulary_extra" : "vocabulary";
    case "grammar":
      return "grammar";
    case "sentence":
      return level === "6" ? "sentence_extra" : "sentence";
    default:
      return "vocabulary";
  }
}