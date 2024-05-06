import { Injectable } from "@angular/core";
import * as BN from 'bn.js';
import Web3, { ContractAbi, MethodNotImplementedError } from "web3";
import { PeriodProofResponseInterface, SignalResponseInterface, SmartContractInterface, TraderResponseInterface, WitnessProofRequestInterface } from "src/app/modules/shared/interfaces/smart-contract.interface";
import { WalletService } from "src/app/modules/shared/services/wallet.service";
import { tradeContract } from "./abi/trade.contract";

@Injectable({
    providedIn: 'root'
})
export class Contract implements SmartContractInterface {
    private web3: Web3
    private publicKey: string
    private contract: any

    constructor(walletService: WalletService) {
        if (this.publicKey) {
            return
        }

        walletService.address$.subscribe((publicKey: string) => {
            if (!publicKey) {
                return
            }
            this.publicKey = publicKey
        })

        this.web3 = new Web3((window as any).ethereum)
        this.contract = new this.web3.eth.Contract(tradeContract.abi, tradeContract.address);
    }

    public async newTrader(email: string): Promise<void> {
        let result = await this.contract.methods.newTrader(email).send({
            from: this.publicKey,
        })
        console.log("on-chain newTrader send return:", result)

        return result
    }

    public async addSignal(hash: string): Promise<void> {
        let result = await this.contract.methods.addSignal(hash).send({
            from: this.publicKey,
        })
        console.log("on-chain addSignal send return:", result)

        return
    }

    public async getTradeLen(): Promise<number> {
        let result = await this.contract.methods.getTradeLen(this.publicKey).call()
        console.log("on-chain getTradeLen call return:", result)

        return Number(result)
    }

    public async getSignal(address: string, index: number): Promise<SignalResponseInterface> {
        let result = await this.contract.methods.getSignal(address, index).call()
        console.log("on-chain getSignal call return:", result)

        return {
            blockNumber: BigInt(result.blockNumber),
            hash: result.hash,
            price: BigInt(index%2 === 0 ? 66560000000000 : 66590000000000)
        }
    }

    public async getProofLen(address: string): Promise<number> {
        let result = await this.contract.methods.getProofLen(address).call()
        console.log("on-chain getProofLen call return:", result)

        return Number(result)
    }

    public async getPrevBalanceHash(address: string, index: number): Promise<string> {
        const proof = await this.getPeriodProofs(address, index)

        return proof.newBalanceHash
    }

    public async addPeriodProof(witnessProof: WitnessProofRequestInterface, prices: bigint[]): Promise<void> {
    }

    public async getTradersCount(): Promise<number> {
        let result = await this.contract.methods.getTradersCount().call()
        console.log("on-chain getTradersCount call return:", result)

        return Number(result)
    }

    public async getTrader(index: number|null): Promise<TraderResponseInterface> {
        let result = await this.contract.methods.traders(index).call()
        console.log('on-chain getTrader call return:', result)

        const address: string = result as string
                
        return {
            address: address,
            email: await this.getEmail(address),
            signalsCount: 0,
            proofsCount: await this.getProofLen(address),
            creationBlockNumber: BigInt(10),
        }
    }

    public async getEmail(address: string): Promise<string> {
        let result = await this.contract.methods.metaData(address).call()
        console.log('on-chain getEmail call return:', result)

        return result as string
    }

    public async getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface> {
        let result = await this.contract.methods.periodProofs(address, index).call()
        console.log('on-chain getPeriodProofs call return:', result)

        return {
            y: Number(result.yield),
            newBalanceHash: result.newBalanceHash as string,
            blockNumber: BigInt(result.blockNumber),
            proof: {
                pi_a: result.proof['pi_a'],
                pi_b: result.proof["pi_b"],
                pi_c: result.proof['pi_c'],
            },
            prices: [BigInt(8888), BigInt(8889)],
        }
    }

    public async getPeriodProofsPage(address: string, page: number): Promise<PeriodProofResponseInterface[]> {
        throw new MethodNotImplementedError()
    }

    public async getTimestampByBlockNumber(blockNumber: bigint): Promise<number> {
        let result = 1713661576
        console.log('on-chain getTimestampByBlockNumber call return:', result)

        return result
    }
}