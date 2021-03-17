import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import User from './User'

@Entity()
export default class Token {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  value!: string

  @OneToOne(() => User, user => user.token)
  @JoinColumn()
  user!: User
}
