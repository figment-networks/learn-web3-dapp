import ProtocolNav from 'components/shared/ProtocolNav/ProtocolNav';
import {getInnerState, getStepId} from 'utils/context';
import {PROTOCOL_STEPS_ID} from 'types';
import {useGlobalState} from 'context';

import * as Steps from '@figment-near/components';
import {accountExplorer} from '@figment-near/lib';

const Near: React.FC = () => {
  const {state} = useGlobalState();
  const {accountId, network} = getInnerState(state);
  const stepId = getStepId(state);

  return (
    <>
      <ProtocolNav
        address={accountId}
        network={network}
        accountExplorer={accountExplorer(network)}
      />
      {stepId === PROTOCOL_STEPS_ID.CHAIN_CONNECTION && <Steps.Connect />}
      {stepId === PROTOCOL_STEPS_ID.CREATE_KEYPAIR && <Steps.Keypair />}
      {stepId === PROTOCOL_STEPS_ID.CREATE_ACCOUNT && <Steps.Account />}
      {stepId === PROTOCOL_STEPS_ID.GET_BALANCE && <Steps.Balance />}
      {stepId === PROTOCOL_STEPS_ID.TRANSFER_TOKEN && <Steps.Transfer />}
      {stepId === PROTOCOL_STEPS_ID.DEPLOY_CONTRACT && <Steps.Deploy />}
      {stepId === PROTOCOL_STEPS_ID.GET_CONTRACT_VALUE && <Steps.Getter />}
      {stepId === PROTOCOL_STEPS_ID.SET_CONTRACT_VALUE && <Steps.Setter />}
    </>
  );
};

export default Near;
