import { Handler, Request, Response } from 'express'
import asyncHandler from '../error/asyncHandler'
import { getUserRepository } from '@whisbi-events/persistence'
import userProfileFetcher from '../google/userProfileFetcher'
import userFactory from '../factory/user'

const googleAuthentication: Handler = async (req: Request, res: Response): Promise<void> => {
  const googleAccessToken = req.body.googleToken as string
  const userInfo = await userProfileFetcher.fetch(googleAccessToken)

  const googleId = userInfo.id as string
  const name = userInfo.name as string
  const photo = userInfo.picture as string

  let user = await getUserRepository().findByGoogleId(googleId)

  if (user === undefined) {
    user = await userFactory.create({ name, photo }, googleId)
  }

  res.json(user)
}

export default asyncHandler(googleAuthentication)
