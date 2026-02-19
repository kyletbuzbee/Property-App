'use client';
import { useState } from 'react';

export default function ExpenseTracker({ budget }: { budget: number }) {
  const [expenses, setExpenses] = useState<{id: string, category: string, amount: number}[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const addExpense = () => {
    if (!amount) return;
    setExpenses([...expenses, { id: Date.now().toString(), category, amount: Number(amount) }]);
    setAmount('');
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
      <h3 className="text-lg font-semibold text-white mb-4">Rehab Budget</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-dark-700 rounded">
          <div className="text-xs text-dark-400">Budget</div>
          <div className="text-lg font-bold text-white">${budget.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-dark-700 rounded">
          <div className="text-xs text-dark-400">Remaining</div>
          <div className="text-lg font-bold text-emerald-400">${(budget - totalSpent).toLocaleString()}</div>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input 
          className="bg-dark-900 border border-dark-600 rounded p-2 text-sm text-white w-1/2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input 
          className="bg-dark-900 border border-dark-600 rounded p-2 text-sm text-white w-1/2"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addExpense} className="bg-primary-600 px-4 rounded text-white text-sm">Add</button>
      </div>

      <div className="space-y-2">
        {expenses.map(e => (
          <div key={e.id} className="flex justify-between text-sm text-dark-300 border-b border-dark-700 pb-1">
            <span>{e.category}</span>
            <span>-${e.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}