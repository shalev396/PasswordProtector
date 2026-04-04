import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ROUTES } from '@/router/routes';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const EditProfilePage = lazy(() => import('@/pages/EditProfilePage'));
const AddPasswordPage = lazy(() => import('@/pages/AddPasswordPage'));
const EditPasswordPage = lazy(() => import('@/pages/EditPasswordPage'));

export const appRoutes = (
  <>
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
    <Route
      path={ROUTES.PROFILE}
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<ProfilePage />} />
      <Route path={ROUTES.EDIT_PROFILE_SEGMENT} element={<EditProfilePage />} />
    </Route>
    <Route
      path={ROUTES.ADD_PASSWORD}
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AddPasswordPage />} />
    </Route>
    <Route
      path={`${ROUTES.EDIT_PASSWORD}/:id`}
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<EditPasswordPage />} />
    </Route>
  </>
);
