import { Injectable } from "@angular/core";
import { WalletProviderInterface } from "src/app/modules/shared/interfaces/wallet-provider.interface";

@Injectable()
export class PhantomProvider implements WalletProviderInterface {

    public async connect(): Promise<string> {
        return new Promise((resolve) => {
        })
    }
}