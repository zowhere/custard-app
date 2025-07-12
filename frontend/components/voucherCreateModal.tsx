/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Coffee, ShoppingBag, Percent, Star, Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface VoucherCreateModalProps {
  onVoucherCreated?: (voucher: any) => void
  triggerButton?: React.ReactNode
}

const voucherCategories = [
  { value: "food", label: "Food & Beverages", icon: Coffee },
  { value: "retail", label: "Retail Items", icon: ShoppingBag },
  { value: "discount", label: "Discounts", icon: Percent },
  { value: "special", label: "Special Offers", icon: Star },
]

const voucherTypes = [
  { value: "freeItem", label: "Free Item", description: "Customer gets a specific item for free" },
  { value: "discount", label: "Percentage Discount", description: "Customer gets a percentage off their purchase" },
  { value: "cashback", label: "Cash Value", description: "Customer gets a fixed cash amount off" },
  { value: "special", label: "Special Offer", description: "Custom special offer or bundle" },
]

export function VoucherCreateModal({ onVoucherCreated, triggerButton }: VoucherCreateModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const { makeAuthenticatedRequest } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pointsCost: "",
    category: "",
    type: "",
    value: "",
    isActive: true,
    expiryDays: "30",
    maxRedemptions: "",
  })

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Voucher name is required"
    }

    if (!formData.pointsCost) {
      errors.pointsCost = "Points cost is required"
    } else if (isNaN(Number(formData.pointsCost)) || Number(formData.pointsCost) <= 0) {
      errors.pointsCost = "Points cost must be a positive number"
    }

    if (!formData.category) {
      errors.category = "Category is required"
    }

    if (!formData.type) {
      errors.type = "Voucher type is required"
    }

    if (formData.expiryDays && (isNaN(Number(formData.expiryDays)) || Number(formData.expiryDays) < 1)) {
      errors.expiryDays = "Expiry days must be a positive number"
    }

    if (formData.maxRedemptions && (isNaN(Number(formData.maxRedemptions)) || Number(formData.maxRedemptions) < 0)) {
      errors.maxRedemptions = "Max redemptions must be a non-negative number"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error when field is edited
    if (formErrors[id]) {
      setFormErrors((prev) => ({
        ...prev,
        [id]: "",
      }))
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when field is edited
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pointsCost: "",
      category: "",
      type: "",
      value: "",
      isActive: true,
      expiryDays: "30",
      maxRedemptions: "",
    })
    setFormErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await makeAuthenticatedRequest("/api/voucher", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          pointsCost: Number(formData.pointsCost),
          category: formData.category,
          type: formData.type,
          value: formData.value,
          isActive: formData.isActive,
          expiryDays: Number(formData.expiryDays),
          maxRedemptions: formData.maxRedemptions ? Number(formData.maxRedemptions) : 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create voucher")
      }

      const data = await response.json()
      

      if (onVoucherCreated) {
        onVoucherCreated(data.voucher)
      }

      resetForm()
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to create voucher:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Voucher
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Voucher</DialogTitle>
          <DialogDescription>Create a new voucher that customers can claim with their points.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Free Coffee"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what the customer gets..."
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pointsCost" className="text-right">
                Points Cost *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="pointsCost"
                  type="number"
                  value={formData.pointsCost}
                  onChange={handleChange}
                  placeholder="200"
                  className={formErrors.pointsCost ? "border-red-500" : ""}
                />
                {formErrors.pointsCost && <p className="text-xs text-red-500">{formErrors.pointsCost}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <div className="col-span-3 space-y-1">
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {voucherCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type *
              </Label>
              <div className="col-span-3 space-y-1">
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select voucher type" />
                  </SelectTrigger>
                  <SelectContent>
                    {voucherTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.type && <p className="text-xs text-red-500">{formErrors.type}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 1 Coffee, 10%, $5"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDays" className="text-right">
                Expires (days)
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="expiryDays"
                  type="number"
                  value={formData.expiryDays}
                  onChange={handleChange}
                  placeholder="30"
                  className={formErrors.expiryDays ? "border-red-500" : ""}
                />
                {formErrors.expiryDays && <p className="text-xs text-red-500">{formErrors.expiryDays}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxRedemptions" className="text-right">
                Max Redemptions
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="maxRedemptions"
                  type="number"
                  value={formData.maxRedemptions}
                  onChange={handleChange}
                  placeholder="Leave empty for unlimited"
                  className={formErrors.maxRedemptions ? "border-red-500" : ""}
                />
                {formErrors.maxRedemptions && <p className="text-xs text-red-500">{formErrors.maxRedemptions}</p>}
                <p className="text-xs text-muted-foreground">Leave empty for unlimited redemptions</p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <span className="text-sm text-muted-foreground">
                  {formData.isActive ? "Voucher is active and available to customers" : "Voucher is inactive"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Voucher"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
