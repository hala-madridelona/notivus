'use client';

import { Session } from 'next-auth';
import UserAvatar from '../auth/user-avatar';
import { SignOut } from '../auth/sign-out-button';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useState } from 'react';
import { DrawerDialogDemo } from '../overlays/modal';

export const UserProfile = ({ session }: { session: Session }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div
      className={`border-r bg-gray-50 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'hidden' : 'flex'}`}>
          <UserAvatar session={session} />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</h2>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>
        </div>

        {isSidebarCollapsed && (
          <div className="mx-auto">
            <UserAvatar session={session} />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-cyan-50 hover:text-cyan-600 flex justify-center"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className={`p-4 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
        <div className="space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-cyan-50 hover:text-cyan-600"
            onClick={() => setIsProfileOpen(true)}
          >
            <Settings className="h-5 w-5 mr-2" />
            Profile Details
          </Button>

          <SignOut className="w-full" />
        </div>
      </div>

      {isSidebarCollapsed && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full aspect-square flex justify-center hover:bg-cyan-50 hover:text-cyan-600 mb-2"
            onClick={() => setIsProfileOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <SignOut className="flex justify-center" isIconOnly={true} />
        </div>
      )}

      <DrawerDialogDemo
        title="Profile Settings"
        description="Manage your account settings"
        open={isProfileOpen}
        setOpen={setIsProfileOpen}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <UserAvatar session={session} />
            <div>
              <h3 className="text-lg font-semibold">{session.user?.name}</h3>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Account Information</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium">{session.user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerDialogDemo>
    </div>
  );
};
