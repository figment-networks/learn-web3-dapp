import {
  Form,
  Input,
  Button,
  Alert,
  Space,
  Typography,
  Col,
  Divider,
  Card,
} from 'antd';
import {useEffect, useState} from 'react';
import {useGlobalState} from 'context';
import {useIdx} from '@figment-ceramic/context/idx';
import {IdxSchema, QuoteSchemaT} from '@figment-ceramic/types';
import {aliases} from '@figment-ceramic/lib';

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};

const tailLayout = {
  wrapperCol: {offset: 4, span: 20},
};

const {Text, Title} = Typography;

const CustomDefinition = () => {
  const {dispatch} = useGlobalState();

  const [saving, setSaving] = useState<boolean>(false);
  const [myQuote, setMyQuote] = useState<QuoteSchemaT | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [customDefinitionData, setCustomDefinitionData] = useState<
    QuoteSchemaT | null | undefined
  >(null);

  const {idx, isAuthenticated, currentUserDID} = useIdx();

  useEffect(() => {
    if (myQuote && customDefinitionData) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [myQuote, customDefinitionData]);

  const setAlias = () => {
    const {aliases} = require('@figment-ceramic/lib');
    idx._aliases = aliases;
  };

  const saveQuote = async (values: QuoteSchemaT) => {
    setSaving(true);
    const {text, author} = values;

    setAlias();

    try {
      // Save quote information to custom schema (use IdxSchema.Figment enum)

      setMyQuote({
        text,
        author,
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const readQuote = async () => {
    try {
      setFetching(true);

      // Read quote (use IdxSchema.Figment enum)
      const resp = undefined;

      setCustomDefinitionData(resp);
    } catch (error) {
      alert(error.message);
    } finally {
      setFetching(false);
    }
  };

  return (
    <Col style={{minHeight: '350px', maxWidth: '700px'}}>
      {isAuthenticated && currentUserDID ? (
        <>
          <Card title="#1 - Set your favourite quote">
            <Form
              {...layout}
              name="transfer"
              layout="horizontal"
              onFinish={saveQuote}
              initialValues={{
                from: currentUserDID,
              }}
            >
              <Form.Item label="DID" name="from" required>
                <Text code>{currentUserDID}</Text>
              </Form.Item>

              <Form.Item
                label="Text"
                name="text"
                required
                tooltip="Quote text associated with your custom schema"
              >
                <Space direction="vertical">
                  <Input style={{width: '200px'}} />
                </Space>
              </Form.Item>

              <Form.Item
                label="Author"
                name="author"
                required
                tooltip="Author of a quote"
              >
                <Space direction="vertical">
                  <Input style={{width: '200px'}} />
                </Space>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={saving}
                  loading={saving}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {myQuote && (
            <div>
              <Divider />
              <Card title="#2 - Get your favourite quote">
                <Button
                  type="primary"
                  onClick={readQuote}
                  disabled={fetching}
                  loading={fetching}
                >
                  Get your quote
                </Button>

                {customDefinitionData && (
                  <div style={{marginTop: '20px'}}>
                    <Space>
                      <Title italic level={4} style={{marginBottom: 0}}>
                        &ldquo;{customDefinitionData.text}&ldquo;
                      </Title>
                      <span> by {customDefinitionData.author}</span>
                    </Space>
                  </div>
                )}
              </Card>
            </div>
          )}
        </>
      ) : (
        <Alert
          message="Please log in to submit transactions to Ceramic"
          type="error"
          showIcon
        />
      )}
    </Col>
  );
};

export default CustomDefinition;
