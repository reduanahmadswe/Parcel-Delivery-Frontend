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
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
            {}
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

            {}
            <div className="p-4 sm:p-6 lg:p-8">
              {}
              {activeTab === "general" && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                      General Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm sm:text-base font-medium text-foreground mb-4 sm:mb-5">
                      System Status
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <label className="font-medium text-foreground text-xs sm:text-sm block mb-1">
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
                          <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {activeTab === "users" && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                      User Management Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <label className="font-medium text-foreground text-xs sm:text-sm block mb-1">
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
                          <div className="w-10 h-5 sm:w-11 sm:h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-red-500 peer-checked:to-red-600 dark:peer-checked:from-red-600 dark:peer-checked:to-red-700"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {activeTab === "notifications" && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                      Notification Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex-1">
                            <label className="font-medium text-foreground text-xs sm:text-sm block mb-1">
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
                          <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex-1">
                            <label className="font-medium text-foreground text-xs sm:text-sm block mb-1">
                              SMS Notifications
                            </label>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
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
                          <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {activeTab === "security" && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                      Security Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {activeTab === "system" && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                      System Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-muted/50 p-4 sm:p-5 rounded-lg border border-border hover:border-green-500/30 transition-colors">
                        <h4 className="font-medium text-foreground mb-2 text-xs sm:text-sm">
                          Application Version
                        </h4>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          v1.0.0
                        </p>
                      </div>
                      <div className="bg-muted/50 p-4 sm:p-5 rounded-lg border border-border hover:border-green-500/30 transition-colors">
                        <h4 className="font-medium text-foreground mb-2 text-xs sm:text-sm">
                          Database Status
                        </h4>
                        <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
                          Connected
                        </p>
                      </div>
                      <div className="bg-muted/50 p-4 sm:p-5 rounded-lg border border-border hover:border-green-500/30 transition-colors">
                        <h4 className="font-medium text-foreground mb-2 text-xs sm:text-sm">
                          Server Status
                        </h4>
                        <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
                          Online
                        </p>
                      </div>
                      <div className="bg-muted/50 p-4 sm:p-5 rounded-lg border border-border hover:border-green-500/30 transition-colors">
                        <h4 className="font-medium text-foreground mb-2 text-xs sm:text-sm">
                          Last Backup
                        </h4>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm sm:text-base font-medium text-foreground mb-4">
                      System Actions
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:shadow-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 text-sm font-medium">
                        Clear Cache
                      </button>
                      <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium">
                        Backup Database
                      </button>
                      <button className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 text-sm font-medium">
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

