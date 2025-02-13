'use client';

import { cn, formatCurrency, formatPercentage } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { IconType } from "react-icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Countup } from "./count-up"
import { Skeleton } from "./ui/skeleton"
import DataRecharts from "./data-recharts"
import { Cog } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react";

const boxVariant = cva(
  'shrink-0 rounded-md p-3',
  {
    variants: {
      variant: {
        default: 'bg-blue-500/20',
        success: 'bg-emerald-500/20',
        danger: 'bg-rose-500/20',
        warning: 'bg-yellow-500/20',
      },
      defaultVariants: {
        variant: 'default'
      }
    }
  }
)

const iconVariant = cva(
  'size-6',
  {
    variants: {
      variant: {
        default: 'fill-blue-500',
        success: 'fill-emerald-500',
        danger: 'fill-rose-500',
        warning: 'fill-yellow-500',
      },
      defaultVariants: {
        variant: 'default'
      }
    }
  }
)

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {
  icon: IconType;
  title: string;
  value?: number;
  totalValue?: number;
  dateRange: string;
  percentageChange?: number;
  variant: 'default' | 'success' | 'danger' | 'warning';
};

export const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  totalValue = 0,
  variant = 'default',
  dateRange,
  percentageChange = 0,
}: DataCardProps) => {
  const [isTotal, setIsTotal] = useState(false);

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl line-clamp-1">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <div className={cn(boxVariant({ variant }))}>
            <Icon className={cn(iconVariant({ variant }))} />
          </div>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button onClick={() => setIsTotal(!isTotal)} className={cn(boxVariant({ variant }))}>
                  <Cog className="size-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Alterar para {isTotal ? 'mensal' : 'acumulado'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
          <Countup preserveValue start={0} end={isTotal ? totalValue : value} decimal='2' decimalPlaces={2} formattingFn={formatCurrency} />
        </h1>
        <p className={cn('text-muted-foreground text-sm line-clamp-1 mb-10', (percentageChange > 0 || totalValue > 0) && 'text-emerald-500', (percentageChange < 0 || totalValue < 0) && 'text-rose-500')}>
          {isTotal ? 'Total acumulado' : `${formatPercentage(percentageChange, { addPrefix: true })} do mês anterior`}
        </p>
        <DataRecharts variant={variant} />
      </CardContent>
    </Card>
  )
}

export const DataCardLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm h-[235px]">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mb-2" />
        <Skeleton className="shrink-0  h-4 w-40 mb-2" />
        <Skeleton className="shrink-0 w-full h-12" />
      </CardContent>
    </Card>
  )
};