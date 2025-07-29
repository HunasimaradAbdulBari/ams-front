import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';

export default function TeacherDashboardPage() {
  return (
    <PrivateRoute allowedRoles={['teacher']}>
      <Layout>
        <TeacherDashboard />
      </Layout>
    </PrivateRoute>
  );
}