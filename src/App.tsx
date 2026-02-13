import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import InvalidLink from './pages/InvalidLink';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/invalid-link" element={<InvalidLink />} />
        <Route path="*" element={<Navigate to="/invalid-link" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
