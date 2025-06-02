import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    body: string;
    userId: number;
  };
  userName?: string;
  commentsCount?: number;
}

const PostCard = ({ post, userName, commentsCount }: PostCardProps) => {
  const { id, title, body } = post;
  const truncatedBody = body.length > 120 ? `${body.substring(0, 120)}...` : body;

  return (
    <Card className="h-full flex flex-col bg-blue-50 border border-blue-100 rounded-lg hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-blue-900 line-clamp-2">{title}</h3>
          <Badge className="bg-blue-100 text-blue-800 font-medium text-xs px-2 py-1 rounded-full">
            Post #{id}
          </Badge>
        </div>

        {userName && (
          <div className="flex items-center gap-1 text-xs text-blue-700">
            <User size={12} />
            <span>{userName}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-blue-800">{truncatedBody}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2 border-t border-blue-200">
        {commentsCount !== undefined && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <MessageCircle size={14} />
            <span>{commentsCount} comments</span>
          </div>
        )}

        <Link to={`/posts/${id}`}>
          <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
