import React from 'react'
let AddSequence = ({onCreateSequence, sessionId}) => {
  let input
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          onCreateSequence(input.value, sessionId)
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

export default AddSequence
