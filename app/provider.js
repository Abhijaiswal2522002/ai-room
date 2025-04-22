'use client'
import React, { useEffect } from 'react'

function Provider({children}) {

  const {user}=useUser();
  useEffect(()=>{
    user&&VerifyUser();
  },[user])
  const VerifyUser=()=>{
    
  }
  return (
    <div>
        {children}
    </div>
  )
}

export default Provider