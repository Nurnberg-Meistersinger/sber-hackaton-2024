export enum StrategiesColumnEnum {
    Id = "id",
    Email = "email",
    ProfitPerMonth = "profit_per_month",
    TradesPerMonth = "trades_per_month",
    CreatedAt = "created_at"
}

export let strategiesColumnToEnum = {
    id: StrategiesColumnEnum.Id,
    email: StrategiesColumnEnum.Email,
    profit_per_month: StrategiesColumnEnum.ProfitPerMonth,
    trades_per_month: StrategiesColumnEnum.TradesPerMonth,
    created_at: StrategiesColumnEnum.CreatedAt,
}

export let strategiesColumnToModelField = {
    id: "id",
    email: "email",
    profit_per_month: "avgProfitPerMonth",
    trades_per_month: "avgProofCountPerMonth",
    created_at: "date"
}

export enum StrategiesSortOrderEnum {
    Asc = "asc",
    Desc = "desc"
}
