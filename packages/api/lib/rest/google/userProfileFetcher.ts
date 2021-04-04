import { google, oauth2_v2 } from 'googleapis'
import UserInfo = oauth2_v2.Schema$Userinfo

export default {
  async fetch (googleAccessToken: string): Promise<UserInfo> {
    const oauthClient = new google.auth.OAuth2()
    oauthClient.setCredentials({ access_token: googleAccessToken })

    const oauth2 = google.oauth2({
      auth: oauthClient,
      version: 'v2'
    })

    return new Promise((resolve, reject) => {
      oauth2.userinfo.get((err, info) => {
        if (err !== null) {
          reject(err)
          return
        }

        if (info === null || info === undefined) {
          reject(new Error('Cannot fetch user profile'))
          return
        }

        resolve(info.data)
      })
    })
  }
}
