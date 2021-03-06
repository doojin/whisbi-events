import notifications from '../notifications'

const apiAddress = `http://${window.location.hostname}:8000/api/v1`

async function getResponseData (response) {
  let data

  try {
    data = await response.json()
  } catch (e) {
    data = null
  }

  if (data && data.error) {
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

  async updateEvent (eventId, event, token) {
    const headers = {
      'Content-Type': 'application/json',
      token
    }

    const response = await fetch(`${apiAddress}/event/${eventId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(event)
    })

    return getResponseData(response)
  },

  async getEvent (id, token) {
    const headers = { token }
    const response = await fetch(`${apiAddress}/event/${id}`, { headers })
    return getResponseData(response)
  },

  async subscribe (eventId, subscription, token) {
    const headers = {
      'Content-Type': 'application/json',
      token
    }

    const response = await fetch(`${apiAddress}/event/${eventId}/subscription`, {
      method: 'POST',
      headers,
      body: JSON.stringify(subscription)
    })

    return getResponseData(response)
  },

  async getUserEvents (token) {
    const headers = { token }
    const response = await fetch(`${apiAddress}/user/event`, { headers })
    return getResponseData(response)
  },

  async getUserSubscriptions (token) {
    const headers = { token }
    const response = await fetch(`${apiAddress}/user/subscription`, { headers })
    return getResponseData(response)
  },

  async deleteEvent (eventId, token) {
    const headers = { token }
    const response = await fetch(`${apiAddress}/event/${eventId}`, {
      method: 'DELETE',
      headers
    })
    return getResponseData(response)
  },

  async deleteSubscription (subscriptionId, token) {
    const headers = { token }
    const response = await fetch(`${apiAddress}/subscription/${subscriptionId}`, {
      method: 'DELETE',
      headers
    })
    return getResponseData(response)
  }
}
