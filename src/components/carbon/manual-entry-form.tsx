"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from "@/components/ui";
import { PlusCircle, Check } from "lucide-react";

interface ManualEntryFormProps {
  onSuccess?: () => void;
}

export function ManualEntryForm({ onSuccess }: ManualEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"transport" | "diet" | "energy" | "shopping" | "other">("shopping");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [successMsg, setSuccessMsg] = useState("");

  const addTxMutation = trpc.carbon.addTransaction.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantName || !amount || isNaN(parseFloat(amount))) {
      return;
    }

    try {
      await addTxMutation.mutateAsync({
        merchantName,
        amount: parseFloat(amount),
        category,
        transactionDate: date,
        subcategory: "manual",
      });

      setSuccessMsg("Logged successfully!");
      setMerchantName("");
      setAmount("");
      
      // Clear success message after 2s
      setTimeout(() => {
        setSuccessMsg("");
        setIsOpen(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error("Failed to add manual transaction:", err);
    }
  };

  return (
    <Card className="border-border-custom bg-surface shadow-md">
      {!isOpen ? (
        <div className="p-4 flex items-center justify-between font-sans">
          <div className="flex flex-col">
            <span className="font-bold text-soil text-sm">Add Transaction</span>
            <span className="text-xs text-muted">Log an expense manually to update footprint.</span>
          </div>
          <Button size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 h-9">
            <PlusCircle className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
      ) : (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-soil opacity-90 text-sm tracking-wide uppercase font-sans flex items-center justify-between">
              <span>Log Manual Expense</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted hover:text-soil font-semibold"
              >
                Cancel
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 font-sans">
            {successMsg ? (
              <div className="flex flex-col items-center justify-center py-6 text-moss gap-2">
                <div className="h-10 w-10 rounded-full bg-moss/10 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm">{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Merchant Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-soil">Merchant / Item Name</label>
                  <Input
                    placeholder="e.g. Whole Foods, Chevron, Starbucks"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Amount */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-soil">Amount (USD)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-soil">Transaction Date</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Category Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-soil">Carbon Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="flex h-11 w-full rounded-custom-input border border-border-custom bg-surface px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay font-sans"
                  >
                    <option value="shopping">Shopping (goods, fast fashion)</option>
                    <option value="diet">Diet (groceries, restaurant meals)</option>
                    <option value="transport">Transport (fuel, transit, taxi)</option>
                    <option value="energy">Energy (electricity bill, gas bill)</option>
                    <option value="other">Other (subscriptions, services)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  isLoading={addTxMutation.isPending}
                  className="w-full mt-2"
                >
                  Log Transaction
                </Button>
              </form>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
