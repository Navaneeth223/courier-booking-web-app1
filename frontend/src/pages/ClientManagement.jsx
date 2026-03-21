import React, { useState } from 'react';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';

const ClientManagement = () => {
  const [clients, setClients] = useState([
    { id: 1, name: 'Alice Tech Corp', email: 'alice@tech.com', phone: '9876543210', totalOrders: 45 },
    { id: 2, name: 'Bob Logistics', email: 'bob@logistics.in', phone: '8877665544', totalOrders: 128 }
  ]);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-10 py-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Enterprise Clients</h1>
            <p className="text-text-dim mt-1 font-medium">Manage corporate accounts and bulk shipping privileges.</p>
        </div>
        <button 
            onClick={() => setShowAdd(!showAdd)}
            className={`px-8 h-12 rounded-xl font-bold transition-all ${showAdd ? 'bg-white/5 text-white border border-white/10' : 'btn-primary shadow-lg shadow-primary/20'}`}
        >
          {showAdd ? 'Close Manifest' : '+ Register Client'}
        </button>
      </div>

      {showAdd && (
        <div className="premium-card animate-fade-in border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-8">Register New Corporate Node</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <Input label="Enterprise Name" placeholder="e.g. Zenit Solutions" />
            <Input label="Secure Email" type="email" />
            <Input label="Access Phone" />
            <div className="md:col-span-3 text-right pt-4 border-t border-white/5 mt-4">
              <button 
                type="button"
                onClick={() => setShowAdd(false)}
                className="btn-primary px-12 h-12"
              >
                Establish Client Profile
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="premium-card p-0 overflow-hidden border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-text-dim text-[11px] uppercase font-bold tracking-[1px]">
              <tr>
                <th className="px-8 py-5">Corporate Entity</th>
                <th className="px-8 py-5">Contact Matrix</th>
                <th className="px-8 py-5">Global Orders</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-white text-lg">{client.name}</p>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 opacity-70">Verified Partner</p>
                  </td>
                  <td className="px-8 py-6 font-medium">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">{client.email}</span>
                        <span className="text-xs text-text-dim opacity-60">{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20">
                            {client.totalOrders}
                        </div>
                        <span className="text-xs text-text-dim font-bold uppercase tracking-tighter opacity-40">Orders</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">Edit</button>
                        <button className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg text-xs font-bold transition-colors">Terminate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
