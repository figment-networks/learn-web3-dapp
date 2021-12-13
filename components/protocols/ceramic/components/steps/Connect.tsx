import {Col, Alert, Space, Typography} from 'antd';
import {useEffect} from 'react';
import {useGlobalState} from 'context';
import {useIdx} from '@figment-ceramic/context/idx';
import Confetti from 'react-confetti';

const {Text} = Typography;

const Connect = () => {
  const {dispatch} = useGlobalState();

  const {isConnected, currentUserAddress, connect} = useIdx();

  useEffect(() => {
    if (currentUserAddress) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [currentUserAddress]);

  const checkConnection = async () => {
    try {
      await connect();
    } catch (error) {
      alert('Something went wrong');
    }
  };

  return (
    <Col style={{minHeight: '350px', maxWidth: '600px'}}>
      <Space direction="vertical" size="large">
        <Space direction="vertical" size="large">
          <>
            {isConnected && currentUserAddress ? (
              <>
                <Confetti
                  numberOfPieces={500}
                  tweenDuration={1000}
                  gravity={0.05}
                />
                <Alert
                  message={<Text strong>Connected to MetaMask 😍</Text>}
                  description={
                    <Space direction="vertical">
                      <Text>Your Ethereum Address is:</Text>
                      <Text code>{currentUserAddress}</Text>
                    </Space>
                  }
                  type="success"
                  showIcon
                  onClick={checkConnection}
                />
              </>
            ) : (
              <Alert
                message="Not connected to MetaMask"
                type="error"
                showIcon
              />
            )}
          </>
        </Space>
      </Space>
    </Col>
  );
};

export default Connect;
