import React from 'react'

let AddSession = ({ onAddSession }) => {
  let input
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          onAddSession(input.value);
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

export default AddSession
