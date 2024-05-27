import { Injectable } from "@angular/core";
import * as BN from 'bn.js';
import { PeriodProofResponseInterface, SignalResponseInterface, SmartContractInterface, TraderResponseInterface, WitnessProofRequestInterface } from "src/app/modules/shared/interfaces/smart-contract.interface";
import { WalletService } from "src/app/modules/shared/services/wallet.service";

@Injectable({
    providedIn: 'root'
})
export class Contract implements SmartContractInterface {
    constructor(walletService: WalletService) {
    }

    public async newTrader(email: string): Promise<void> {
    }

    public async addSignal(hash: string): Promise<void> {
        let prices: bigint[] = []

        let bHash = Buffer.alloc(32)
        new BN(hash).toBuffer().copy(bHash)
    }

    public async getTradeLen(): Promise<number> {
        return Number(11)
    }

    public async getSignal(address: string, index: number): Promise<SignalResponseInterface> {
        return {
            blockNumber: BigInt(22),
            hash: "222",
            price: BigInt(2222)
        }
    }

    public async getProofLen(address: string): Promise<number> {
        return Number(33)
    }

    public async getPrevBalanceHash(address: string, index: number): Promise<string> {
        const proof = await this.getPeriodProofs(address, index)

        return "44"
    }

    public async addPeriodProof(witnessProof: WitnessProofRequestInterface, blockNumber: bigint): Promise<void> {
    }

    public async getTradersCount(): Promise<number> {
        return 66
    }

    public async getTrader(index: number|null): Promise<TraderResponseInterface> {
        return {
            address: "myemail@email.net",
            email: "myemail@email.net",
            signalsCount: Number(77),
            proofsCount: Number(777),
            creationBlockNumber: BigInt(7777),
        }
    }

    public async getEmail(address: string): Promise<string> {
        return "getemail@email"
    }

    public async getPeriodProofs(address: string, index: number): Promise<PeriodProofResponseInterface> {
        return {
            y: 88,
            newBalanceHash: "888",
            blockNumber: BigInt(8888),
            proof: {
                pi_a: ["p1"],
                pi_b: [["p2"], ["p3"]],
                pi_c: ["p4"],
            },
            prices: [BigInt(8888), BigInt(8889)],
        }
    }

    public async getTimestampByBlockNumber(blockNumber: bigint): Promise<number> {
        return 1713661576
    }

    public async getCurrentBlockNumber(): Promise<bigint> {
        return BigInt(12345678)
    }

    private removeZeros(hash: Buffer): string {
        let zerosCount = 0
        for (let i = hash.length - 1; i >= 0; i--) {
            if (hash[i] !== 0) {
                break
            }

            zerosCount += 1
        }

        let trailedHash = hash.slice(0, hash.length-zerosCount)

        return (new BN(trailedHash)).toString()
    }
}