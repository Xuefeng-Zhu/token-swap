import React, { createContext, useContext, useState, useEffect } from 'react';
import _ from 'lodash';

import { useWeb3Context } from './Web3ContextProvider';
import TokenSwap from '../contracts/TokenSwap';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { signer } = useWeb3Context();
  const [tokenSwap, setTokenSwap] = useState(null);

  useEffect(async () => {
    if (!signer) {
      return;
    }

    setTokenSwap(TokenSwap(signer));
  }, [signer]);

  return (
    <StateContext.Provider
      value={{
        tokenSwap,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
