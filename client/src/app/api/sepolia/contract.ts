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
        return await this.contract.methods.newTrader(email).send({
            from: this.publicKey,
        })
    }

    public async addSignal(hash: string): Promise<void> {
        await this.contract.methods.addSignal(hash).send({
            from: this.publicKey,
        })
    }

    public async getTradeLen(): Promise<number> {
        let result = await this.contract.methods.getTradeLen(this.publicKey).call()

        return Number(result)
    }

    public async getSignal(address: string, index: number): Promise<SignalResponseInterface> {
        let result = await this.contract.methods.getSignal(address, index).call()

        return {
            blockNumber: BigInt(result.blockNumber),
            hash: result.hash,
            price: BigInt(0),
        }
    }

    public async getProofLen(address: string): Promise<number> {
        let result = await this.contract.methods.getProofLen(address).call()

        return Number(result)
    }

    public async getPrevBalanceHash(address: string, index: number): Promise<string> {
        const proof = await this.getPeriodProofs(address, index)

        return proof.newBalanceHash
    }

    public async addPeriodProof(witnessProof: WitnessProofRequestInterface, blockNumber: bigint): Promise<void> {
        await this.contract.methods.addPeriodProof(
            Number(witnessProof.publicSignals[1]),
            {
                'pi_a': [BigInt(witnessProof.pi_a[0]), BigInt(witnessProof.pi_a[1])],
                'pi_b': [
                    [BigInt(witnessProof.pi_b[0][0]), BigInt(witnessProof.pi_b[0][1])],
                    [BigInt(witnessProof.pi_b[1][0]), BigInt(witnessProof.pi_b[1][1])],
                ],
                'pi_c': [BigInt(witnessProof.pi_c[0]), BigInt(witnessProof.pi_c[1])],
            },
            witnessProof.publicSignals[0],
            blockNumber,
        ).send({
            from: this.publicKey,
        })
    }

    public async getTradersCount(): Promise<number> {
        let result = await this.contract.methods.getTradersCount().call()

        return Number(result)
    }

    public async getTrader(index: number|null): Promise<TraderResponseInterface> {
        let address: string = this.publicKey
        if (index !== null) {
            let result = await this.contract.methods.traders(index).call()

            address = result as string
        }

        let creationBlockNumber = BigInt(0)
        try {
            let signal = await this.getSignal(address, 0)
            creationBlockNumber = signal.blockNumber
        } catch (err) {
            console.log('creation block number: no signals for trader')
        }
                
        return {
            address: address,
            email: await this.getEmail(address),
            signalsCount: 0,
            proofsCount: await this.getProofLen(address),
            creationBlockNumber: creationBlockNumber,
        }
    }

    public async getEmail(address: string): Promise<string> {
        let result = await this.contract.methods.metaData(address).call()

        return result as string
    }

    public async getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface> {
        // Note: contract does not return block number right now, so get block number of second signal's of current proof
        let blockNumber = BigInt(0)
        try {
            let signal = await this.getSignal(address, index*2+1)
            blockNumber = signal.blockNumber
        } catch (err) {
            console.log('get period proofs: no signals for proof')
        }

        let result = await this.contract.methods.getPeriodProof(address, index).call()

        let periodProof = {
            y: Number(result.yield),
            newBalanceHash: result.newBalanceHash as string,
            blockNumber: result.blockNumber,
            proof: {
                pi_a: result.proof['pi_a'].map((x: bigint) => x.toString()),
                pi_b: result.proof["pi_b"].map((x: bigint[]) => x.map((y: bigint) => y.toString())),
                pi_c: result.proof['pi_c'].map((x: bigint) => x.toString()),
            },
            prices: [BigInt(60000000000000), BigInt(60000000000000)],
        }

        return periodProof
    }

    public async getTimestampByBlockNumber(blockNumber: bigint): Promise<number> {
        let result = await this.web3.eth.getBlock(blockNumber)

        return Number(result.timestamp)
    }

    public async getCurrentBlockNumber(): Promise<bigint> {
        let result = await this.web3.eth.getBlockNumber()

        return BigInt(result)
    }
}