import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  categoryService,
  pictureService,
  videoService,
  activityService,
  blogService,
} from "../services";

const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    pictures: 0,
    videos: 0,
    activities: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [categories, pictures, videos, activities, blogs] =
          await Promise.all([
            categoryService.getAll(1, 1),
            pictureService.getAll(1, 1),
            videoService.getAll(1, 1),
            activityService.getAll(1, 1),
            blogService.getAll(1, 1),
          ]);

        setStats({
          categories: categories.data?.pagination?.total || 0,
          pictures: pictures.data?.pagination?.total || 0,
          videos: videos.data?.pagination?.total || 0,
          activities: activities.data?.pagination?.total || 0,
          blogs: blogs.data?.pagination?.total || 0,
        });
      } catch (error) {
        toast.error("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, label, count }) => (
    <Card className="text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-blue-600">{count}</p>
      <p className="text-gray-600 text-sm">{label}</p>
    </Card>
  );

  return (
    <AdminLayout>
      <PageHeader title="Dashboard" subtitle="Welcome to ILMERA Admin Panel" />

      {loading ? (
        <LoadingSpinner text="Loading statistics..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard icon="📁" label="Categories" count={stats.categories} />
          <StatCard icon="🖼️" label="Pictures" count={stats.pictures} />
          <StatCard icon="🎥" label="Videos" count={stats.videos} />
          <StatCard icon="📢" label="Activities" count={stats.activities} />
          <StatCard icon="📝" label="Blogs" count={stats.blogs} />
        </div>
      )}

      {/* Quick Info */}
      <Card className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-gray-600">Last Login</p>
            <p className="font-semibold text-gray-900">Just now</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-gray-600">Status</p>
            <p className="font-semibold text-green-600">
              All Systems Operational
            </p>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
