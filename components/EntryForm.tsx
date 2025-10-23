"use client";

import { useEffect, useState } from "react";

export type EntryFormData = {
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
};

interface EntryFormProps {
  categories: string[];
  onSubmit: (data: EntryFormData) => void;
}

const initialForm = (categories: string[]): EntryFormData => ({
  type: "expense",
  category: categories[0] ?? "その他",
  amount: 0,
  description: "",
  date: new Date().toISOString().slice(0, 10)
});

export function EntryForm({ categories, onSubmit }: EntryFormProps) {
  const [formState, setFormState] = useState<EntryFormData>(() => initialForm(categories));
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    setFormState((prev) => {
      if (categories.length === 0) {
        return prev;
      }
      if (!categories.includes(prev.category)) {
        return { ...prev, category: categories[0] };
      }
      return prev;
    });
  }, [categories]);

  const resetForm = () => {
    setFormState(initialForm(categories));
    setErrors(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.description.trim()) {
      setErrors("内容を入力してください");
      return;
    }
    if (!formState.amount || Number.isNaN(formState.amount) || formState.amount <= 0) {
      setErrors("金額は1円以上で入力してください");
      return;
    }

    onSubmit(formState);
    resetForm();
  };

  return (
    <section className="card">
      <div className="card-header">
        <h2>新しい記録を追加</h2>
        {errors && <p className="error">{errors}</p>}
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>収支区分</span>
            <select
              value={formState.type}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, type: event.target.value as EntryFormData["type"] }))
              }
            >
              <option value="income">収入</option>
              <option value="expense">支出</option>
            </select>
          </label>

          <label className="field">
            <span>カテゴリ</span>
            <select
              value={formState.category}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>金額</span>
            <input
              type="number"
              min="0"
              value={formState.amount === 0 ? "" : formState.amount}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, amount: Number(event.target.value) }))
              }
            />
          </label>

          <label className="field">
            <span>日付</span>
            <input
              type="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, date: event.target.value }))
              }
            />
          </label>
        </div>

        <label className="field">
          <span>内容</span>
          <input
            type="text"
            placeholder="メモを入力"
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
          />
        </label>

        <div className="actions">
          <button type="submit">追加する</button>
          <button type="button" className="secondary" onClick={resetForm}>
            クリア
          </button>
        </div>
      </form>
    </section>
  );
}
