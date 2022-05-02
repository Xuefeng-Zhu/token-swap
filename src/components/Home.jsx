import React, { useEffect, useState } from 'react';
import { Result, Card, Statistic, Row, Col, Button } from 'antd';
import { formatEther } from 'ethers/lib/utils';

import { useWeb3Context } from '../contexts/Web3ContextProvider';
import { useStateContext } from '../contexts/StateContextProvider';

const Home = () => {
  const { address } = useWeb3Context();
  const { tokenSwap } = useStateContext();
  const [allocation, setAllocation] = useState(0);
  const [claimable, setClaimable] = useState(0);

  useEffect(async () => {
    if (!tokenSwap || !address) {
      return;
    }

    setAllocation(await tokenSwap.allocations(address));
    setClaimable(await tokenSwap.claimable(address));
  }, [tokenSwap, address]);

  const claim = async () => {
    if (!tokenSwap) {
      return;
    }
    await tokenSwap.claim();
  };

  if (!address) {
    return (
      <Result
        status="warning"
        title="Please connect to your wallet to claim."
      />
    );
  }

  console.log(claimable);
  return (
    <Card
      style={{ width: '100%' }}
      title="Claim token"
      actions={[
        <Button type="primary" onClick={claim}>
          Claim
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Allocations"
            value={formatEther(allocation)}
            precision={2}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Claimable"
            value={formatEther(claimable)}
            precision={2}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Home;
