import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './lib/AuthContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CoreDisplay } from './pages/CoreDisplay';
import { Interactive } from './pages/Interactive';
import { DataViz } from './pages/DataViz';
import { Members } from './pages/Members';
import { Management } from './pages/Admin';
import { Profile } from './pages/Profile';
import { UserCenter } from './pages/UserCenter';
import { VideoDetail } from './pages/VideoDetail';
import { SummaryDetail } from './pages/SummaryDetail';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="core" element={<CoreDisplay />} />
              <Route path="video/:id" element={<VideoDetail />} />
              <Route path="summary/:id" element={<SummaryDetail />} />
              <Route path="interactive" element={<Interactive />} />
              <Route path="data" element={<DataViz />} />
              <Route path="members" element={<Members />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="admin" element={<Management />} />
              <Route path="me" element={<UserCenter />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

