import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const useConfirm = (
  title: string,
  message: string,
  recurrenceDad?: string,
  field?: {
    onChange: (value: string) => void;
    value: string;
  }
): [() => JSX.Element, () => Promise<unknown>, string?] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean | string) => void } | null>(null);

  const confirm = () => new Promise((resolve) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    if (field) {
      promise?.resolve(field.value);
    } else {
      promise?.resolve(true);
    }
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {
            recurrenceDad && field ? (
              <>
                <DialogDescription>
                  Atenção! Essa recorrência tem transações passadas ou futuras, o que você deseja fazer com elas?
                </DialogDescription>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex flex-row gap-2">
                    <RadioGroupItem value="all" />
                    <Label className="font-normal ml-2">
                      Todas (incluindo as passadas)
                    </Label>
                  </div>
                  <div className="flex flex-row gap-2">
                    <RadioGroupItem value="mentions" />
                    <Label className="font-normal ml-2">
                      Esta e as próximas
                    </Label>
                  </div>
                  <div className="flex flex-row gap-2">
                    <RadioGroupItem value="none" />
                    <Label className="font-normal ml-2">
                      Somente essa
                    </Label>
                  </div>
                </RadioGroup>
              </>
            ) : <DialogDescription>{message}</DialogDescription>
          }
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant='outline'>Cancelar</Button>
          <Button onClick={handleConfirm} variant='outline'>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};