import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount)
}

export function getStatusColor(status: string) {
  const colors = {
    requested: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    dispatched: 'bg-purple-100 text-purple-800',
    'in-transit': 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export function getStatusIcon(status: string) {
  const icons = {
    requested: '📋',
    approved: '✅',
    dispatched: '📦',
    'in-transit': '🚚',
    delivered: '📍',
    cancelled: '❌',
    returned: '↩️'
  }
  return icons[status as keyof typeof icons] || '📦'
}

