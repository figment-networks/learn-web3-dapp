import React, {useState} from 'react';
import {Button, Space, Tag, Typography} from 'antd';
import {
  FundViewOutlined,
  LinkOutlined,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {useIdx} from '@figment-ceramic/context/idx';
import {slicedAddress} from 'utils/string-utils';
import {EntryT} from '@figment-ceramic/types';
import IdentityItem from '@figment-ceramic/components/auth/IdentityItem';
import IdentityPopover from '@figment-ceramic/components/auth/IdentityPopover';

type AuthProps = {
  onConnected?: (address: string) => void;
  onLoggedIn?: (did: string) => void;
  onLoggedOut?: () => void;
  onlyConnect?: boolean;
  connectBtnText?: string;
  disconnectBtnText?: string;
  logInBtnText?: string;
  logOutBtnText?: string;
};

const Auth = (props: AuthProps): JSX.Element => {
  const {
    onlyConnect = false,
    onConnected,
    onLoggedIn,
    onLoggedOut,
    logInBtnText = 'Log In',
    logOutBtnText = 'Log Out',
    connectBtnText = 'Connect',
    disconnectBtnText = 'Disconnect',
  } = props;

  const {
    connect,
    disconnect,
    logIn,
    logOut,
    isConnected,
    isAuthenticated,
    currentUserAddress,
    currentUserDID,
    currentUserData,
  } = useIdx();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConnect = async () => {
    try {
      setLoading(true);

      const address = await connect();

      if (onConnected) {
        onConnected(address);
      }
    } catch (err) {
      alert('Could not connect to Metamask');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);

      await disconnect();
    } catch (err) {
      alert('Could not disconnect');
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = async () => {
    try {
      setLoading(true);

      const DID = await logIn();

      if (onLoggedIn) {
        onLoggedIn(DID);
      }
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      setLoading(true);

      await logOut();

      if (onLoggedOut) {
        onLoggedOut();
      }
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const UserInfo = ({msg, display, value}: EntryT) => {
    return (
      <Typography.Paragraph
        copyable={{text: value, tooltips: `Click to copy!`}}
      >
        <span>{msg}</span>
        <Tag color="gold">
          <Space>
            <FundViewOutlined />
            <strong>{display ? display(value) : value}</strong>
          </Space>
        </Tag>
      </Typography.Paragraph>
    );
  };

  const IdentityItems = () => {
    return (
      <div>
        <IdentityItem label="Address" value={currentUserAddress} slice />

        <IdentityItem label="DID" value={currentUserDID} slice />

        <IdentityItem
          label="Name"
          value={currentUserData?.basicProfile?.name}
        />
      </div>
    );
  };

  if (onlyConnect) {
    if (isConnected && currentUserAddress) {
      return (
        <IdentityPopover
          actions={[
            <Button
              icon={<LinkOutlined />}
              onClick={handleDisconnect}
              block
              danger
              key={'handleDisconnect'}
            >
              {disconnectBtnText}
            </Button>,
          ]}
        >
          <Button size="large" shape="round" icon={<UserOutlined />}>
            {slicedAddress(currentUserAddress as string)}
          </Button>
        </IdentityPopover>
      );
    } else {
      return (
        <Button
          type="primary"
          icon={<LinkOutlined />}
          onClick={handleConnect}
          size="large"
          shape="round"
        >
          {connectBtnText}
        </Button>
      );
    }
  }

  if (isAuthenticated && currentUserDID) {
    let displayText;
    if (currentUserData?.basicProfile?.name) {
      displayText = currentUserData.basicProfile.name;
    } else {
      displayText = slicedAddress(
        (currentUserDID || currentUserAddress) as string,
      );
    }

    return (
      <IdentityPopover
        actions={[
          <Button
            icon={<PoweroffOutlined />}
            onClick={handleLogOut}
            block
            danger
            key={'handleLogOut'}
          >
            {logOutBtnText}
          </Button>,
        ]}
      >
        <Button size="large" shape="round" icon={<UserOutlined />}>
          {displayText}
        </Button>
      </IdentityPopover>
    );
  } else {
    return (
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={handleLogIn}
          size="large"
          shape="round"
          disabled={loading}
          loading={loading}
        >
          {logInBtnText}
        </Button>
      </Space>
    );
  }
};

export default Auth;
