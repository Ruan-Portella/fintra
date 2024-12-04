import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-accounts";
import { Select } from "@/components/creatable-select";

export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = Array.isArray(accountQuery?.data) && accountQuery.data?.map((account: {name: string, id: string}) => ({
    label: account.name,
    value: account.id,
  })) || [];

  const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () => new Promise((resolve) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione uma conta</DialogTitle>
          <DialogDescription>Por favor, selecione uma conta para prosseguir.</DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Selecione uma conta"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => {
            selectValue.current = value;
          }}
          disabled={accountQuery.isLoading || accountMutation.isPending}
        />
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant='outline'>Cancelar</Button>
          <Button onClick={handleConfirm} variant='outline'>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};