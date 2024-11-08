import { Inject, Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { VerificationProverEnum } from 'src/app/core/enums/verification-trader.enum';
import { SmartContractInterface } from '../../shared/interfaces/smart-contract.interface';
import { TraderModel } from '../../shared/models/trader.model';
import { StrategyModel } from '../models/strategy.model';
import { ProofItem } from '../models/proof-item';
import SharedConsts from 'src/app/core/consts/shared-consts';
import MathHelper from 'src/app/core/helpers/math.helper';

@Injectable({
  providedIn: 'root'
})
export class TradersService {

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
  ) {}

  public getTrader(index: number): Observable<TraderModel> {
    return from(this.getTraderModel(index))
  }

  public async getTraderModel(index: number): Promise<TraderModel> {
    const trader = await this.contract.getTrader(index)

    let periodProofList = []
    for (let j = 0; j < trader.proofsCount; j++) {
      periodProofList.push(await this.contract.getPeriodProofs(trader.address, j))
    }

    let proof: ProofItem[] = []
    let prevProofBalance = MathHelper.decimalDigitsNumber(SharedConsts.initialUsdBalance)
    let prevTimestamp = await this.contract.getTimestampByBlockNumber(trader.creationBlockNumber)
    const createdDate = new Date(prevTimestamp)
    for (let i = 0; i < periodProofList.length; i++) {
      const periodProof = periodProofList[i]

      const currentTimestamp = await this.contract.getTimestampByBlockNumber(periodProof.blockNumber)

      proof.push(new ProofItem(i, periodProof.y, prevProofBalance, new Date(prevTimestamp), new Date(currentTimestamp)))

      prevProofBalance = periodProof.y
      prevTimestamp = currentTimestamp
    }

    return new TraderModel(index, trader.email, trader.address, proof, createdDate)
  }

  public getTraders(): Observable<StrategyModel> {
    let tradersSubject = new Subject<StrategyModel>();

    (async () => await this.traders(tradersSubject))()

    return tradersSubject
  }

  private async traders(tradersSubject: Subject<StrategyModel>): Promise<void> {
    const now = new Date()
    const tradersCount = await this.contract.getTradersCount()
    if (tradersCount == 0) {
      tradersSubject.complete()
      return
    }

    let allTradersAsync: Promise<TraderModel>[] = []
    for (let i = 0; i < tradersCount; i++) {
      allTradersAsync.push(this.getTraderModel(i))
    }

    let allTraders = await Promise.all(allTradersAsync)
    let sortedTraders = allTraders.sort((x, y) => x.id < y.id ? -1 : 1);

    for (let i = 0; i < tradersCount; i++) {
      const traderModel = sortedTraders[i]

      const createdDate = traderModel.date
      const initBalance = MathHelper.decimalDigitsNumber(SharedConsts.initialUsdBalance)

      let profitSum = 0
      let proofCount = 0
      let proofIds = []
      for (let j = 0; j < traderModel.proof.length; j++) {
        profitSum += (traderModel.proof[j].yieldNumber - traderModel.proof[j].prevYieldNumber)
        proofCount++
        proofIds.push(j)
      }

      const monthDiffForAvg = this.monthDiff(createdDate, now) || 1
      const avgProfitPerMonth = 100 * (profitSum / initBalance) / monthDiffForAvg
      const avgProofCountPerMonth = proofCount / monthDiffForAvg

      tradersSubject.next(new StrategyModel(
        i, traderModel.email, traderModel.address, proofIds,
        avgProfitPerMonth, avgProofCountPerMonth,
        VerificationProverEnum.Unverified, createdDate
      ))
    }
  }

  private monthDiff(from: Date, to: Date) {
    var months;
    months = (to.getFullYear() - from.getFullYear()) * 12;
    months -= from.getMonth();
    months += to.getMonth();
    return months <= 0 ? 0 : months;
  }
}
