import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { LandingLayout } from '@/components/layouts/LandingLayout';

const LandingPage = lazy(() => import('@/pages/LandingPage'));

export const homeRoutes = (
  <Route element={<LandingLayout />}>
    <Route index element={<LandingPage />} />
  </Route>
);
