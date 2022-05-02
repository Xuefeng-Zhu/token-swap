import { ethers } from 'ethers';
import { memoize } from 'lodash';

import TokenSwap from '../deployments/kovan/TokenSwap.json';

export default memoize((signer) => {
  return new ethers.Contract(TokenSwap.address, TokenSwap.abi, signer);
});
