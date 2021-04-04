import React from 'react'
import { GoogleLogin } from 'react-google-login'
import { setUser } from './store/slice/user'
import whisbiApi from './api/whisbi'
import { useDispatch } from 'react-redux'

export default function LoginButton () {
  const dispatch = useDispatch()

  const onSuccess = async response => {
    const user = await whisbiApi.authenticate(response.accessToken)
    dispatch(setUser(user))
  }

  return <GoogleLogin clientId="166448680162-nflkph4e527pql7evjjqilhm4snhffmc.apps.googleusercontent.com"
                      onSuccess={onSuccess} />
}
