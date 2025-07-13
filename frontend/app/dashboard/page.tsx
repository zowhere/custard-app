"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Send,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useVoucherStore } from "@/store/voucher"

interface Transaction {
  id: string
  type: "send" | "receive" | "claim" | "redeem"
  amount: number
  email?: string
  description?: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

interface UserProfile {
  email: string
  name: string
  businessName: string
  tokenSymbol: string
  tokenName: string
  balance: number
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [sendEmail, setSendEmail] = useState("")
  const [sendDescription, setSendDescription] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const {isAuthenticated, makeAuthenticatedRequest } = useAuth()
  const { updateVoucher } = useVoucherStore()

  const fetchDashboardData = async () => {
    try {
      const [tokenResponse, businessResponse, profileResponse, transactionsResponse, vouchersResponse ] = await Promise.all([
        await makeAuthenticatedRequest("/api/token",
          {
            method: "GET",
          }
        ),
        await makeAuthenticatedRequest("/api/business",
          {
            method: "GET",
          }
        ),
        await makeAuthenticatedRequest("/api/user",
          {
            method: "GET",
          }
        ),
        await makeAuthenticatedRequest("/api/transactions",
          {
            method: "GET",
          }
        ),
        await makeAuthenticatedRequest("/api/voucher",
          {
            method: "GET",
          }
        )
      ]);

      const { loyalty } = await tokenResponse.json()
      const { user } = await profileResponse.json()
      const { business } = await businessResponse.json()
      const { transactions = [] } = await transactionsResponse.json()
      const { vouchers } = await vouchersResponse.json()

      const { name: tokenName, symbol: tokenSymbol, totalSupply } = loyalty;
      const { name, email } = user;
      const { businessName } = business;
      
      setUserProfile({
        email,
        name,
        businessName,
        tokenSymbol,
        tokenName,
        balance: totalSupply
      });

      if(transactions){
        setTransactions(transactions) 
      }else{
        setTransactions([]);
      }
      
      updateVoucher(vouchers);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/signin"
      return
    }

    fetchDashboardData();
  },[isAuthenticated])

  const handleSendPoints = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSending(true)
      setSendSuccess(false)

      if (!sendAmount || !sendEmail) {
        throw new Error("Please enter both amount and recipient email")
      }

      const amount = Number.parseFloat(sendAmount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (amount > (userProfile?.balance || 0)) {
        throw new Error("Insufficient balance")
      }

      const newTransaction: Transaction = {
        id: `tx${Date.now()}`,
        type: "send",
        amount: amount,
        email: sendEmail,
        description: sendDescription || "Points transfer",
        timestamp: new Date().toISOString(),
        status: "completed",
      }

      await Promise.all([
        await makeAuthenticatedRequest("/api/token/send",
          {
            method: "POST",
            body: JSON.stringify({
              ...newTransaction
            })
          }
        ),
      ]);

      setTransactions([newTransaction, ...transactions])

      // Update balance
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          balance: userProfile.balance - amount,
        })
      }

      setSendSuccess(true)
      setSendAmount("")
      setSendEmail("")
      setSendDescription("")

      setTimeout(() => {
        setDialogOpen(false)
        setSendSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send points")
    } finally {
      setIsSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-orange-600" />
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />
      case "claim":
        return <Plus className="w-4 h-4 text-blue-600" />
      case "redeem":
        return <ArrowUpRight className="w-4 h-4 text-yellow-600" />
      default:
        return <ArrowDownLeft className="w-4 h-4 text-gray-600" />
    }
  }

  const getTransactionText = (transaction: Transaction) => {
    switch (transaction.type) {
      case "send":
        return `Sent to ${transaction.email}`
      case "receive":
        return `Received from ${transaction.email}`
      case "claim":
        return "Claimed points"
      case "redeem":
        return "Redeemed points"
      default:
        return "Transaction"
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl">Custard</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.name?.split(" ")[0]}!</h1>
              <p className="text-gray-600 mt-2">
                Manage your {userProfile?.tokenName} ({userProfile?.tokenSymbol})
              </p>
            </>
          )}
        </div>

        {/* Balance Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">Current Balance</p>
                <div className="flex items-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {isLoading ? (
                      <Skeleton className="h-10 w-32" />
                    ) : (
                      `${userProfile?.balance.toLocaleString()} ${userProfile?.tokenSymbol}`
                    )}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-yellow-600 to-blue-600 hover:from-yellow-700 hover:to-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Points
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Send {userProfile?.tokenName}</DialogTitle>
                      <DialogDescription>
                        Send {userProfile?.tokenName} to another user via their email address.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendPoints}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="amount" className="text-right text-sm font-medium">
                            Amount
                          </label>
                          <Input
                            id="amount"
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            placeholder={`Amount in ${userProfile?.tokenSymbol}`}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="email" className="text-right text-sm font-medium">
                            Recipient
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={sendEmail}
                            onChange={(e) => setSendEmail(e.target.value)}
                            placeholder="Email address"
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="description" className="text-right text-sm font-medium">
                            Description
                          </label>
                          <Input
                            id="description"
                            value={sendDescription}
                            onChange={(e) => setSendDescription(e.target.value)}
                            placeholder="Optional message"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      {sendSuccess && (
                        <Alert className="mb-4 border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">Points sent successfully!</AlertDescription>
                        </Alert>
                      )}
                      <DialogFooter>
                        <Button type="submit" disabled={isSending}>
                          {isSending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>Send Points</>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="ml-auto h-4 w-[100px]" />
                  </div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {getTransactionIcon(transaction.type)}
                            <span className="ml-2 capitalize">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{getTransactionText(transaction)}</div>
                            <div className="text-sm text-gray-500">{transaction.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium ${transaction.type === "send" || transaction.type === "redeem" ? "text-red-600" : "text-green-600"}`}
                          >
                            {transaction.type === "send" || transaction.type === "redeem" ? "-" : "+"}
                            {transaction.amount} {userProfile?.tokenSymbol}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
