// src/lib/dialog.tsx
"use client"

import {
  Dialog as HeadlessDialog,
  DialogTitle as HeadlessDialogTitle,
  Transition,
} from "@headlessui/react"
import { Fragment, type ReactNode } from "react"
import cn from "@/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Dialog({ open, onClose, children }: DialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-orange-100">
              {children}
            </div>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}

interface DialogSubProps {
  children: ReactNode
  className?: string
}

export function DialogHeader({ children, className }: DialogSubProps) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

export function DialogTitle({ children, className }: DialogSubProps) {
  return (
    <HeadlessDialogTitle
      className={cn("text-lg font-semibold text-gray-900", className)}
    >
      {children}
    </HeadlessDialogTitle>
  )
}

export function DialogContent({ children, className }: DialogSubProps) {
  return <div className={cn("text-sm text-gray-700", className)}>{children}</div>
}

export function DialogFooter({ children, className }: DialogSubProps) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)}>{children}</div>
}
