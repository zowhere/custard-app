"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VoucherCreateModal } from "@/components/voucherCreateModal"
import { Alert } from "@/components/ui/alert"
import { AlertDescription } from "@/components/ui/alert"
import { CardHeader } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { TableHeader } from "@/components/ui/table"
import { CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TableRow } from "@/components/ui/table"
import { TableHead } from "@/components/ui/table"
import { TableBody } from "@/components/ui/table"
import { TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Gift,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  Coffee,
  ShoppingBag,
  Star,
  Percent
} from "lucide-react"
import { useVoucherStore } from "@/store/voucher"
import { useAuth } from "@/lib/auth"

const voucherCategories = [
  { value: "food", label: "Food & Beverages", icon: Coffee },
  { value: "retail", label: "Retail Items", icon: ShoppingBag },
  { value: "discount", label: "Discounts", icon: Percent },
  { value: "special", label: "Special Offers", icon: Star },
]

export default function DashboardPage() {
  const { vouchers } = useVoucherStore()
  const [ error ] = useState<boolean>(false)
  const [ isLoading ] = useState<boolean>(false)
  const { makeAuthenticatedRequest } = useAuth()

  const handleVoucherCreated = async() => {
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = voucherCategories.find((c) => c.value === category)
    const Icon = categoryData?.icon || Gift
    return <Icon className="h-4 w-4" />
  };

  const handleToggleActive = async (voucherId: string) => {
    try {
      console.log(voucherId);
    } catch (err) {
      console.log(err);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "freeItem":
        return "bg-green-100 text-green-800"
      case "discount":
        return "bg-blue-100 text-blue-800"
      case "cashback":
        return "bg-purple-100 text-purple-800"
      case "special":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  };

  const handleDeleteVoucher = async (voucherID: string) => {
    if (!confirm("Are you sure you want to delete this voucher?")) return

    try {
      makeAuthenticatedRequest("/api/voucher", {
        method: "DELETE",
        body: JSON.stringify({
          voucherID
        })
      })
    } catch (err) {
      console.log(err)
    }
  };

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
                <span className="font-bold text-xl">Voucher</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Voucher Management</h1>
            <p className="text-muted-foreground">Create and manage vouchers that customers can claim with points</p>
          </div>
          <VoucherCreateModal onVoucherCreated={handleVoucherCreated} />
        </div>
          {/* Success/Error Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Vouchers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Vouchers</CardTitle>
              <CardDescription>Manage all your vouchers and track their performance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                      <Skeleton className="h-8 w-[100px]" />
                    </div>
                  ))}
                </div>
              ) : vouchers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Voucher</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Points Cost</TableHead>
                        <TableHead>Redemptions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vouchers.map((voucher) => (
                        <TableRow key={voucher.voucherID}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{voucher.name}</div>
                              <div className="text-sm text-muted-foreground">{voucher.description}</div>
                              {voucher.value && (
                                <div className="text-sm font-medium text-primary">Value: {voucher.value}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(voucher.category)}
                              <span className="capitalize">{voucher.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(voucher.type)}>{voucher.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{voucher.pointsCost} pts</span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>
                                {1}
                                {voucher.maxRedemptions > 0 && ` / ${voucher.maxRedemptions}`}
                              </div>
                              {voucher.maxRedemptions > 0 && (
                                <div className="text-muted-foreground">
                                  {Math.round((1 / voucher.maxRedemptions) * 100)}% used
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(voucher.voucherID)}
                                className="h-8 w-8 p-0"
                              >
                                {voucher.isActive ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                              <Badge variant={voucher.isActive ? "default" : "secondary"}>
                                {voucher.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteVoucher(voucher.voucherID)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No vouchers yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first voucher to start offering rewards to your customers.
                  </p>
                  <VoucherCreateModal
                    onVoucherCreated={handleVoucherCreated}
                    triggerButton={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Voucher
                      </Button>
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
      </main>
    </div>
  )
}
