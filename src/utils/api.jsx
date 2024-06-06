export const apiAllowedTypes = ["grammar", "grammar_examples", "sentence", "sentence_extra", "vocabulary", "vocabulary_extra", "kanji"]
export const apiAllowedColumns = ["kanji", "japanese", "english", "french", "romaji", "categories", "level", "reported", "isAnswer", "words", "grammar", "base", "form", "rule_english", "rule_french", "subrule_english", "subrule_french", "grammar_id"]

export const getApi2 = async (method, type, level, count, limit) => {
  try {
    const options = {
      method: `${method}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let query = `http://localhost:3001/${type}`
    if(count) {
      query += `/count?`
    }
    query += `?level=${level}&limit=${limit}`

    fetch(query, options)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          return data
        }
      })
  } catch (error) {
    console.error("error : ", error)
  }
}

export const getApi = async (type, level, count, limit, kanji) => {
  let apiUrl = `/api/get?type=${type}`
  count && (apiUrl += `&count=true`)
  level && (apiUrl += `&level=${level}`)
  limit && (apiUrl += `&limit=${limit}`)
  kanji && (apiUrl += `&kanji=true`)

  const result = await fetch(apiUrl)
  const data = await result.json()
  return data
}

export const postApi = async (type, data) => {
  const result = await fetch(`/api/post?type=${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  const response = await result.json()
  return response
}

export const putApi = async (type, column, value, id) => {

  const data = { column: column, value: value, id: id }
  const result = await fetch(`/api/update?type=${type}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  const response = await result.json()
  return response
}