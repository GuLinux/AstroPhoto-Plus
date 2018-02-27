import React from 'react'
import { connect } from 'react-redux'
import { Actions } from '../actions'

let AddSession = ({ dispatch }) => {
  let input
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(Actions.Sessions.add(input.value))
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">
          Add Session
        </button>
      </form>
    </div>
  )
}
AddSession = connect()(AddSession)

export default AddSession
