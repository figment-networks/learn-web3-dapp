import { BN } from 'avalanche';

export type AvalancheConnectResponse = string

export type AvalancheTransferResponse = {
	txID: string
}

export type AvalancheTransferErrorResponse = {
	message: string
}

export type AvalancheQueryResponse = {
	pChainHeight: BN
	pChainMinStake: {
		minValidatorStake: BN
		minDelegatorStake: BN
	}
	pBlockchainId: string
	xBlockchainId: string
	cBlockchainId: string
	txFee: {
		txFee: BN
		creationTxFee: BN
	}
}

export type AvalancheKeypairType = {
	addressString: string
}