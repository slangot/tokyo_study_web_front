import { useEffect, useState } from 'react'

// Context
import { useUser } from '../context/UserContext'

// Packages
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'

export const PrivateRoute = () => {
  const logo = require('../assets/logo-v2.png')
  const { state, dispatch } = useUser()
  const user = state.user

  const navigate = useNavigate()
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    const testAuth = async () => {
      if (user?.connectionToken) {

        try {
          const options = {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.connectionToken}`,
              'Content-Type': 'application/json',
            },
          };
          const result = await fetch(`https://www.data.tsw.konecton.com/auth/protected`, options)
          if (!result.ok) {
            dispatch({ type: 'LOGOUT' });
            navigate('/login')
          }
          setLoader(false)
        } catch (error) {
          dispatch({ type: 'LOGOUT' });
          console.error(error)
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
          <Link className='py-3 px-5 rounded-xl bg-primary text-white' to='/login'>Se reconnecter</Link>
        </div>
        :
        user && user?.connectionToken ? <Outlet /> : <Navigate to='/login' />}
    </>
  )
}