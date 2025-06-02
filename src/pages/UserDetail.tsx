
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserById, fetchPostsByUserId } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
import PostCard from "@/components/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building2, 
  Briefcase, 
  ArrowLeft
} from "lucide-react";

interface SavedLocation {
  address: string;
  latitude: number;
  longitude: number;
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // Renamed to authUser to avoid conflict
  const { toast } = useToast();
  const [savedLocation, setSavedLocation] = useState<SavedLocation | null>(null);

  const isViewingOwnAdminProfile = !!authUser && authUser.isAdmin && authUser.id === Number(id);

  // Load saved location from localStorage on component mount
  useEffect(() => {
    if (id && !isViewingOwnAdminProfile) { // Don't load for admin's own profile if not needed
      const storedLocation = localStorage.getItem(`user_location_${id}`);
      if (storedLocation) {
        setSavedLocation(JSON.parse(storedLocation));
      }
    }
  }, [id, isViewingOwnAdminProfile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Fetch user details - disabled if viewing own admin profile
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(Number(id)),
    enabled: !!authUser && !!id && !isViewingOwnAdminProfile,
  });

  // Fetch user posts - disabled if viewing own admin profile
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => fetchPostsByUserId(Number(id)),
    enabled: !!authUser && !!id && !isViewingOwnAdminProfile,
  });

  if (!authUser) return null; // Wait for auth check
  
  const displayUser = isViewingOwnAdminProfile ? {
    id: authUser.id,
    name: authUser.name,
    username: authUser.username,
    email: authUser.email,
    // Admin doesn't have these details from the API
    phone: undefined, 
    website: undefined,
    address: undefined,
    company: { name: "System Administrator", catchPhrase: "", bs: "" }, // Mock company for admin
  } : userData;

  // Determine which geo data to use - saved location or from user data
  const hasCustomLocation = !!savedLocation;
  const hasGeoData = !isViewingOwnAdminProfile && (hasCustomLocation || (displayUser?.address?.geo?.lat && displayUser?.address?.geo?.lng));
  
  // Function to handle location updates from Map component
  const handleAddressUpdate = (address: string, lat: number, lng: number) => {
    if (isViewingOwnAdminProfile) return; // No location saving for admin's own profile

    const newLocation = { address, latitude: lat, longitude: lng };
    setSavedLocation(newLocation);
    
    if (id) {
      localStorage.setItem(`user_location_${id}`, JSON.stringify(newLocation));
      toast({
        title: "Location saved",
        description: `The location has been saved for this user profile.`,
      });
    }
  };

  const effectiveIsLoadingUser = isViewingOwnAdminProfile ? false : isLoadingUser;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-indigo-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {effectiveIsLoadingUser ? (
              <div className="flex justify-center p-12">
                <div className="loader"></div>
              </div>
            ) : !displayUser && !isViewingOwnAdminProfile ? (
              <div className="p-8 text-center bg-red-100 text-red-600 rounded-md">
                <p>User not found.</p>
              </div>
            ) : displayUser ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Profile Card */}
                <Card className="md:col-span-1 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-50 pb-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="w-20 h-20 border-4 border-white mb-2 shadow">
                        <div className="flex items-center justify-center w-full h-full bg-indigo-200 text-indigo-900 text-2xl font-semibold">
                          {displayUser.name.charAt(0)}
                        </div>
                      </Avatar>
                      <CardTitle className="mt-2 text-center text-indigo-900">{displayUser.name}</CardTitle>
                      <p className="text-sm text-indigo-600 mt-1">@{displayUser.username}</p>

                      {isViewingOwnAdminProfile ? (
                        <Badge className="mt-2 bg-indigo-100 text-indigo-800">Administrator</Badge>
                      ) : displayUser.company && (
                        <Badge className="mt-2 bg-indigo-100 text-indigo-800">{displayUser.company.name}</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="py-6 text-indigo-900">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-indigo-500" />
                        <span>{displayUser.email}</span>
                      </div>

                      {!isViewingOwnAdminProfile && displayUser.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-indigo-500" />
                          <span>{displayUser.phone}</span>
                        </div>
                      )}

                      {!isViewingOwnAdminProfile && displayUser.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-indigo-500" />
                          <a
                            href={`https://${displayUser.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-700 hover:underline"
                          >
                            {displayUser.website}
                          </a>
                        </div>
                      )}

                      {!isViewingOwnAdminProfile && displayUser.company && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-indigo-600" />
                              Company Details
                            </h3>
                            <p className="text-sm">{displayUser.company.name}</p>
                            <p className="text-sm italic text-indigo-600">"{displayUser.company.catchPhrase}"</p>
                            <p className="text-sm text-indigo-600">{displayUser.company.bs}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address & Map */}
                {!isViewingOwnAdminProfile && (
                  <Card className="md:col-span-2 bg-white border border-indigo-100 rounded-lg shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-indigo-900">
                        <MapPin className="h-5 w-5 text-indigo-600" /> Address Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-indigo-800">
                      {displayUser.address && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">Location</h3>
                              {savedLocation ? (
                                <>
                                  <p className="text-indigo-700 font-medium">Custom saved location:</p>
                                  <p>{savedLocation.address}</p>
                                </>
                              ) : (
                                <>
                                  <p>{displayUser.address.street}</p>
                                  <p>{displayUser.address.suite}</p>
                                  <p>{displayUser.address.city}, {displayUser.address.zipcode}</p>
                                </>
                              )}
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">Coordinates</h3>
                              {savedLocation ? (
                                <>
                                  <p>Latitude: {savedLocation.latitude}</p>
                                  <p>Longitude: {savedLocation.longitude}</p>
                                </>
                              ) : (
                                <>
                                  <p>Latitude: {displayUser.address.geo?.lat}</p>
                                  <p>Longitude: {displayUser.address.geo?.lng}</p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <h3 className="font-semibold mb-2">Map View</h3>
                            {hasGeoData ? (
                              <Map
                                latitude={savedLocation ? savedLocation.latitude : parseFloat(displayUser.address.geo.lat)}
                                longitude={savedLocation ? savedLocation.longitude : parseFloat(displayUser.address.geo.lng)}
                                zoom={5}
                                markerTitle={displayUser.name}
                                height="300px"
                                onAddressUpdate={handleAddressUpdate}
                              />
                            ) : (
                              <div className="p-8 text-center bg-indigo-50 text-indigo-600 rounded-lg">
                                <p>No map coordinates available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Posts */}
                {!isViewingOwnAdminProfile && (
                  <Card className="md:col-span-3 bg-white border border-indigo-100 shadow-sm rounded-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-indigo-900">
                        <Briefcase className="h-5 w-5 text-indigo-600" /> Posts by {displayUser?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingPosts ? (
                        <div className="flex justify-center p-8">
                          <div className="loader"></div>
                        </div>
                      ) : !userPosts || userPosts.length === 0 ? (
                        <div className="p-8 text-center bg-indigo-50 text-indigo-600 rounded-lg">
                          <p>No posts available</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userPosts.map((post: any) => (
                            <PostCard key={post.id} post={post} userName={displayUser.name} />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

