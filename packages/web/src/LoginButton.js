import React from 'react'
import { GoogleLogin } from 'react-google-login'

export default function LoginButton () {
  const onSuccess = response => {
    console.log(response.accessToken)
  }

  return (
    <GoogleLogin clientId="166448680162-nflkph4e527pql7evjjqilhm4snhffmc.apps.googleusercontent.com"
                 onSuccess={onSuccess} />
  )
}
