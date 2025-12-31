
import React, { useState, useMemo } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Plus, CreditCard, Banknote, Landmark, Check, History, ReceiptText } from 'lucide-react';
import { Customer, DebtTransaction, PaymentMethod } from '../types';

interface DebtManagementModalProps {
  customer: Customer;
  onClose: () => void;
  onUpdate: (updatedCustomer: Customer) => void;
}

const DebtManagementModal: React.FC<DebtManagementModalProps> = ({ customer, onClose, onUpdate }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  const history = useMemo(() => customer.debtHistory || [], [customer]);
  
  const stats = useMemo(() => {
    const totalCredit = history.filter(h => h.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = history.filter(h => h.type === 'payment').reduce((acc, curr) => acc + curr.amount, 0);
    return { totalCredit, totalPaid };
  }, [history]);

  const handleProcessPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newTransaction: DebtTransaction = {
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'payment',
      amount: amount,
      method: paymentMethod,
    };

    const updatedCustomer: Customer = {
      ...customer,
      balance: customer.balance + amount,
      debtHistory: [newTransaction, ...history]
    };

    onUpdate(updatedCustomer);
    setShowPaymentForm(false);
    setPaymentAmount('');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#333984]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#333984]">{customer.name}</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Debt Management Ledger</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F4F6FF] p-6 rounded-[2rem]">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Balance</p>
              <h3 className={`text-2xl font-black ${customer.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                ${Math.abs(customer.balance).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                <span className="text-xs ml-1 font-bold">{customer.balance < 0 ? 'Owed' : 'Credit'}</span>
              </h3>
            </div>
            <div className="bg-red-50 p-6 rounded-[2rem]">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Total Credited</p>
              <h3 className="text-2xl font-black text-red-500">
                ${stats.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="bg-green-50 p-6 rounded-[2rem]">
              <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Total Paid</p>
              <h3 className="text-2xl font-black text-green-500">
                ${stats.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </h3>
            </div>
          </div>

          {/* Payment Form */}
          {!showPaymentForm ? (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full py-6 border-2 border-dashed border-[#2A46FF]/30 text-[#2A46FF] font-black rounded-[2rem] hover:bg-blue-50/50 transition-all flex items-center justify-center gap-3 group"
            >
              <div className="p-2 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                <Plus size={18} />
              </div>
              Record Repayment
            </button>
          ) : (
            <div className="bg-gray-50 p-8 rounded-[3rem] animate-in slide-in-from-top duration-300 border border-blue-100">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-black text-[#333984] uppercase tracking-widest">Process Repayment</h4>
                <button onClick={() => setShowPaymentForm(false)} className="text-gray-400 hover:text-red-500">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#333984] opacity-20">$</span>
                  <input
                    autoFocus
                    type="number"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-white pl-12 pr-6 py-6 rounded-[2rem] text-3xl font-black text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                  />
                </div>

                <div className="flex gap-2 p-2 bg-white rounded-[1.5rem]">
                  {(['Cash', 'Card', 'Transfer'] as PaymentMethod[]).map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        paymentMethod === m ? 'bg-[#2A46FF] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {m === 'Cash' && <Banknote size={16} />}
                      {m === 'Card' && <CreditCard size={16} />}
                      {m === 'Transfer' && <Landmark size={16} />}
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleProcessPayment}
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="w-full py-5 bg-[#333984] text-white font-black rounded-[2rem] hover:bg-[#2A46FF] shadow-xl shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check size={20} strokeWidth={3} />
                  Complete Payment
                </button>
              </div>
            </div>
          )}

          {/* History Timeline */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <History size={20} className="text-[#333984]" />
              <h4 className="text-sm font-black text-[#333984] uppercase tracking-widest">Transaction Timeline</h4>
            </div>
            
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-5 bg-white border border-gray-50 rounded-[2rem] group hover:border-[#2A46FF]/20 transition-all">
                    <div className={`p-4 rounded-2xl ${tx.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {tx.type === 'payment' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[#333984] capitalize">{tx.type === 'payment' ? `Repayment (${tx.method})` : `Credit Purchase`}</p>
                          <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                            <ReceiptText size={10} /> {tx.reference || tx.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-black ${tx.type === 'payment' ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.type === 'payment' ? '+' : '-'}${tx.amount.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-20">
                  <ReceiptText size={48} className="mx-auto mb-4" />
                  <p className="font-bold">No financial history found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtManagementModal;
