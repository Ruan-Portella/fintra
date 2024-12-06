import { useOpenCategories } from "@/services/categories/hooks/use-open-categories";
import { useOpenTransaction } from "@/services/transactions/hooks/use-open-transaction";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const {onOpen: onOpencategory} = useOpenCategories();
  const {onOpen: onOpenTransaction} = useOpenTransaction();

  const onClick = () => {
    if (!categoryId) return onOpenTransaction(id);
    onOpencategory(categoryId);
  };

  return (
    <div onClick={onClick} className={cn("flex items-center cursor-pointer hover:underline", !category && 'text-rose-500')}>
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0"/> }
      {category || 'Sem Categoria'}
    </div>
  )
}