"use client";

import { useMountedState } from "react-use";
import NewAccountSheet from "@/services/accounts/components/new-account-sheet";
import EditAccountsSheet from "@/services/accounts/components/edit-account-sheet";
import NewCategoriesSheet from "@/services/categories/components/new-category-sheet";
import EditCategoriesSheet from "@/services/categories/components/edit-category-sheet";
// import NewTransactionSheet from "@/services/transactions/components/new-transaction-sheet";
// import EditTransactionSheet from "@/services/transactions/components/edit-transaction-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null
  }

  return (
    <>
      <NewAccountSheet />
      <EditAccountsSheet />
      <NewCategoriesSheet />
      <EditCategoriesSheet />
      {/* 
      <NewTransactionSheet />
      <EditTransactionSheet /> */}
    </>
  );
};