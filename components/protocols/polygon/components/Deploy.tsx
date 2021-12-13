import React, {useEffect, useState} from 'react';
import {Col, Alert, Space, Typography, Input, Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';

import {PROTOCOL_INNER_STATES_ID} from 'types';
import {useGlobalState} from 'context';
import {getInnerState} from 'utils/context';
import {deploy} from '@figment-polygon/challenges';

const {Text} = Typography;

const Deploy = () => {
  const {state, dispatch} = useGlobalState();
  const {contractId} = getInnerState(state);

  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [address, setAddress] = useState<string | undefined>(contractId);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isDeployed) {
      dispatch({
        type: 'SetInnerState',
        values: [
          {
            [PROTOCOL_INNER_STATES_ID.CONTRACT_ID]: address,
          },
        ],
        isCompleted: true,
      });
    }
  }, [isDeployed, setIsDeployed]);

  const checkDeployment = async () => {
    setFetching(true);
    setIsDeployed(false);
    setError(undefined);
    const {error, status} = await deploy(address as string);
    if (error) {
      setError(error);
    } else {
      setIsDeployed(status as boolean);
    }
    setFetching(false);
  };

  return (
    <Col>
      <Space direction="vertical" size="large">
        <Text>
          Paste the <Text strong>contract address</Text> generated after the
          deployment:
        </Text>
        <Input
          placeholder="Enter the program address"
          onChange={(e) => setAddress(e.target.value)}
          style={{width: '500px'}}
          disabled={!!contractId}
          defaultValue={contractId as string}
        />
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={checkDeployment}
          loading={fetching}
          size="large"
          disabled={!!contractId}
        >
          Check deployment
        </Button>
        {isDeployed ? (
          <>
            <Alert
              message={<Text strong>We found a deployed contract! 🎉</Text>}
              description={
                <Space direction="vertical">
                  <div>The time is come to collect the fruits of our work.</div>
                  <div>
                    Now let&apos;s query the contract to display some revelant
                    information about it&apos;s state. Let&apos;s go do the next
                    step!
                  </div>
                </Space>
              }
              type="success"
              showIcon
            />
          </>
        ) : error ? (
          <Alert
            message={<Text strong>We couldn&apos;t find a contract 😢</Text>}
            description={
              <Space direction="vertical">
                <Text>Are you sure the contract was deployed?</Text>
                <Text code>{error}</Text>
              </Space>
            }
            type="error"
            showIcon
          />
        ) : null}
      </Space>
    </Col>
  );
};

export default Deploy;
