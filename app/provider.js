'use client'

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserDetailContext } from './_context/UserDetailContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

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
    <PayPalScriptProvider options={{clientId:process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
    <div>{children}</div>
    </PayPalScriptProvider>
    
  </UserDetailContext.Provider>;
}

export default Provider;
