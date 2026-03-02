/**
 * DeleteDialog.tsx
 *
 * A confirmation dialog that appears before deleting a player.
 * Prevents accidental deletions – a common UX pattern.
 *
 * This uses shadcn/ui's Dialog, which wraps Radix UI's Dialog primitive.
 * The key idea: the dialog is "controlled" – the parent decides whether it is
 * open or not via the `open` / `onOpenChange` props.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the user closes the dialog (Cancel or clicking outside). */
  onOpenChange: (open: boolean) => void;
  /** Name shown in the prompt so the user knows what they're deleting. */
  playerName: string;
  /** Called when the user confirms deletion. Should perform the API call. */
  onConfirm: () => Promise<void>;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  playerName,
  onConfirm,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false); // Close after success
    } catch {
      // The calling page handles the error toast/alert.
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete player?</DialogTitle>
          <DialogDescription>
            You are about to permanently remove{' '}
            <span className="font-semibold text-foreground">{playerName}</span>{' '}
            from the squad. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : 'Yes, delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
