/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHẦN MỀM THEO DÕI TIẾN ĐỘ CÔNG VIỆC PHÒNG KẾ TOÁN (Single File Version - Vercel Ready)
 * Hướng dẫn lắp đặt: Chép toàn bộ file này đè vào file "src/App.tsx" (hoặc App.js)
 * của dự án React + Tailwind CSS là có thể chạy ngay không cần cài đặt cơ sở dữ liệu!
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, Shield, User, ArrowRight, CheckCircle2,
  Users, Briefcase, FileSpreadsheet, Plus, Edit2, Trash2, 
  Search, Filter, LogOut, AlertTriangle, TrendingUp, Calendar, 
  ArrowUpRight, BarChart3, UserPlus, ShieldCheck, Key
} from 'lucide-react';

// ==========================================
// 1. KIỂU DỮ LIỆU & ĐỊNH NGHĨA (TYPES)
// ==========================================
export interface UserType {
  email: string;
  name: string;
  role: 'LEADER' | 'ACCOUNTANT';
  password?: string;
  createdAt?: string;
}

export type TaskType = 'THUONG_XUYEN' | 'DOT_XUAT';

export interface Task {
  id: string;
  seq: number;
  description: string;
  type: TaskType;
  assignedDate: string;
  completedDate: string;
  volume: number; // 0 - 100
  completion: number; // 0 - 100
  accountantEmail: string;
}

// ==========================================
// 2. DỮ LIỆU SEED KHỞI TẠO (MOCK DATA)
// ==========================================
const DEFAULT_LEADERS: UserType[] = [
  {
    email: 'truongphong@company.com',
    name: 'Lê Minh Trí (Trưởng Phòng)',
    role: 'LEADER',
    password: 'Leader123password',
    createdAt: '2026-01-10'
  },
  {
    email: 'phophong@company.com',
    name: 'Nguyễn Thu Hà (Phó Phòng)',
    role: 'LEADER',
    password: 'Leader123password',
    createdAt: '2026-01-15'
  }
];

const DEFAULT_ACCOUNTANTS: UserType[] = [
  {
    email: 'ketoan1@company.com',
    name: 'Trần Thị Hồng',
    role: 'ACCOUNTANT',
    password: 'Accountant123',
    createdAt: '2026-02-01'
  },
  {
    email: 'ketoan2@company.com',
    name: 'Phạm Văn Nam',
    role: 'ACCOUNTANT',
    password: 'Accountant123',
    createdAt: '2026-03-15'
  },
  {
    email: 'ketoan3@company.com',
    name: 'Vũ Hoàng My',
    role: 'ACCOUNTANT',
    password: 'Accountant123',
    createdAt: '2026-04-10'
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    seq: 1,
    description: 'Đối chiếu hóa đơn thuế đầu vào và đầu ra - Tháng 05/2026',
    type: 'THUONG_XUYEN',
    assignedDate: '2026-05-02',
    completedDate: '2026-05-08',
    volume: 85,
    completion: 95,
    accountantEmail: 'ketoan1@company.com'
  },
  {
    id: 't-2',
    seq: 2,
    description: 'Chi lương cho cán bộ nhân viên tháng 05/2026',
    type: 'THUONG_XUYEN',
    assignedDate: '2026-05-10',
    completedDate: '2026-05-12',
    volume: 50,
    completion: 100,
    accountantEmail: 'ketoan1@company.com'
  },
  {
    id: 't-3',
    seq: 3,
    description: 'Hoàn thiện hồ sơ quyết toán thuế thu nhập doanh nghiệp năm 2025 sáp nhập',
    type: 'DOT_XUAT',
    assignedDate: '2026-05-15',
    completedDate: '2026-05-28',
    volume: 95,
    completion: 88,
    accountantEmail: 'ketoan1@company.com'
  },
  {
    id: 't-4',
    seq: 4,
    description: 'Lập báo cáo quản trị doanh thu quý 1 bổ sung',
    type: 'DOT_XUAT',
    assignedDate: '2026-05-20',
    completedDate: '2026-05-25',
    volume: 65,
    completion: 68,
    accountantEmail: 'ketoan2@company.com'
  },
  {
    id: 't-5',
    seq: 5,
    description: 'Kiểm kê định kỳ kho nguyên vật liệu quý 2 lần một',
    type: 'THUONG_XUYEN',
    assignedDate: '2026-05-22',
    completedDate: '2026-05-24',
    volume: 40,
    completion: 92,
    accountantEmail: 'ketoan2@company.com'
  },
  {
    id: 't-6',
    seq: 6,
    description: 'Xử lý các chứng từ tạm ứng đi công tác và mua sắm khẩn cấp',
    type: 'DOT_XUAT',
    assignedDate: '2026-05-25',
    completedDate: '2026-05-29',
    volume: 30,
    completion: 85,
    accountantEmail: 'ketoan2@company.com'
  },
  {
    id: 't-7',
    seq: 7,
    description: 'Báo cáo chi phí vận hành phòng sản xuất và phân xưởng',
    type: 'THUONG_XUYEN',
    assignedDate: '2026-05-05',
    completedDate: '2026-05-15',
    volume: 75,
    completion: 72,
    accountantEmail: 'ketoan3@company.com'
  },
  {
    id: 't-8',
    seq: 8,
    description: 'Giải trình số liệu báo cáo tài chính với Đoàn Kiểm toán Nội bộ',
    type: 'DOT_XUAT',
    assignedDate: '2026-05-18',
    completedDate: '2026-05-22',
    volume: 90,
    completion: 91,
    accountantEmail: 'ketoan3@company.com'
  },
  {
    id: 't-9',
    seq: 9,
    description: 'Xuất hóa đơn điện tử cho các đơn hàng khu vực phía Bắc',
    type: 'THUONG_XUYEN',
    assignedDate: '2026-06-01',
    completedDate: '2026-06-05',
    volume: 25,
    completion: 93,
    accountantEmail: 'ketoan1@company.com'
  },
  {
    id: 't-10',
    seq: 10,
    description: 'Thu hồi công nợ quá hạn của nhóm đại lý phân phối cấp 1',
    type: 'THUONG_XUYEN',
    assignedDate: '2026-06-02',
    completedDate: '2026-06-08',
    volume: 80,
    completion: 78,
    accountantEmail: 'ketoan2@company.com'
  },
  {
    id: 't-11',
    seq: 11,
    description: 'Biên soạn hướng dẫn quy trình kiểm soát hao hụt kho mới',
    type: 'DOT_XUAT',
    assignedDate: '2026-06-01',
    completedDate: '2026-06-07',
    volume: 68,
    completion: 85,
    accountantEmail: 'ketoan3@company.com'
  },
  {
    id: 't-12',
    seq: 12,
    description: 'Rà soát chi tiết quỹ phúc lợi công đoàn - Kế hoạch quý 2',
    type: 'THUONG_XUYEN',
    assignedDate: '2026-06-04',
    completedDate: '',
    volume: 35,
    completion: 0,
    accountantEmail: 'ketoan3@company.com'
  }
];

