// src/components/dialogs/RenameDialog.tsx
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/lib/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import cn from "@/lib/utils"

export interface RenameDialogProps {
  open: boolean
  initialTitle: string
  onCancel: () => void
  onSave: (newTitle: string) => void
}

export default function RenameDialog({ open, initialTitle, onCancel, onSave }: RenameDialogProps) {
  const [title, setTitle] = useState(initialTitle)

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Roadmap</DialogTitle>
        </DialogHeader>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-4"
        />
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(title)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
