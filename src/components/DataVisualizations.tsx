import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchStatistics } from '@/lib/api';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

const DataVisualizations = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Access denied',
        description: 'You do not have permission to view this page.',
      });
      navigate('/dashboard');
      return;
    }

    const loadStatistics = async () => {
      try {
        setLoading(true);
        const data = await fetchStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error loading statistics:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load statistics data.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [user, toast, navigate]);

  const pieChartData = stats
    ? [
        { name: 'Users', value: stats.userCount },
        { name: 'Posts', value: stats.postCount },
        { name: 'Comments', value: stats.commentCount },
      ]
    : [];

  const barChartData = stats
    ? stats.users.map((user: any) => {
        const userPosts = stats.posts.filter((post: any) => post.userId === user.id).length;
        const userComments = stats.comments.filter((comment: any) => {
          const post = stats.posts.find((p: any) => p.id === comment.postId);
          return post && post.userId === user.id;
        }).length;

        return {
          name: user.name.split(' ')[0],
          posts: userPosts,
          comments: userComments,
        };
      })
    : [];

  if (loading) {
    return (
      <Card className="h-64 flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-sm">
        <div className="loader" />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card className="bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Platform Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData.slice(0, 5)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="posts" fill="#6366f1" name="Posts" />
              <Bar dataKey="comments" fill="#22c55e" name="Comments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="lg:col-span-2 bg-white border border-indigo-100 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Statistics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-100 rounded-lg p-4">
              <div className="text-4xl font-bold text-indigo-700">{stats?.userCount}</div>
              <div className="text-sm mt-1 text-indigo-800">Total Users</div>
            </div>
            <div className="bg-emerald-100 rounded-lg p-4">
              <div className="text-4xl font-bold text-emerald-600">{stats?.postCount}</div>
              <div className="text-sm mt-1 text-emerald-700">Total Posts</div>
            </div>
            <div className="bg-amber-100 rounded-lg p-4">
              <div className="text-4xl font-bold text-amber-600">{stats?.commentCount}</div>
              <div className="text-sm mt-1 text-amber-700">Total Comments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualizations;
