import { useEffect, useState } from 'react'

// Context
import { useUser } from '../context/UserContext'

// Packages
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'

export const PrivateRoute = () => {
  const logo = require('../assets/logo-v3.png')
  const { state, dispatch } = useUser()
  const user = state.user

  const navigate = useNavigate()
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    const testAuth = async () => {
      if (sessionStorage.getItem('user_session')) {
        const userToken = sessionStorage.getItem('user_session')
        const userTokenSplitted = userToken.split('\"')
        const currentLatestConnection = sessionStorage.getItem('user_latest_connection')
        const currentDailyTokens = sessionStorage.getItem('user_daily_tokens')
        try {
          const options = {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${userTokenSplitted[1]}`,
              'Content-Type': 'application/json',
            },
          };
          const result = await fetch(`${process.env.REACT_APP_API}/auth/protected`, options)
          if (!result.ok) {
            dispatch({ type: 'LOGOUT' });
            sessionStorage.clear()
            sessionStorage.setItem('user_latest_connection', currentLatestConnection)
            sessionStorage.setItem('user_daily_tokens', currentDailyTokens)
            navigate('/login')
          }
          setLoader(false)
        } catch (error) {
          dispatch({ type: 'LOGOUT' });
          sessionStorage.clear()
          console.error(error)
          sessionStorage.setItem('user_latest_connection', currentLatestConnection)
          sessionStorage.setItem('user_daily_tokens', currentDailyTokens)
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    }
    testAuth()
  }, [user])

  return (
    <>
      {loader ?
        <div className='flex flex-col items-center justify-center h-[100dvh]'>
          <img src={logo} alt="Tokyo Study logo" width='50%' height={'auto'} className="object-contain mt-0" />
          <h1 className='mt-5 mb-10 text-2xl'>Votre session a expiré.</h1>
          <Link className='py-3 px-5 rounded-xl bg-medium-blue text-white' to='/login'>Se reconnecter</Link>
        </div>
        :
        sessionStorage.getItem('user_session') ? <Outlet /> : <Navigate to='/login' />}
    </>
  )
}