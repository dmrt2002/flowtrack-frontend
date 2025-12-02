'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Workflow,
  FileText,
  BarChart3,
  Code2,
  Flame,
} from 'lucide-react';

export function QuickNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      href: '/dashboard-home',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Main dashboard',
    },
    {
      href: '/hotbox',
      label: 'Hotbox',
      icon: Flame,
      description: 'Manage email conversations',
    },
    {
      href: '/workflows',
      label: 'Workflows',
      icon: Workflow,
      description: 'Manage automation workflows',
    },
    {
      href: '/workflows/demo-id',
      label: 'Workflow Builder',
      icon: FileText,
      description: 'Configure forms and analytics',
    },
    {
      href: '/demo/forms',
      label: 'Forms Demo',
      icon: Code2,
      description: 'Feature showcase',
    },
  ];

  return (
    <>
      {/* Quick Nav Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-40 rounded-full bg-indigo-600 p-4 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-indigo-700"
        aria-label="Open navigation"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 transform bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <h2 className="text-[18px] font-semibold text-neutral-900">
            Quick Navigation
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 transition-colors hover:bg-neutral-100"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group block rounded-xl border border-neutral-200 p-4 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 transition-colors group-hover:bg-indigo-200">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="mb-0.5 text-[15px] font-semibold text-neutral-900">
                      {item.label}
                    </h3>
                    <p className="text-[13px] text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute right-0 bottom-0 left-0 border-t border-neutral-200 bg-neutral-50 p-6">
          <p className="text-center text-[12px] text-neutral-500">
            Form Embedding Feature
            <br />
            <span className="font-medium text-indigo-600">
              Implementation Complete ✓
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
