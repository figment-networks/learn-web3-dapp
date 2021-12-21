import ProtocolNav from 'components/shared/ProtocolNav/ProtocolNav';
import {getInnerState, getStepId} from 'utils/context';
import {PROTOCOL_STEPS_ID} from 'types';
import {useGlobalState} from 'context';

import * as Steps from '@figment-avalanche/components';
import {accountExplorer} from '@figment-avalanche/lib';

const Avalanche: React.FC = () => {
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
      {stepId === PROTOCOL_STEPS_ID.CREATE_KEYPAIR && <Steps.Account />}
      {stepId === PROTOCOL_STEPS_ID.GET_BALANCE && <Steps.Balance />}
      {stepId === PROTOCOL_STEPS_ID.TRANSFER_TOKEN && <Steps.Transfer />}
      {stepId === PROTOCOL_STEPS_ID.EXPORT_TOKEN && <Steps.Export />}
      {stepId === PROTOCOL_STEPS_ID.IMPORT_TOKEN && <Steps.Import />}
    </>
  );
};

export default Avalanche;
