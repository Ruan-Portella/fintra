import { Area, AreaChart, ResponsiveContainer } from "recharts"

const data = [
  {
    income: 1000,
    expenses: 500
  },
  {
    income: 2000,
    expenses: 1000
  },
  {
    income: 1500,
    expenses: 500
  },
  {
    income: 2500,
    expenses: 1000
  },
  {
    income: 2000,
    expenses: 1500
  },
  {
    income: 3000,
    expenses: 2000
  },
  {
    income: 2500,
    expenses: 1500
  }
]

export default function DataRecharts({
  variant = 'default'
}) {
  return (
    <div className="absolute w-[calc(100%+15px)] left-[-8px] bottom-[-15px] opacity-35">
      <ResponsiveContainer width='100%' height={100}>
        <AreaChart data={data.map((item) => {
          if (variant === 'default') {
            return {
              income: item.income,
              expenses: item.expenses
            }
          }
          if (variant === 'success') {
            return {
              income: item.income + Math.floor(Math.random() * 200),
            }
          }
          return {
            expenses: item.expenses - Math.floor(Math.random() * 200),
          }
        })}>
          <defs>
            {
              variant === 'default' && (
                <>
                  <linearGradient id='income' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='2%' stopColor='#10b981' stopOpacity={0.8} />
                    <stop offset='98%' stopColor='#10b981' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='expenses' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='2%' stopColor='#f87171' stopOpacity={0.8} />
                    <stop offset='98%' stopColor='#f87171' stopOpacity={0} />
                  </linearGradient>
                </>
              )
            }
            {
              variant === 'success' && (
                <linearGradient id='income' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='2%' stopColor='#10b981' stopOpacity={0.8} />
                  <stop offset='98%' stopColor='#10b981' stopOpacity={0} />
                </linearGradient>
              )
            }
            {
              variant === 'danger' && (
                <linearGradient id='expenses' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='2%' stopColor='#f87171' stopOpacity={0.8} />
                  <stop offset='98%' stopColor='#f87171' stopOpacity={0} />
                </linearGradient>
              )
            }

          </defs>
          {
            variant === 'default' && (
              <>
                <Area
                  type='monotone'
                  dataKey='expenses'
                  stackId='expenses'
                  strokeWidth={2}
                  stroke='#f87171'
                  fill='url(#expenses)'
                  className='drop-shadow-sm'
                />
                <Area
                  type='monotone'
                  dataKey='income'
                  stackId='income'
                  strokeWidth={2}
                  stroke='#10b981'
                  fill='url(#income)'
                  className='drop-shadow-sm'
                />
              </>
            )
          }
          {
            variant === 'success' && (
              <Area
                type='monotone'
                dataKey='income'
                stackId='income'
                strokeWidth={2}
                stroke='#10b981'
                fill='url(#income)'
                className='drop-shadow-sm'
              />
            )
          }
          {
            variant === 'danger' && (
              <Area
                type='monotone'
                dataKey='expenses'
                stackId='expenses'
                strokeWidth={2}
                stroke='#f87171'
                fill='url(#expenses)'
                className='drop-shadow-sm'
              />
            )
          }
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}