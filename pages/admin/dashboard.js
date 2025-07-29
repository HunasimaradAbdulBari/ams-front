import PrivateRoute from '../../components/auth/PrivateRoute';
import Layout from '../../components/layout/Layout';
import AdminDashboard from '../../components/dashboard/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <PrivateRoute allowedRoles={['admin']}>
      <Layout>
        <AdminDashboard />
      </Layout>
    </PrivateRoute>
  );
}