import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Calendar,
  CheckCircle2,
  Ban,
  Trash2,
  Eye,
  X,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserProfile } from '../../types';

export const AdminUsers: React.FC = () => {
  const { users, orders, registerUser, updateUserProfile, deleteUser } = useStore();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newEmail.trim()) {
      alert('নাম, মোবাইল নম্বর এবং ইমেইল অবশ্যই পূরণ করতে হবে।');
      return;
    }

    registerUser(newName, newPhone, newEmail, newAddress, newCity);
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
  };

  const handleToggleStatus = (user: UserProfile) => {
    const newStatus = user.status === 'Active' ? 'Blocked' : 'Active';
    updateUserProfile({ ...user, status: newStatus });
  };

  const getUserOrders = (user: UserProfile) => {
    return orders.filter(
      (o) =>
        o.userId === user.id ||
        o.customerPhone.replace(/[^0-9]/g, '') === user.phone.replace(/[^0-9]/g, '') ||
        o.customerEmail?.toLowerCase() === user.email.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-stone-900 font-serif">
              কাস্টমার ও ইউজার প্রোফাইল ডাটাবেজ
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
              মোট: {users.length} জন
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            কেনাকাটা করার জন্য নিবন্ধিত সকল গ্রাহকের নাম, মোবাইল নম্বর, ইমেইল ও অর্ডার হিস্টোরি
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম, ফোন বা ইমেইল দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700/20"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন কাস্টমার যোগ</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">কাস্টমার নাম ও ছবি</th>
                <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                <th className="py-3.5 px-4">ইমেইল এড্রেস</th>
                <th className="py-3.5 px-4">ঠিকানা ও এরিয়া</th>
                <th className="py-3.5 px-4 text-center">মোট অর্ডার</th>
                <th className="py-3.5 px-4 text-right">মোট ব্যয় (৳)</th>
                <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    কোনো কাস্টমার অ্যাকাউন্ট পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userOrders = getUserOrders(user);
                  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0) || user.totalSpent;

                  return (
                    <tr key={user.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {user.name.slice(0, 1)}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 text-sm block">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              আইডি: #{user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-semibold text-stone-800 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{user.phone}</span>
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-stone-600 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span className="truncate max-w-[180px]">{user.email}</span>
                        </span>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4">
                        <span className="text-stone-600 truncate max-w-[200px] block">
                          {user.address || 'ঠিকানা দেওয়া হয়নি'}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {user.city === 'Inside Dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                        </span>
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 font-mono font-bold text-stone-800">
                          {userOrders.length || user.totalOrders} টি
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-emerald-900 font-sans text-sm">
                          ৳{totalSpent.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {user.status === 'Active' ? 'সক্রিয়' : 'ব্লকড'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                            title="বিস্তারিত প্রোফাইল ও অর্ডার"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              user.status === 'Active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={user.status === 'Active' ? 'ব্লক করুন' : 'আনব্লক করুন'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি "${user.name}" এর প্রোফাইল মুছে ফেলতে চান?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail & Orders Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-5 border-b border-stone-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-amber-300 font-bold text-xl flex items-center justify-center">
                {selectedUser.name.slice(0, 1)}
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-lg font-serif">
                  {selectedUser.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                  <span className="font-mono text-emerald-800 font-bold">{selectedUser.phone}</span>
                  <span>·</span>
                  <span className="font-mono">{selectedUser.email}</span>
                </div>
              </div>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">ঠিকানা:</span>
                <span className="font-semibold text-stone-900">{selectedUser.address || 'এন/এ'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">এরিয়া:</span>
                <span className="font-semibold text-stone-900">
                  {selectedUser.city === 'Inside Dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">নিবন্ধন তারিখ:</span>
                <span className="font-mono text-stone-700">
                  {new Date(selectedUser.createdAt).toLocaleDateString('bn-BD', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <h4 className="font-bold text-stone-900 text-sm mb-3">এই কাস্টমারের অর্ডারসমূহ:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {getUserOrders(selectedUser).length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
                  এখনো কোনো অর্ডার সম্পন্ন হয়নি।
                </div>
              ) : (
                getUserOrders(selectedUser).map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-900">#{order.id}</span>
                      <p className="text-[11px] text-stone-500">
                        {order.items.map((i) => i.banglaName || i.productName).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-900">৳{order.total}</span>
                      <span className="block text-[10px] text-amber-700">{order.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-stone-900 text-base font-serif mb-4">
              নতুন কাস্টমার একাউন্ট তৈরি
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  কাস্টমার নাম <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="পুরো নাম"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  ইমেইল এড্রেস <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">ডেলিভারি ঠিকানা</label>
                <textarea
                  rows={2}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="ঠিকানা..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer mt-2"
              >
                প্রোফাইল সেভ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
