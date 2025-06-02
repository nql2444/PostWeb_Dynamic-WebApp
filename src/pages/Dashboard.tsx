// [Unchanged imports]
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchAllPosts, fetchPostsByUserId, fetchUserById, fetchUsers } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MessageSquare, FileText } from "lucide-react";
import UserCard from "@/components/UserCard";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts", user?.id, user?.isAdmin],
    queryFn: () => user?.isAdmin ? fetchAllPosts() : fetchPostsByUserId(user?.id || 0),
    enabled: !!user,
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    if (postsData) setRecentPosts(postsData.slice(0, 3));
    if (usersData) setRecentUsers(usersData.slice(0, 3));
  }, [postsData, usersData]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-sky-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-sky-900">Welcome back, {user.name}</h1>
            <p className="text-gray-500 mt-2 text-lg">Here’s a summary of your activity:</p>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-green-50 shadow hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-green-900">Total Users</CardTitle>
                <User className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  {isLoadingUsers ? <div className="loader"></div> : usersData?.length || 0}
                </div>
                <p className="text-xs text-green-700 mt-1">Registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 shadow hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-yellow-900">Your Posts</CardTitle>
                <FileText className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">
                  {isLoadingPosts ? (
                    <div className="loader"></div>
                  ) : user.isAdmin ? (
                    `${postsData?.length || 0} (all users)`
                  ) : (
                    postsData?.length || 0
                  )}
                </div>
                <p className="text-xs text-yellow-700 mt-1">Published posts</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 shadow hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-purple-900">Account Type</CardTitle>
                <Mail className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">
                  {user.isAdmin ? "Administrator" : "Standard User"}
                </div>
                <p className="text-xs text-purple-700 mt-1">
                  {user.isAdmin ? "Full access to all features" : "Access to your own content"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-sky-800">Recent Posts</h2>
                <Link to="/posts">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              {isLoadingPosts ? (
                <div className="flex justify-center p-8"><div className="loader"></div></div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      userName={usersData?.find((u: any) => u.id === post.userId)?.name}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-sky-50 border border-dashed border-sky-200">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <MessageSquare className="h-10 w-10 text-sky-400 mb-2" />
                    <p className="text-sky-700 text-center">No posts available</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-sky-800">Recent Users</h2>
                <Link to="/users">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              {isLoadingUsers ? (
                <div className="flex justify-center p-8"><div className="loader"></div></div>
              ) : recentUsers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {recentUsers.map((userData) => (
                    <UserCard key={userData.id} user={userData} />
                  ))}
                </div>
              ) : (
                <Card className="bg-sky-50 border border-dashed border-sky-200">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <User className="h-10 w-10 text-sky-400 mb-2" />
                    <p className="text-sky-700 text-center">No users available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;