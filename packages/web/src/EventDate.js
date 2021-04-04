import React from 'react'
import { formatRelative } from 'date-fns'
import PropTypes from 'prop-types'
import { enGB } from 'date-fns/locale'
import { Calendar } from 'react-bootstrap-icons'
import './EventDate.css'

export default function EventDate ({ date }) {
  return (
    <span className="EventDate">
      <Calendar/>
      <span className="value">
        { formatRelative(new Date(Date.parse(date)), new Date(), { locale: enGB }) }
      </span>
    </span>
  )
}

EventDate.propTypes = {
  date: PropTypes.string
}
