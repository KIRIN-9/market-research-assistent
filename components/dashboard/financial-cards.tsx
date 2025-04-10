"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, Bitcoin, BarChart3, Droplet } from "lucide-react"
import { useEffect, useState } from "react"

interface FinancialData {
  currency: {
    value: number
    change: number
  }
  crypto: {
    value: number
    change: number
  }
  stock: {
    value: number
    change: number
  }
  commodity: {
    value: number
    change: number
    constraint: string
  }
}

const initialData: FinancialData = {
  currency: {
    value: 0.9327,
    change: 0.42,
  },
  crypto: {
    value: 67842,
    change: -1.23,
  },
  stock: {
    value: 5342.18,
    change: 0.87,
  },
  commodity: {
    value: 82.47,
    change: -0.63,
    constraint: "supply constraints",
  },
}

export function FinancialCards() {
  const [data, setData] = useState<FinancialData>(initialData)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        // Generate random fluctuations for each financial metric
        const currencyChange = (Math.random() * 0.2 - 0.1).toFixed(2)
        const cryptoChange = (Math.random() * 3 - 1.5).toFixed(2)
        const stockChange = (Math.random() * 0.4 - 0.2).toFixed(2)
        const commodityChange = (Math.random() * 0.3 - 0.15).toFixed(2)

        // Calculate new values
        const newCurrencyValue = Number.parseFloat(
          (prev.currency.value + Number.parseFloat(currencyChange) * 0.01).toFixed(4),
        )
        const newCryptoValue = Math.round(prev.crypto.value * (1 + Number.parseFloat(cryptoChange) / 100))
        const newStockValue = Number.parseFloat(
          (prev.stock.value * (1 + Number.parseFloat(stockChange) / 100)).toFixed(2),
        )
        const newCommodityValue = Number.parseFloat(
          (prev.commodity.value * (1 + Number.parseFloat(commodityChange) / 100)).toFixed(2),
        )

        // Generate random supply constraint messages
        const constraints = [
          "supply constraints",
          "production limits",
          "high demand",
          "OPEC decision",
          "geopolitical factors",
        ]
        const randomConstraint = constraints[Math.floor(Math.random() * constraints.length)]

        return {
          currency: {
            value: newCurrencyValue,
            change: Number.parseFloat(currencyChange),
          },
          crypto: {
            value: newCryptoValue,
            change: Number.parseFloat(cryptoChange),
          },
          stock: {
            value: newStockValue,
            change: Number.parseFloat(stockChange),
          },
          commodity: {
            value: newCommodityValue,
            change: Number.parseFloat(commodityChange),
            constraint: randomConstraint,
          },
        }
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="card-gradient border-[#1e293b]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Currency Exchange</CardTitle>
            <CardDescription>USD/EUR</CardDescription>
          </div>
          <DollarSign className="h-4 w-4 text-primary/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.currency.value.toFixed(4)}</div>
          <div
            className={`flex items-center text-xs mt-1 ${data.currency.change >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {data.currency.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(data.currency.change)}%</span>
            <span className="text-muted-foreground ml-1">vs yesterday</span>
          </div>
        </CardContent>
      </Card>

      <Card className="card-gradient border-[#1e293b]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cryptocurrency</CardTitle>
            <CardDescription>BTC/USD</CardDescription>
          </div>
          <Bitcoin className="h-4 w-4 text-amber-400/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.crypto.value.toLocaleString()}</div>
          <div
            className={`flex items-center text-xs mt-1 ${data.crypto.change >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {data.crypto.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(data.crypto.change)}%</span>
            <span className="text-muted-foreground ml-1">24h change</span>
          </div>
        </CardContent>
      </Card>

      <Card className="card-gradient border-[#1e293b]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Market</CardTitle>
            <CardDescription>S&P 500</CardDescription>
          </div>
          <BarChart3 className="h-4 w-4 text-primary/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.stock.value.toLocaleString()}</div>
          <div
            className={`flex items-center text-xs mt-1 ${data.stock.change >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {data.stock.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(data.stock.change)}%</span>
            <span className="text-muted-foreground ml-1">today</span>
          </div>
        </CardContent>
      </Card>

      <Card className="card-gradient border-[#1e293b]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commodities</CardTitle>
            <CardDescription>Crude Oil (WTI)</CardDescription>
          </div>
          <Droplet className="h-4 w-4 text-blue-400/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.commodity.value.toFixed(2)}</div>
          <div
            className={`flex items-center text-xs mt-1 ${data.commodity.change >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {data.commodity.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(data.commodity.change)}%</span>
            <span className="text-muted-foreground ml-1">{data.commodity.constraint}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
