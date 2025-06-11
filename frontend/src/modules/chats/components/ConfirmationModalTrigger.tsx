import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/modules/shared/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/modules/shared/components/ui/button";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof AlertDialogTrigger> & {
  onConfirm?: () => void;
  variant?: 'default' | 'destructive';
};

export function ConfirmationModalTrigger({ children, variant, onConfirm, ...props }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger {...props}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action need your attention. Please confirm that you want to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction className={buttonVariants({ variant })} asChild>
            <Button onClick={onConfirm}>
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
