export interface SmartContractInterface {
    newTrader(email: string): Promise<void>
    addSignal(hash: string, price: bigint): Promise<void>
    getTradeLen(): Promise<number>
    getSignal(address: string, index: number): Promise<SignalResponseInterface>
    getProofLen(address: string): Promise<number>
    getPrevBalanceHash(address: string, index: number): Promise<string>
    addPeriodProof(witnessProof: WitnessProofRequestInterface, blockNumber: bigint, price: bigint): Promise<void>

    getTradersCount(): Promise<number>
    getTrader(index: number|null): Promise<TraderResponseInterface>
    getEmail(address: string): Promise<string>
    getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface>

    getTimestampByBlockNumber(blockNumber: bigint): Promise<number>
    getCurrentBlockNumber(): Promise<bigint>
}

export interface TraderResponseInterface {
    address: string,
    email: string,
    signalsCount: number,
    proofsCount: number,
    creationBlockNumber: bigint,
}

export interface SignalResponseInterface {
    blockNumber: bigint
    hash: string
    price: number
}

export interface WitnessProofRequestInterface {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
    publicSignals: string[]
}

export interface PeriodProofResponseInterface {
    y: number,
    newBalanceHash: string,
    blockNumber: bigint,
    proof: {
        pi_a: string[],
        pi_b: string[][],
        pi_c: string[]
    },
    prices: number[]
}