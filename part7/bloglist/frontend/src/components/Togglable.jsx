import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef(function Togglable(props, ref) {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible((prev) => !prev)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }))

  return (
    <div>
      {!visible && (
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      )}

      {visible && (
        <div>
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      )}
    </div>
  )
})

export default Togglable
