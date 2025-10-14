"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Settings,
  Code,
  User,
  LogOut,
  Github,
  Mail,
  Calendar,
  Shield,
  Bell,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      if (response.success && response.user) {
        setUserInfo(response.user);
      }
    } catch (error: any) {
      console.error("Failed to fetch user info:", error);
      if (error.response?.status === 401) {
        router.push("/signup");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Settings</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CodeAI Review</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Dashboard
            </Link>
            <Button variant="outline" size="icon" className="border-blue-500 bg-blue-50">
              <Settings className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <Settings className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </header>

        {/* Profile Section */}
        <section className="mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your GitHub profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">GitHub Username</span>
                </div>
                <span className="text-gray-900 font-semibold">@{userInfo.username}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">GitHub ID</span>
                </div>
                <span className="text-gray-900 font-semibold">{userInfo.githubId}</span>
              </div>
              {userInfo.avatarUrl && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 font-medium">Avatar</span>
                  </div>
                  <img
                    src={userInfo.avatarUrl}
                    alt="GitHub Avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">Joined</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  {new Date(userInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Notifications Section */}
        <section className="mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-gray-900 font-medium">PR Review Notifications</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Get notified when a PR review is completed
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300">
                  Coming Soon
                </Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-gray-900 font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive email updates about your repositories
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300">
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Security Section */}
        <section className="mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-gray-900 font-medium">Connected GitHub Account</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your account is connected via GitHub OAuth
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Github className="h-4 w-4" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-gray-900 font-medium">Access Token</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your GitHub access token
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Danger Zone */}
        <section>
          <Card className="bg-white border-red-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-gray-600">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-gray-900 font-medium">Logout</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Sign out of your account
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-gray-300 hover:border-gray-400 text-gray-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-gray-900 font-medium">Delete Account</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Permanently delete your account and all data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-300 hover:border-red-400 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900">
                        Delete Account?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600">
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data including repositories, PR reviews, and settings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
