"use client";

import { create } from "zustand";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
  duration?: number;
}

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Toast queue
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  // Action completion celebration
  showCelebration: boolean;
  celebrationData: { co2eSaved: number; actionTitle: string } | null;
  triggerCelebration: (data: { co2eSaved: number; actionTitle: string }) => void;
  dismissCelebration: () => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove after duration
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  showCelebration: false,
  celebrationData: null,
  triggerCelebration: (data) =>
    set({ showCelebration: true, celebrationData: data }),
  dismissCelebration: () =>
    set({ showCelebration: false, celebrationData: null }),
}));
