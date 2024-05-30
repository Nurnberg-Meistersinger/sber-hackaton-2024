import { Component, OnInit } from '@angular/core';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { StrategiesFilters } from '../../models/strategies';
import { StrategiesColumnEnum, strategiesColumnToEnum, strategiesColumnToModelField, StrategiesSortOrderEnum } from '../../models/strategies.enum';
import { StrategyModel } from '../../models/strategy.model';
import { TradersService } from '../../services/traders.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ZkService } from '../../../shared/services/zk.service';
import { VerificationProverEnum, verificationProverText } from '../../../../core/enums/verification-trader.enum';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.less']
})
export class StrategiesComponent implements OnInit {
  public faPlusCircle = faPlusCircle
  public faMinusCircle = faMinusCircle

  public verificationStatesText = verificationProverText

  strategies: StrategyModel[]

  sortColumn: StrategiesColumnEnum = StrategiesColumnEnum.Id
  sortOrder: StrategiesSortOrderEnum = StrategiesSortOrderEnum.Asc

  filters: StrategiesFilters = new StrategiesFilters()
  isAdditionalFiltersOpened: boolean = false

  constructor(
    private tradersService: TradersService,
    private toastr: ToastService,
    private zkService: ZkService
  ) { }

  ngOnInit(): void {
    this.initStrategies()
  }

  private initStrategies(): void {
    this.tradersService.getTraders().subscribe(
      (strategies: StrategyModel) => {
        if (!this.strategies) {
          this.strategies = []
        }

        this.strategies.push(strategies)
      },
      undefined,
      () => { this.strategies = []}
    )
  }

  public get ColumnEnum(): typeof StrategiesColumnEnum {
    return StrategiesColumnEnum; 
  }

  public get SortOrderEnum(): typeof StrategiesSortOrderEnum {
    return StrategiesSortOrderEnum; 
  }

  public verifyTrader(strategy: StrategyModel): void {
    if (strategy.state != VerificationProverEnum.Unverified) {
      return
    }

    strategy.setState(VerificationProverEnum.Processing)

    this.zkService.verifyAll(strategy.address, strategy.proofIds).subscribe(
      (isSuccess: boolean) => {
        strategy.setState(isSuccess ? VerificationProverEnum.Success : VerificationProverEnum.Failed)
      },
      (error: any) => {
        strategy.setState(VerificationProverEnum.Failed)
        this.toastr.error('Something went wrong')
        console.log(error)
      }
    )
  }

  public sortColumnBy(column: string): void {
    let newSortColumn = strategiesColumnToEnum[column]

    if (newSortColumn === this.sortColumn && this.sortOrder === StrategiesSortOrderEnum.Asc) {
      this.sortOrder = StrategiesSortOrderEnum.Desc
    } else {
      this.sortOrder = StrategiesSortOrderEnum.Asc
    }

    this.sortColumn = newSortColumn

    let sortField = strategiesColumnToModelField[column]
    this.strategies = this.strategies.sort((x: StrategyModel, y: StrategyModel) => {
      if (x[sortField] > y[sortField]) {
        return this.sortOrder === StrategiesSortOrderEnum.Asc ? 1 : -1
      }

      if (x[sortField] < y[sortField]) {
        return this.sortOrder === StrategiesSortOrderEnum.Asc ? -1 : 1
      }

      return 0
    })
  }

  public strategyCheck(strategy: StrategyModel): boolean {
    if (this.filters.email) {
      if (!strategy.email.includes(this.filters.email)) {
        return false
      }
    }

    if (this.filters.profitFrom != null) {
      if (strategy.avgProfitPerMonth < this.filters.profitFrom) {
        return false
      }
    }

    if (this.filters.profitTo != null) {
      if (strategy.avgProfitPerMonth > this.filters.profitTo) {
        return false
      }
    }

    if (this.filters.countFrom != null) {
      if (2 * strategy.avgProofCountPerMonth < this.filters.countFrom) {
        return false
      }
    }

    if (this.filters.countTo != null) {
      if (2 * strategy.avgProofCountPerMonth > this.filters.countTo) {
        return false
      }
    }
    
    return true
  }

  public onFilterInput(event: any, filterColumn: string): void {
    let value = event.target.value
    if (value == "") {
      value = null
    }
    
    this.filters[filterColumn] = value;
  }

  public flipAdditionalFilters(): void {
    this.isAdditionalFiltersOpened = !this.isAdditionalFiltersOpened
  }

}
