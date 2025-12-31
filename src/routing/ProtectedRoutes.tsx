import type { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from 'contexts/app/AppContext';

const ProtectedRoutes: FC = () => {
  const { user, userLoading } = useAppContext();

  if (userLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoutes;
