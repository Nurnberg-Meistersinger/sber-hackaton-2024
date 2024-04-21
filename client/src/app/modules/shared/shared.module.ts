import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { TimeagoModule } from 'ngx-timeago';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

import { SmartContractInterface } from './interfaces/smart-contract.interface';
import { WalletProviderInterface } from './interfaces/wallet-provider.interface';
import { NoCommaPipe } from './pipes/no-comma.pipe';


@NgModule({
  declarations: [
    NoCommaPipe,
  ],
  exports: [
    NgxMaskDirective,
    NoCommaPipe,
    TimeagoModule,
    ClipboardModule,
    CommonModule,
  ],
  imports: [
    NgxMaskDirective,
    NgxMaskPipe,
    ToastrModule.forRoot(),
    TimeagoModule.forRoot(),
    ClipboardModule,
    CommonModule,
  ],
  providers: [
    provideNgxMask(),
  ],
})
export class SharedModule {
  static withProviders(contract: Type<SmartContractInterface>, walletProvider: Type<WalletProviderInterface>): ModuleWithProviders<SharedModule> {
    return {
       ngModule: SharedModule,
       providers: [
        { provide: 'SmartContractInterface', useClass: contract },
        { provide: 'WalletProviderInterface', useClass: walletProvider },
       ]
    };
  }
}
