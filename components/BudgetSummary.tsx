"use client";

interface BudgetSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  averageExpensePerDay: number;
  averageIncomePerDay: number;
  entryCount: number;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });

const formatNumber = (value: number) =>
  value.toLocaleString("ja-JP", { maximumFractionDigits: 0 });

export function BudgetSummary({
  totalIncome,
  totalExpense,
  balance,
  averageExpensePerDay,
  averageIncomePerDay,
  entryCount
}: BudgetSummaryProps) {
  return (
    <section className="summary-grid">
      <div className="summary-card balance">
        <h3>残高</h3>
        <p className="amount">{formatCurrency(balance)}</p>
        <p className="caption">収入 - 支出</p>
      </div>
      <div className="summary-card income">
        <h3>総収入</h3>
        <p className="amount">{formatCurrency(totalIncome)}</p>
        <p className="caption">1日平均 {formatCurrency(Math.round(averageIncomePerDay))}</p>
      </div>
      <div className="summary-card expense">
        <h3>総支出</h3>
        <p className="amount">{formatCurrency(totalExpense)}</p>
        <p className="caption">1日平均 {formatCurrency(Math.round(averageExpensePerDay))}</p>
      </div>
      <div className="summary-card neutral">
        <h3>記録数</h3>
        <p className="amount">{formatNumber(entryCount)}</p>
        <p className="caption">現在のフィルターでの収支記録</p>
      </div>
    </section>
  );
}
