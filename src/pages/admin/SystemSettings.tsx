"use client";

import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import { Bell, Database, Lock, Mail, Server, Users } from "lucide-react";
import { useState } from "react";

interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maxFileSize: number;
  sessionTimeout: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Parcel Delivery System",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    maxFileSize: 10,
    sessionTimeout: 24,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Settings saved:", settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", name: "General", icon: Server },
    { id: "users", name: "User Management", icon: Users },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Lock },
    { id: "system", name: "System", icon: Database },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto pt-2 px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                System Settings
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                Configure system-wide settings and preferences
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-md hover:shadow-lg disabled:opacity-50 transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="bg-background rounded-lg shadow border border-border hover:shadow-lg transition-all duration-300">
            {/* Tab Navigation */}
            <div className="border-b border-border overflow-x-auto">
              <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-4 lg:px-6 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 lg:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-green-500 text-green-600 dark:text-green-400"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 lg:p-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                      General Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              siteName: e.target.value,
                            })
                          }
                          className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                          Max File Size (MB)
                        </label>
                        <input
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              maxFileSize: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-foreground mb-2 sm:mb-3">
                      System Status
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <label className="font-medium text-foreground text-xs sm:text-sm block">
                            Maintenance Mode
                          </label>
                          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                            Put the system in maintenance mode
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                maintenanceMode: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === "users" && (
                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                      User Management Settings
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <label className="font-medium text-foreground text-xs sm:text-sm block">
                            Allow User Registration
                          </label>
                          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                            Allow new users to register accounts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={settings.userRegistration}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                userRegistration: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-red-500 peer-checked:to-red-600 dark:peer-checked:from-red-600 dark:peer-checked:to-red-700"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                      Notification Settings
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex-1">
                            <label className="font-medium text-foreground text-xs sm:text-sm block">
                              Email Notifications
                            </label>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                              Send email notifications for important events
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emailNotifications: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex-1">
                            <label className="font-medium text-slate-700 dark:text-slate-300 text-xs sm:text-sm block">
                              SMS Notifications
                            </label>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 dark:text-slate-400">
                              Send SMS notifications for critical updates
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={settings.smsNotifications}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                smsNotifications: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
                      Security Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">
                          Session Timeout (hours)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              sessionTimeout: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System */}
              {activeTab === "system" && (
                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
                      System Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <div className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1.5 sm:mb-2 text-xs sm:text-sm">
                          Application Version
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                          v1.0.0
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1.5 sm:mb-2 text-xs sm:text-sm">
                          Database Status
                        </h4>
                        <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm">
                          Connected
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1.5 sm:mb-2 text-xs sm:text-sm">
                          Server Status
                        </h4>
                        <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm">
                          Online
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-lg">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1.5 sm:mb-2 text-xs sm:text-sm">
                          Last Backup
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-slate-900 dark:text-slate-100 mb-3">
                      System Actions
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full md:w-auto px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">
                        Clear Cache
                      </button>
                      <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-0 md:ml-3">
                        Backup Database
                      </button>
                      <button className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ml-0 md:ml-3">
                        Restart System
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