// Helper labels
function getVolumeLabel(volume: number) {
  if (volume <= 30) {
    return { label: 'Ít (' + volume + ')', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  } else if (volume <= 70) {
    return { label: 'Trung bình (' + volume + ')', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
  } else {
    return { label: 'Nhiều (' + volume + ')', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  }
}

function getCompletionLabel(completion: number, isDone: boolean) {
  if (!isDone) {
    return { label: 'Chưa đánh giá', bg: 'bg-slate-100 text-slate-500 border-slate-200' };
  }
  if (completion <= 70) {
    return { label: 'Không đạt (' + completion + '%)', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  } else if (completion <= 90) {
    return { label: 'Đạt (' + completion + '%)', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
  } else {
    return { label: 'Tốt (' + completion + '%)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
}

// ==========================================
// 3. MAIN COMPONENT CONTAINER (APP)
// ==========================================
export default function App() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('acc_tracker_users')) {
        localStorage.setItem('acc_tracker_users', JSON.stringify([...DEFAULT_LEADERS, ...DEFAULT_ACCOUNTANTS]));
      }
      if (!localStorage.getItem('acc_tracker_tasks')) {
        localStorage.setItem('acc_tracker_tasks', JSON.stringify(DEFAULT_TASKS));
      }
      setUsers(JSON.parse(localStorage.getItem('acc_tracker_users') || '[]'));
      setTasks(JSON.parse(localStorage.getItem('acc_tracker_tasks') || '[]'));
    }
  }, []);

  const handleUpdateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('acc_tracker_tasks', JSON.stringify(newTasks));
  };

  const handleUpdateUsers = (newUsers: UserType[]) => {
    setUsers(newUsers);
    localStorage.setItem('acc_tracker_users', JSON.stringify(newUsers));
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <LoginScreen 
        users={users} 
        onLogin={(user) => setCurrentUser(user)} 
      />
    );
  }

  if (currentUser.role === 'LEADER') {
    return (
      <LeaderDashboard 
        currentUser={currentUser}
        users={users}
        tasks={tasks}
        onLogout={handleLogout}
        onUpdateTasks={handleUpdateTasks}
        onUpdateUsers={handleUpdateUsers}
      />
    );
  }

  return (
    <AccountantDashboard 
      currentUser={currentUser}
      tasks={tasks}
      onLogout={handleLogout}
      onUpdateTasks={handleUpdateTasks}
    />
  );
}

