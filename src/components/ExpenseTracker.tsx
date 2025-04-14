"use client";
import React from 'react';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import UserSelector from "@/components/users/UserSelector";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

const COLORS = ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#DB7093', '#FF9EF5', '#F48FB1', '#EC407A'];

export default function PookifiedExpenseTracker() {
  const currencies: CurrencyOption[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee' }
  ];

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Food', amount: 150, date: '2025-04-10' },
    { id: '2', category: 'Rent', amount: 800, date: '2025-04-01' },
    { id: '3', category: 'Transport', amount: 100, date: '2025-04-05' }
  ]);

  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(currencies[0]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [reminders, setReminders] = useState<string[]>([]);
  const [newReminder, setNewReminder] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    });
  };
  const groupMembers = ["Alice", "Bob", "Charlie"];
  const [currentUser, setCurrentUser] = useState("Alice");

  <UserSelector
  users={groupMembers}
  currentUser={currentUser}
  setCurrentUser={setCurrentUser}
  />

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.category || newExpense.amount <= 0) return;

    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString()
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ category: '', amount: 0, date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleCurrencyChange = (currency: CurrencyOption) => {
    setSelectedCurrency(currency);
    setShowCurrencyModal(false);
  };

  const convertAmount = (amount: number): string => {
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
  };

  const getCategoryTotals = () => {
    const categoryMap = new Map<string, number>();
    expenses.forEach(expense => {
      const currentTotal = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentTotal + expense.amount);
    });
    return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
  };

  const handleAddReminder = () => {
    if (newReminder.trim()) {
      setReminders([...reminders, newReminder.trim()]);
      setNewReminder('');
    }
  };

  const chartData = getCategoryTotals();
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = [
    '🍰 Food', '🏠 Housing', '🚗 Transport', '🎮 Entertainment', 
    '💡 Utilities', '🏥 Healthcare', '🛍️ Shopping', '📚 Education', '✈️ Travel', '🎁 Other'
  ];

  return (
    <div className="p-4 bg-pink-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg border-2 border-pink-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pink-600">✨ Expense Tracker ✨</h1>
          <div className="relative">
            <button 
              onClick={() => setShowCurrencyModal(!showCurrencyModal)}
              className="flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors border border-pink-300"
            >
              <span className="mr-2">{selectedCurrency.code}</span>
              <span className="text-xs">▼</span>
            </button>
            {showCurrencyModal && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-pink-200">
                {currencies.map(currency => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency)}
                    className="block w-full text-left px-4 py-2 hover:bg-pink-50 transition-colors"
                  >
                    <span className="font-medium">{currency.code}</span> - {currency.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="mb-8 p-5 border-2 border-pink-200 rounded-xl bg-pink-50">
          <h2 className="text-xl font-bold mb-4 text-pink-700">Add New Expense</h2>
          <form onSubmit={handleAddExpense} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-40">
              <label className="block text-sm font-medium mb-1 text-pink-600">Category</label>
              <select
                name="category"
                value={newExpense.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-32">
              <label className="block text-sm font-medium mb-1 text-pink-600">
                Amount ({selectedCurrency.symbol})
              </label>
              <input
                type="number"
                name="amount"
                value={newExpense.amount || ''}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex-1 min-w-32">
              <label className="block text-sm font-medium mb-1 text-pink-600">Date</label>
              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                 Add Expense
              </button>
            </div>
          </form>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Expenses Table */}
          <div className="md:col-span-2 overflow-hidden rounded-xl border-2 border-pink-200 bg-white">
            <h2 className="text-xl font-bold p-3 bg-pink-100 text-pink-700">Expense List</h2>
            <div className="overflow-x-auto max-h-96">
              {expenses.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-pink-50">
                      <th className="p-3 text-left text-pink-700">Category</th>
                      <th className="p-3 text-left text-pink-700">Amount</th>
                      <th className="p-3 text-left text-pink-700">Date</th>
                      <th className="p-3 text-left text-pink-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-t border-pink-100 hover:bg-pink-50">
                        <td className="p-3">{expense.category}</td>
                        <td className="p-3">{convertAmount(expense.amount)}</td>
                        <td className="p-3">{expense.date}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-pink-500 hover:text-pink-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-4 text-pink-400">No expenses yet. Add some!</p>
              )}
            </div>
            <div className="p-3 bg-pink-50 border-t-2 border-pink-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-pink-700">Total</span>
                <span className="font-bold text-lg text-pink-700">{convertAmount(totalAmount)}</span>
              </div>
            </div>
          </div>
          
          {/* Reminders Section */}
          <div className="border-2 border-pink-200 rounded-xl p-4 bg-pink-50">
            <h2 className="text-xl font-bold text-pink-700 mb-3">📝 To-Do / Buy List</h2>
            <div className="space-y-2 mb-3">
              {reminders.length > 0 ? reminders.map((item, idx) => (
                <div key={idx} className="bg-white border border-pink-100 px-3 py-2 rounded-lg shadow-sm text-pink-700">
                  {item}
                </div>
              )) : <p className="text-pink-400 text-sm">No items yet. Add a reminder!</p>}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newReminder}
                onChange={e => setNewReminder(e.target.value)}
                placeholder="e.g. buy something, clean kitchen"
                className="flex-1 px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
              <button
                onClick={handleAddReminder}
                className="px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-full shadow"
              >
                ➕
              </button>
            </div>
          </div>
          
          {/* Expense Chart */}
          <div className="rounded-xl border-2 border-pink-200 overflow-hidden">
            <h2 className="text-xl font-bold p-3 bg-pink-100 text-pink-700">Expense Distribution</h2>
            <div className="p-4">
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => convertAmount(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-pink-50 rounded-lg">
                  <p className="text-pink-400">Add expenses to see the chart</p>
                </div>
              )}
              <div className="mt-4 p-3 bg-pink-50 rounded-lg text-center text-pink-600 text-sm">
                Click on chart sections to see details
              </div>
            </div>
          </div>
        </div> {/* grid end */}
      </div> {/* card container end */}
    </div> /* root end */
  );
}
