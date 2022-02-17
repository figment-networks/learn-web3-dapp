import {Col, Space, Typography, Switch, message, Statistic, Card} from 'antd';
import {useGlobalState} from 'context';
import {SyncOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react';
import Confetti from 'react-confetti';
import {clusterApiUrl, Connection, Keypair} from '@solana/web3.js';
import bip39 from 'bip39';
import {PythConnection, getPythProgramKeyForCluster} from '@pythnetwork/client';
import {pythMarketExplorer} from '../lib/index';
import {
  DollarCircleFilled,
  AimOutlined,
  CalculatorFilled,
} from '@ant-design/icons';
import {PYTH_NETWORKS, SOLANA_NETWORKS} from 'types/index';

const {Title} = Typography;

const connection = new Connection(clusterApiUrl(SOLANA_NETWORKS.DEVNET));
const pythPublicKey = undefined;
const pythConnection = undefined;

const Connect = () => {
  const {state, dispatch} = useGlobalState();
  const [fetching, setFetching] = useState<boolean>(false);

  const [price, setPrice] = useState<number | undefined>(undefined);
  const [symbol, setSymbol] = useState<string | undefined>(undefined);
  const [confidence, setConfidence] = useState<number | undefined>(undefined);
  const [exponent, setExponent] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (price) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [price, setPrice]);

  const getPythData = async (checked: boolean) => {
    undefined.onPriceChange((product, price) => {
      if (
        product.symbol === 'Crypto.SOL/USD' &&
        price.price &&
        price.confidence
      ) {
        // Console logging at the frequency Pyth updates
        // will likely cause significant lag in the browser!
        // Sample output: Crypto.SOL/USD: $108.932958 ±$0.3174755
        // console.log(
        //   `${product.symbol}: $${price.price} \xB1$${price.confidence}`,
        // );
        setSymbol('Crypto.SOL/USD');
        setPrice(price.price);
        setConfidence(price.confidence);
        setExponent(price.exponent);
      } else if (product.symbol === 'Crypto.SOL/USD' && !price.price) {
        console.log(`${product.symbol}: price currently unavailable`);
        setSymbol('Crypto.SOL/USD');
        setPrice(0);
        setConfidence(0);
        setExponent(0);
      }
    });

    if (!checked) {
      message.info('Stopping Pyth price feed!');
      pythConnection.stop();
      setFetching(false);
    } else {
      message.info('Starting Pyth price feed!');
      pythConnection.start();
      setFetching(true);
    }
  };

  return (
    <Col>
      <Space direction="vertical" size="large">
        <Card
          size="small"
          title={
            <Title level={3}>
              <a
                href={pythMarketExplorer(
                  PYTH_NETWORKS.DEVNET,
                  symbol as string,
                )}
              >
                {symbol}
              </a>{' '}
            </Title>
          }
          style={{width: 500}}
          extra={
            <Switch
              checkedChildren={<SyncOutlined spin />}
              unCheckedChildren={'Pyth'}
              onChange={getPythData}
            />
          }
        >
          {' '}
          {price && fetching && (
            <>
              <Confetti
                confettiSource={{x: 325, y: 125, w: 100, h: 200}}
                numberOfPieces={10}
                tweenDuration={200}
                gravity={0.25}
                recycle={false}
              />
            </>
          )}{' '}
          <Statistic
            value={price}
            prefix={
              <>
                <label style={{fontSize: 14}}>
                  <DollarCircleFilled /> Price:
                </label>
              </>
            }
          />
          <Statistic
            value={confidence}
            prefix={
              <>
                <label style={{fontSize: 14, textAlign: 'left'}}>
                  <AimOutlined /> Confidence:
                </label>
              </>
            }
          />
          <Statistic
            value={exponent}
            prefix={
              <>
                <label style={{fontSize: 14}}>
                  <CalculatorFilled /> Exponent:
                </label>
              </>
            }
          />
        </Card>
        <Space direction="horizontal" size="large"></Space>
      </Space>
    </Col>
  );
};

export default Connect;
