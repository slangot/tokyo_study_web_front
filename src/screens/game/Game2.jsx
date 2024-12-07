import React, { useEffect, useState } from 'react'


// Packages
import Swal from 'sweetalert2'

const Game2 = () => {
  const sendEmail = async (email) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        })
      }
      const query = `${process.env.REACT_APP_API}/user/testemail`
      const response = await fetch(query, options);

      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log(response)
      }
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <section className='flex flex-col gap-5 items-center'>
          <button
            className='flex relative px-10 py-5 rounded-lg font-bold bg-primary w-auto justify-center'
            // onClick={() => sendEmail('sylvain.langot@yahoo.fr')}
            onClick={() => sendEmail('shawn17@live.fr')}
          >EMAIL</button>
    </section>
  )
}

export default Game2