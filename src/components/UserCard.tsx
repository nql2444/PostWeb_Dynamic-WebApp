import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserCardProps {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string;
    website?: string;
    company?: {
      name: string;
    };
  };
  showDetailLink?: boolean;
}

const UserCard = ({ user, showDetailLink = true }: UserCardProps) => {
  const { id, name, username, email, phone, website, company } = user;

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden bg-indigo-50 border border-indigo-100 rounded-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-50 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <div className="flex items-center justify-center w-full h-full bg-indigo-200 text-indigo-900 font-semibold text-sm">
                {name.charAt(0)}
              </div>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-indigo-900">{name}</h3>
              <p className="text-sm text-indigo-600">@{username}</p>
            </div>
          </div>
          {company && (
            <Badge className="bg-indigo-200 text-indigo-800 font-medium text-xs px-2 py-1 rounded-full">
              {company.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 text-indigo-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-indigo-500" />
            <span>{email}</span>
          </div>

          {phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-indigo-500" />
              <span>{phone}</span>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe size={14} className="text-indigo-500" />
              <span>{website}</span>
            </div>
          )}

          {showDetailLink && (
            <div className="mt-4">
              <Link to={`/users/${id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                >
                  View Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
