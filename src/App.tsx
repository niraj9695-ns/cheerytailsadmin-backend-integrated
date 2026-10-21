import { useState, useCallback, useEffect } from 'react';
import AdminLogin from './screens/AdminLogin';
import OTPVerification from './screens/OTPVerification';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './screens/DashboardPage';
import ManageOwnersPage from './screens/ManageOwnersPage';
import BookingsPage from './screens/BookingsPage';
import CreateOwnerPage from './screens/CreateOwnerPage';
import OwnerDetailsPage from './screens/OwnerDetailsPage';
import ManageCentersPage from './screens/ManageCentersPage';
import CenterDetailsPage from './screens/CenterDetailsPage';
import { fetchBoardingOwners, fetchOwners } from './services/owners';
import { fetchCentersByOwner } from './services/centers';
import { NavItemKey } from './components/Sidebar';
import { useAuth } from './context/AuthContext';

type Screen = 'login' | 'otp' | 'dashboard';
type OwnersSubPage = 'list' | 'create' | 'view';
type BoardingOwnersSubPage = 'list' | 'view' | 'centers' | 'centerView' | 'bookings';
type CentersSubPage = 'list' | 'view';
type CenterHistoryRoute =
  | { source: 'centers'; centerId: string }
  | { source: 'boardingOwner'; centerId: string; ownerId: string };

