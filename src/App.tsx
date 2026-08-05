import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuickRoleSwitcher } from './components/QuickRoleSwitcher';
import { LoginForm } from './components/auth/LoginForm';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { ClassManagement } from './components/admin/ClassManagement';
import { SubjectManagement } from './components/admin/SubjectManagement';
import { UploadPermissions } from './components/admin/UploadPermissions';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherTaskList } from './components/teacher/TeacherTaskList';
import { TaskSubmissionsView } from './components/teacher/TaskSubmissionsView';
import { TeacherGradeRecap } from './components/teacher/TeacherGradeRecap';
import { HomeroomDashboard } from './components/teacher/HomeroomDashboard';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentTaskList } from './components/student/StudentTaskList';
import { StudentGrades } from './components/student/StudentGrades';

const MainLayout: React.FC = () => {
  const { currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('admin-dashboard');

  // Selected task ID for detailed inspection in teacher view
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Sync default tab when user or role changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') setActiveTab('admin-dashboard');
      else if (currentUser.role === 'guru') setActiveTab('teacher-dashboard');
      else if (currentUser.role === 'murid') setActiveTab('student-dashboard');
      setSelectedTaskId(null);
    }
  }, [currentUser?.id, currentUser?.role]);

  if (!currentUser) {
    return <LoginForm />;
  }

  const renderTabContent = () => {
    // Admin Views
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'admin-dashboard':
          return <AdminDashboard onNavigate={setActiveTab} />;
        case 'admin-users':
          return <UserManagement />;
        case 'admin-classes':
          return <ClassManagement />;
        case 'admin-subjects':
          return <SubjectManagement />;
        case 'admin-permissions':
          return <UploadPermissions />;
        default:
          return <AdminDashboard onNavigate={setActiveTab} />;
      }
    }

    // Teacher Views
    if (currentUser.role === 'guru') {
      if (selectedTaskId && (activeTab === 'teacher-tasks' || activeTab === 'teacher-exams')) {
        return (
          <TaskSubmissionsView
            taskId={selectedTaskId}
            onBack={() => setSelectedTaskId(null)}
          />
        );
      }

      switch (activeTab) {
        case 'teacher-dashboard':
          return (
            <TeacherDashboard
              onNavigate={(tab, taskId) => {
                setActiveTab(tab);
                if (taskId) setSelectedTaskId(taskId);
              }}
            />
          );
        case 'teacher-tasks':
          return (
            <TeacherTaskList
              mode="tugas"
              onSelectTask={taskId => {
                setSelectedTaskId(taskId);
              }}
            />
          );
        case 'teacher-exams':
          return (
            <TeacherTaskList
              mode="ulangan"
              onSelectTask={taskId => {
                setSelectedTaskId(taskId);
              }}
            />
          );
        case 'teacher-grading':
          return (
            <TeacherTaskList
              mode="tugas"
              onSelectTask={taskId => {
                setSelectedTaskId(taskId);
              }}
            />
          );
        case 'teacher-recap':
          return <TeacherGradeRecap />;
        case 'homeroom-dashboard':
          return <HomeroomDashboard />;
        default:
          return (
            <TeacherDashboard
              onNavigate={(tab, taskId) => {
                setActiveTab(tab);
                if (taskId) setSelectedTaskId(taskId);
              }}
            />
          );
      }
    }

    // Student Views
    if (currentUser.role === 'murid') {
      switch (activeTab) {
        case 'student-dashboard':
          return <StudentDashboard onNavigate={setActiveTab} />;
        case 'student-tasks':
          return <StudentTaskList mode="tugas" />;
        case 'student-exams':
          return <StudentTaskList mode="ulangan" />;
        case 'student-grades':
          return <StudentGrades />;
        default:
          return <StudentDashboard onNavigate={setActiveTab} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 antialiased font-sans">
      <QuickRoleSwitcher />
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigateLink={(linkId, jenis) => {
          if (currentUser.role === 'guru' && linkId) {
            setActiveTab('teacher-tasks');
            setSelectedTaskId(linkId);
          } else if (currentUser.role === 'murid') {
            if (jenis === 'nilai_masuk') setActiveTab('student-grades');
            else setActiveTab('student-tasks');
          }
        }}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={tab => {
            setActiveTab(tab);
            setSelectedTaskId(null);
          }}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
