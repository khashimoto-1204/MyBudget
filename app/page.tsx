"use client";

import { useEffect, useMemo, useState } from "react";
import { EntryForm, type EntryFormData } from "../components/EntryForm";
import { EntryList } from "../components/EntryList";
import { FilterBar } from "../components/FilterBar";
import { BudgetSummary } from "../components/BudgetSummary";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import type { BudgetEntry } from "../types";

const STORAGE_KEY = "mybudget.entries.v1";

const DEFAULT_CATEGORIES = [
  "食費",
  "日用品",
  "住居費",
  "公共料金",
  "交通費",
  "医療",
  "教育・育児",
  "交際費",
  "娯楽",
  "給与",
  "副収入",
  "その他"
];

interface FilterState {
  month: string;
  category: string;
  type: "all" | "income" | "expense";
  search: string;
}

const initialFilters: FilterState = {
  month: "",
  category: "all",
  type: "all",
  search: ""
};

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function HomePage() {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: BudgetEntry[] = JSON.parse(saved);
        setEntries(parsed);
      } catch (error) {
        console.error("failed to parse entries from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const categories = useMemo(() => {
    const customCategories = Array.from(new Set(entries.map((entry) => entry.category)));
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...customCategories]));
  }, [entries]);

  const handleAddEntry = (data: EntryFormData) => {
    const newEntry: BudgetEntry = {
      id: generateId(),
      ...data,
      amount: Math.round(data.amount)
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (filters.month && entry.date.slice(0, 7) !== filters.month) {
          return false;
        }
        if (filters.category !== "all" && entry.category !== filters.category) {
          return false;
        }
        if (filters.type !== "all" && entry.type !== filters.type) {
          return false;
        }
        if (filters.search && !entry.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, filters]);

  const totalIncome = filteredEntries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpense = filteredEntries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const balance = totalIncome - totalExpense;

  const uniqueDays = useMemo(() => new Set(filteredEntries.map((entry) => entry.date)).size, [filteredEntries]);

  const averageIncomePerDay = uniqueDays ? totalIncome / uniqueDays : 0;
  const averageExpensePerDay = uniqueDays ? totalExpense / uniqueDays : 0;

  const categoryStats = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    for (const entry of filteredEntries) {
      if (!map.has(entry.category)) {
        map.set(entry.category, { income: 0, expense: 0 });
      }
      const current = map.get(entry.category)!;
      if (entry.type === "income") {
        current.income += entry.amount;
      } else {
        current.expense += entry.amount;
      }
    }
    return Array.from(map.entries()).map(([category, values]) => ({ category, ...values }));
  }, [filteredEntries]);

  return (
    <main>
      <header className="hero">
        <h1>MyBudget 家計簿</h1>
        <p>
          日々の収支をかんたんに記録し、カテゴリ別に内訳を可視化できる家計簿アプリです。ブラウザの
          localStorage に保存されるので、ページを再読み込みしてもデータは維持されます。
        </p>
      </header>

      <BudgetSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        averageIncomePerDay={averageIncomePerDay}
        averageExpensePerDay={averageExpensePerDay}
        entryCount={filteredEntries.length}
      />

      <EntryForm categories={categories} onSubmit={handleAddEntry} />

      <FilterBar categories={categories} filters={filters} onChange={setFilters} />

      <EntryList entries={filteredEntries} onDelete={handleDelete} />

      <CategoryBreakdown stats={categoryStats} />
    </main>
  );
}
