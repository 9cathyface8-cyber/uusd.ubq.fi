import { formatUnits, type Address } from "viem";
import type { TokenBalance } from "../types/inventory.types.ts";
import type { InventoryBarComponent } from "../components/inventory-bar-component.ts";
import { areAddressesEqual } from "./format-utils.ts";

export const MIN_DISPLAY_USD_VALUE = 1;

/**
 * Balance utilities for inventory display and amount input fields
 */

function formatBalanceForInput(tokenBalance: TokenBalance): string {
  const formattedBalance = formatUnits(tokenBalance.balance, tokenBalance.decimals);
  return formattedBalance.replace(/\.?0+$/, "") || "0";
}

/**
 * Get the maximum available balance for a specific token from inventory bar
 */
export function getMaxTokenBalance(inventoryBar: InventoryBarComponent, tokenSymbol: string): string {
  if (!inventoryBar) {
    return "0";
  }

  const balances = inventoryBar.getBalances();
  const tokenBalance = balances.find((balance) => balance.symbol === tokenSymbol);

  if (!tokenBalance) {
    return "0";
  }

  return formatBalanceForInput(tokenBalance);
}

/**
 * Get the maximum available balance for a specific token address from inventory bar
 */
export function getMaxTokenBalanceByAddress(inventoryBar: InventoryBarComponent, tokenAddress: Address): string {
  if (!inventoryBar) {
    return "0";
  }

  const balances = inventoryBar.getBalances();
  const tokenBalance = balances.find((balance) => areAddressesEqual(balance.address, tokenAddress));

  if (!tokenBalance) {
    return "0";
  }

  return formatBalanceForInput(tokenBalance);
}

/**
 * Check if a token balance is available and greater than zero
 */
export function hasAvailableBalance(inventoryBar: InventoryBarComponent, tokenSymbol: string): boolean {
  const balances = inventoryBar.getBalances();
  const tokenBalance = balances.find((balance) => balance.symbol === tokenSymbol);

  if (!tokenBalance) {
    return false;
  }

  return tokenBalance.balance > 0n;
}

/**
 * Check if a token balance is available for a specific token address
 */
export function hasAvailableBalanceByAddress(inventoryBar: InventoryBarComponent, tokenAddress: Address): boolean {
  const balances = inventoryBar.getBalances();
  const tokenBalance = balances.find((balance) => areAddressesEqual(balance.address, tokenAddress));

  if (!tokenBalance) {
    return false;
  }

  return tokenBalance.balance > 0n;
}

/**
 * Check whether a token balance is large enough to display in inventory UI
 */
export function hasDisplayableUsdValue(tokenBalance: TokenBalance): boolean {
  return tokenBalance.balance > 0n && (tokenBalance.usdValue ?? 0) > MIN_DISPLAY_USD_VALUE;
}

/**
 * Filter wallet balances to the minimum USD value shown in inventory-facing UI
 */
export function getDisplayableBalances(balances: TokenBalance[]): TokenBalance[] {
  return balances.filter(hasDisplayableUsdValue);
}

/**
 * Get formatted balance display for a specific token
 */
export function getBalanceDisplay(inventoryBar: InventoryBarComponent, tokenSymbol: string): string {
  const balances = inventoryBar.getBalances();
  const tokenBalance = balances.find((balance) => balance.symbol === tokenSymbol);

  if (!tokenBalance) {
    return "0";
  }

  const formattedBalance = formatUnits(tokenBalance.balance, tokenBalance.decimals);
  const trimmed = formattedBalance.replace(/\.?0+$/, "") || "0";

  if (trimmed === "0") return "0";
  if (tokenBalance.balance < 100000000000000n) return "<0.0001";

  return parseFloat(formattedBalance).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}
