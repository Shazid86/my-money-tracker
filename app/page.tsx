"use client";
import { toast as sonnerToast } from "sonner";
import Link from "next/link";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  CircleDollarSign,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  LayoutDashboard,
  MoreHorizontal,
  Copy,
  Eye,
  Moon,
  Pencil,
  TrendingUp,
  TrendingDown,
  Plus,
  Receipt,
  Save,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

                          // Shadcn UI
// Dropdown-Menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "../components/ui/dropdown-menu";

// Alert Dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"

// Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

// Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Progress
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "../components/ui/progress";

// Sheets
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";

// Accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

type Category =
  | "Stationery"
  | "Food"
  | "Transport"
  | "Bills"
  | "Shopping"
  | "Other";

type Transaction = {
  id: number;
  itemName: string;
  amount: number;
  category: Category;
  date: string;
  notes: string;
};

type SortOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest";

const categories: Category[] = [
  "Stationery",
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Other",
];

const categoryStyles: Record<
  Category,
  {
    dot: string;
    badge: string;
    bar: string;
  }
> = {
  Stationery: {
    dot: "bg-emerald-400",
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-400/20",
    bar: "bg-emerald-500",
  },

  Food: {
    dot: "bg-amber-400",
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/20",
    bar: "bg-amber-500",
  },

  Transport: {
    dot: "bg-sky-400",
    badge:
      "bg-sky-50 text-sky-700 ring-sky-600/10 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-400/20",
    bar: "bg-sky-500",
  },

  Bills: {
    dot: "bg-violet-400",
    badge:
      "bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-400/20",
    bar: "bg-violet-500",
  },

  Shopping: {
    dot: "bg-rose-400",
    badge:
      "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-400/20",
    bar: "bg-rose-500",
  },

  Other: {
    dot: "bg-slate-400",
    badge:
      "bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600",
    bar: "bg-slate-500",
  },
};

const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

export default function ExpenseTrackerPage() {
  const BRAND_NAME = "AuReUs";

  /*
   * ============================================================
   * APP STATE
   * ============================================================
   */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [editingId, setEditingId] = useState<
    number | null
  >(null);

  const [darkMode, setDarkMode] = useState(true);

  /*
   * walletBalance = SAVED value
   * walletDraft = what the user is currently typing
   */

  const [walletBalance, setWalletBalance] =
    useState<number>(0);

  const [walletDraft, setWalletDraft] =
    useState<string>("0");

  const [isWalletSaved, setIsWalletSaved] =
    useState(true);

  /*
   * IMPORTANT:
   *
   * No fake/demo transactions.
   * A new installation starts with zero transactions.
   */

  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  /*
   * Expense form
   */

  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    category: "Food" as Category,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  /*
   * Transaction search/filter/sort
   */

  const [searchQuery, setSearchQuery] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState<Category | "All">("All");

  const [sortOption, setSortOption] =
    useState<SortOption>("newest");

  /*
   * Toast notification
   */

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /*
   * Delete confirmation
   */

  const [deleteTarget, setDeleteTarget] =
    useState<Transaction | null>(null);

  const [detailsTarget, setDetailsTarget] =
  useState<Transaction | null>(null);

  /*
   * ============================================================
   * LOAD SAVED DATA
   * ============================================================
   */

  useEffect(() => {
    const savedWallet = localStorage.getItem(
      "takaflow-wallet"
    );

    const savedTransactions =
      localStorage.getItem(
        "takaflow-transactions"
      );

    const savedTheme = localStorage.getItem(
      "takaflow-theme"
    );

    /*
     * Wallet
     */

    if (savedWallet !== null) {
      const parsedWallet = Number(savedWallet);

      if (
        Number.isFinite(parsedWallet) &&
        parsedWallet >= 0
      ) {
        setWalletBalance(parsedWallet);
        setWalletDraft(String(parsedWallet));
      }
    } else {
      setWalletBalance(0);
      setWalletDraft("0");
    }

    /*
     * Transactions
     *
     * If the key doesn't exist, keep transactions empty.
     *
     * If [] exists, keep [].
     *
     * Therefore deleted transactions stay deleted.
     */

    if (savedTransactions !== null) {
      try {
        const parsedTransactions =
          JSON.parse(savedTransactions);

        if (Array.isArray(parsedTransactions)) {
          setTransactions(parsedTransactions);
        }
      } catch {
        console.error(
          "Could not load saved transactions."
        );

        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }

    /*
     * Theme
     */

    setDarkMode(savedTheme === "dark");
  }, []);

  /*
   * ============================================================
   * DARK MODE
   * ============================================================
   */

  /* ============================================================
   THEME — LOAD SAVED THEME
============================================================ */

useEffect(() => {
  const savedTheme =
    localStorage.getItem("takaflow-theme");

  const shouldUseDarkMode =
    savedTheme !== "light";

  setDarkMode(
    shouldUseDarkMode
  );

  const root =
    document.documentElement;

  if (shouldUseDarkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}, []);


/* ============================================================
   THEME — APPLY & SAVE AFTER INITIALIZATION
============================================================ */

useEffect(() => {
  if (darkMode === null) {
    return;
  }

  const root =
    document.documentElement;

  if (darkMode) {
    root.classList.add("dark");

    localStorage.setItem(
      "takaflow-theme",
      "dark"
    );
  } else {
    root.classList.remove("dark");

    localStorage.setItem(
      "takaflow-theme",
      "light"
    );
  }
}, [darkMode]);

  /*
   * ============================================================
   * TOAST AUTO CLOSE
   * ============================================================
   */

  

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    if (type === "success") {
      sonnerToast.success(message);
    } else {
      sonnerToast.error(message);
    }
  };

  /*
   * ============================================================
   * WALLET
   * ============================================================
   */

  const handleWalletDraftChange = (
    value: string
  ) => {
    if (value === "") {
      setWalletDraft("");
      setIsWalletSaved(false);
      return;
    }

    if (Number(value) < 0) {
      return;
    }

    setWalletDraft(value);

    setIsWalletSaved(
      Number(value) === walletBalance
    );
  };

  const saveWallet = () => {
    const numericWallet = Number(
      walletDraft
    );

    if (
      !Number.isFinite(numericWallet) ||
      numericWallet < 0
    ) {
      showToast(
        "Please enter a valid wallet amount.",
        "error"
      );

      return;
    }

    /*
     * Update React state
     */

    setWalletBalance(numericWallet);

    /*
     * Persist to browser storage
     */

    localStorage.setItem(
      "takaflow-wallet",
      String(numericWallet)
    );

    /*
     * Make the saved value authoritative
     */

    setWalletDraft(
      String(numericWallet)
    );

    setIsWalletSaved(true);

    showToast(
      "Wallet amount saved successfully."
    );
  };

  /*
   * ============================================================
   * LIVE DASHBOARD CALCULATIONS
   * ============================================================
   */

  const totalSpent = useMemo(
    () =>
      transactions.reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0
      ),
    [transactions]
  );

  const rawRemainingBalance =
    walletBalance - totalSpent;

  const remainingBalance = Math.max(
    rawRemainingBalance,
    0
  );

  const overspentAmount = Math.max(
    -rawRemainingBalance,
    0
  );

  const spentPercentage =
    walletBalance > 0
      ? (totalSpent / walletBalance) * 100
      : 0;

  const isNeedsImprovement =
    spentPercentage > 80;

  const isOverBudget =
    totalSpent > walletBalance;

  /*
   * ============================================================
   * CATEGORY TOTALS
   * ============================================================
   */

  const categoryTotals = useMemo(() => {
    return categories.map((category) => {
      const total = transactions
        .filter(
          (transaction) =>
            transaction.category === category
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        );

      return {
        category,
        total,
        percentage:
          totalSpent > 0
            ? (total / totalSpent) * 100
            : 0,
      };
    });
  }, [transactions, totalSpent]);

  /*
   * ============================================================
   * HIGHEST CATEGORY
   * ============================================================
   */

  const highestCategory = useMemo(() => {
    return categoryTotals.reduce(
      (largest, current) =>
        current.total > largest.total
          ? current
          : largest,
      {
        category: "Other" as Category,
        total: 0,
        percentage: 0,
      }
    );
  }, [categoryTotals]);

  /*
   * ============================================================
   * FILTER + SEARCH + SORT
   * ============================================================
   */

  const visibleTransactions = useMemo(() => {
    const normalizedSearch =
      searchQuery.trim().toLowerCase();

    const filtered =
      transactions.filter(
        (transaction) => {
          const matchesSearch =
            normalizedSearch
              ? [
                  transaction.itemName,
                  transaction.category,
                  transaction.notes,
                  transaction.date,
                ].some((value) =>
                  value
                    .toLowerCase()
                    .includes(
                      normalizedSearch
                    )
                )
              : true;

          const matchesCategory =
            categoryFilter === "All" ||
            transaction.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );

    return [...filtered].sort(
      (a, b) => {
        switch (sortOption) {
          case "oldest":
            return (
              new Date(
                `${a.date}T00:00:00`
              ).getTime() -
              new Date(
                `${b.date}T00:00:00`
              ).getTime()
            );

          case "highest":
            return b.amount - a.amount;

          case "lowest":
            return a.amount - b.amount;

          case "newest":
          default:
            return (
              new Date(
                `${b.date}T00:00:00`
              ).getTime() -
              new Date(
                `${a.date}T00:00:00`
              ).getTime()
            );
        }
      }
    );
  }, [
    transactions,
    searchQuery,
    categoryFilter,
    sortOption,
  ]);

  /*
   * ============================================================
   * ADD / UPDATE EXPENSE
   * ============================================================
   */

  const handleAddExpense = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const amount = Number(form.amount);

    /*
     * Validation
     */

    if (!form.itemName.trim()) {
      showToast(
        "Please enter an item name.",
        "error"
      );

      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      showToast(
        "Please enter a valid expense amount.",
        "error"
      );

      return;
    }

    if (!form.date) {
      showToast(
        "Please select a date.",
        "error"
      );

      return;
    }

    /*
     * UPDATE
     */

    if (editingId !== null) {
      const updatedTransactions =
        transactions.map(
          (transaction) =>
            transaction.id === editingId
              ? {
                  ...transaction,
                  itemName:
                    form.itemName.trim(),
                  amount,
                  category: form.category,
                  date: form.date,
                  notes: form.notes.trim(),
                }
              : transaction
        );

      setTransactions(
        updatedTransactions
      );

      localStorage.setItem(
        "takaflow-transactions",
        JSON.stringify(
          updatedTransactions
        )
      );

      setEditingId(null);

      resetForm();

      showToast(
        "Expense updated successfully."
      );

      return;
    }

    /*
     * ADD
     */

    const newTransaction: Transaction = {
      id: Date.now(),
      itemName: form.itemName.trim(),
      amount,
      category: form.category,
      date: form.date,
      notes: form.notes.trim(),
    };

    const updatedTransactions = [
      newTransaction,
      ...transactions,
    ];

    setTransactions(
      updatedTransactions
    );

    /*
     * Immediately persist
     */

    localStorage.setItem(
      "takaflow-transactions",
      JSON.stringify(
        updatedTransactions
      )
    );

    resetForm();

    showToast(
      "Expense added successfully."
    );
  };

  /*
   * ============================================================
   * EDIT
   * ============================================================
   */

  const editTransaction = (
    transaction: Transaction
  ) => {
    setEditingId(transaction.id);

    setForm({
      itemName: transaction.itemName,
      amount: String(
        transaction.amount
      ),
      category: transaction.category,
      date: transaction.date,
      notes: transaction.notes,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * ============================================================
   * DELETE REQUEST
   * ============================================================
   */

  const requestDeleteTransaction = (
    transaction: Transaction
  ) => {
    setDeleteTarget(transaction);
  };

  /*
   * ============================================================
   * DELETE CONFIRMATION
   * ============================================================
   */

  const confirmDeleteTransaction = () => {
    if (!deleteTarget) {
      return;
    }

    const updatedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.id !==
          deleteTarget.id
      );

    /*
     * Update React state
     */

    setTransactions(
      updatedTransactions
    );

    /*
     * IMPORTANT:
     *
     * Persist [] when the final transaction
     * gets deleted.
     *
     * This prevents deleted data from
     * resurrecting after refresh.
     */

    localStorage.setItem(
      "takaflow-transactions",
      JSON.stringify(
        updatedTransactions
      )
    );

    if (
      editingId ===
      deleteTarget.id
    ) {
      setEditingId(null);
      resetForm();
    }

    setDeleteTarget(null);

    showToast(
      "Transaction deleted successfully."
    );
  };

  /*
   * ============================================================
   * FORM RESET
   * ============================================================
   */

  const resetForm = () => {
    setForm({
      itemName: "",
      amount: "",
      category: "Food",
      date: new Date()
        .toISOString()
        .split("T")[0],
      notes: "",
    });
  };

  /*
   * ============================================================
   * CANCEL EDIT
   * ============================================================
   */

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();

    showToast(
      "Editing cancelled."
    );
  };

  /*
   * ============================================================
   * THEME
   * ============================================================
   */

  const toggleTheme = () => {
    setDarkMode(
      (current) => !current
    );
  };

  /*
   * ============================================================
   * FILTER RESET
   * ============================================================
   */

  const clearTransactionFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setSortOption("newest");
  };

  /*
   * ============================================================
   * CSV EXPORT
   * ============================================================
   */

  const exportTransactions = () => {
    if (transactions.length === 0) {
      showToast(
        "There are no transactions to export.",
        "error"
      );

      return;
    }

    const headers = [
      "Item Name",
      "Amount (BDT)",
      "Category",
      "Date",
      "Notes",
    ];

    const escapeCsv = (
      value: string | number
    ) => {
      const stringValue =
        String(value);

      return `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows =
      transactions.map(
        (transaction) => [
          transaction.itemName,
          transaction.amount,
          transaction.category,
          transaction.date,
          transaction.notes,
        ]
      );

    const csv = [
      headers
        .map(escapeCsv)
        .join(","),
      ...rows.map((row) =>
        row
          .map(escapeCsv)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download = `takaflow-transactions-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);

    showToast(
      "Transaction CSV exported successfully."
    );
  };

  /*
   * ============================================================
   * CURRENT MONTH
   * ============================================================
   */

  const currentMonth =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ).format(new Date());

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  /* ============================================================
   MONTHLY SPENDING PROGRESS
============================================================ */

