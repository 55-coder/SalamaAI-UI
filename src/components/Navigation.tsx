/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Bell, Shield, User, Users, Activity, Layers, LogOut } from 'lucide-react';
import { UserRole, Notification } from '../types';

interface NavigationProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUserEmail: string;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onLogout: () => void;
}

export default function Navigation({
  currentRole,
  setCurrentRole,
  currentUserEmail,
  notifications,
  onMarkRead,
  onLogout,
}: NavigationProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md text-zinc-800 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 ring-4 ring-emerald-50/50">
            <Heart className="h-5.5 w-5.5 fill-emerald-500/10 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="font-display text-lg font-bold tracking-tight text-zinc-900">
              Salama <span className="font-semibold text-emerald-600">AI</span>
            </span>
            <span className="block font-sans text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
              Explainable Cardiology
            </span>
          </div>
        </div>

        {/* Demo Role Switcher Bar */}
        <div className="hidden md:flex items-center space-x-1 rounded-xl bg-zinc-100/80 p-1 border border-zinc-200">
          <button
            onClick={() => setCurrentRole('patient')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-smooth ${
              currentRole === 'patient'
                ? 'bg-white text-emerald-600 shadow-sm border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Patient Portal</span>
          </button>
          <button
            onClick={() => setCurrentRole('clinician')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-smooth ${
              currentRole === 'clinician'
                ? 'bg-white text-emerald-600 shadow-sm border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Clinician Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentRole('admin')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-smooth ${
              currentRole === 'admin'
                ? 'bg-white text-emerald-600 shadow-sm border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-smooth border border-transparent hover:border-zinc-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-zinc-250 bg-white p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-150">
                  <h3 className="font-display text-sm font-semibold text-zinc-800 font-bold">System Notifications</h3>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-400">
                      No notifications found
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl hover:bg-zinc-50 transition-smooth border-l-3 ${
                          notif.severity === 'alert'
                            ? 'border-l-rose-500'
                            : notif.severity === 'warning'
                            ? 'border-l-amber-500'
                            : 'border-l-emerald-500'
                        } ${!notif.isRead ? 'bg-zinc-50/50' : ''} mb-1`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-display text-xs font-bold text-zinc-800">
                            {notif.title}
                          </h4>
                          <span className="text-[9px] font-semibold text-zinc-400 font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-[11px] text-zinc-600 leading-snug">
                          {notif.message}
                        </p>
                        {!notif.isRead && (
                          <button
                            onClick={() => onMarkRead(notif.id)}
                            className="mt-2 text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="p-1 border-t border-zinc-150 mt-1">
                  <div className="text-center text-[10px] text-zinc-400 py-1.5 font-mono">
                    Mock SQLite/PostgreSQL Logs Live
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User badge */}
          <div className="flex items-center space-x-2.5 border-l border-zinc-200 pl-4">
            <div className="hidden text-right lg:block">
              <span className="block font-sans text-xs font-semibold text-zinc-800">
                {currentUserEmail === 'antonynjuguna502@gmail.com' ? 'Antony Njuguna' : 'Dr. Sara Vance'}
              </span>
              <span className="block font-mono text-[9px] text-zinc-500 capitalize font-semibold">
                {currentRole} Access
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 border border-zinc-200 hover:text-zinc-900 hover:bg-zinc-200 transition-smooth cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Role Switcher (Compact tab bar) */}
      <div className="flex border-t border-zinc-200 bg-white p-1.5 md:hidden">
        <button
          onClick={() => setCurrentRole('patient')}
          className={`flex-1 flex items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-semibold transition-smooth ${
            currentRole === 'patient' ? 'bg-zinc-100 text-emerald-600 border border-zinc-200/60 shadow-sm' : 'text-zinc-550'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Patient</span>
        </button>
        <button
          onClick={() => setCurrentRole('clinician')}
          className={`flex-1 flex items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-semibold transition-smooth ${
            currentRole === 'clinician' ? 'bg-zinc-100 text-emerald-600 border border-zinc-200/60 shadow-sm' : 'text-zinc-550'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Clinician</span>
        </button>
        <button
          onClick={() => setCurrentRole('admin')}
          className={`flex-1 flex items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-semibold transition-smooth ${
            currentRole === 'admin' ? 'bg-zinc-100 text-emerald-600 border border-zinc-200/60 shadow-sm' : 'text-zinc-550'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}
