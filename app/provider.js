'use client'

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserDetailContext } from './_context/UserDetailContext';

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail,setUserDetail]=useState();

  const VerifyUser = async () => {
    try {
      const { data } = await axios.post('/api/verify-user', { user });
      console.log(data);
      setUserDetail(data.result); 
    } catch (error) {
      console.error('Error verifying user:', error);
    }
    
  };

  useEffect(() => {
    if (user) {
      VerifyUser();
    }
  }, [user]);

  return <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
     <div>{children}</div>
  </UserDetailContext.Provider>;
}

export default Provider;
