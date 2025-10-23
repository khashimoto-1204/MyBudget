"use client";

import { BudgetEntry } from "../types";

interface EntryListProps {
  entries: BudgetEntry[];
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });

const formatDate = (isoDate: string) => new Date(isoDate + "T00:00:00").toLocaleDateString("ja-JP", {
  year: "numeric",
  month: "short",
  day: "numeric"
});

export function EntryList({ entries, onDelete }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <section className="card">
        <div className="card-header">
          <h2>履歴</h2>
        </div>
        <p className="empty">まだ記録がありません。</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>履歴</h2>
        <span className="count">{entries.length} 件</span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>日付</th>
              <th>内容</th>
              <th>カテゴリ</th>
              <th>収支</th>
              <th>金額</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.date)}</td>
                <td>{entry.description}</td>
                <td>{entry.category}</td>
                <td className={entry.type === "income" ? "income" : "expense"}>
                  {entry.type === "income" ? "収入" : "支出"}
                </td>
                <td className={entry.type === "income" ? "income" : "expense"}>
                  {entry.type === "income" ? "+" : "-"}
                  {formatCurrency(entry.amount)}
                </td>
                <td>
                  <button className="ghost" onClick={() => onDelete(entry.id)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
