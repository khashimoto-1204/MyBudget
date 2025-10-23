"use client";

interface FilterState {
  month: string;
  category: string;
  type: "all" | "income" | "expense";
  search: string;
}

interface FilterBarProps {
  categories: string[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterBar({ categories, filters, onChange }: FilterBarProps) {
  const setFilter = <Key extends keyof FilterState>(key: Key, value: FilterState[Key]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="card filters">
      <div className="card-header">
        <h2>絞り込み</h2>
      </div>
      <div className="filter-grid">
        <label className="field">
          <span>年月</span>
          <input
            type="month"
            value={filters.month}
            onChange={(event) => setFilter("month", event.target.value)}
          />
        </label>

        <label className="field">
          <span>カテゴリ</span>
          <select value={filters.category} onChange={(event) => setFilter("category", event.target.value)}>
            <option value="all">すべて</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>区分</span>
          <select value={filters.type} onChange={(event) => setFilter("type", event.target.value as FilterState["type"])}>
            <option value="all">収支すべて</option>
            <option value="income">収入のみ</option>
            <option value="expense">支出のみ</option>
          </select>
        </label>

        <label className="field search">
          <span>キーワード</span>
          <input
            type="search"
            placeholder="内容で検索"
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
          />
        </label>
      </div>
      <div className="actions">
        <button
          type="button"
          className="secondary"
          onClick={() =>
            onChange({ month: "", category: "all", type: "all", search: "" })
          }
        >
          リセット
        </button>
      </div>
    </section>
  );
}
