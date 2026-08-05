import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Clock, FileText, Award, FileSpreadsheet } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';

interface NotificationDropdownProps {
  onSelectLink?: (linkId?: string, jenis?: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onSelectLink }) => {
  const { currentUser, notifikasi, markNotifAsRead, markAllNotifAsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const myNotifs = notifikasi.filter(n => n.user_id === currentUser.id);
  const unreadCount = myNotifs.filter(n => !n.sudah_dibaca).length;

  const getIcon = (jenis: string) => {
    switch (jenis) {
      case 'tugas_baru':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'nilai_masuk':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'jawaban_masuk':
        return <FileSpreadsheet className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-full transition focus:outline-none"
        title="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-sm text-slate-800">Notifikasi</span>
              {unreadCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} Baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllNotifAsRead}
                className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center space-x-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {myNotifs.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Belum ada notifikasi saat ini.
              </div>
            ) : (
              myNotifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotifAsRead(n.id);
                    if (n.link_id && onSelectLink) {
                      onSelectLink(n.link_id, n.jenis);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition flex items-start space-x-3 ${
                    !n.sudah_dibaca ? 'bg-emerald-50/40 font-medium' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 shrink-0 mt-0.5">
                    {getIcon(n.jenis)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-slate-800 leading-snug ${!n.sudah_dibaca ? 'font-semibold' : ''}`}>
                      {n.pesan}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatDateTime(n.tanggal)}
                    </span>
                  </div>
                  {!n.sudah_dibaca && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
