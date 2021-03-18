import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import EventState from './EventState'
import User from './User'

@Entity()
export default class Event {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  headline!: string

  @Column()
  description!: string

  @Column()
  startDate!: Date

  @Column()
  location!: string

  @Column({ type: 'enum', enum: EventState })
  state!: EventState

  @ManyToOne(() => User, user => user.events)
  user!: User
}
