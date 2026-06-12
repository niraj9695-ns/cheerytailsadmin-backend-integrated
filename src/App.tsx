import { useState } from 'react';
import AdminLogin from './screens/AdminLogin';
import OTPVerification from './screens/OTPVerification';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './screens/DashboardPage';
import ManageOwnersPage from './screens/ManageOwnersPage';
import CreateOwnerPage from './screens/CreateOwnerPage';
import OwnerDetailsPage from './screens/OwnerDetailsPage';
import ManageCentersPage from './screens/ManageCentersPage';
import CenterDetailsPage from './screens/CenterDetailsPage';
import { NavItemKey } from './components/Sidebar';
import { useAuth } from './context/AuthContext';

type Screen = 'login' | 'otp' | 'dashboard';
type OwnersSubPage = 'list' | 'create' | 'view';
type CentersSubPage = 'list' | 'view';

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>(() => (isAuthenticated ? 'dashboard' : 'login'));
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeNav, setActiveNav] = useState<NavItemKey>('dashboard');
  const [ownersSubPage, setOwnersSubPage] = useState<OwnersSubPage>('list');
  const [viewOwnerId, setViewOwnerId] = useState<string>('');
  const [centersSubPage, setCentersSubPage] = useState<CentersSubPage>('list');
  const [viewCenterId, setViewCenterId] = useState<string>('');

  function handleSendOTP(email: string, password: string) {
    setAdminEmail(email);
    setAdminPassword(password);
    setScreen('otp');
  }

  function handleLogout() {
    logout();
    setAdminEmail('');
    setAdminPassword('');
    setScreen('login');
  }

  function handleNavChange(key: NavItemKey) {
    setActiveNav(key);
    if (key !== 'owners') setOwnersSubPage('list');
    if (key !== 'centers') setCentersSubPage('list');
  }

  function goToOwnersList() {
    setActiveNav('owners');
    setOwnersSubPage('list');
  }

  function handleViewOwner(id: string) {
    setViewOwnerId(id);
    setOwnersSubPage('view');
  }

  function goToCentersList() {
    setActiveNav('centers');
    setCentersSubPage('list');
  }

  function handleViewCenter(id: string) {
    setViewCenterId(id);
    setCentersSubPage('view');
  }

  if (screen === 'login') {
    return <AdminLogin onSendOTP={handleSendOTP} />;
  }

  if (screen === 'otp') {
    return (
      <OTPVerification
        email={adminEmail}
        password={adminPassword}
        onBack={() => {
          setAdminPassword('');
          setScreen('login');
        }}
        onVerified={() => {
          setAdminPassword('');
          setScreen('dashboard');
        }}
      />
    );
  }

  return (
    <DashboardLayout activeItem={activeNav} onNavigate={handleNavChange} onLogout={handleLogout}>
      {activeNav === 'dashboard' && <DashboardPage />}

      {activeNav === 'owners' && ownersSubPage === 'list' && (
        <ManageOwnersPage
          onCreateOwner={() => setOwnersSubPage('create')}
          onViewOwner={handleViewOwner}
        />
      )}

      {activeNav === 'owners' && ownersSubPage === 'create' && (
        <CreateOwnerPage
          onCancel={goToOwnersList}
          onSuccess={goToOwnersList}
          onNavigateDashboard={() => handleNavChange('dashboard')}
          onNavigateOwners={goToOwnersList}
        />
      )}

      {activeNav === 'owners' && ownersSubPage === 'view' && (
        <OwnerDetailsPage
          ownerId={viewOwnerId}
          onBack={goToOwnersList}
          onNavigateDashboard={() => handleNavChange('dashboard')}
          onNavigateOwners={goToOwnersList}
        />
      )}

      {activeNav === 'centers' && centersSubPage === 'list' && (
        <ManageCentersPage onViewCenter={handleViewCenter} />
      )}

      {activeNav === 'centers' && centersSubPage === 'view' && (
        <CenterDetailsPage
          centerId={viewCenterId}
          onBack={goToCentersList}
          onNavigateDashboard={() => handleNavChange('dashboard')}
          onNavigateCenters={goToCentersList}
        />
      )}
    </DashboardLayout>
  );
}
