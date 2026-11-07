'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Bell, User, Clock, Utensils } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { user, profile } = useAuth();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-PK', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-surface/70 border-b border-surface-border px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated border border-surface-border text-xs text-secondary font-mono font-bold">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span>{timeString || 'Kitchen Time'}</span>
        </div>

        {/* Staff Role Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface border border-surface-border">
          <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-white block leading-tight">
              {profile?.full_name || user?.email?.split('@')[0] || 'Kitchen Manager'}
            </span>
            <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider block">
              Staff Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

