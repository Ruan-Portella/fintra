import { AreaChart, BarChart, FileSearch, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from '@/components/ui/select'
import AreaVariant from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[]
}

export const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState('area');

  const onTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Transações
        </CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder='Chart type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='area'>
              <div className="flex items-center">
                <AreaChart className="size-6 mr-2 shrink-0" />
                <p className="line-clamp-1">
                  Grafico de Área
                </p>
              </div>
            </SelectItem>
            <SelectItem value='bar'>
              <div className="flex items-center">
                <BarChart className="size-6 mr-2 shrink-0" />
                <p className="line-clamp-1">
                  Grafico de Barras
                </p>
              </div>
            </SelectItem>
            <SelectItem value='line'>
              <div className="flex items-center">
                <LineChart className="size-6 mr-2 shrink-0" />
                <p className="line-clamp-1">
                  Grafico de Linha
                </p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {
          data.length === 0 ? (
            <div className="flex flex-col gap-y-2 items-center justify-center h-[350px] w-full">
              <FileSearch className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Não há dados suficientes para exibir o gráfico
              </p>
            </div>
          ) : (
            <>
              {
                chartType === 'area' && <AreaVariant data={data} />
              }
              {
                chartType === 'bar' && <BarVariant data={data} />
              }
              {
                chartType === 'line' && <LineVariant data={data} />
              }
            </>
          )
        }
      </CardContent>
    </Card>
  )
};

export const ChartLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-[350px] w-full mb-2" />
      </CardContent>
    </Card>
  )
}