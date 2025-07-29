import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import StudentDashboard from '../../components/dashboard/StudentDashboard';

export default function StudentDashboardPage() {
  return (
    <PrivateRoute allowedRoles={['student']}>
      <Layout>
        <StudentDashboard />
      </Layout>
    </PrivateRoute>
  );
}