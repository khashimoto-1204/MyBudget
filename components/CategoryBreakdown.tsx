"use client";

interface CategoryStat {
  category: string;
  income: number;
  expense: number;
}

interface CategoryBreakdownProps {
  stats: CategoryStat[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });

export function CategoryBreakdown({ stats }: CategoryBreakdownProps) {
  if (stats.length === 0) {
    return null;
  }

  const sortedByExpense = [...stats].sort((a, b) => b.expense - a.expense);
  const sortedByIncome = [...stats].sort((a, b) => b.income - a.income);

  return (
    <section className="card">
      <div className="card-header">
        <h2>カテゴリ別内訳</h2>
      </div>
      <div className="category-columns">
        <div>
          <h3>支出トップ</h3>
          <ul>
            {sortedByExpense.slice(0, 5).map((item) => (
              <li key={`expense-${item.category}`}>
                <span>{item.category}</span>
                <span className="expense">-{formatCurrency(item.expense)}</span>
              </li>
            ))}
            {sortedByExpense.length === 0 && <li>データがありません</li>}
          </ul>
        </div>
        <div>
          <h3>収入トップ</h3>
          <ul>
            {sortedByIncome.slice(0, 5).map((item) => (
              <li key={`income-${item.category}`}>
                <span>{item.category}</span>
                <span className="income">+{formatCurrency(item.income)}</span>
              </li>
            ))}
            {sortedByIncome.length === 0 && <li>データがありません</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