const currentMonthKey =
new Date().toISOString().slice(0, 7);

const monthlySpent =
transactions
  .filter((transaction) =>
    transaction.date.startsWith(
      currentMonthKey
    )
  )
  .reduce(
    (total, transaction) =>
      total + transaction.amount,
    0
  );

const spendingProgress =
walletBalance > 0
  ? Math.min(
      (monthlySpent / walletBalance) * 100,
      100
    )
  : 0;

const remainingForMonth =
Math.max(
  walletBalance - monthlySpent,
  0
);

  return (
     <TooltipProvider>
    <main
      className={`min-h-screen text-slate-900 transition-colors duration-300 dark:text-slate-100 ${
        darkMode
          ? "bg-slate-950"
          : "bg-slate-100"
      }`}
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />

        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-green-100/50 blur-3xl dark:bg-green-900/10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* =====================================================
    PREMIUM WEBSITE NAVIGATION
===================================================== */}

<nav className="sticky top-4 z-40 mb-12">

  <div className="rounded-[28px] border border-slate-200/70 bg-white/80 px-4 py-3 shadow-xl shadow-slate-200/20 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-slate-950/70 dark:shadow-black/20 sm:px-5">

    <div className="flex items-center justify-between gap-3">

      {/* =================================================
          LOGO
      ================================================= */}

<a
  href="#home"
  onClick={() => setMobileMenuOpen(false)}
  className="group flex items-center gap-3"
>
  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 transition duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/40">
    <div className="absolute inset-0 bg-white/10" />

    <Wallet className="relative h-5 w-5 text-white" />
  </div>

  <div>
    <p className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
      {BRAND_NAME}
    </p>

    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
      Money Management
    </p>
  </div>
