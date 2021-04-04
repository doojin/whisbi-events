import React from 'react'
import { Eye, FileEarmarkLock } from 'react-bootstrap-icons'
import PropTypes from 'prop-types'

export default function StateIcon ({ state }) {
  if (state === 'public') {
    return <Eye/>
  } else if (state === 'private') {
    return <FileEarmarkLock/>
  } else {
    return null
  }
}

StateIcon.propTypes = {
  state: PropTypes.string
}
