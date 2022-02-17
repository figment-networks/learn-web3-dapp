import ProtocolNav from 'components/shared/ProtocolNav/ProtocolNav';
import {getInnerState, getStepId} from 'utils/context';
import {PROTOCOL_STEPS_ID} from 'types';
import {useGlobalState} from 'context';

import * as Steps from '@figment-polkadot/components';
import {accountExplorer} from '@figment-polkadot/lib';

const Polkadot: React.FC = () => {
  const {state} = useGlobalState();
  const {address, network} = getInnerState(state);
  const stepId = getStepId(state);

  return (
    <>
      <ProtocolNav
        address={address}
        network={network}
        accountExplorer={accountExplorer(network)}
      />
      {stepId === PROTOCOL_STEPS_ID.CHAIN_CONNECTION && <Steps.Connect />}
      {stepId === PROTOCOL_STEPS_ID.CREATE_ACCOUNT && <Steps.Account />}
      {stepId === PROTOCOL_STEPS_ID.RESTORE_ACCOUNT && <Steps.Restore />}
      {stepId === PROTOCOL_STEPS_ID.ESTIMATE_FEES && <Steps.Estimate />}
      {stepId === PROTOCOL_STEPS_ID.GET_BALANCE && <Steps.Balance />}
      {stepId === PROTOCOL_STEPS_ID.ESTIMATE_DEPOSIT && <Steps.Deposit />}
      {stepId === PROTOCOL_STEPS_ID.TRANSFER_TOKEN && <Steps.Transfer />}
    </>
  );
};

export default Polkadot;