function readCenterHistoryRoute(state: unknown): CenterHistoryRoute | null {
  if (!state || typeof state !== 'object' || !('cheerytailsCenterRoute' in state)) return null;
  const route = state.cheerytailsCenterRoute;
  if (!route || typeof route !== 'object' || !('source' in route) || !('centerId' in route)) {
    return null;
  }
  if (route.source === 'centers' && typeof route.centerId === 'string') {
    return { source: 'centers', centerId: route.centerId };
  }
  if (
    route.source === 'boardingOwner' &&
    typeof route.centerId === 'string' &&
    'ownerId' in route &&
    typeof route.ownerId === 'string'
  ) {
    return { source: 'boardingOwner', centerId: route.centerId, ownerId: route.ownerId };
  }
  return null;
}

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>(() => (isAuthenticated ? 'dashboard' : 'login'));
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeNav, setActiveNav] = useState<NavItemKey>('owners');
  const [ownersSubPage, setOwnersSubPage] = useState<OwnersSubPage>('list');
  const [viewOwnerId, setViewOwnerId] = useState<string>('');
  const [boardingOwnersSubPage, setBoardingOwnersSubPage] = useState<BoardingOwnersSubPage>('list');
  const [viewBoardingOwnerId, setViewBoardingOwnerId] = useState<string>('');
  const [boardingOwnerCentersId, setBoardingOwnerCentersId] = useState<string>('');
  const [viewBoardingOwnerCenterId, setViewBoardingOwnerCenterId] = useState<string>('');
  const [boardingOwnerBookingsId, setBoardingOwnerBookingsId] = useState<string>('');
  const [centersSubPage, setCentersSubPage] = useState<CentersSubPage>('list');
  const [viewCenterId, setViewCenterId] = useState<string>('');

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      const route = readCenterHistoryRoute(event.state);
      if (route?.source === 'centers') {
        setActiveNav('centers');
        setCentersSubPage('view');
        setViewCenterId(route.centerId);
        return;
      }
      if (route?.source === 'boardingOwner') {
        setActiveNav('boardingOwners');
        setBoardingOwnerCentersId(route.ownerId);
        setViewBoardingOwnerCenterId(route.centerId);
        setBoardingOwnersSubPage('centerView');
        return;
      }

      if (activeNav === 'centers' && centersSubPage === 'view') {
        goToCentersList();
      } else if (activeNav === 'boardingOwners' && boardingOwnersSubPage === 'centerView') {
        goToBoardingOwnerCentersList();
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeNav, centersSubPage, boardingOwnersSubPage]);

  function handleSendOTP(email: string, password: string) {
    setAdminEmail(email);
    setAdminPassword(password);
    setActiveNav('owners');
    setOwnersSubPage('list');
    setScreen('dashboard');
  }

  async function handleLogout() {
    await logout();
    setAdminEmail('');
    setAdminPassword('');
    setScreen('login');
  }

  function handleNavChange(key: NavItemKey) {
    setActiveNav(key);
    if (key !== 'owners') setOwnersSubPage('list');
    if (key !== 'boardingOwners') setBoardingOwnersSubPage('list');
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

  function goToBoardingOwnersList() {
    setActiveNav('boardingOwners');
    setBoardingOwnersSubPage('list');
  }

  function handleViewBoardingOwner(id: string) {
    setViewBoardingOwnerId(id);
    setBoardingOwnersSubPage('view');
  }

  function handleViewBoardingOwnerCenters(ownerId: string) {
    setBoardingOwnerCentersId(ownerId);
    setBoardingOwnersSubPage('centers');
  }

  function goToBoardingOwnerCentersList() {
    setActiveNav('boardingOwners');
    setBoardingOwnersSubPage('centers');
  }

  function handleViewBoardingOwnerBookings(ownerId: string) {
    setActiveNav('boardingOwners');
    setBoardingOwnerBookingsId(ownerId);
    setBoardingOwnersSubPage('bookings');
  }

  function goToBoardingOwnerBookings() {
    setActiveNav('boardingOwners');
    setBoardingOwnersSubPage('bookings');
  }

  function handleViewBoardingOwnerCenter(centerId: string) {
    setViewBoardingOwnerCenterId(centerId);
    setBoardingOwnersSubPage('centerView');
    window.history.pushState(
      {
        ...window.history.state,
        cheerytailsCenterRoute: {
          source: 'boardingOwner',
          centerId,
          ownerId: boardingOwnerCentersId,
        },
      },
      '',
      window.location.href,
    );
  }

  const fetchBoardingOwnerCenters = useCallback(
    () => fetchCentersByOwner(boardingOwnerCentersId),
    [boardingOwnerCentersId],
  );

  function goToCentersList() {
    setActiveNav('centers');
    setCentersSubPage('list');
  }

  function handleViewCenter(id: string) {
    setViewCenterId(id);
    setCentersSubPage('view');
    window.history.pushState(
      {
        ...window.history.state,
        cheerytailsCenterRoute: { source: 'centers', centerId: id },
      },
      '',
      window.location.href,
    );
  }

  function goBackFromCenterDetails(source: CenterHistoryRoute['source']) {
    window.history.replaceState(
      { ...window.history.state, cheerytailsCenterRoute: null },
      '',
      window.location.href,
    );
    if (source === 'centers') {
      goToCentersList();
    } else {
      goToBoardingOwnerCentersList();
    }
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
          setActiveNav('owners');
          setOwnersSubPage('list');
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
          title="Manage Pet Owner"
          fetchList={fetchOwners}
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
          listLabel="Manage Pet Owner"
          onBack={goToOwnersList}
          onNavigateDashboard={() => handleNavChange('dashboard')}
          onNavigateOwners={goToOwnersList}
        />
      )}

      {activeNav === 'boardingOwners' && boardingOwnersSubPage === 'list' && (
        <ManageOwnersPage
          title="Manage Boarding Owners"
          subtitle="Manage and monitor all registered boarding owners."
          fetchList={fetchBoardingOwners}
          onViewOwner={handleViewBoardingOwner}
          onViewCenters={handleViewBoardingOwnerCenters}
        />
      )}

      {activeNav === 'boardingOwners' && boardingOwnersSubPage === 'view' && (
        <OwnerDetailsPage
          ownerId={viewBoardingOwnerId}
          listLabel="Manage Boarding Owners"
          onBack={goToBoardingOwnersList}
          onNavigateDashboard={() => handleNavChange('dashboard')}
          onNavigateOwners={goToBoardingOwnersList}
        />
      )}

      {activeNav === 'boardingOwners' && boardingOwnersSubPage === 'bookings' && (
        <BookingsPage
          ownerId={boardingOwnerBookingsId}
          onBack={goToBoardingOwnersList}
          onNavigateOwners={goToBoardingOwnersList}
        />
      )}

      {activeNav === 'boardingOwners' && boardingOwnersSubPage === 'centers' && (
        <ManageCentersPage
          title="Boarding Centers"
          subtitle="Centers registered by this boarding owner."
          fetchList={fetchBoardingOwnerCenters}
          onBack={goToBoardingOwnersList}
          onViewCenter={handleViewBoardingOwnerCenter}
        />
      )}

      {activeNav === 'boardingOwners' && boardingOwnersSubPage === 'centerView' && (
        <CenterDetailsPage
          centerId={viewBoardingOwnerCenterId}
          listLabel="Boarding Centers"
          onBack={() => goBackFromCenterDetails('boardingOwner')}
          onNavigateDashboard={() => handleNavChange('dashboard')}
          onNavigateCenters={() => goBackFromCenterDetails('boardingOwner')}
        />
      )}

      {activeNav === 'centers' && centersSubPage === 'list' && (
        <ManageCentersPage onViewCenter={handleViewCenter} />
      )}

      {activeNav === 'centers' && centersSubPage === 'view' && (
        <CenterDetailsPage
          centerId={viewCenterId}
          onBack={() => goBackFromCenterDetails('centers')}
          onNavigateDashboard={() => handleNavChange('dashboard')}
          onNavigateCenters={() => goBackFromCenterDetails('centers')}
        />
      )}
    </DashboardLayout>
  );
}
