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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Client'}
        </Button>
      </div>

      {showAdd && (
        <div className="premium-card animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold mb-4">Register New Client</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input label="Client Name" placeholder="e.g. Zenit Solutions" />
            <Input label="Email" type="email" />
            <Input label="Phone" />
            <div className="md:col-span-3 text-right">
              <Button onClick={() => setShowAdd(false)}>Save Client</Button>
            </div>
          </form>
        </div>
      )}

      <div className="premium-card p-0">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Client Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Orders</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4 font-medium">{client.name}</td>
                <td className="px-6 py-4 text-gray-500">{client.email}</td>
                <td className="px-6 py-4 text-gray-500">{client.phone}</td>
                <td className="px-6 py-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    {client.totalOrders}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary mr-3 hover:underline text-sm font-semibold">Edit</button>
                  <button className="text-danger hover:underline text-sm font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientManagement;
