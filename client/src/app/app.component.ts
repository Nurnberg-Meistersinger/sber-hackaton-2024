import { Component, OnInit } from '@angular/core';

import { PriceService } from './modules/shared/services/price.service';
import SharedConsts from "./core/consts/shared-consts";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public title = 'Sber Hackaton 2024';
  public isAvailable = false

  public witness: ArrayBuffer|null = null;
  public provingKey: ArrayBuffer|null = null;
  public income: object;

  constructor(
    private priceService: PriceService,
  ) {}

  ngOnInit(): void {
    this.initKeys()
    this.initPriceOracle()
  }

  private initKeys(): void {
    fetch("./assets/proving_key.bin").then( (response) => {
      return response.arrayBuffer();
    }).then( (b: ArrayBuffer) => {
        this.provingKey = b;
    });

    fetch("./assets/witness.bin").then( (response) => {
        return response.arrayBuffer();
    }).then( (b: ArrayBuffer) => {
        this.witness = b;
    });

    fetch("./assets/income.json").then( (response: Response) => {
        return response.json();
    }).then( (b: object) => {
        this.income = b;
    });
  }

  private initPriceOracle(): void {
    let btcBasePrice = 60000;

    this.priceService.nextBtcPrice(btcBasePrice * (10 ** SharedConsts.maxDecimalDigits))

    setInterval(() => {
      let diff = Math.floor((Math.random()*100)-50)
  
      this.priceService.nextBtcPrice((btcBasePrice+diff) * (10 ** SharedConsts.maxDecimalDigits))
   }, 2000);

   this.priceService.subscribeToBtcPrice()
  }
}
