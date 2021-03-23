import Event from './Event'
import User from './User'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export default class Subscription {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  email!: string

  @ManyToOne(() => Event)
  event!: Event

  @ManyToOne(() => User)
  user!: User
}
