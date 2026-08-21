import React from 'react';

const ExpenseStatsWidget = ({ grossSalesRevenue, totalExpenseSum, netProfitMargin, profitPercentage, expenseCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Gross Sales */}
      <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
        <span className="text-xs font-black text-amber-950 uppercase tracking-wider">Gross Sales Revenue</span>
        <p className="text-3xl font-black text-gray-900">₹{grossSalesRevenue.toLocaleString()}</p>
        <p className="text-[11px] font-bold text-gray-500">Total billings collected</p>
      </div>

      {/* Total Expenses Logged */}
      <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-rose-900/20 shadow-sm space-y-2">
        <span className="text-xs font-black text-rose-950 uppercase tracking-wider">Total Expenses Logged ({expenseCount})</span>
        <p className="text-3xl font-black text-rose-700">₹{totalExpenseSum.toLocaleString()}</p>
        <p className="text-[11px] font-bold text-gray-500">Stock purchases & shop overheads</p>
      </div>

      {/* Real Net Profit (Warm Gold Card) */}
      <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-6 rounded-3xl border-2 border-amber-400 shadow-md space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-[#4A0E0E] uppercase tracking-wider">Realized Net Profit</span>
          <span className="bg-[#4A0E0E] text-[#FFD700] font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
            {profitPercentage}% Margin
          </span>
        </div>
        <p className="text-3xl font-black text-[#c00000]">₹{netProfitMargin.toLocaleString()}</p>
        <p className="text-[11px] font-bold text-amber-950/80">Revenue minus total recorded expenses</p>
      </div>
    </div>
  );
};

export default ExpenseStatsWidget;
