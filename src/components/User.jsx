import React from 'react'

const User = ({user:{displayName,photoURL}}) => {
  return (
    <div className='flex items-center shrink-0'>
      <img className='w-8 rounded-full mr-2' src={photoURL} alt={displayName}/>
      <span className='hidden md:block text-xs'>{displayName}</span>
    </div>
  )
}

export default User