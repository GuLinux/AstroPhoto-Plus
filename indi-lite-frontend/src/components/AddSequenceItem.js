import React from 'react'
let AddSequenceItem = ({onCreateSequenceItem, sequenceId}) => {
  let input
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          onCreateSequenceItem(input.value, sequenceId)
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">
          Add SequenceItem
        </button>
      </form>
    </div>
  )
}

export default AddSequenceItem
