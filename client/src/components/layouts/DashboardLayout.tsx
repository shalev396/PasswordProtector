import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StandardLayout } from '@/components/layouts/StandardLayout';
import { useMe } from '@/api/queries';
import { setProfile } from '@/store/userSlice';

export function DashboardLayout() {
  const dispatch = useDispatch();
  const { data: meData } = useMe();

  useEffect(() => {
    if (meData) {
      dispatch(setProfile(meData));
    }
  }, [meData, dispatch]);

  return <StandardLayout />;
}
