import React, {useEffect, useState} from 'react';
import {Col, Alert, Space, Typography, Input, InputNumber} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {useGlobalState} from 'context';
import axios from 'axios';
import {StepButton} from 'components/shared/Button.styles';
import {useColors} from 'hooks';

const {Text} = Typography;

const startBlockAnswer = 54167320;
const entityAnswer = 'account';
const methodAnswer = 'putdid';

const GraphNode = () => {
  const {state, dispatch} = useGlobalState();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [userStartBlockAnswer, setUserStartBlockAnswer] = useState<number>();
  const [userEntityAnswer, setUserEntityAnswer] = useState<string>();
  const [userMethodAnswer, setUserMethodAnswer] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const {primaryColor, secondaryColor} = useColors(state);

  useEffect(() => {
    if (
      userStartBlockAnswer == startBlockAnswer &&
      userEntityAnswer == entityAnswer &&
      userMethodAnswer == methodAnswer
    ) {
      setIsValid(true);
      setError(null);
    }
    if (
      userStartBlockAnswer != startBlockAnswer ||
      userEntityAnswer != entityAnswer ||
      userMethodAnswer != methodAnswer
    ) {
      setError('yes');
      setIsValid(false);
    }
    if (
      userStartBlockAnswer == undefined ||
      userEntityAnswer == undefined ||
      userMethodAnswer == undefined
    ) {
      setIsValid(false);
      setError(null);
    }
    if (isValid) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [
    userStartBlockAnswer,
    userEntityAnswer,
    userMethodAnswer,
    isValid,
    setIsValid,
  ]);

  function onStartBlockChange(value: number) {
    setUserStartBlockAnswer(value);
  }

  function onEntityChange(event: any) {
    setUserEntityAnswer(event.target.value.toLowerCase());
  }

  function onMethodChange(event: any) {
    setUserMethodAnswer(event.target.value.toLowerCase());
  }

  const validStep = async () => {
    setFetching(true);
    setIsValid(false);
    setError(null);
    try {
      const response = await axios.get(`/api/the-graph/scaffold`);
      setIsValid(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setFetching(false);
    }
  };

  return (
    <Col key={fetching as unknown as React.Key}>
      <Space direction="vertical" size="large">
        <Text>What is startBlock currently set to?</Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <InputNumber min={0} max={99999999} onChange={onStartBlockChange} />
        <Text>What is the name of the one entity currently defined?</Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <Input onChange={onEntityChange} />
        <Text>
          What is the name of the first functionCall method being listened for?
        </Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <Input onChange={onMethodChange} />
        {isValid ? (
          <>
            <Alert
              message={
                <Text strong>
                  Looks like your NEAR subgraph scaffold is ready to go! 🎉
                </Text>
              }
              description={
                <Space direction="vertical">
                  <div>
                    Sorry no confetti this time... But that&apos;s a great
                    start.
                  </div>
                  <div>
                    Now let&apos;s tweak the subgraph to make it do something
                    useful.
                  </div>
                </Space>
              }
              type="success"
              showIcon
            />
          </>
        ) : error ? (
          <Alert
            message={
              <Text strong>
                Looks like one or more of your answers is wrong. 😢
              </Text>
            }
            description={
              <Space direction="vertical">
                <div>
                  Are you sure you cloned the NEAR subgraph project? Try
                  confirming your answers.
                </div>
              </Space>
            }
            type="error"
            showIcon
            closable
          />
        ) : null}
      </Space>
    </Col>
  );
};

export default GraphNode;
