import React, {useEffect, useState} from 'react';
import {Col, Alert, Space, Typography, InputNumber} from 'antd';
import {useGlobalState} from 'context';
import Confetti from 'react-confetti';

const {Text} = Typography;

const HostedService = () => {
  const {state, dispatch} = useGlobalState();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number>();

  const answer = 32;

  useEffect(() => {
    if (userAnswer == undefined) {
      setIsValid(false);
      setError(null);
    }
    if (userAnswer == answer) {
      setIsValid(true);
      setError(null);
    }
    if (userAnswer != answer && userAnswer != undefined) {
      setError('yes');
      setIsValid(false);
    }

    if (isValid) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [userAnswer, isValid, setIsValid]);

  function onChange(value: number) {
    setUserAnswer(value);
  }

  return (
    <Col key={`${fetching}`}>
      {isValid && (
        <Confetti numberOfPieces={500} tweenDuration={1000} gravity={0.05} />
      )}
      <Space direction="vertical" size="large">
        <Text>
          In your Hosted Service dashboard, how many characters does your access
          token have?
        </Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <InputNumber min={0} max={100} onChange={onChange} />
        {isValid ? (
          <>
            <Alert
              message={
                <Text strong>
                  Looks like you have access to the Hosted Service! 🎉
                </Text>
              }
              description={
                <Space>
                  but... there&apos;s not much there. Let&apos;s give it some
                  code to run for us. Click on the button at the bottom right to
                  go to the next step.
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
                That&apos;s not the right answer. Ensure you are in the
                dashboard and count the access token characters carefully. 😢
              </Text>
            }
            description={
              <Space direction="vertical">
                <div>
                  We tried to match your answer with the length of an access
                  token but got:
                </div>
                <Text code> {userAnswer} != access token length</Text>
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

export default HostedService;
