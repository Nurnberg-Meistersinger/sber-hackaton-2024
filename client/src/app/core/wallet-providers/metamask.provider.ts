import { Injectable } from "@angular/core";
import detectEthereumProvider from "@metamask/detect-provider";

import { WalletProviderInterface } from "src/app/modules/shared/interfaces/wallet-provider.interface";

@Injectable()
export class MetaMaskProvider implements WalletProviderInterface {

    public async connect(): Promise<string> {
        const provider = await detectEthereumProvider();

        if (provider) {
            this.startApp(provider);
        } else {
            console.log("Please install MetaMask!");
        }

        return this.getAccount()
    }

    public startApp(provider) {
        if (provider !== window.ethereum) {
          console.error("Do you have multiple wallets installed?");
        }
    }

    public async getAccount() {
        const accounts = await window.ethereum
            .request({ method: "eth_requestAccounts" })
            .catch((err) => {
                if (err.code === 4001) {
                    console.log("Please connect to MetaMask.");
                } else {
                    console.error("Error", err);
                }
            });
        return accounts[0];
      }
}