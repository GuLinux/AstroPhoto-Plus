import React from 'react'
import { connect } from 'react-redux'
import { addSequence } from '../actions'

let AddSequence = ({ dispatch }) => {
  let input
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(addSequence(input.value))
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">
          Add Sequence
        </button>
      </form>
    </div>
  )
}
AddSequence = connect()(AddSequence)

export default AddSequence
