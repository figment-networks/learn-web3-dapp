import {useEffect, useState} from 'react';
import {Col, Alert, Space, Typography, Input, InputNumber} from 'antd';
import {useGlobalState} from 'context';

const {Text} = Typography;

const firstAnswerResponse = 2;
const secondAnswerResponse = 'yes';
const thirdAnswerResponse = 'yes';

const Entity = () => {
  const {state, dispatch} = useGlobalState();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [firstAnswer, setFirstAnswer] = useState<number>();
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

  function onFirstAnswerChange(value: number) {
    setFirstAnswer(value);
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
        <Text>How many entities do you have defined?</Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer:</Text>
        <InputNumber min={0} max={999} onChange={onFirstAnswerChange} />
        <Text>Is the Account entity present in your schema.graphql file?</Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer (yes or no):</Text>
        <Input onChange={onSecondAnswerChange} />
        <Text>Is the Log entity present in your schema.graphql file?</Text>
        <Text style={{fontWeight: 'bold'}}>Your Answer (yes or no):</Text>
        <Input onChange={onThirdAnswerChange} />
        {isValid ? (
          <>
            <Alert
              message={<Text strong>Excellent. 🎉</Text>}
              description={
                <Space direction="vertical">
                  <div>Looks like your entities are defined.</div>
                  <div>Now let&apos;s create their mappings.</div>
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
                Oops, looks like there is an issue with your entities. 😢
              </Text>
            }
            description={
              <Space direction="vertical">
                <div>Please ensure your entities are defined.</div>
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

export default Entity;
