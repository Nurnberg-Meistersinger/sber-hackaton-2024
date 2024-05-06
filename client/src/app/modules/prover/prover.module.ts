import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";

import { ProverRoutingModule } from './prover-routing.module';
import { ProverComponent } from './prover.component';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { AddSignalComponent } from './components/signals/components/add-signal/add-signal.component';
import { GenerateProofComponent } from './components/proof/components/generate-proof/generate-proof.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SignalsComponent } from './components/signals/signals.component';
import { ProofComponent } from './components/proof/proof.component';
import { FollowersComponent } from './components/followers/followers.component';
import { CurrencyComponent } from './components/signals/components/add-signal/components/currency/currency.component';
import { AmountComponent } from './components/signals/components/add-signal/components/amount/amount.component';
import { NonceComponent } from './components/signals/components/add-signal/components/nonce/nonce.component';
import { ActionComponent } from './components/signals/components/add-signal/components/action/action.component';
import { FinalComponent } from './components/signals/components/add-signal/components/final/final.component';
import { MetaMaskProvider } from 'src/app/core/wallet-providers/metamask.provider';
import { Contract } from 'src/app/api/sepolia/contract';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConnectionComponent } from './components/connection/connection.component';

@NgModule({
  declarations: [
    AddAccountComponent,
    AddSignalComponent,
    GenerateProofComponent,
    ProverComponent,
    SignalsComponent,
    ProofComponent,
    FollowersComponent,
    CurrencyComponent,
    AmountComponent,
    NonceComponent,
    ActionComponent,
    FinalComponent,
    ConnectionComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ProverRoutingModule,
    SharedModule.withProviders(Contract, MetaMaskProvider),
    NgxSpinnerModule,
  ]
})
export class ProverModule { }
