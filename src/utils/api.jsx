// Packages
import Swal from "sweetalert2";

/**
 * Fetch Exercice Datas
 * @param {string} dbType - Exercice DB table name
 * @param {number} level - Exercice level
 * @param {number} limit - Limit
 * @param {number} tokens - User tokens
 * @param {function} navigate - Handle navigation
 */
export const fetchData = async (dbType, level, limit, tokens, navigate) => {
    try {
      if(tokens === 0) {
        Swal.fire({
          title: "Jetons insuffisants",
          text: "Vous n'avez plus assez de jetons pour cet exercice",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#653C87",
          confirmButtonText: "Ajouter des jetons"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/shop')
          } else {
            navigate('/')
          }
        });
      } else {
        const options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        const query = `${process.env.REACT_APP_API}/${dbType}?level=${level}&limit=${limit}`
  
        const response = await fetch(query, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data
      }
    } catch (error) {
      console.error('error : ', error)
    }
}

/**
 * Update user tokens
 * @param {number} number - Tokens to decrease
 * @param {number} daily_tokens - Available user daily tokens
 * @param {number} tokens - User total tokens number
 * @param {number} userId - User ID
 * @param {function} dispatch - Dispatch function
 * @param {string} action - Action to do ("add" or "reduce")
 * @param {boolean} shop - Indicate if action comes from shop (optionnal)
 */
export const updateTokens = async (number, daily_tokens, tokens, userId, dispatch, action, shop = false) => {
  try {
    let updatedDailyTokens = daily_tokens;
    let updatedTokens = tokens;

    if (action === "reduce") {
      if (daily_tokens > 0) {
        updatedDailyTokens = parseInt(daily_tokens) - number;
        dispatch({ type: 'UPDATE_DAILY_TOKENS', payload: parseInt(daily_tokens) - number });
        sessionStorage.setItem('user_daily_tokens', parseInt(daily_tokens) - number);
      } else {
        updatedTokens = tokens - number;
      }
    } else if (action === "add") {
      updatedTokens = tokens + number;
    } 
     
    if (daily_tokens <= 0 || action === "add") {
      const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenNumber: updatedTokens,
          userId: userId,
        }),
      };

      const query = `${process.env.REACT_APP_API}/user/tokenManager`;
      const response = await fetch(query, options);

      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
        dispatch({ type: 'UPDATE_TOKENS', payload: updatedTokens });
        sessionStorage.setItem('user_tokens', updatedTokens);

        if(shop) {
          Swal.fire({
            title: "Opération réussie",
            text: "Vous pouvez désormais à nouveau faire des exercices",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#027800",
            confirmButtonText: "Ok"
          })
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

/**
 * Update user stats
 * @param {string} type - Exercice type
 * @param {boolean} status - Answer status
 * @param {number} userId - User ID
 * @param {number} exerciceId - Exercice ID (optionnal)
 */
export const updateStats = async (type, status, userId, exerciceId = null) => {
  try {
    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciceId: exerciceId,
        status: status ? 'correct' : 'wrong',
        type: type,
        userId: userId,
      })
    }
    let query = `${process.env.REACT_APP_API}`
    if(exerciceId) {
      query += '/es//update'
    } else {
      query += '/egs/'
    }
    const response = await fetch(query, options);

    if (!response.ok) {
      Swal.fire("Erreur lors de l'opération");
      throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.ok) {
    }
  } catch(err) {
    console.error(err)
  }
}