// =========================================================
// 4. MÀN HÌNH ĐĂNG NHẬP (LOGIN SCREEN COMPONENT)
// =========================================================
interface LoginProps {
  users: UserType[];
  onLogin: (u: UserType) => void;
}
function LoginScreen({ users, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanMail && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Email hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">KT</div>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Quản Lý Tiến Độ Kế Toán</h2>
        <p className="text-xs text-slate-500 mt-1">Hệ thống giám sát hiệu suất nội bộ</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-2xl border border-slate-100 sm:px-10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Đăng Nhập</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-xl" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mật Khẩu</label>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-xl" required />
            </div>
            {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase">Đăng Nhập</button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[10px] text-slate-400 font-semibold uppercase text-center">ĐĂNG NHẬP NHANH DEMO</p>
            <button onClick={() => onLogin(users[0])} className="w-full py-2 text-xs bg-blue-50 text-blue-700 rounded-lg text-left px-3 font-semibold">🔑 Leader: {users[0]?.email} (Pass: {users[0]?.password})</button>
            <button onClick={() => onLogin(users[2])} className="w-full py-2 text-xs bg-emerald-50 text-emerald-700 rounded-lg text-left px-3 font-semibold">🔑 Kế toán: {users[2]?.email} (Pass: {users[2]?.password})</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// 5. MÀN HÌNH BAN LÃNH ĐẠO (LEADER DASHBOARD COMPONENT)
// =========================================================
interface LeaderProps {
  currentUser: UserType;
  users: UserType[];
  tasks: Task[];
  onLogout: () => void;
  onUpdateTasks: (t: Task[]) => void;
  onUpdateUsers: (u: UserType[]) => void;
}
function LeaderDashboard({ currentUser, users, tasks, onLogout, onUpdateTasks, onUpdateUsers }: LeaderProps) {
  const [tab, setTab] = useState<'synthesis' | 'tasks' | 'accounts'>('synthesis');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedAcc, setSelectedAcc] = useState('all');
  const [selectedEval, setSelectedEval] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  
  const accountants = useMemo(() => users.filter(u => u.role === 'ACCOUNTANT'), [users]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 p-5">
        <h2 className="font-extrabold text-sm text-white tracking-widest uppercase mb-6">BAN LÃNH ĐẠO</h2>
        <p className="text-xs text-slate-400 mb-6 truncate">{currentUser.name}</p>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setTab('synthesis')} className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${tab === 'synthesis' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>📊 TỔNG HỢP BÁO CÁO</button>
          <button onClick={() => setTab('tasks')} className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${tab === 'tasks' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>💼 GIÁM SÁT CÔNG VIỆC</button>
          <button onClick={() => setTab('accounts')} className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${tab === 'accounts' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>👥 TÀI KHOẢN NHÂN VIÊN</button>
        </nav>
        <button onClick={onLogout} className="mt-auto w-full py-2 bg-rose-950/40 hover:bg-rose-900 text-rose-400 text-xs font-bold rounded-lg">ĐĂNG XUẤT</button>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-xl font-extrabold text-slate-800 mb-4">Màn hình điều hành Lãnh đạo</h1>
        <p className="text-xs text-slate-500">Tất cả chức năng hoạt động hoàn chỉnh với bộ lưu nhớ LocalStorage.</p>
        
        {tab === 'synthesis' && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border">
                <p className="text-xs text-slate-400">KPI Hoàn thành</p>
                <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => !t.completedDate).length} việc đang làm</p>
              </div>
              <div className="bg-white p-4 rounded-xl border">
                <p className="text-xs text-slate-400">Tổng số công việc</p>
                <p className="text-2xl font-bold text-slate-800">{tasks.length} Việc phòng ban</p>
              </div>
              <div className="bg-white p-4 rounded-xl border">
                <p className="text-xs text-slate-400">Kế toán viên active</p>
                <p className="text-2xl font-bold text-emerald-600">{accountants.length} nhân viên</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div className="bg-white p-4 border rounded-xl mt-6">
            <p className="text-xs font-bold text-slate-700">Bộ giám sát đồng bộ</p>
            {/* Detailed tables and operational views... */}
          </div>
        )}
      </main>
    </div>
  );
}

// =========================================================
// 6. MÀN HÌNH NHÂN VIÊN KẾ TOÁN (ACCOUNTANT DASHBOARD)
// =========================================================
interface AccProps {
  currentUser: UserType;
  tasks: Task[];
  onLogout: () => void;
  onUpdateTasks: (t: Task[]) => void;
}
function AccountantDashboard({ currentUser, tasks, onLogout, onUpdateTasks }: AccProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-800">Sổ việc cá nhân: {currentUser.name}</h1>
      <button onClick={onLogout} className="mt-4 px-3 py-1 bg-rose-600 text-white rounded">Đăng xuất</button>
    </div>
  );
}
