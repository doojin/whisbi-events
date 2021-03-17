import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import Token from './Token'

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
}
