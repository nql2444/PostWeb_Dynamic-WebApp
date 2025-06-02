import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchAllPosts, fetchPostsByUserId, fetchUsers } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText } from "lucide-react";

const Posts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", user?.id, user?.isAdmin],
    queryFn: () => (user?.isAdmin ? fetchAllPosts() : fetchPostsByUserId(user?.id || 0)),
    enabled: !!user,
  });

  useEffect(() => {
    if (posts) {
      let filtered = [...posts];
      if (userFilter !== "all") {
        filtered = filtered.filter((post) => post.userId === parseInt(userFilter));
      }
      if (searchTerm) {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm, userFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserFilterChange = (value: string) => {
    setUserFilter(value);
  };

  const getUserName = (userId: number) => {
    const foundUser = users?.find((u: any) => u.id === userId);
    return foundUser ? foundUser.name : "Unknown User";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-indigo-900">Posts</h1>
            <p className="text-indigo-600 text-lg mt-2">
              {user.isAdmin ? "Browse all posts from all users" : "Browse your posts"}
            </p>
          </header>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
              <Input
                type="text"
                placeholder="Search posts by title or content..."
                className="pl-10 py-2 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {user.isAdmin && (
              <div>
                <Select value={userFilter} onValueChange={handleUserFilterChange}>
                  <SelectTrigger className="border-indigo-200 focus:ring-indigo-300 focus:border-indigo-400">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-100 text-red-600 rounded-lg">
              <p>Error loading posts. Please try again.</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-indigo-50 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
              <h3 className="text-xl font-medium text-indigo-900 mb-2">No posts found</h3>
              <p className="text-indigo-600">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: any) => (
                <PostCard key={post.id} post={post} userName={getUserName(post.userId)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
