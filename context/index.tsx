import {createContext, Dispatch, useContext} from 'react';
import {CHAINS_CONFIG} from 'lib/constants';
import {
  GlobalStateT,
  ProtocolStepsT,
  ProtocolsStateT,
  CHAINS,
  StepType,
  PROTOCOL_STEPS_ID,
  InnerStateT,
} from 'types';
import {getChainId, getStepId, isCompletedStep} from 'utils/context';

type StepsReducerHelperT = {
  index: number;
  data: ProtocolStepsT;
};

const stepsReducerHelper = (
  {index, data}: StepsReducerHelperT,
  step: StepType,
): StepsReducerHelperT => {
  const id = step.id;
  const title = step.title;
  const isOneColumn = !!step.isOneColumn;
  const isSkippable = !!step.skippable || isOneColumn;
  const isCompleted = isSkippable ? true : false;
  const position = index + 1;
  const previousStepId =
    index === 0 ? null : (Object.keys(data)[index - 1] as PROTOCOL_STEPS_ID);
  data[id] = {
    id,
    title,
    isCompleted,
    isSkippable,
    position,
    previousStepId,
    isOneColumn,
    nextStepId: null,
  };

  if (previousStepId) {
    data[previousStepId].nextStepId = id;
  }

  return {index: index + 1, data};
};

const protocolsReducerHelper = (
  protocolsData: ProtocolsStateT,
  chainId: CHAINS,
): ProtocolsStateT => {
  const steps = CHAINS_CONFIG[chainId].steps.reduce(
    (data, step) => stepsReducerHelper(data, step),
    {index: 0, data: {}} as StepsReducerHelperT,
  );
  const stepsIds = Object.keys(steps.data) as PROTOCOL_STEPS_ID[];
  const numberOfSteps = stepsIds.length;
  const firstStepId = stepsIds[0];
  const lastStepId = stepsIds[numberOfSteps - 1];

  protocolsData[chainId] = {
    id: CHAINS_CONFIG[chainId].id,
    label: CHAINS_CONFIG[chainId].label,
    logoUrl: CHAINS_CONFIG[chainId].logoUrl,
    network: CHAINS_CONFIG[chainId].network,
    isActive: CHAINS_CONFIG[chainId].active,
    protocol: CHAINS_CONFIG[chainId].protocol,
    currentStepId: firstStepId,
    steps: steps.data,
    firstStepId,
    lastStepId,
    numberOfSteps,
    innerState: undefined,
  };

  return protocolsData;
};

export const buildInitialState = (): ProtocolsStateT => {
  return Object.keys(CHAINS_CONFIG).reduce(
    (protocolsData, chainId) =>
      protocolsReducerHelper(protocolsData, chainId as CHAINS),
    {} as ProtocolsStateT,
  );
};

export const initGlobalState = {
  currentChainId: undefined,
  protocols: buildInitialState(),
};

export type Action =
  | {type: 'SetCurrentChainId'; currentChainId: CHAINS}
  | {
      type: 'SetIsCompleted';
    }
  | {
      type: 'SetInnerState';
      values: InnerStateT[];
      isCompleted?: boolean;
    }
  | {
      type: 'SetSharedState';
      values: any[];
      isCompleted?: boolean;
    };

export function globalStateReducer(
  state: GlobalStateT,
  action: Action,
): GlobalStateT {
  const getKey = (field: any) => Object.keys(field)[0];
  const getValue = (field: any) => Object.values(field)[0];

  switch (action.type) {
    case 'SetCurrentChainId':
      return {...state, currentChainId: action.currentChainId};

    case 'SetIsCompleted': {
      const chainId = getChainId(state);
      const stepId = getStepId(state);
      return {
        ...state,
        protocols: {
          ...state.protocols,
          [chainId]: {
            ...state.protocols[chainId],
            steps: {
              ...state.protocols[chainId].steps,
              [stepId]: {
                ...state.protocols[chainId].steps[stepId],
                isCompleted: true,
              },
            },
          },
        },
      };
    }

    case 'SetInnerState': {
      const chainId = getChainId(state);
      const stepId = getStepId(state);
      const isCompleted = action.isCompleted ? true : isCompletedStep(state);
      const innerState = state.protocols[chainId].innerState;
      let newInnerState = {...innerState} as InnerStateT;
      action.values.forEach((field: InnerStateT) => {
        const key = getKey(field);
        const value = getValue(field);
        newInnerState = {
          ...newInnerState,
          [key]: value,
        };
      });

      return {
        ...state,
        protocols: {
          ...state.protocols,
          [chainId]: {
            ...state.protocols[chainId],
            steps: {
              ...state.protocols[chainId].steps,
              [stepId]: {
                ...state.protocols[chainId].steps[stepId],
                isCompleted,
              },
            },
            innerState: newInnerState,
          },
        },
      };
    }

    case 'SetSharedState': {
      const chainId = getChainId(state);
      const stepId = getStepId(state);
      const isCompleted = action.isCompleted ? true : isCompletedStep(state);
      let sharedState = {...state.protocols[chainId]};
      action.values.forEach((field) => {
        const key = getKey(field);
        const value = getValue(field);
        sharedState = {
          ...sharedState,
          [key]: value,
        };
      });

      return {
        ...state,
        protocols: {
          ...state.protocols,
          [chainId]: {
            ...sharedState,
            steps: {
              ...sharedState.steps,
              [stepId]: {
                ...sharedState.steps[stepId],
                isCompleted,
              },
            },
          },
        },
      };
    }
    default:
      return state;
  }
}

//-------------------------------------------------
export const GlobalContext = createContext<{
  state: GlobalStateT;
  dispatch: Dispatch<Action>;
}>({
  state: {
    currentChainId: undefined,
    protocols: buildInitialState(),
  },
  dispatch: () => null,
});

export const useGlobalState = () => useContext(GlobalContext);
