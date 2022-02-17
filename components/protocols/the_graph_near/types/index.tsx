type ErrorT = {
  message: string;
  file?: string;
  args?: string;
};

type EntryT = {
  msg: string;
  display: (value: string) => string;
  value: string;
};

type sourceT = {
  account: string;
  startBlock: number;
};

type receiptHandlersT = {
  handler: string;
};

type mappingT = {
  apiVersion: string;
  language: string;
  file: string;
  entities: string[];
  receiptHandlers: receiptHandlersT[];
};

type dataSourcesT = {
  kind: string;
  name: string;
  network: string;
  source: sourceT;
  mapping: mappingT;
};

type manifestT = {
  specVersion: string;
  schema: any;
  dataSources: dataSourcesT[];
};

export type ManifestStepStatusesT = {
  block: StepStatusT;
  entities: StepStatusT;
  receiptHandlers: StepStatusT;
};

export type EntityStepStatusesT = {
  entities: StepStatusT;
  account: StepStatusT;
  log: StepStatusT;
};

type StatusMessageT = string;

export type StepStatusT = {
  isValid: boolean;
  message: StatusMessageT;
};

export type {ErrorT, EntryT, manifestT};