</a>


      {/* =================================================
          DESKTOP NAVIGATION
      ================================================= */}

      <div className="hidden items-center rounded-2xl border border-slate-200/70 bg-slate-50/80 p-1 dark:border-white/[0.06] dark:bg-white/[0.04] lg:flex">

        {[
  ["Features", "#features"],
  ["About", "#about"],
  ["FAQ", "#faq"],
].map(
          ([label, href]) => (

            <a
              key={label}
              href={href}
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-white hover:text-slate-950 hover:shadow-sm dark:text-slate-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
            >

              {label}

            </a>

          )
        )}

      </div>


      {/* =================================================
          RIGHT CONTROLS
      ================================================= */}

      <div className="flex items-center gap-2">


        {/* THEME TOGGLE */}

        <Tooltip>
  <TooltipTrigger
    render={
      <button
        type="button"
        onClick={() =>
          setDarkMode(!darkMode)
        }
        className="..."
      >
        {darkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    }
  />

  <TooltipContent>
    {darkMode
      ? "Switch to light mode"
      : "Switch to dark mode"}
  </TooltipContent>
</Tooltip>


        {/* CTA */}

        <a
          href="#dashboard"
          className="group hidden items-center gap-2 rounded-xl ml-8 bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/25 dark:bg-emerald-500 dark:hover:bg-emerald-400 md:flex"
        >

          Get Started

          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

        </a>


        {/* MOBILE MENU */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-white/[0.08] dark:text-slate-300 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 lg:hidden"
          aria-label="Toggle navigation"
        >

          <MoreHorizontal className="h-5 w-5" />

        </button>

      </div>

    </div>


    {/* =================================================
        MOBILE NAVIGATION
    ================================================= */}

    {mobileMenuOpen && (

      <div className="mt-4 border-t border-slate-200/70 pt-4 dark:border-white/[0.08] lg:hidden">

        <div className="grid gap-1">

          {[
  ["Features", "#features"],
  ["About", "#about"],
  ["FAQ", "#faq"],
].map(
            ([label, href]) => (

              <a
                key={label}
                href={href}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
              >

                {label}

                <ArrowUpRight className="h-4 w-4 opacity-50" />

              </a>

            )
          )}

        </div>

      </div>

    )}

  </div>

</nav>


{/* =====================================================
    PREMIUM HERO
===================================================== */}

<header
  id="home"
  className="relative mb-12 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white px-6 py-10 shadow-xl shadow-slate-200/20 dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 sm:px-10 sm:py-14"
>


  {/* BACKGROUND DECORATION */}

  <div className="pointer-events-none absolute inset-0 overflow-hidden">

    <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

    <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-green-300/10 blur-3xl dark:bg-emerald-900/10" />

    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

  </div>


  <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">


    {/* =================================================
        HERO CONTENT
    ================================================= */}

    <div>


      {/* BADGE */}

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">

        <span className="relative flex h-2 w-2">

          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

        </span>

        Your personal money command center

      </div>


      {/* HEADLINE */}

      <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">

        Take control of

        <span className="block bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 bg-clip-text text-transparent">

          your money flow.

        </span>

      </h1>


      {/* DESCRIPTION */}

      <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">

        Track every single penny. Understand where your money goes.
        Build better spending habits and stay in control of
        your financial life.

      </p>


      {/* HERO ACTIONS */}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">


        <a
          href="#dashboard"
          className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/30"
        >

          Start Tracking

          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />

        </a>


        <a
          href="#transactions"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
        >

          View Transactions

        </a>

      </div>


      {/* MINI TRUST LINE */}

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-400">

        <div className="flex items-center gap-2">

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

            <Check className="h-3.5 w-3.5" />

          </div>

          Track every purchase

        </div>


        <div className="flex items-center gap-2">

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

            <Check className="h-3.5 w-3.5" />

          </div>

          Your data stays organized

        </div>


        <div className="flex items-center gap-2">

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

            <Check className="h-3.5 w-3.5" />

          </div>

          Built for better habits

        </div>

      </div>

    </div>


    {/* =================================================
        CURRENT MONTH CARD
    ================================================= */}

    <div className="relative">

      <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 dark:border-white/[0.08] sm:p-7">


        {/* TOP */}

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">

              Financial period

            </p>

            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">

              {currentMonth}

            </h2>

          </div>


          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">

            <CalendarDays className="h-5 w-5" />

          </div>

        </div>


        {/* DIVIDER */}

        <div className="my-6 h-px bg-white/[0.08]" />


        {/* STATUS */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-medium text-slate-400">

              Monthly status

            </p>

            <div className="mt-2 flex items-center gap-2">

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isNeedsImprovement
                    ? "bg-amber-400"
                    : "bg-emerald-400"
                }`}
              />

              <span
                className={`text-sm font-bold ${
                  isNeedsImprovement
                    ? "text-amber-300"
                    : "text-emerald-300"
                }`}
              >

                {isNeedsImprovement
                  ? "Needs attention"
                  : "Looking healthy"}

              </span>

            </div>

          </div>


          <div className="text-right">

            <p className="text-xs text-slate-500">

              Budget used

            </p>

            <p className="mt-1 font-display text-2xl font-bold text-white">

              {walletBalance > 0
                ? `${spentPercentage.toFixed(1)}%`
                : "0.0%"}

            </p>

          </div>

        </div>


        {/* PROGRESS */}

        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/[0.08]">

          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isNeedsImprovement
                ? "bg-amber-400"
                : "bg-emerald-400"
            }`}
            style={{
              width: `${Math.min(
                spentPercentage,
                100
              )}%`,
            }}
          />

        </div>


        <p className="mt-4 text-xs leading-5 text-slate-500">

          Stay aware of your spending today so your future
          financial decisions become easier tomorrow.

        </p>

      </div>

    </div>

  </div>

</header>

{/* =====================================================
    FEATURES
===================================================== */}

<section
  id="features"
  className="scroll-mt-32 py-6 sm:py-10"
>
  {/* ===================================================
      SECTION HEADER
  =================================================== */}

  <div className="mb-10 max-w-2xl">

    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
      Powerful Features
    </p>

    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
      Everything you need to understand your money.
    </h2>

    <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
      Aureus helps you track spending, understand your financial
      habits, and make better decisions with your money.
    </p>

  </div>


  {/* ===================================================
      FEATURE CARDS
  =================================================== */}

  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">


    {/* =================================================
        1. EXPENSE TRACKING
    ================================================= */}

    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-emerald-500/30">

      {/* Decorative glow */}

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl transition-opacity duration-300 group-hover:bg-emerald-400/20" />

      {/* Icon */}

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-950/40 dark:text-emerald-400">

        <Wallet className="h-6 w-6" />

      </div>


      {/* Content */}

      <h3 className="relative mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">
        Expense Tracking
      </h3>

      <p className="relative mt-3 leading-7 text-slate-500 dark:text-slate-400">
        Record your everyday expenses and know exactly where your
        money goes.
      </p>

    </div>



    {/* =================================================
        2. FINANCIAL OVERVIEW
    ================================================= */}

    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-emerald-500/30">

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl transition-opacity duration-300 group-hover:bg-blue-400/20" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-950/40 dark:text-blue-400">

        <LayoutDashboard className="h-6 w-6" />

      </div>

      <h3 className="relative mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">
        Financial Overview
      </h3>

      <p className="relative mt-3 leading-7 text-slate-500 dark:text-slate-400">
        See your balance, spending activity, and financial information
        in one clear dashboard.
      </p>

    </div>



    {/* =================================================
        3. SMART CATEGORIES
    ================================================= */}

    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-emerald-500/30">

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-400/10 blur-3xl transition-opacity duration-300 group-hover:bg-violet-400/20" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110 dark:bg-violet-950/40 dark:text-violet-400">

        <SlidersHorizontal className="h-6 w-6" />

      </div>

      <h3 className="relative mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">
        Smart Categories
      </h3>

      <p className="relative mt-3 leading-7 text-slate-500 dark:text-slate-400">
        Organize transactions into meaningful categories and make your
        spending easier to understand.
      </p>

    </div>



    {/* =================================================
        4. TRANSACTION HISTORY
    ================================================= */}

    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-emerald-500/30">

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-400/10 blur-3xl transition-opacity duration-300 group-hover:bg-orange-400/20" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:scale-110 dark:bg-orange-950/40 dark:text-orange-400">

        <ClipboardList className="h-6 w-6" />

      </div>

      <h3 className="relative mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">
        Transaction History
      </h3>

      <p className="relative mt-3 leading-7 text-slate-500 dark:text-slate-400">
        Review your past transactions, check details, and keep your
        financial records organized.
      </p>

    </div>



    {/* =================================================
        5. PERSONALIZED EXPERIENCE
    ================================================= */}

    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-emerald-500/30">

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-400/10 blur-3xl transition-opacity duration-300 group-hover:bg-pink-400/20" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 transition-transform duration-300 group-hover:scale-110 dark:bg-pink-950/40 dark:text-pink-400">

        <Moon className="h-6 w-6" />

      </div>

      <h3 className="relative mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">
        Personalized Experience
      </h3>

      <p className="relative mt-3 leading-7 text-slate-500 dark:text-slate-400">
        Switch between light and dark mode and use Aureus in the
        environment that feels comfortable to you.
      </p>

    </div>



    {/* =================================================
        6. BETTER MONEY HABITS
    ================================================= */}

    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 dark:hover:border-emerald-500/30">

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl transition-opacity duration-300 group-hover:bg-amber-400/20" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110 dark:bg-amber-950/40 dark:text-amber-400">

        <TrendingUp className="h-6 w-6" />

      </div>

      <h3 className="relative mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">
        Better Money Habits
      </h3>

      <p className="relative mt-3 leading-7 text-slate-500 dark:text-slate-400">
        Understand your everyday spending patterns and take practical
        steps toward better financial habits.
      </p>

    </div>


  </div>

</section>


{/* =====================================================
    ABOUT AUREUS
===================================================== */}

<section
  id="about"
  className="scroll-mt-32 py-12 sm:py-16"
>
  <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">


    {/* =================================================
        LEFT — ABOUT CONTENT
    ================================================= */}

    <div>

      {/* EYEBROW */}

      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
        About Aureus
      </p>


      {/* MAIN HEADING */}

      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
        Your money deserves more than guesswork.
      </h2>


      {/* INTRODUCTION */}

      <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
        Aureus is built to help people understand where their money
        goes and take control of everyday spending without making
        personal finance unnecessarily complicated.
      </p>


      <p className="mt-4 text-base leading-8 text-slate-500 dark:text-slate-400">
        Instead of relying on memory, random notes, or guessing at the
        end of the month, Aureus gives you one clear place to record
        expenses, review transactions, and understand your financial
        habits.
      </p>


      {/* =================================================
          CORE VALUES
      ================================================= */}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">


        {/* CLARITY */}

        <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">

            <Eye className="h-5 w-5" />

          </div>

          <h3 className="mt-4 font-black text-slate-950 dark:text-white">
            Clarity
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            See your money clearly instead of guessing.
          </p>

        </div>


        {/* CONTROL */}

        <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">

            <ShieldCheck className="h-5 w-5" />

          </div>

          <h3 className="mt-4 font-black text-slate-950 dark:text-white">
            Control
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Stay aware of your everyday financial decisions.
          </p>

        </div>


        {/* PROGRESS */}

        <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">

            <TrendingUp className="h-5 w-5" />

          </div>

          <h3 className="mt-4 font-black text-slate-950 dark:text-white">
            Progress
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Build stronger money habits over time.
          </p>

        </div>

      </div>


      {/* =================================================
          ACTION BUTTONS
      ================================================= */}

      <div className="mt-8 flex flex-wrap items-center gap-3">


        {/* PRIMARY CTA */}

        <a
          href="#dashboard"
          className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          Start managing your money

          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

        </a>


        {/* FULL STORY */}

        <a
          href="/about"
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
        >
          Read the full story

          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

        </a>

      </div>

    </div>



    {/* =================================================
        RIGHT — AUREUS PHILOSOPHY CARD
    ================================================= */}

    <div className="relative">


      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />


      {/* MAIN CARD */}

      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-white/[0.08] dark:bg-slate-900/70 dark:shadow-black/20 sm:p-8">


        {/* CARD HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              The Aureus philosophy
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Small awareness.
              <br />
              Better decisions.
            </h3>

          </div>


          {/* WALLET ICON */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">

            <Wallet className="h-5 w-5 text-white" />

          </div>

        </div>


        {/* DIVIDER */}

        <div className="my-8 h-px bg-slate-200 dark:bg-white/[0.08]" />


        {/* =================================================
            PHILOSOPHY POINTS
        ================================================= */}

        <div className="space-y-5">


          {/* POINT ONE */}

          <div className="flex gap-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">

              <Check className="h-4 w-4" />

            </div>

            <div>

              <p className="font-bold text-slate-900 dark:text-white">
                Every transaction matters
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Small everyday expenses can reveal important spending
                patterns.
              </p>

            </div>

          </div>


          {/* POINT TWO */}

          <div className="flex gap-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">

              <Check className="h-4 w-4" />

            </div>

            <div>

              <p className="font-bold text-slate-900 dark:text-white">
                Awareness comes before improvement
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                You cannot improve financial habits you do not understand.
              </p>

            </div>

          </div>


          {/* POINT THREE */}

          <div className="flex gap-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">

              <Check className="h-4 w-4" />

            </div>

            <div>

              <p className="font-bold text-slate-900 dark:text-white">
                Better habits create better futures
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Consistent financial awareness can lead to meaningful
                long-term change.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM MESSAGE
        ================================================= */}

        <div className="mt-8 rounded-2xl bg-slate-50 p-5 dark:bg-white/[0.04]">

          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">

            Aureus isn't about obsessing over every penny.
            It's about understanding your money well enough to make
            smarter decisions with confidence.

          </p>

        </div>

      </div>

    </div>

  </div>

</section>

{/* =====================================================
    FAQ — FREQUENTLY ASKED QUESTIONS
===================================================== */}

<section
  id="faq"
  className="scroll-mt-32 py-12 sm:py-16"
>
  <div className="relative overflow-hidden rounded-[36px] border border-slate-200/80 bg-white/70 px-5 py-10 shadow-xl shadow-slate-200/20 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-black/20 sm:px-8 sm:py-14 lg:px-12">


    {/* =================================================
        BACKGROUND DECORATION
    ================================================= */}

    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-green-400/10 blur-3xl dark:bg-emerald-900/20" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

    </div>


    {/* =================================================
        CONTENT
    ================================================= */}

    <div className="relative">


      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <div className="mx-auto max-w-2xl text-center">


        {/* EYEBROW */}

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

          <Sparkles className="h-3.5 w-3.5" />

          FAQ

        </div>


        {/* TITLE */}

        <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">

          Questions, answered clearly.

        </h2>


        {/* DESCRIPTION */}

        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">

          Everything you need to know about using Aureus to
          understand your spending and build better money habits.

        </p>

      </div>


      {/* =================================================
          FAQ CONTENT
      ================================================= */}

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">


        {/* =============================================
            LEFT SIDE — INFO CARD
        ============================================== */}

        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.04] sm:p-7">


          {/* ICON */}

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">

            <CircleHelp className="h-5 w-5 text-white" />

          </div>


          {/* TITLE */}

          <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">

            Simple answers.
            <br />
            Better understanding.

          </h3>


          {/* TEXT */}

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">

            Aureus is designed to keep money management simple.
            No unnecessary complexity. No confusing financial jargon.

          </p>


          {/* MINI POINTS */}

          <div className="mt-6 space-y-4">


            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

                <Check className="h-3.5 w-3.5" />

              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">

                Track your everyday expenses.

              </p>

            </div>


            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

                <Check className="h-3.5 w-3.5" />

              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">

                Review your transactions clearly.

              </p>

            </div>


            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

                <Check className="h-3.5 w-3.5" />

              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">

                Build stronger financial awareness.

              </p>

            </div>

          </div>


          {/* BOTTOM MESSAGE */}

          <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/[0.06]">

            <p className="text-sm font-medium leading-6 text-emerald-800 dark:text-emerald-300">

              The goal isn't to obsess over every taka.
              It's to understand where your money goes.

            </p>

          </div>

        </div>


        {/* =============================================
            RIGHT SIDE — SHADCN ACCORDION
        ============================================== */}

        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-3 shadow-lg shadow-slate-200/10 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-black/10 sm:p-4">


          <Accordion
            type="single"
            collapsible="true"
            className="w-full"
          >


            {/* QUESTION 1 */}

            <AccordionItem
              value="item-1"
              className="border-b border-slate-100 px-2 dark:border-white/[0.07]"
            >

              <AccordionTrigger className="py-5 text-left text-sm font-bold text-slate-900 hover:no-underline dark:text-white sm:text-base">

                What is Aureus?

              </AccordionTrigger>

              <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-slate-600 dark:text-slate-400">

                Aureus is a personal expense tracker designed to help
                you record transactions, understand where your money
                goes, and become more aware of your everyday spending.

              </AccordionContent>

            </AccordionItem>


            {/* QUESTION 2 */}

            <AccordionItem
              value="item-2"
              className="border-b border-slate-100 px-2 dark:border-white/[0.07]"
            >

              <AccordionTrigger className="py-5 text-left text-sm font-bold text-slate-900 hover:no-underline dark:text-white sm:text-base">

                Is Aureus free to use?

              </AccordionTrigger>

              <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-slate-600 dark:text-slate-400">

                The current version of Aureus is focused on providing
                a simple and accessible personal expense tracking
                experience. Future features and plans may evolve as
                the product develops.

              </AccordionContent>

            </AccordionItem>


            {/* QUESTION 3 */}

            <AccordionItem
              value="item-3"
              className="border-b border-slate-100 px-2 dark:border-white/[0.07]"
            >

              <AccordionTrigger className="py-5 text-left text-sm font-bold text-slate-900 hover:no-underline dark:text-white sm:text-base">

                Where is my financial data stored?

              </AccordionTrigger>

              <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-slate-600 dark:text-slate-400">

                In the current version, Aureus stores your expense
                information locally in your browser. Your data remains
                available on the device and browser where you use the
                application.

              </AccordionContent>

            </AccordionItem>


            {/* QUESTION 4 */}

            <AccordionItem
              value="item-4"
              className="border-b border-slate-100 px-2 dark:border-white/[0.07]"
            >

              <AccordionTrigger className="py-5 text-left text-sm font-bold text-slate-900 hover:no-underline dark:text-white sm:text-base">

                Can I edit or delete transactions?

              </AccordionTrigger>

              <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-slate-600 dark:text-slate-400">

                Yes. Aureus allows you to update transaction information
                when something changes and remove transactions you no
                longer want to keep.

              </AccordionContent>

            </AccordionItem>


            {/* QUESTION 5 */}

            <AccordionItem
              value="item-5"
              className="border-b border-slate-100 px-2 dark:border-white/[0.07]"
            >

              <AccordionTrigger className="py-5 text-left text-sm font-bold text-slate-900 hover:no-underline dark:text-white sm:text-base">

                Does Aureus work on mobile devices?

              </AccordionTrigger>

              <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-slate-600 dark:text-slate-400">

                Yes. Aureus is designed with responsive layouts so you
                can manage and review your expenses across desktop,
                tablet, and mobile screen sizes.

              </AccordionContent>

            </AccordionItem>


            {/* QUESTION 6 */}

            <AccordionItem
              value="item-6"
              className="border-b-0 px-2"
            >

              <AccordionTrigger className="py-5 text-left text-sm font-bold text-slate-900 hover:no-underline dark:text-white sm:text-base">

                Does Aureus support dark mode?

              </AccordionTrigger>

              <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-slate-600 dark:text-slate-400">

                Yes. Aureus supports both light and dark themes, and
                your selected theme is remembered so your preferred
                experience remains consistent after refreshing.

              </AccordionContent>

            </AccordionItem>


          </Accordion>

        </div>

      </div>


      {/* =================================================
          BOTTOM CTA
      ================================================= */}

      <div className="mx-auto mt-10 max-w-2xl text-center">

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">

          Ready to understand your money better?

        </p>


        <a
          href="#dashboard"
          className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >

          Start using Aureus

          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

        </a>

      </div>

    </div>

  </div>

