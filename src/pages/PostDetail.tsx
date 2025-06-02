import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchPostById, fetchCommentsByPostId, fetchUserById } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MessageCircle } from "lucide-react";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: post, isLoading: isLoadingPost, error: postError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(Number(id)),
    enabled: !!user && !!id,
  });

  const { data: comments, isLoading: isLoadingComments, error: commentsError } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchCommentsByPostId(Number(id)),
    enabled: !!user && !!id,
  });

  const { data: author, isLoading: isLoadingAuthor } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => fetchUserById(post?.userId || 0),
    enabled: !!post?.userId,
  });

  useEffect(() => {
    if (post && !user?.isAdmin && post.userId !== user?.id) {
      navigate("/posts");
    }
  }, [post, user, navigate]);

  if (!user) return null;

  const isLoading = isLoadingPost || isLoadingComments;
  const hasError = postError || commentsError;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="loader"></div>
            </div>
          ) : hasError ? (
            <div className="p-8 text-center bg-red-100 text-red-600 rounded-lg">
              <p>Error loading post. The post may not exist or you may not have permission to view it.</p>
            </div>
          ) : !post ? (
            <div className="p-8 text-center bg-gray-100 text-gray-600 rounded-lg">
              <p>Post not found.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Post Card */}
              <Card className="overflow-hidden bg-indigo-50 border border-indigo-100 shadow-sm rounded-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
                        Post #{post.id}
                      </Badge>
                      <CardTitle className="text-3xl font-bold text-indigo-900">{post.title}</CardTitle>
                    </div>
                  </div>

                  {isLoadingAuthor ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="loader"></div>
                      <span>Loading author...</span>
                    </div>
                  ) : author && (
                    <div className="flex items-center gap-2 mt-3">
                      <Avatar className="h-6 w-6">
                        <div className="flex items-center justify-center w-full h-full bg-indigo-200 text-indigo-900 font-medium text-xs">
                          {author.name.charAt(0)}
                        </div>
                      </Avatar>
                      <Link to={`/users/${author.id}`} className="text-sm text-indigo-700 hover:underline">
                        {author.name}
                      </Link>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-6 text-indigo-900">
                  <p className="whitespace-pre-line text-lg">{post.body}</p>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-800 flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments?.length || 0})
                </h2>

                {isLoadingComments ? (
                  <div className="flex justify-center p-8">
                    <div className="loader"></div>
                  </div>
                ) : !comments || comments.length === 0 ? (
                  <Card className="bg-indigo-50 border border-dashed border-indigo-200">
                    <CardContent className="p-8 text-center text-indigo-600">
                      No comments yet
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <Card key={comment.id} className="border border-indigo-100 bg-white shadow-sm rounded-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <div className="flex items-center justify-center w-full h-full bg-indigo-200 text-indigo-900 font-medium text-xs">
                                  {comment.name.charAt(0)}
                                </div>
                              </Avatar>
                              <div>
                                <p className="font-medium text-indigo-800">{comment.name}</p>
                                <a href={`mailto:${comment.email}`} className="text-xs text-indigo-600 hover:underline">
                                  {comment.email}
                                </a>
                              </div>
                            </div>
                            <Badge className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                              Comment #{comment.id}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 text-indigo-900">
                          <p className="text-sm">{comment.body}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
