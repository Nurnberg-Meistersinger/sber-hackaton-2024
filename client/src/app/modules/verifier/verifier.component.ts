import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { WalletService } from '../shared/services/wallet.service';

@Component({
  selector: 'app-verifier',
  templateUrl: './verifier.component.html',
  styleUrls: ['./verifier.component.less']
})
export class VerifierComponent implements OnInit {
  constructor(
    private location: Location,
    private menuService: MenuService,
    private walletService: WalletService,
  ) { }

  ngOnInit(): void {
    this.initMenu()

    this.initNetworkConnection()
  }

  private initMenu(): void {
    let states = this.location.normalize(this.location.path()).split('/')
    
    this.menuService.changeState(states[1], states[2])
  }

  private async initNetworkConnection(): Promise<void> {
    const reloadRequired = await this.walletService.connectNetwork()

    if (reloadRequired) {
      window.location.reload()
    }
  }

}
