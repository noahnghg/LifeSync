import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target, Plus, X } from 'lucide-react';
import { getFinances, getTransactions, createExpense } from '../lib/api';

interface FinancialStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface BudgetCategory {
  name: string;
  budget: number;
  spent: number;
  color: string;
}

const FinanceModule = () => {
  const [financialStats, setFinancialStats] = useState<FinancialStat[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [financesData, transactionsData] = await Promise.all([
          getFinances(),
          getTransactions(),
        ]);

        // Create financial stats from real data
        if (financesData && financesData.length > 0) {
          const financeData = financesData[0];
          
          // Create stats from the real data
          const stats = [
            {
              title: 'Total Income',
              value: `$${financeData.income?.toLocaleString() || '0'}`,
              change: '+8%',
              trend: 'up' as const,
              icon: DollarSign,
              color: 'green'
            },
            {
              title: 'Total Expenses',
              value: `$${financeData.totalExpenses?.toLocaleString() || '0'}`,
              change: '-3%',
              trend: 'down' as const,
              icon: CreditCard,
              color: 'red'
            },
            {
              title: 'Savings',
              value: `$${financeData.savings?.toLocaleString() || '0'}`,
              change: '+12%',
              trend: 'up' as const,
              icon: PiggyBank,
              color: 'blue'
            },
            {
              title: 'Savings Goal',
              value: `$${financeData.savingsGoal?.toLocaleString() || '0'}`,
              change: `${Math.round((financeData.savings / financeData.savingsGoal) * 100) || 0}%`,
              trend: 'up' as const,
              icon: Target,
              color: 'purple'
            }
          ];
          setFinancialStats(stats);

          // Create budget categories from real data
          if (financeData.budgets) {
            const categories = financeData.budgets.map((budget: any) => ({
              name: budget.category,
              budget: budget.budget,
              spent: budget.spent,
              color: getBudgetColor(budget.category)
            }));
            setBudgetCategories(categories);
          }
        }

        setRecentTransactions(transactionsData || []);

      } catch (err) {
        setError('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBudgetColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Housing': 'bg-blue-500',
      'Food': 'bg-green-500',
      'Transportation': 'bg-yellow-500',
      'Entertainment': 'bg-purple-500',
      'Utilities': 'bg-red-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expenseData = {
        description: newExpense.description,
        amount: -Math.abs(parseFloat(newExpense.amount)), // Expenses are negative
        category: newExpense.category,
        date: new Date(newExpense.date).toISOString()
      };
      
      await createExpense(expenseData);
      
      // Refresh data
      const [financesData, transactionsData] = await Promise.all([
        getFinances(),
        getTransactions(),
      ]);
      setRecentTransactions(transactionsData || []);
      
      // Reset form and close modal
      setNewExpense({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
      setShowExpenseModal(false);
    } catch (err) {
      setError('Failed to create expense');
    }
  };

  if (loading) return <div className="p-8">Loading financial data...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance</h1>
            <p className="text-gray-600">Track your financial health and manage your budget</p>
          </div>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {financialStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'red' ? 'bg-red-100' :
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'red' ? 'text-red-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">{transaction.date} • {transaction.category}</p>
                </div>
                <span className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Edit budget
            </button>
          </div>
          <div className="space-y-4">
            {budgetCategories.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-600">
                      ${category.spent} / ${category.budget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{percentage.toFixed(0)}% used</span>
                    <span>${category.budget - category.spent} remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Emergency Fund</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>$5,000 / $10,000</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <p className="text-xs text-blue-700">50% complete</p>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <PiggyBank className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Vacation Fund</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>$2,100 / $3,000</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-green-700">70% complete</p>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Investment Goal</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>$8,500 / $15,000</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '57%' }}></div>
              </div>
              <p className="text-xs text-purple-700">57% complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What did you spend on?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Food">Food</option>
                    <option value="Housing">Housing</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
