
import React from 'react';
import { User, Mail, Shield, Phone, Clock, Award, Star, TrendingUp } from 'lucide-react';

const Profile: React.FC = () => {
  const userStats = [
    { label: 'Total Sales', value: '458', icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Efficiency', value: '98%', icon: Star, color: 'text-yellow-500' },
    { label: 'Shift Time', value: '6h 45m', icon: Clock, color: 'text-green-500' },
    { label: 'Points', value: '1,250', icon: Award, color: 'text-purple-500' },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Enterprise Identity</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Personnel authentication & performance analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-12 flex flex-col items-center animate-in fade-in duration-500">
            <div className="relative mb-10 group">
              <div className="w-48 h-48 rounded-[3.5rem] bg-white border-4 border-white shadow-2xl overflow-hidden p-2 transition-transform duration-500 group-hover:scale-105">
                <img
                  src="https://picsum.photos/seed/manager/400/400"
                  alt="Admin"
                  className="w-full h-full object-cover rounded-[2.8rem]"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-10 h-10 rounded-2xl shadow-xl"></div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Alex Nguyen</h2>
            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Store Manager • ID: #4401</p>

            <div className="w-full space-y-5 pt-10 mt-10 border-t border-slate-100/50">
              <div className="flex items-center gap-5 text-[13px] text-slate-600 font-bold">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-400"><Mail size={18} /></div>
                alex.n@fastpos.com
              </div>
              <div className="flex items-center gap-5 text-[13px] text-slate-600 font-bold">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-400"><Phone size={18} /></div>
                +84 987 654 321
              </div>
              <div className="flex items-center gap-5 text-[13px] text-primary font-bold">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Shield size={18} /></div>
                System Administrator
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            {userStats.map((stat, idx) => (
              <div key={idx} className="glass-card p-10 flex flex-col gap-6 hover:scale-105 transition-transform shadow-lg group">
                <div className={`p-5 rounded-2xl bg-white shadow-sm w-fit ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-12">
            <h3 className="text-xl font-extrabold text-slate-800 mb-10 tracking-tight">Performance Spectrum</h3>
            <div className="space-y-8">
              {[
                { label: 'Customer Satisfaction Score', value: 95, color: 'bg-emerald-500' },
                { label: 'Weekly Gross Target Acquisition', value: 78, color: 'bg-primary' },
                { label: 'Punctuality Index', value: 100, color: 'bg-slate-800' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xl font-extrabold text-slate-800">{item.value}%</span>
                  </div>
                  <div className="h-5 w-full bg-slate-900/5 rounded-2xl overflow-hidden p-1 shadow-inner border border-slate-100">
                    <div
                      className={`h-full ${item.color} rounded-xl shadow-lg transition-all duration-1000 ease-out`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
