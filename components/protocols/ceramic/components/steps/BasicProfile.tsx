import {
  Form,
  Input,
  Button,
  Space,
  Typography,
  Col,
  Divider,
  Card,
  Alert,
} from 'antd';
import {useEffect, useState} from 'react';
import {useGlobalState} from 'context';
import {useIdx} from '@figment-ceramic/context/idx';
import {BasicProfile} from '@ceramicstudio/idx-constants';
import {IdxSchema} from '@figment-ceramic/types';

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};

const tailLayout = {
  wrapperCol: {offset: 4, span: 20},
};

const {Text} = Typography;

const BasicProfileStep = () => {
  const {dispatch} = useGlobalState();

  const [saving, setSaving] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const [basicProfile, setBasicProfile] = useState<
    BasicProfile | undefined | null
  >(undefined);

  const {idx, isAuthenticated, currentUserDID, setCurrentUserData} = useIdx();

  useEffect(() => {
    if (name && basicProfile) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [name, basicProfile]);

  const saveBasicProfile = async (values: BasicProfile) => {
    setSaving(true);
    setBasicProfile(null);

    const {name} = values;

    try {
      // Set BasicProfile (use IdxSchema.BasicProfile)

      setCurrentUserData(IdxSchema.BasicProfile, {name});

      setName(name);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const readBasicProfile = async () => {
    try {
      setFetching(true);

      // Read basic profile (use IdxSchema.BasicProfile enum)
      const resp = undefined;

      setCurrentUserData(
        IdxSchema.BasicProfile,
        resp as unknown as BasicProfile,
      );

      setBasicProfile(resp);
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
          <Card title="#1 - Set the name">
            <Form
              {...layout}
              name="transfer"
              layout="horizontal"
              onFinish={saveBasicProfile}
              initialValues={{
                from: currentUserDID,
              }}
            >
              <Form.Item label="DID" name="from" required>
                <Text code>{currentUserDID}</Text>
              </Form.Item>

              <Form.Item
                label="Name"
                name="name"
                required
                tooltip="Your name associated with DID"
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

          {name && (
            <div>
              <Divider />
              <Card title="#2 - Get the name">
                <Space direction="vertical">
                  <Button
                    type="primary"
                    onClick={readBasicProfile}
                    disabled={fetching}
                    loading={fetching}
                  >
                    Get name
                  </Button>

                  {basicProfile && (
                    <div>
                      <Text>
                        Your name is <Text code>{basicProfile.name}</Text>
                      </Text>
                    </div>
                  )}
                </Space>
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

export default BasicProfileStep;
