import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm'
import Token from './Token'
import Event from './Event'

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  photo!: string

  @OneToOne(() => Token, token => token.user)
  token!: Token

  @OneToMany(() => Event, event => event.user)
  events!: Event[]

  @Column({ nullable: true })
  googleId?: string
}
