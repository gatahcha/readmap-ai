// src/components/dialogs/ConfirmDelete.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/lib/dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmDeleteProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDelete({ open, onCancel, onConfirm }: ConfirmDeleteProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Roadmap?</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this roadmap? This action cannot be undone.</p>
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            className="text-white border-white hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
