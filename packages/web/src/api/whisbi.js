import notifications from '../notifications'

const apiAddress = 'http://localhost:8000/api/v1'

async function getResponseData (response) {
  const data = await response.json()

  if (data.error) {
    notifications.error(data.error)
    throw new Error(data.error)
  }

  if (!response.ok) {
    notifications.error(response.statusText)
    throw new Error(response.statusText)
  }

  return data
}

export default {
  async authenticate (googleAccessToken) {
    const response = await fetch(`${apiAddress}/authentication/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ googleToken: googleAccessToken })
    })

    return getResponseData(response)
  },

  async getEvents (token) {
    const headers = token ? { token } : {}
    const response = await fetch(`${apiAddress}/event`, { headers })
    return getResponseData(response)
  },

  async createEvent (event, token) {
    const headers = {
      'Content-Type': 'application/json',
      token
    }

    const response = await fetch(`${apiAddress}/event`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event)
    })

    return getResponseData(response)
  },

  async getEvent (id, token) {
    const headers = { token }
    const response = await fetch(`${apiAddress}/event/${id}`, { headers })
    return getResponseData(response)
  }
}
