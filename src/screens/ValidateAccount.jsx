import React, { useEffect } from 'react'

// Packages
import { RotatingLines } from "react-loader-spinner"
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const useSearchParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const ValidateAccount = () => {
  const navigate = useNavigate()

    // Params
    const searchParams = useSearchParams();
    const tokenEmail = searchParams.get("pts");

  const validateEmail = async (token) => {
    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token
        })
      }

      const query = `${process.env.REACT_APP_API}/user/tokenManager`
      const response = await fetch(query, options);
  
      if (!response.ok) {
        Swal.fire("Erreur lors de l'opération");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.ok) {
        // navigate('/login')
        Swal.fire("Email validé");
      }
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if(tokenEmail) {
      validateEmail(tokenEmail)
    }
  }, [tokenEmail])
  return (
    <div>
      <h1>PAGE DE VALIDATION DU COMPTE ET DE l'EMAIL</h1>
    </div>
  )
}

export default ValidateAccount