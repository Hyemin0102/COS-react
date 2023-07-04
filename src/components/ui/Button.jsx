import React from 'react'

const Button = ({onClick,text}) => {
  return (
    <button className="text-xs bg-black text-slate-100 p-2" onClick={onClick}>{text}</button>
  )
}

export default Button