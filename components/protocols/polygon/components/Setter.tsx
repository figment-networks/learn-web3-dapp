import {useState, useEffect} from 'react';
import {Alert, Col, InputNumber, Space, Typography, Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';

import {getPolygonTxExplorerURL} from '@figment-polygon/lib';
import {setValue} from '@figment-polygon/challenges';
import {useGlobalState} from 'context';
import {getInnerState} from 'utils/context';

const {Text} = Typography;

const Setter = () => {
  const {state, dispatch} = useGlobalState();
  const {contractId} = getInnerState(state);

  const [inputNumber, setInputNumber] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (txHash) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [txHash, setTxHash]);

  const setContractValue = async () => {
    setFetching(true);
    setError(undefined);
    setTxHash(null);
    const {error, hash} = await setValue(contractId, inputNumber);
    if (error) {
      setError(error);
    } else {
      setTxHash(hash);
    }
    setFetching(false);
  };

  return (
    <Col>
      <Space direction="vertical" size="large">
        <Space direction="horizontal">
          <InputNumber value={inputNumber} onChange={setInputNumber} />
          <Button
            type="primary"
            icon={<PoweroffOutlined />}
            onClick={setContractValue}
            loading={fetching}
            size="large"
          >
            Set Value
          </Button>
        </Space>
        {txHash ? (
          <Alert
            showIcon
            type="success"
            message={<Text strong>Transaction confirmed!</Text>}
            description={
              <a
                href={getPolygonTxExplorerURL(txHash)}
                target="_blank"
                rel="noreferrer"
              >
                View on Polyscan
              </a>
            }
          />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : null}
      </Space>
    </Col>
  );
};

export default Setter;
