
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target } from 'lucide-react';

const FinanceModule = () => {
  const financialStats = [
    {
      title: 'Total Balance',
      value: '$12,450.00',
      change: '+5.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Monthly Expenses',
      value: '$3,240.00',
      change: '-12.3%',
      trend: 'down',
      icon: CreditCard,
      color: 'red'
    },
    {
      title: 'Savings Goal',
      value: '$8,500.00',
      change: '+8.7%',
      trend: 'up',
      icon: PiggyBank,
      color: 'blue'
    },
    {
      title: 'Investment Return',
      value: '$1,420.00',
      change: '+15.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const recentTransactions = [
    { id: 1, description: 'Grocery Shopping', amount: -85.50, date: '2024-01-15', category: 'Food' },
    { id: 2, description: 'Salary Deposit', amount: 3500.00, date: '2024-01-15', category: 'Income' },
    { id: 3, description: 'Netflix Subscription', amount: -15.99, date: '2024-01-14', category: 'Entertainment' },
    { id: 4, description: 'Gas Station', amount: -45.20, date: '2024-01-13', category: 'Transportation' },
    { id: 5, description: 'Investment Dividend', amount: 125.00, date: '2024-01-12', category: 'Investment' }
  ];

  const budgetCategories = [
    { name: 'Housing', budget: 1200, spent: 1200, color: 'bg-blue-500' },
    { name: 'Food', budget: 600, spent: 420, color: 'bg-green-500' },
    { name: 'Transportation', budget: 300, spent: 180, color: 'bg-yellow-500' },
    { name: 'Entertainment', budget: 200, spent: 150, color: 'bg-purple-500' },
    { name: 'Utilities', budget: 150, spent: 135, color: 'bg-red-500' }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance</h1>
        <p className="text-gray-600">Track your financial health and manage your budget</p>
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
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
    </div>
  );
};

export default FinanceModule;
