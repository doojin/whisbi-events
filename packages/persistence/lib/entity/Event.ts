import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import EventState from './EventState'
import User from './User'

@Entity()
export default class Event {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ charset: 'utf8' })
  headline!: string

  @Column({ charset: 'utf8' })
  description!: string

  @Column()
  startDate!: Date

  @Column({ charset: 'utf8' })
  location!: string

  @Column({ type: 'enum', enum: EventState, default: EventState.DRAFT })
  state!: EventState

  @ManyToOne(() => User, user => user.events)
  user!: User
}
