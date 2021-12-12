import React, {useEffect, useState} from 'react';
import {Col, Alert, Space, Typography, Input} from 'antd';
import {useGlobalState} from 'context';
import {useColors} from 'hooks';

const {Text} = Typography;

const firstAnswerResponse = 'mapping';
const secondAnswerResponse = 'source';
const thirdAnswerResponse = 'near-mainnet';

const GraphNode = () => {
  const {state, dispatch} = useGlobalState();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [firstAnswer, setFirstAnswer] = useState<string>();
  const [secondAnswer, setSecondAnswer] = useState<string>();
  const [thirdAnswer, setThirdAnswer] = useState<string>();

  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      firstAnswer == firstAnswerResponse &&
      secondAnswer == secondAnswerResponse &&
      thirdAnswer == thirdAnswerResponse
    ) {
      setIsValid(true);
      setError(null);
    }
    if (
      firstAnswer != firstAnswerResponse ||
      secondAnswer != secondAnswerResponse ||
      thirdAnswer != thirdAnswerResponse
    ) {
      setError('yes');
      setIsValid(false);
    }
    if (
      firstAnswer == undefined ||
      secondAnswer == undefined ||
      thirdAnswer == undefined
    ) {
      setIsValid(false);
      setError(null);
    }
    if (isValid) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [firstAnswer, secondAnswer, thirdAnswer, isValid, setIsValid]);

  function onFirstAnswerChange(event: any) {
    setFirstAnswer(event.target.value.toLowerCase());
  }

  function onSecondAnswerChange(event: any) {
    setSecondAnswer(event.target.value.toLowerCase());
  }

  function onThirdAnswerChange(event: any) {
    setThirdAnswer(event.target.value.toLowerCase());
  }

  return (
    <Col key={`${fetching}`}>
      <Space direction="vertical" size="large">
        <Text>
          What section of the manifest are entities and receiptHandlers found in
          (one word)?
        </Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <Input onChange={onFirstAnswerChange} />
        <Text>
          In which section of the manifest would one set the contract to listen
          to?
        </Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <Input onChange={onSecondAnswerChange} />
        <Text>
          What is the only network can we listen to for NEAR contracts?
        </Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <Input onChange={onThirdAnswerChange} />
        {isValid ? (
          <>
            <Alert
              message={<Text strong>Correct. 🎉</Text>}
              description={
                <Space direction="vertical">
                  <div>Looks like you have mastered the manifest.</div>
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
                Oops, looks like one or more of your answers is wrong. 😢
              </Text>
            }
            description={
              <Space direction="vertical">
                <div>Please review the lesson and check your answers.</div>
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
