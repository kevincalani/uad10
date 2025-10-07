import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from '../store/authStore';

export default function ProtectedRoutes() {
  const user = useAuth((s) => s.user);

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
