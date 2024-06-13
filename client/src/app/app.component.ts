import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { PriceService } from './modules/shared/services/price.service';
import SharedConsts from "./core/consts/shared-consts";
import { Observable, map } from 'rxjs';
import MathHelper from './core/helpers/math.helper';

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
    private http: HttpClient,
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
    // Note: in case price API does not work
    let randomBtcPriceFunc = () => {
      let btcPrice = 68000 + MathHelper.floorNumber(Math.random() * 30)
      this.priceService.nextBtcPrice((btcPrice * (10 ** SharedConsts.maxDecimalDigits)))
    }

    this.coinMarketCapPrice().subscribe(
      (btcPrice: number) => {
        this.priceService.nextBtcPrice((btcPrice))
      },
      randomBtcPriceFunc
    )

    setInterval(() => {
      this.coinMarketCapPrice().subscribe(
        (btcPrice: number) => {
          this.priceService.nextBtcPrice((btcPrice))
        },
        randomBtcPriceFunc
      )

   }, 3000);

   this.priceService.subscribeToBtcPrice()
  }

  private coinMarketCapPrice(): Observable<number> {
    const url = "https://api.coinbase.com/v2/prices/BTC-USD/buy"

    return this.http.get(
      url,
      {headers: {"Accept": "application/json"}}
    ).pipe(
        map(
          (response: Object) => {
            return MathHelper.floorNumber((response["data"]["amount"])) * (10 ** SharedConsts.maxDecimalDigits)
          }
        )
    )
  }
}
