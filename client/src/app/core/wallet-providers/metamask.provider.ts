import { Injectable } from "@angular/core";
import detectEthereumProvider from "@metamask/detect-provider";

import { WalletProviderInterface } from "src/app/modules/shared/interfaces/wallet-provider.interface";

@Injectable()
export class MetaMaskProvider implements WalletProviderInterface {

    public async connectWithAccount(): Promise<string> {
        const provider = await detectEthereumProvider();

        if (provider) {
            await this.start(provider);
        } else {
            console.log("Please install MetaMask!");
        }

        return this.getAccount()
    }

    public async connectWithNetwork(): Promise<boolean> {
        const provider = await detectEthereumProvider();

        if (provider) {
            return await this.start(provider);
        } else {
            console.log("Please install MetaMask!");
        }
    }

    public async start(provider): Promise<boolean> {
        if (provider !== window.ethereum) {
          console.error("Do you have multiple wallets installed?");
          return false
        }

        const chainId = await provider.request({ method: 'eth_chainId' });
        const siberiuChainId = '0x1b198'
        if (chainId === siberiuChainId){
            console.log("Already connected to Siberium network!");
            return false
        }
        
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: siberiuChainId}],
            });
            console.log("Connected to Siberium network!")
        } catch (switchError) {
            if (switchError.code === 4902) {
                console.log("Siberium network is not available in your MetaMask. Please add it manually.")
                return false
            }
            console.log("Failed to switch to the Siberium network")
            return false
        }

        return true
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