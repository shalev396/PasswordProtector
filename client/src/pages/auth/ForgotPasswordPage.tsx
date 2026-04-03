import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';
import { PageMetadata } from '@/components/shared/PageMetadata';

export default function ForgotPasswordPage() {
  return (
    <>
      <PageMetadata title="Forgot Password | Password Protector" noIndex />
      <ForgotPasswordForm />
    </>
  );
}