</section>

        {/* =====================================================
            WALLET
        ===================================================== */}

<section
  className="relative mb-8 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/30 dark:border-white/[0.08] dark:bg-slate-900/70 dark:shadow-black/30 sm:p-8 lg:p-10"
>
  {/* =============================================
      BACKGROUND ATMOSPHERE
  ============================================= */}

  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-emerald-400/[0.08] blur-3xl dark:bg-emerald-500/[0.08]" />

    <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-green-400/[0.06] blur-3xl dark:bg-emerald-500/[0.06]" />

    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
  </div>

  <div className="relative">
    {/* =============================================
        SECTION HEADER
    ============================================= */}

    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <Wallet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />

          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            Financial Command Center
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Your monthly wallet.
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Set your available money for the month and keep an eye
          on how every penny moves.
        </p>
      </div>

      {/* SAVE STATUS */}

      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
          isWalletSaved
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
        }`}
      >
        {isWalletSaved ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Saved
          </>
        ) : (
          <>
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Unsaved changes
          </>
        )}
      </div>
    </div>

    {/* =============================================
        MAIN GRID
    ============================================= */}

    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      {/* =============================================
          LEFT SIDE — WALLET CONTROL
      ============================================= */}

      <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/[0.08] dark:bg-white/[0.035] sm:p-7">
        {/* LABEL */}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Total Money Available
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Your monthly budget or available cash.
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        {/* INPUT */}

        <label
          htmlFor="walletBalance"
          className="mb-3 block text-xs font-bold text-slate-600 dark:text-slate-300"
        >
          Monthly Wallet / Budget
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-emerald-500/10 font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
            ৳
          </div>

          <input
            id="walletBalance"
            type="number"
            min="0"
            value={walletDraft}
            onChange={(event) =>
              handleWalletDraftChange(event.target.value)
            }
            placeholder="25000"
            className="w-full rounded-2xl border border-slate-200 bg-white px-16 py-5 font-display text-3xl font-bold tracking-tight text-slate-950 outline-none transition-all placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-700"
          />
        </div>

        {/* INPUT STATUS */}

        <div className="mt-3 flex items-center gap-2">
          {isWalletSaved ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />

              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Your wallet amount is safely saved.
              </span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500" />

              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                You have unsaved changes.
              </span>
            </>
          )}
        </div>

        {/* SAVE BUTTON */}

        <button
          type="button"
          onClick={saveWallet}
          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-500/30 active:translate-y-0"
        >
          <Save className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

          Save Monthly Wallet
        </button>
      </div>

      {/* =============================================
          RIGHT SIDE — MONEY OVERVIEW
      ============================================= */}

      <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/15 dark:bg-black/30 sm:p-7">
        {/* TOP */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Current Position
            </p>

            <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-white">
              Monthly financial health
            </h3>
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              isOverBudget
                ? "bg-rose-500/15 text-rose-400"
                : "bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {isOverBudget ? (
              <TrendingDown className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )}
          </div>
        </div>

        {/* MAIN REMAINING */}

        <div className="mt-8">
          <p className="text-sm font-medium text-slate-400">
            {isOverBudget
              ? "Amount over budget"
              : "Money remaining"}
          </p>

          <p
            className={`mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl ${
              isOverBudget
                ? "text-rose-400"
                : "text-emerald-400"
            }`}
          >
            {isOverBudget
              ? `-${formatBDT(overspentAmount)}`
              : formatBDT(remainingBalance)}
          </p>
        </div>

        {/* PROGRESS */}

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">
              Monthly usage
            </span>

            <span
              className={`font-display text-lg font-bold ${
                isNeedsImprovement
                  ? "text-rose-400"
                  : "text-emerald-400"
              }`}
            >
              {walletBalance > 0
                ? `${spentPercentage.toFixed(1)}%`
                : "0.0%"}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isNeedsImprovement
                  ? "bg-rose-500"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-400"
              }`}
              style={{
                width: `${Math.min(
                  spentPercentage,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* FINANCIAL NUMBERS */}

        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Total Spent
            </p>

            <p className="mt-2 font-display text-lg font-bold text-white">
              {formatBDT(totalSpent)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Total Budget
            </p>

            <p className="mt-2 font-display text-lg font-bold text-white">
              {formatBDT(walletBalance)}
            </p>
          </div>
        </div>

        {/* STATUS */}

        <div
          className={`mt-5 flex items-center gap-3 rounded-2xl border p-4 ${
            isNeedsImprovement
              ? "border-rose-500/15 bg-rose-500/10"
              : "border-emerald-500/15 bg-emerald-500/10"
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isNeedsImprovement
                ? "bg-rose-500/15 text-rose-400"
                : "bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {isNeedsImprovement ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </div>

          <div>
            <p
              className={`text-sm font-bold ${
                isNeedsImprovement
                  ? "text-rose-300"
                  : "text-emerald-300"
              }`}
            >
              {isNeedsImprovement
                ? "Spending needs attention"
                : "Your spending looks healthy"}
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-400">
              {isNeedsImprovement
                ? "You have used a large portion of your monthly budget."
                : "You are currently within a comfortable spending range."}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* =====================================================
            OVER BUDGET WARNING
        ===================================================== */}

        {isOverBudget && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 dark:border-rose-900 dark:bg-rose-950/30">

            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />

            <div>

              <p className="text-sm font-black text-rose-700 dark:text-rose-300">
                You are over your monthly budget.
              </p>

              <p className="mt-1 text-xs leading-5 text-rose-600/80 dark:text-rose-300/70">
                You've spent{" "}
                {formatBDT(
                  overspentAmount
                )}{" "}
                more than the saved wallet amount.
              </p>

            </div>

          </div>
        )}

        {/* =====================================================
            DASHBOARD CARDS
        ===================================================== */}

        <section
          id="dashboard"
          className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >

          <StatCard
            title="Total Spent"
            value={formatBDT(
              totalSpent
            )}
            subtitle={`${transactions.length} transactions`}
            icon={
              <CreditCard className="h-5 w-5" />
            }
            accent="emerald"
          />

          <StatCard
            title="Remaining"
            value={
              isOverBudget
                ? `-${formatBDT(
                    overspentAmount
                  )}`
                : formatBDT(
                    remainingBalance
                  )
            }
            subtitle={
              isOverBudget
                ? "Amount over budget"
                : `${Math.max(
                    100 -
                      spentPercentage,
                    0
                  ).toFixed(
                    1
                  )}% available`
            }
            icon={
              <CircleDollarSign className="h-5 w-5" />
            }
            accent="green"
          />

          <StatCard
            title="Top Category"
            value={
              highestCategory.category
            }
            subtitle={formatBDT(
              highestCategory.total
            )}
            icon={
              <ArrowUpRight className="h-5 w-5" />
            }
            accent="amber"
          />

          <StatCard
            title="Avg. Transaction"
            value={formatBDT(
              transactions.length
                ? totalSpent /
                    transactions.length
                : 0
            )}
            subtitle="Per purchase"
            icon={
              <Receipt className="h-5 w-5" />
            }
            accent="violet"
          />

        </section>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

          {/* =================================================
              EXPENSE FORM
          ================================================= */}

<section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/20 transition-all dark:border-white/[0.08] dark:bg-slate-900/70 dark:shadow-black/20 sm:p-8">
  {/* Decorative background */}

  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/[0.04] blur-3xl dark:bg-emerald-500/[0.06]" />

    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
  </div>

  <div className="relative">

    {/* HEADER */}

    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[20px] bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          {editingId !== null ? (
            <Pencil className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              {editingId !== null
                ? "Transaction Editor"
                : "Expense Logger"}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {editingId !== null
              ? "Edit Expense"
              : "Add a new expense"}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {editingId !== null
              ? "Update the transaction details and keep your financial records accurate."
              : "Track every purchase—yes, even that suspiciously expensive blue pen."}
          </p>
        </div>
      </div>

      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
          editingId !== null
            ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
            : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            editingId !== null
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
        />

        {editingId !== null
          ? "Editing transaction"
          : "New transaction"}
      </div>
    </div>

    <form
      onSubmit={handleAddExpense}
      className="space-y-6"
    >
      {/* ITEM NAME */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="itemName"
            className="text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            Item Name
          </label>

          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            What did you buy?
          </span>
        </div>

        <input
          id="itemName"
          value={form.itemName}
          onChange={(event) =>
            setForm(
              (current) => ({
                ...current,
                itemName:
                  event.target.value,
              })
            )
          }
          placeholder="e.g. Blue pen"
          className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:border-white/[0.12] dark:focus:border-emerald-500 dark:focus:bg-white/[0.06]"
        />
      </div>

      {/* AMOUNT + CATEGORY */}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* AMOUNT */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="amount"
              className="text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              Amount
            </label>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              BDT
            </span>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-black text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              ৳
            </div>

            <input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={form.amount}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    amount:
                      event.target.value,
                  })
                )
              }
              placeholder="0"
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-16 pr-5 text-base font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:border-white/[0.12] dark:focus:border-emerald-500 dark:focus:bg-white/[0.06]"
            />
          </div>
        </div>

        {/* CATEGORY */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="category"
              className="text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              Category
            </label>

            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Classification
            </span>
          </div>

          <div className="relative">
            <select
              id="category"
              value={form.category}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    category:
                      event.target.value as Category,
                  })
                )
              }
             className="h-[52px] w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-5 pr-12 text-sm font-semibold text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-800 dark:text-white dark:hover:border-white/[0.12] dark:focus:border-emerald-500 dark:focus:bg-slate-800"
            >
              {categories.map(
  (category) => (
    <option
      key={category}
      value={category}
      className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
    >
      {category}
    </option>
  )
)}
            </select>

            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* DATE */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="date"
            className="text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            Purchase Date
          </label>

          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            When?
          </span>
        </div>

        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />

          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(event) =>
              setForm(
                (current) => ({
                  ...current,
                  date:
                    event.target.value,
                })
              )
            }
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 text-sm font-semibold text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:border-white/[0.12] dark:focus:border-emerald-500 dark:focus:bg-white/[0.06]"
          />
        </div>
      </div>

      {/* NOTES */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="notes"
            className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />

            Detailed Notes
          </label>

          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Optional
          </span>
        </div>

        <textarea
          id="notes"
          rows={5}
          value={form.notes}
          onChange={(event) =>
            setForm(
              (current) => ({
                ...current,
                notes:
                  event.target.value,
              })
            )
          }
          placeholder="Why did you buy it? Where? Any useful context..."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:border-white/[0.12] dark:focus:border-emerald-500 dark:focus:bg-white/[0.06]"
        />
      </div>

      {/* ACTIONS */}

      <div className="space-y-3 border-t border-slate-200/80 pt-6 dark:border-white/[0.08]">
        <button
          type="submit"
          className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/25 active:translate-y-0"
        >
          {editingId !== null ? (
            <Check className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          )}

          {editingId !== null
            ? "Update Expense"
            : "Add Expense"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={cancelEdit}
            className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            Cancel Editing
          </button>
        )}
      </div>
    </form>
  </div>
