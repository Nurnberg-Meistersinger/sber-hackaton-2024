export interface WalletProviderInterface {
    connectWithAccount(): Promise<string|null>
    connectWithNetwork(): Promise<boolean>
}