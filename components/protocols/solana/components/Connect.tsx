import {Col, Alert, Space, Typography, Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import Confetti from 'react-confetti';
import axios from 'axios';

import {getInnerState, getChainLabel} from 'utils/context';
import {useGlobalState} from 'context';

const {Text} = Typography;

const Connect = () => {
  const {state, dispatch} = useGlobalState();
  const {network} = getInnerState(state);
  const chainLabel = getChainLabel(state);

  const [version, setVersion] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (version) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [version, setVersion]);

  const getConnection = async () => {
    setFetching(true);
    setError(null);
    setVersion(null);
    try {
      const response = await axios.post(`/api/solana/connect`, {network});
      setVersion(response.data);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setFetching(false);
    }
  };

  return (
    <Col>
      {version && (
        <Confetti numberOfPieces={500} tweenDuration={1000} gravity={0.05} />
      )}
      <Space direction="vertical" size="large">
        <Space direction="horizontal" size="large">
          <Button
            type="primary"
            icon={<PoweroffOutlined />}
            onClick={getConnection}
            loading={fetching}
            size="large"
          />
          {version ? (
            <Alert
              message={
                <Text>
                  Connected to {chainLabel}:<Text code>version {version}</Text>
                </Text>
              }
              type="success"
              showIcon
            />
          ) : error ? (
            <Alert
              message={
                <Space>
                  <Text code>Error: {error}</Text>
                </Space>
              }
              type="error"
              showIcon
            />
          ) : (
            <Alert
              message={<Space>Not Connected to {chainLabel}</Space>}
              type="error"
              showIcon
            />
          )}
        </Space>
      </Space>
    </Col>
  );
};

export default Connect;
