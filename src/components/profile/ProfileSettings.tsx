'use client';

import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, getAuthHeaders } from '@/contexts/AuthContext';
import { 
  Settings, 
  User as UserIcon, 
  Mail, 
  Camera,
  Save,
  Edit,
  Bell,
  Shield,
  Palette,
  Globe,
  LogOut
} from 'lucide-react';

interface ProfileSettingsProps {
  user: User;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    interests: user.interests.join(', '),
    avatar: user.avatar
  });

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout? This will end your session.');
    if (confirmed) {
      // Clear localStorage
      localStorage.removeItem('smileup_token');
      localStorage.removeItem('smileup_user');
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          interests: formData.interests.split(',').map(i => i.trim()),
          avatar: formData.avatar
        }),
      });

      if (response.ok) {
        // Update localStorage with new user data
        const updatedUser = { 
          ...user, 
          name: formData.name,
          bio: formData.bio,
          interests: formData.interests.split(',').map(i => i.trim()),
          avatar: formData.avatar
        };
        localStorage.setItem('smileup_user', JSON.stringify(updatedUser));
        setIsEditing(false);
        
        // Reload the page to reflect changes
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: user.bio,
      interests: user.interests.join(', '),
      avatar: user.avatar
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback className="text-lg">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{formData.name}</h3>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
              {isEditing && (
                <Button variant="outline" size="sm" className="mt-2">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, interests: e.target.value })}
              disabled={!isEditing}
              placeholder="Sustainability, Technology, Community Service"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-muted-foreground">Manage your notification preferences</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Privacy</div>
                <div className="text-sm text-muted-foreground">Control your privacy settings</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Appearance</div>
                <div className="text-sm text-muted-foreground">Customize your theme and display</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Customize
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Language</div>
                <div className="text-sm text-muted-foreground">Choose your preferred language</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              English
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{user.smiles}</div>
              <div className="text-sm text-muted-foreground">Smiles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user.friends}</div>
              <div className="text-sm text-muted-foreground">Friends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user.badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign out of your account. You'll need to log in again to access your profile.
            </p>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 