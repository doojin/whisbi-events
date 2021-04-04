import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm'
import Token from './Token'
import Event from './Event'

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ charset: 'utf8' })
  name!: string

  @Column({ charset: 'utf8' })
  photo!: string

  @OneToOne(() => Token, token => token.user)
  token!: Token

  @OneToMany(() => Event, event => event.user)
  events!: Event[]

  @Column({ nullable: true, charset: 'utf8' })
  googleId?: string
}
