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
    'cd38c215-e126-4141-a92b-1227ae38fe14': 'text-yellow-500',
    '2d9f84bc-1b34-4bfd-8669-46a1879dbe2f': 'text-green-500',
    'd0618e3f-805d-4252-8fcb-53ce58bce469': 'text-rose-500',
  }

  return (
    <div onClick={onClick} className={cn("flex items-center cursor-pointer hover:underline", statusColor[statusId || 'Atrasado'])}>
      {!status && <TriangleAlert className="mr-2 size-4 shrink-0"/> }
      {status || 'Sem Status'}
    </div>
  )
}