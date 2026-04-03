import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ROUTES } from '@/router/routes';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

export const appRoutes = (
  <Route
    path={ROUTES.DASHBOARD}
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<DashboardPage />} />
  </Route>
);
