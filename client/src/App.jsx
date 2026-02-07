import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AdminLoginPage from './pages/AdminLogin';
import ReportPage from './pages/ReportIssue';
import AdminPage from './pages/AdminDashboard';
import WorkerPage from './pages/WorkerDashboard';
import RoleSelection from './pages/RoleSelection';
import WorkerLoginPage from './pages/WorkerLogin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Navbar />

        {/* Content */}
        <main className="flex-grow pt-[var(--nav-height)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<RoleSelection />} /> {/* Main Login Entry - Role Selection */}
            <Route path="/login/citizen" element={<LoginPage />} /> {/* Citizen Login */}
            <Route path="/login/worker" element={<WorkerLoginPage />} /> {/* Worker Login */}
            <Route path="/login/admin" element={<AdminLoginPage />} /> {/* Admin Login */}

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/report" element={<ReportPage />} />

            <Route path="/admin/dashboard" element={<AdminPage />} />
            <Route path="/worker" element={<WorkerPage />} />

            {/* Legacy route kept for backward compatibility if needed, or redirect could be added */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}


export default App;
