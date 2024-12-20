import { useOpenTransaction } from "@/services/transactions/hooks/use-open-transaction";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
  id: string;
  status: string | null;
  statusId: string | null;
};

export const StatusColumn = ({ id, status, statusId }: Props) => {
  const {onOpen: onOpenTransaction} = useOpenTransaction();

  const onClick = () => {
    if (!statusId) return onOpenTransaction(id);
  };

  const statusColor: { [key: string]: string } = {
    'Pendente': 'text-yellow-500',
    'Pago': 'text-green-500',
    'Atrasado': 'text-rose-500',
  }

  return (
    <div onClick={onClick} className={cn("flex items-center cursor-pointer hover:underline", statusColor[status || 'Atrasado'])}>
      {!status && <TriangleAlert className="mr-2 size-4 shrink-0"/> }
      {status || 'Sem Status'}
    </div>
  )
}