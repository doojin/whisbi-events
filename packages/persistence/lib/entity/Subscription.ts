import Event from './Event'
import User from './User'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export default class Subscription {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ charset: 'utf8' })
  name!: string

  @Column({ charset: 'utf8' })
  email!: string

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  event!: Event

  @ManyToOne(() => User)
  user!: User
}
