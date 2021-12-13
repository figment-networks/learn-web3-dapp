import {Web3AuthProvider} from '@figment-ceramic/context/idx';
import {CERAMIC_NETWORKS, CERAMIC_PROTOCOLS, PROTOCOL_STEPS_ID} from 'types';
import Nav from '@figment-ceramic/components/nav';
import {
  BasicProfile,
  Connect,
  CustomDefinition,
  LogIn,
} from '@figment-ceramic/components/steps';
import {useGlobalState} from 'context';
import {getChainId, getStepId} from 'utils/context';
import {getNodeURL} from 'utils/datahub';
import LocalStorageIdentityStore from '@figment-ceramic/lib/identityStore/LocalStorage';

const Ceramic: React.FC = () => {
  const {state} = useGlobalState();
  const chainId = getChainId(state);
  const stepId = getStepId(state);
  const nodeUrl = getNodeURL(
    chainId,
    CERAMIC_NETWORKS.TESTNET,
    CERAMIC_PROTOCOLS.HTTP,
    'devnet',
  );
  // IdentityStore is responsible for persisting address, did and basic profile
  // Here we use LocalStorage identity store, but we could easily create another abstractions for ie. storing data in cookies
  const identityStore = new LocalStorageIdentityStore('learn-web3-dapp');

  return (
    <Web3AuthProvider ceramicNodeUrl={nodeUrl} identityStore={identityStore}>
      <div key={stepId}>
        <Nav />
        {stepId === PROTOCOL_STEPS_ID.PROJECT_SETUP}
        {stepId === PROTOCOL_STEPS_ID.CHAIN_CONNECTION && <Connect />}
        {stepId === PROTOCOL_STEPS_ID.LOGIN && <LogIn />}
        {stepId === PROTOCOL_STEPS_ID.BASIC_PROFILE && <BasicProfile />}
        {stepId === PROTOCOL_STEPS_ID.CUSTOM_DEFINITION && <CustomDefinition />}
      </div>
    </Web3AuthProvider>
  );
};

export default Ceramic;
