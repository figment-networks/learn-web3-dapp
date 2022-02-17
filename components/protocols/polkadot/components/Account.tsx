import {Alert, Button, Col, Space, Typography} from 'antd';
import {useEffect, useState} from 'react';
import axios from 'axios';

import {PROTOCOL_INNER_STATES_ID} from 'types';
import {useGlobalState} from 'context';

import {FAUCET_URL} from '@figment-polkadot/lib';

const {Text} = Typography;

const Account = () => {
  const {dispatch} = useGlobalState();

  const [address, setAddress] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address && mnemonic) {
      dispatch({
        type: 'SetInnerState',
        values: [
          {
            [PROTOCOL_INNER_STATES_ID.ADDRESS]: address,
          },
          {
            [PROTOCOL_INNER_STATES_ID.MNEMONIC]: mnemonic,
          },
        ],
        isCompleted: true,
      });
    }
  }, [address, mnemonic]);

  const generateKeypair = async () => {
    try {
      setFetching(true);
      setAddress(null);
      setMnemonic(null);
      setError(null);
      const response = await axios.get(`/api/polkadot/account`);
      setAddress(response.data.address);
      setMnemonic(response.data.mnemonic);
    } catch (error) {
      setError(error.message);
    } finally {
      setFetching(false);
    }
  };

  return (
    <Col>
      <Space direction="vertical">
        <Button
          type="primary"
          onClick={generateKeypair}
          style={{marginBottom: '20px'}}
          loading={fetching}
        >
          Generate a Keypair
        </Button>
        {address && mnemonic ? (
          <>
            <Alert
              message={
                <Space>
                  <Text strong>Keypair generated!</Text>
                </Space>
              }
              description={
                <div>
                  <div>
                    This is the string representation of the public key <br />
                    <Text code>{address}</Text>.
                  </div>
                  <Text>
                    Accessible (and copyable) at the top right of this page.
                  </Text>
                </div>
              }
              type="success"
              showIcon
            />
            <Alert
              message={
                <Space>
                  <Text strong>Fund your new account</Text>
                </Space>
              }
              description={
                <a href={FAUCET_URL} target="_blank" rel="noreferrer">
                  Go to the faucet
                </a>
              }
              type="warning"
              showIcon
            />
          </>
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Alert message="Please Generate a Keypair" type="error" showIcon />
        )}
      </Space>
    </Col>
  );
};

export default Account;
