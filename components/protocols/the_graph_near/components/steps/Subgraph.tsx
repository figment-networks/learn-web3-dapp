import React, {useEffect, useState} from 'react';
import {Col, Alert, Space, Typography} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {useGlobalState} from 'context';
import axios from 'axios';
import {StepButton} from 'components/shared/Button.styles';
import {useColors} from 'hooks';

const {Text} = Typography;

const GraphNode = () => {
  const {state, dispatch} = useGlobalState();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {primaryColor, secondaryColor} = useColors(state);

  useEffect(() => {
    if (isValid) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [isValid, setIsValid]);

  const validStep = async () => {
    setFetching(true);
    setIsValid(false);
    setError(null);
    try {
      const response = await axios.get(`/api/the-graph-near/scaffold`);
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
        <StepButton
          type="ghost"
          icon={<PoweroffOutlined />}
          onClick={validStep}
          loading={fetching}
          secondary_color={secondaryColor}
          primary_color={primaryColor}
          size="large"
          autoFocus={false}
        >
          Check for a subgraph scaffold
        </StepButton>
        {isValid ? (
          <>
            <Alert
              message={<Text strong>We found a subgraph scaffold! 🎉</Text>}
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
            message={<Text strong>We couldn&apos;t find a subgraph 😢</Text>}
            description={
              <Space direction="vertical">
                <div>Are you sure the subgraph was created?</div>
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
