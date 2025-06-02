import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchUsers } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import UserCard from "@/components/UserCard";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";

const Users = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: !!user,
  });

  useEffect(() => {
    if (users) {
      const filtered = users.filter((u: any) =>
        [u.name, u.email, u.username].some((v) =>
          v.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-indigo-900">User Directory</h1>
            <p className="text-indigo-600 mt-1 text-lg">Browse and explore user profiles</p>
          </header>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
            <Input
              type="text"
              placeholder="Search users by name, email, or username..."
              className="pl-10 py-2 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 bg-red-100 rounded-md">
              <p>Error loading users. Please try again.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center bg-indigo-50 rounded-lg">
              <User className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
              <h3 className="text-xl font-medium text-indigo-900 mb-2">No users found</h3>
              <p className="text-indigo-600">Try adjusting your search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((userData: any) => (
                <UserCard key={userData.id} user={userData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
