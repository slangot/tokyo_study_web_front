import React from 'react'

// Context
import{ useUser } from '../context/UserContext'

const Shop = () => {
  const { state, dispatch } = useUser();
  const user = state.user

  const addTokens = () => {
    dispatch({ type: 'UPDATE_TOKEN', payload: user.token + 3 });
  }

  return (
    <section className='flex flex-col items-center bg-yellow-400 w-full h-[100dvh]'>
      <h1>LE SHOOOOOOP</h1>
      <h2>Vous disposez de {user.token} jeton{user.token > 1 ? 's' : ''}</h2>
      <button className='py-3 px-5 bg-primary text-white' onClick={() => addTokens()}>Recharger les jetons</button>
      <button className='py-3 px-5 bg-gold text-white' onClick={() => addTokens()}>Regarder une pub (+10 jetons)</button>
    </section>
  )
}

export default Shop