import ProtocolNav from 'components/shared/ProtocolNav/ProtocolNav';
import {getInnerState, getStepId} from 'utils/context';
import {PROTOCOL_STEPS_ID} from 'types';
import {useGlobalState} from 'context';

import * as Steps from '@figment-polygon/components';
import {accountExplorer} from '@figment-polygon/lib';

const Polygon: React.FC = () => {
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
      {stepId === PROTOCOL_STEPS_ID.QUERY_CHAIN && <Steps.Query />}
      {stepId === PROTOCOL_STEPS_ID.GET_BALANCE && <Steps.Balance />}
      {stepId === PROTOCOL_STEPS_ID.TRANSFER_TOKEN && <Steps.Transfer />}
      {stepId === PROTOCOL_STEPS_ID.DEPLOY_CONTRACT && <Steps.Deploy />}
      {stepId === PROTOCOL_STEPS_ID.SET_CONTRACT_VALUE && <Steps.Setter />}
      {stepId === PROTOCOL_STEPS_ID.GET_CONTRACT_VALUE && <Steps.Getter />}
      {stepId === PROTOCOL_STEPS_ID.RESTORE_ACCOUNT && <Steps.Restore />}
    </>
  );
};

export default Polygon;
