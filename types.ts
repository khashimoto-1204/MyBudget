export type EntryType = "income" | "expense";

export interface BudgetEntry {
  id: string;
  type: EntryType;
  category: string;
  amount: number;
  description: string;
  date: string; // ISO date string yyyy-mm-dd
}