</section>

          {/* =================================================
              BREAKDOWN + STATUS
          ================================================= */}

<div className="space-y-6">
  {/* =============================================
      SPENDING INTELLIGENCE
  ============================================= */}

  <section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/20 dark:border-white/[0.08] dark:bg-slate-900/70 dark:shadow-black/20 sm:p-8">
    {/* Background atmosphere */}

    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/[0.04] blur-3xl dark:bg-emerald-500/[0.06]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
    </div>

    <div className="relative">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950">
            <LayoutDashboard className="h-5 w-5" />
          </div>

          <div>
            <div className="mb-2 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Spending Intelligence
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Spending breakdown
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              See exactly where your money is going and which
              categories are consuming the largest share.
            </p>
          </div>
        </div>

        <div className="w-fit rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.04]">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            Total spent
          </p>

          <p className="mt-1 font-display text-lg font-bold text-slate-950 dark:text-white">
            {formatBDT(totalSpent)}
          </p>
        </div>
      </div>

      {/* Category list */}

      <div className="space-y-5">
        {categoryTotals.map(
          ({
            category,
            total,
            percentage,
          }) => (
            <div
              key={category}
              className="group rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50/80 dark:hover:border-white/[0.06] dark:hover:bg-white/[0.025]"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                {/* Category */}

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05]">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${categoryStyles[category].dot}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                      {category}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {percentage.toFixed(1)}% of spending
                    </p>
                  </div>
                </div>

                {/* Amount */}

                <div className="shrink-0 text-right">
                  <p className="font-display text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    {formatBDT(total)}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                    Monthly total
                  </p>
                </div>
              </div>

              {/* Progress */}

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${categoryStyles[category].bar}`}
                  style={{
                    width: `${Math.min(
                      percentage,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  </section>

  {/* =============================================
      MONTHLY STATUS REPORT
  ============================================= */}

  <section
    className={`relative overflow-hidden rounded-[32px] border p-6 shadow-xl sm:p-8 ${
      isNeedsImprovement
        ? "border-rose-200/80 bg-rose-50/70 shadow-rose-100/40 dark:border-rose-500/15 dark:bg-rose-500/[0.06] dark:shadow-black/20"
        : "border-emerald-200/80 bg-emerald-50/70 shadow-emerald-100/40 dark:border-emerald-500/15 dark:bg-emerald-500/[0.06] dark:shadow-black/20"
    }`}
  >
    {/* Decorative background */}

    <div
      className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl ${
        isNeedsImprovement
          ? "bg-rose-500/[0.08]"
          : "bg-emerald-500/[0.08]"
      }`}
    />

    <div className="relative">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* Eyebrow */}

          <div className="mb-3 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isNeedsImprovement
                  ? "bg-rose-500"
                  : "bg-emerald-500"
              }`}
            />

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Monthly Status Report
            </span>
          </div>

          {/* Main heading */}

          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {walletBalance > 0
              ? `${spentPercentage.toFixed(
                  1
                )}% of your budget has been used`
              : "Your monthly budget is waiting"}
          </h2>

          {/* Description */}

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {walletBalance === 0 &&
            totalSpent === 0
              ? "Set your monthly wallet to begin tracking your financial health and understand where every single penny goes."
              : isOverBudget
              ? "Your spending has exceeded your saved monthly wallet. Review your largest categories and reduce discretionary purchases where possible."
              : isNeedsImprovement
              ? "You have crossed the 80% spending threshold. It may be time to slow down and protect the remaining portion of your budget."
              : "Your spending is currently within a healthy range. Keep recording even the small purchases—those tiny expenses are usually the sneaky ones."}
          </p>
        </div>

        {/* Status icon */}

        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] shadow-lg ${
            isNeedsImprovement
              ? "bg-rose-500 text-white shadow-rose-500/20"
              : "bg-emerald-500 text-white shadow-emerald-500/20"
          }`}
        >
          {isNeedsImprovement ? (
            <XCircle className="h-7 w-7" />
          ) : (
            <CheckCircle2 className="h-7 w-7" />
          )}
        </div>
      </div>

      {/* Bottom status area */}

      <div className="mt-7 flex flex-col gap-3 border-t border-slate-900/[0.06] pt-6 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between">
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
            isNeedsImprovement
              ? "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
              : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isNeedsImprovement
                ? "bg-rose-500"
                : "bg-emerald-500"
            }`}
          />

          Status:{" "}
          {isNeedsImprovement
            ? "Needs Improvement"
            : "Healthy / OK"}
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="text-slate-400">
            Health threshold:
          </span>

          <span className="font-bold">
            80% monthly spending
          </span>
        </div>
      </div>
    </div>
  </section>
</div>

        </div>

        {/* ============================================================
    MONTHLY SPENDING PROGRESS
============================================================ */}

<section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

  <div>

    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
      Monthly Spending
    </p>

    <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
      {formatBDT(monthlySpent)}
    </h2>

    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">

      Remaining from wallet:{" "}

      <span className="font-bold text-slate-900 dark:text-white">
        {formatBDT(remainingForMonth)}
      </span>

    </p>

  </div>


  <div className="w-full max-w-md">

    <Progress
      value={spendingProgress}
      className="w-full"
    >

      <ProgressLabel className="text-sm font-bold text-slate-600 dark:text-slate-300">
        Wallet used this month
      </ProgressLabel>

      <ProgressValue className="text-sm font-black text-slate-950 dark:text-white" />

    </Progress>

  </div>

</div>

</section>

        {/* =====================================================
            TRANSACTION HISTORY
        ===================================================== */}

<section
  id="transactions"
  className="relative mt-6 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/20 transition-all dark:border-white/[0.08] dark:bg-slate-900/70 dark:shadow-black/20"
>
  {/* SUBTLE DECORATIVE BACKGROUND */}

  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-500/[0.04] blur-3xl dark:bg-emerald-500/[0.06]" />

    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
  </div>

  {/* HEADER */}

  <div className="relative border-b border-slate-200/70 p-6 dark:border-white/[0.08] sm:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[20px] bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          <ClipboardList className="h-5 w-5" />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Financial Records
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Transaction History
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Every purchase you've logged, organized and ready to review.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* TRANSACTION COUNT */}

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Receipt className="h-3 w-3" />
          </div>

          <span>
            {visibleTransactions.length} of {transactions.length}
          </span>
        </div>

        {/* EXPORT */}

        <Tooltip>
  <TooltipTrigger
    render={
      <button
        type="button"
        onClick={exportTransactions}
        className="YOUR EXISTING CLASSNAME"
      >
        <Download className="h-4 w-4" />
      </button>
    }
  />

  <TooltipContent>
    Export transactions as CSV
  </TooltipContent>
</Tooltip>
      </div>
    </div>

    {/* SEARCH / FILTER CONTROL CENTER */}

    <div className="mt-8 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
        {/* SEARCH */}

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search item, category, notes, or date..."
            className="h-[48px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-800 dark:text-white dark:hover:border-white/[0.12]"
          />
        </div>

        {/* CATEGORY */}

        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value as Category | "All"
              )
            }
            className="h-[48px] w-full appearance-none rounded-2xl border border-slate-200 bg-white px-10 pr-10 text-sm font-semibold text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-800 dark:text-white dark:hover:border-white/[0.12]"
          >
            <option
              value="All"
              className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
            >
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
              >
                {category}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {/* SORT */}

        <div className="relative">
          <select
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target.value as SortOption
              )
            }
            className="h-[48px] w-full appearance-none rounded-2xl border border-slate-200 bg-white px-5 pr-10 text-sm font-semibold text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/[0.08] dark:bg-slate-800 dark:text-white dark:hover:border-white/[0.12]"
          >
            <option
              value="newest"
              className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
            >
              Newest First
            </option>

            <option
              value="oldest"
              className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
            >
              Oldest First
            </option>

            <option
              value="highest"
              className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
            >
              Highest Amount
            </option>

            <option
              value="lowest"
              className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
            >
              Lowest Amount
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {/* RESET */}

        {(searchQuery ||
          categoryFilter !== "All" ||
          sortOption !== "newest") && (
          <button
            type="button"
            onClick={clearTransactionFilters}
            className="inline-flex h-[48px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-xs font-black text-slate-500 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-rose-500/30 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
          >
            <X className="h-3.5 w-3.5" />

            Reset
          </button>
        )}
      </div>
    </div>
  </div>

  {/* CONTENT */}

  <div className="relative">

    {/* EMPTY STATE */}

    {transactions.length === 0 ? (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-100 shadow-inner dark:bg-slate-800">
          <Receipt className="h-8 w-8 text-slate-400" />
        </div>

        <h3 className="mt-6 text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Your history is waiting
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Start logging your purchases above. Small expenses matter more than they seem.
        </p>
      </div>

    ) : visibleTransactions.length === 0 ? (

      /* NO RESULTS */

      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-100 shadow-inner dark:bg-slate-800">
          <Search className="h-8 w-8 text-slate-400" />
        </div>

        <h3 className="mt-6 text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Nothing matched your search
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Try another search term, category, or reset your filters.
        </p>

        <button
          type="button"
          onClick={clearTransactionFilters}
          className="mt-6 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
        >
          Reset Filters
        </button>
      </div>

    ) : (

      /* TABLE */

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200/70 bg-slate-50/80 text-left dark:border-white/[0.08] dark:bg-white/[0.03]">
              <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Item
              </th>

              <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Amount
              </th>

              <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Category
              </th>

              <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Date
              </th>

              <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Notes
              </th>

              <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="group border-b border-slate-100 transition-all duration-200 hover:bg-emerald-50/40 dark:border-white/[0.06] dark:hover:bg-emerald-500/[0.035]"
              >
                {/* ITEM */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition group-hover:bg-emerald-500 group-hover:text-white dark:bg-white/[0.06] dark:text-slate-400">
                      <ShoppingBag className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {transaction.itemName}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Transaction #{transaction.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* AMOUNT */}

                <td className="px-6 py-5">
                  <span className="text-base font-black tracking-tight text-slate-950 dark:text-white">
                    {formatBDT(transaction.amount)}
                  </span>
                </td>

                {/* CATEGORY */}

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ring-1 ring-inset ${categoryStyles[transaction.category].badge}`}
                  >
                    {transaction.category}
                  </span>
                </td>

                {/* DATE */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/[0.05]">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    </div>

                    {formatDate(transaction.date)}
                  </div>
                </td>

                {/* NOTES */}

                <td className="max-w-[320px] px-6 py-5">
                  <p className="truncate text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {transaction.notes || "No notes added."}
                  </p>
                </td>

                {/* ACTIONS */}

                <td className="px-6 py-5 text-right">
                  <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
                  <Tooltip>
  <TooltipTrigger
    render={
      <button
        type="button"
        onClick={() =>
          editTransaction(transaction)
        }
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <Pencil className="h-4 w-4" />
      </button>
    }
  />

  <TooltipContent>
    Edit transaction
  </TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger
    render={
      <button
        type="button"
        onClick={() =>
          requestDeleteTransaction(transaction)
        }
        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    }
  />

  <TooltipContent>
    Delete transaction
  </TooltipContent>
</Tooltip>

{/* MORE */}

<DropdownMenu>

  <DropdownMenuTrigger
    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
    title="More options"
  >
    <MoreHorizontal className="h-4 w-4" />
  </DropdownMenuTrigger>


  <DropdownMenuContent
    align="end"
    className="w-56"
  >

    <DropdownMenuGroup>

      <DropdownMenuLabel>
        Transaction Options
      </DropdownMenuLabel>


      {/* VIEW DETAILS */}

      <DropdownMenuItem
        onClick={() =>
          setDetailsTarget(transaction)
        }
        className="cursor-pointer gap-2"
      >
        <Eye className="h-4 w-4" />

        View Details
      </DropdownMenuItem>


      {/* DUPLICATE */}

      <DropdownMenuItem
  onClick={() => {
    setForm({
      itemName: transaction.itemName,
      amount: String(transaction.amount),
      category: transaction.category,
      date: transaction.date,
      notes: transaction.notes,
    });

    setEditingId(null);

    showToast(
      "Transaction copied to the form. You can modify it and save it as a new expense."
    );
  }}
  className="cursor-pointer gap-2"
>
  <Copy className="h-4 w-4" />

  Duplicate Transaction
</DropdownMenuItem>


      {/* COPY AMOUNT */}

      <DropdownMenuItem
        onClick={() => {

          navigator.clipboard.writeText(
            String(
              transaction.amount
            )
          );

          showToast(
            "Amount copied to clipboard."
          );

        }}
        className="cursor-pointer gap-2"
      >
        <Copy className="h-4 w-4" />

        Copy Amount
      </DropdownMenuItem>

    </DropdownMenuGroup>


    <DropdownMenuSeparator />

  </DropdownMenuContent>

</DropdownMenu>



                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</section>

      </div>

      {/* =====================================================
          TOAST NOTIFICATION
      ===================================================== */}

     

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

<AlertDialog
  open={deleteTarget !== null}
  onOpenChange={(open) => {
    if (!open) {
      setDeleteTarget(null);
    }
  }}
>
  <AlertDialogContent className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">

    <AlertDialogHeader>

      <AlertDialogTitle className="text-xl font-black text-slate-950 dark:text-white">
        Delete Transaction?
      </AlertDialogTitle>

      <AlertDialogDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">

        {deleteTarget ? (
          <>
            Are you sure you want to permanently delete{" "}

            <span className="font-bold text-slate-900 dark:text-white">
              {deleteTarget.itemName}
            </span>

            {" "}for{" "}

            <span className="font-bold text-rose-600 dark:text-rose-400">
              {formatBDT(deleteTarget.amount)}
            </span>

            ?

            <br />
            <br />

            This action cannot be undone.

          </>
        ) : (
          "This action cannot be undone."
        )}

      </AlertDialogDescription>

    </AlertDialogHeader>

    <AlertDialogFooter>

      <AlertDialogCancel
        className="border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={confirmDeleteTransaction}
        className="bg-rose-500 font-black text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
      >
        Delete Transaction
      </AlertDialogAction>

    </AlertDialogFooter>

  </AlertDialogContent>
</AlertDialog>

{/* ============================================================
    TRANSACTION DETAILS SHEET
============================================================ */}

<Sheet
  open={detailsTarget !== null}
  onOpenChange={(open) => {
    if (!open) {
      setDetailsTarget(null);
    }
  }}
>
  <SheetContent
    side="right"
    className="w-full border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-950 sm:max-w-lg"
  >
    {detailsTarget && (

      <div className="flex h-full flex-col">

        {/* HEADER */}

        <SheetHeader className="border-b border-slate-200 p-6 dark:border-slate-800">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Transaction Details
          </p>

          <SheetTitle className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">

            {detailsTarget.itemName}

          </SheetTitle>

          <SheetDescription className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">

            Complete information about this transaction.

          </SheetDescription>

        </SheetHeader>


        {/* CONTENT */}

        <div className="flex-1 space-y-6 overflow-y-auto p-6">


          {/* AMOUNT */}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">

            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Amount
            </p>

            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {formatBDT(detailsTarget.amount)}
            </p>

          </div>


          {/* DETAILS */}

          <div className="space-y-4">


            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">

              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Category
              </span>

              <span className="text-sm font-black text-slate-950 dark:text-white">
                {detailsTarget.category}
              </span>

            </div>


            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">

              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Date
              </span>

              <span className="text-sm font-black text-slate-950 dark:text-white">
                {formatDate(detailsTarget.date)}
              </span>

            </div>


            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">

              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Notes
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">

                {detailsTarget.notes?.trim()
                  ? detailsTarget.notes
                  : "No notes were added to this transaction."}

              </p>

            </div>


            <div>

              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Transaction ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-slate-500 dark:text-slate-400">

                #{detailsTarget.id}

              </p>

            </div>


          </div>

        </div>


        {/* FOOTER */}

        <div className="border-t border-slate-200 p-6 dark:border-slate-800">

          <button
            type="button"
            onClick={() =>
              setDetailsTarget(null)
            }
            className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Close Details
          </button>

        </div>

      </div>

    )}

  </SheetContent>

</Sheet>

    </main>

    </TooltipProvider>

  );
}

/*
 * ============================================================
 * STAT CARD
 * ============================================================
 */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent:
    | "emerald"
    | "green"
    | "amber"
    | "violet";
}) {
  const accentClasses = {
    emerald: {
      icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
      line: "from-emerald-500 via-emerald-400 to-transparent",
      glow: "group-hover:shadow-emerald-500/10",
      dot: "bg-emerald-500",
    },

    green: {
      icon: "bg-green-500/10 text-green-600 dark:bg-green-500/15 dark:text-green-400",
      line: "from-green-500 via-green-400 to-transparent",
      glow: "group-hover:shadow-green-500/10",
      dot: "bg-green-500",
    },

    amber: {
      icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
      line: "from-amber-500 via-amber-400 to-transparent",
      glow: "group-hover:shadow-amber-500/10",
      dot: "bg-amber-500",
    },

    violet: {
      icon: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
      line: "from-violet-500 via-violet-400 to-transparent",
      glow: "group-hover:shadow-violet-500/10",
      dot: "bg-violet-500",
    },
  };

  const currentAccent = accentClasses[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/[0.08] dark:bg-slate-900/70 ${currentAccent.glow}`}
    >
      {/* TOP ACCENT LINE */}

      <div
        className={`absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r ${currentAccent.line}`}
      />

      {/* SOFT BACKGROUND GLOW */}

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${currentAccent.dot} opacity-[0.04] blur-3xl transition-opacity duration-300 group-hover:opacity-[0.08]`}
      />

      <div className="relative">
        {/* TOP AREA */}

        <div className="mb-7 flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${currentAccent.icon}`}
          >
            {icon}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-500 dark:group-hover:text-slate-300">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* CONTENT */}

        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>

        <p className="mt-3 truncate font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          {value}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${currentAccent.dot}`}
          />

          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}