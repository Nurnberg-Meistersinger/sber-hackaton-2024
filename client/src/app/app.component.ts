import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { PriceService } from './modules/shared/services/price.service';
import SharedConsts from "./core/consts/shared-consts";
import { Observable, map } from 'rxjs';

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
    this.coinMarketCapPrice().subscribe((btcPrice: number) => {
        this.priceService.nextBtcPrice((btcPrice))
      }
    )

    setInterval(() => {
      this.coinMarketCapPrice().subscribe((btcPrice: number) => {
          this.priceService.nextBtcPrice((btcPrice))
        }
      )

   }, 10000);

   this.priceService.subscribeToBtcPrice()
  }

  private coinMarketCapPrice(): Observable<number> {
    // Note: CoinMarketCap API Proxy to workaround CORS problems
    const url = "http://localhost:5000/cryptocurrency/quotes/latest"
    const btcParams = "slug=bitcoin&convert=USD"

    return this.http.get(
      url+"?"+btcParams,
      {headers: {"Accept": "application/json"}}
    ).pipe(
        map(
          (response: Object) => {
            return (response["data"]["1"]["quote"]["USD"]["price"]) * (10 ** SharedConsts.maxDecimalDigits)
          }
        )
    )
  }
}
