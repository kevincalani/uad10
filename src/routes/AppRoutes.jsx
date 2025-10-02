import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import {Login} from '../pages/Login';
import {Layout} from"../layouts/Layout"
import { AuthProvider } from '../store/authStore';


export default function AppRoutes() {
  return (
    <AuthProvider>
    <Routes>
      {/* Rutas pública */}
        <Route path="/" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoutes/>}>
        <Route  path="/dashboard"element={<Layout/>}>

        </Route>
      </Route>
    </Routes>
    </AuthProvider>
  );
}

