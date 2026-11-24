import React, { useState } from 'react'
import Input from '../ui/Input'

/** Input with a Show / Hide toggle, shared by the Login and Register forms. */
export default function PasswordInput(props) {
  const [shown, setShown] = useState(false)

  return (
    <div className="relative">
      <Input {...props} type={shown ? 'text' : 'password'} className="[&_input]:pr-16" />
      <button
        type="button"
        onClick={() => setShown((value) => !value)}
        aria-controls={props.id}
        aria-pressed={shown}
        className="absolute right-4 top-[2.4rem] text-xs font-semibold uppercase tracking-[0.12em] text-espresso-light/60 hover:text-coffee-dark transition-colors"
      >
        {shown ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
