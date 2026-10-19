import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CustomerAccount,
  CsvRecipientRow,
  MergedRecord,
  ErrorLogItem,
  RunHistoryItem,
  SEEDED_ACCOUNTS,
  SEEDED_CSV_ROWS,
  SEEDED_ERRORS,
  SEEDED_RUNS,
} from '../mock/seed';
import { performMerge, MergeResult } from '../mock/mergeEngine';
import { ExecutionLogLine } from '../mock/runEngine';

export interface CartItem {
  id: string;
  planId: 'starter' | 'growth' | 'scale';
  planName: string;
  cadence: 'monthly' | 'quarterly';
  price: number;
  seats: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AppState {
  // Cart & checkout
  cart: CartItem | null;
  lastRemovedItem: CartItem | null;
  isCartDrawerOpen: boolean;
  orderNumber: string;
  
  // Accounts & Data
  accounts: CustomerAccount[];
  csvRows: CsvRecipientRow[];
  mergedResult: MergeResult;
  errors: ErrorLogItem[];
  runs: RunHistoryItem[];
  
  // UI & Guided Tour
  toasts: ToastMessage[];
  isCommandPaletteOpen: boolean;
  guidedTourDismissed: boolean;
  guidedTourStep: number;
  
  // Scenario Canvas Run Sim
  isScenarioRunning: boolean;
  scenarioRunSpeed: number; // 1x or 2x
  injectedFailure: 'none' | 'missing_field' | 'bad_postcode' | 'duplicate_key' | 'api_500';
  selectedModuleId: string | null;
  activeBundleIndex: number;
  nodeCounts: Record<string, number>;
  liveLogs: ExecutionLogLine[];
  
  // Actions
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: () => void;
  undoRemoveFromCart: () => void;
  generateNewOrder: () => string;
  
  addCustomerAccount: (account: CustomerAccount) => void;
  runCsvMerge: () => void;
  resolveErrorItem: (errorId: string, correctedData?: Partial<CsvRecipientRow>) => void;
  dismissErrorItem: (errorId: string) => void;
  
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  dismissGuidedTour: () => void;
  nextGuidedTourStep: () => void;
  
  setSelectedModuleId: (moduleId: string | null) => void;
  setInjectedFailure: (failure: AppState['injectedFailure']) => void;
  setScenarioRunSpeed: (speed: number) => void;
  startScenarioRun: () => Promise<void>;
  resetScenarioRun: () => void;
  
  resetDemo: () => void;
}

const initialMerge = performMerge(SEEDED_ACCOUNTS, SEEDED_CSV_ROWS);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: {
        id: 'cart-1',
        planId: 'growth',
        planName: 'Growth',
        cadence: 'monthly',
        price: 149,
        seats: 1,
      },
      lastRemovedItem: null,
      isCartDrawerOpen: false,
      orderNumber: 'QF-20481',
      
      accounts: SEEDED_ACCOUNTS,
      csvRows: SEEDED_CSV_ROWS,
      mergedResult: initialMerge,
      errors: SEEDED_ERRORS,
      runs: SEEDED_RUNS,
      
      toasts: [],
      isCommandPaletteOpen: false,
      guidedTourDismissed: false,
      guidedTourStep: 1,
      
      isScenarioRunning: false,
      scenarioRunSpeed: 1,
      injectedFailure: 'none',
      selectedModuleId: 'node-1',
      activeBundleIndex: 0,
      nodeCounts: {
        'node-1': 14,
        'node-2': 1,
        'node-3': 24,
        'node-4': 24,
        'node-5': 24,
        'node-6': 22,
        'node-7': 22,
        'node-8': 2,
        'node-9': 2,
        'node-10': 2,
      },
      liveLogs: [
        { id: 'l1', time: '09:14:02', level: 'info', nodeNumber: 1, message: 'Google Sheets: Detected 14 active sender profiles in Customer Parameters' },
        { id: 'l2', time: '09:14:03', level: 'info', nodeNumber: 2, message: 'Google Drive: Fetched recipients-master.csv (24 rows, 4.2 KB)' },
        { id: 'l3', time: '09:14:04', level: 'info', nodeNumber: 3, message: 'CSV Parser: Header matched RFC-4180 [recipient_name, address, city, postcode, account_id]' },
        { id: 'l4', time: '09:14:05', level: 'info', nodeNumber: 4, message: 'Iterator: Created 24 recipient bundles for processing' },
        { id: 'l5', time: '09:14:08', level: 'warn', nodeNumber: 5, message: 'Validate & Map: Row 7 missing postal code for Kenneth Bradley. Routed to Break directive.' },
        { id: 'l6', time: '09:14:09', level: 'error', nodeNumber: 8, message: 'Break Module: Stored bundle in Incomplete Executions queue. Next retry in 5 minutes.' },
        { id: 'l7', time: '09:14:10', level: 'error', nodeNumber: 9, message: 'Append Error Log: Appended ERR-2026-1019-01 to Google Sheets Error Log' },
        { id: 'l8', time: '09:14:11', level: 'warn', nodeNumber: 10, message: 'Email Alert: Dispatched alert to ops@quillfold-demo.com' },
        { id: 'l9', time: '09:14:12', level: 'success', nodeNumber: 6, message: 'Send to API: 22 payloads accepted (201 Created) at https://sandbox.api.example.com/v1/shipments' },
      ],
      
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      
      addToCart: (item) => {
        set({ cart: item, isCartDrawerOpen: true });
        get().addToast({
          message: `Added ${item.planName} plan to cart.`,
          type: 'success',
        });
      },
      
      removeFromCart: () => {
        const current = get().cart;
        if (!current) return;
        set({ cart: null, lastRemovedItem: current });
        get().addToast({
          message: 'Item removed from cart.',
          action: {
            label: 'Undo',
            onClick: () => get().undoRemoveFromCart(),
          },
        });
      },
      
      undoRemoveFromCart: () => {
        const removed = get().lastRemovedItem;
        if (removed) {
          set({ cart: removed, lastRemovedItem: null });
          get().addToast({
            message: 'Cart item restored.',
            type: 'info',
          });
        }
      },
      
      generateNewOrder: () => {
        const nextOrderNum = `QF-${Math.floor(20480 + Math.random() * 900)}`;
        set({ orderNumber: nextOrderNum });
        return nextOrderNum;
      },
      
      addCustomerAccount: (account) => {
        const updatedAccounts = [
          { ...account, isNew: true },
          ...get().accounts.filter((a) => a.accountId !== account.accountId),
        ];
        const newMerge = performMerge(updatedAccounts, get().csvRows);
        set({ accounts: updatedAccounts, mergedResult: newMerge });
        get().addToast({
          message: `New account ${account.company} added to Customer Parameters sheet.`,
          type: 'success',
        });
      },
      
      runCsvMerge: () => {
        const result = performMerge(get().accounts, get().csvRows);
        set({ mergedResult: result });
        get().addToast({
          message: `Merge complete: ${result.stats.mergedCount} merged, ${result.stats.orphansCount} orphaned, ${result.stats.duplicatesCount} duplicate.`,
          type: 'info',
        });
      },
      
      resolveErrorItem: (errorId, correctedData) => {
        const updatedErrors = get().errors.map((err) => {
          if (err.id === errorId) {
            return {
              ...err,
              status: 'Resolved' as const,
              rawRecord: { ...err.rawRecord, ...correctedData },
            };
          }
          return err;
        });
        
        // Also update any matching CSV row if applicable
        const targetErr = get().errors.find((e) => e.id === errorId);
        let updatedCsvRows = get().csvRows;
        if (targetErr && targetErr.rowNumber && correctedData) {
          updatedCsvRows = get().csvRows.map((row) => {
            if (row.rowId === targetErr.rowNumber) {
              return {
                ...row,
                ...correctedData,
                issueType: undefined,
              };
            }
            return row;
          });
        }
        
        const newMerge = performMerge(get().accounts, updatedCsvRows);
        set({
          errors: updatedErrors,
          csvRows: updatedCsvRows,
          mergedResult: newMerge,
        });
        get().addToast({
          message: 'Error resolved. Record verified and marked for delivery.',
          type: 'success',
        });
      },
      
      dismissErrorItem: (errorId) => {
        const updatedErrors = get().errors.filter((e) => e.id !== errorId);
        set({ errors: updatedErrors });
        get().addToast({
          message: 'Error dismissed from review queue.',
          type: 'info',
        });
      },
      
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        set((state) => ({
          toasts: [...state.toasts.slice(-2), { ...toast, id }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
      
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      dismissGuidedTour: () => set({ guidedTourDismissed: true }),
      nextGuidedTourStep: () =>
        set((state) => ({ guidedTourStep: Math.min(state.guidedTourStep + 1, 3) })),
        
      setSelectedModuleId: (id) => set({ selectedModuleId: id }),
      setInjectedFailure: (failure) => set({ injectedFailure: failure }),
      setScenarioRunSpeed: (speed) => set({ scenarioRunSpeed: speed }),
      
      startScenarioRun: async () => {
        if (get().isScenarioRunning) return;
        set({ isScenarioRunning: true });
        
        const failureType = get().injectedFailure;
        const speed = get().scenarioRunSpeed;
        const delayMs = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms / speed));
          
        const timeStr = () => new Date().toTimeString().split(' ')[0];
        
        const newRunId = `RUN-2026-1019-0${Math.floor(10 + Math.random() * 89)}`;
        const freshLogs: ExecutionLogLine[] = [
          {
            id: `log-${Date.now()}-1`,
            time: timeStr(),
            level: 'info',
            nodeNumber: 1,
            message: `Execution ${newRunId} started. Checking Customer Parameters sheet...`,
          },
        ];
        
        set({ liveLogs: freshLogs });
        await delayMs(400);
        
        freshLogs.push({
          id: `log-${Date.now()}-2`,
          time: timeStr(),
          level: 'info',
          nodeNumber: 2,
          message: 'Drive Parser: Accessing file recipients_2026.csv via Google API',
        });
        set({ liveLogs: [...freshLogs] });
        await delayMs(400);
        
        freshLogs.push({
          id: `log-${Date.now()}-3`,
          time: timeStr(),
          level: 'info',
          nodeNumber: 3,
          message: 'CSV Parser: Parsed 12 incoming recipient records into memory',
        });
        set({ liveLogs: [...freshLogs] });
        await delayMs(400);
        
        freshLogs.push({
          id: `log-${Date.now()}-4`,
          time: timeStr(),
          level: 'info',
          nodeNumber: 4,
          message: 'Iterator: Dispatched 12 bundles across router',
        });
        set({ liveLogs: [...freshLogs] });
        await delayMs(500);
        
        if (failureType !== 'none') {
          // Failure routed to Break -> Error Log -> Email
          let errReason = 'Validation rule failed';
          let failingFld = 'postcode';
          if (failureType === 'missing_field') {
            errReason = 'Required field missing: recipient_address.line1 is null';
            failingFld = 'addressLine1';
          } else if (failureType === 'bad_postcode') {
            errReason = "Postcode doesn't match US ZIP format (found: '99XX-!')";
            failingFld = 'postcode';
          } else if (failureType === 'duplicate_key') {
            errReason = 'Duplicate key collision: recipient already received package this month';
            failingFld = 'account_id + recipient';
          } else if (failureType === 'api_500') {
            errReason = 'HTTP 502 Bad Gateway from upstream recipient fulfillment service';
            failingFld = 'API Sandbox';
          }
          
          freshLogs.push({
            id: `log-${Date.now()}-5`,
            time: timeStr(),
            level: 'warn',
            nodeNumber: 5,
            message: `Validate & Map: Bundle 7 caught by error router [${errReason}]`,
          });
          freshLogs.push({
            id: `log-${Date.now()}-6`,
            time: timeStr(),
            level: 'error',
            nodeNumber: 8,
            message: 'Break Module: Incomplete execution saved. Retry scheduled (3 attempts, 5m delay)',
          });
          set({ liveLogs: [...freshLogs] });
          await delayMs(500);
          
          freshLogs.push({
            id: `log-${Date.now()}-7`,
            time: timeStr(),
            level: 'error',
            nodeNumber: 9,
            message: `Append Error Log: Row appended to Google Sheet for account ACCT-0417`,
          });
          freshLogs.push({
            id: `log-${Date.now()}-8`,
            time: timeStr(),
            level: 'warn',
            nodeNumber: 10,
            message: 'Email Alert: Instant alert triggered to ops@quillfold-demo.com',
          });
          set({ liveLogs: [...freshLogs] });
          await delayMs(400);
          
          freshLogs.push({
            id: `log-${Date.now()}-9`,
            time: timeStr(),
            level: 'success',
            nodeNumber: 6,
            message: 'Send to API: Remaining 11 bundles successfully sent (201 Created)',
          });
          freshLogs.push({
            id: `log-${Date.now()}-10`,
            time: timeStr(),
            level: 'success',
            nodeNumber: 7,
            message: 'Update Status: Sheet updated with fulfillment tracking references',
          });
          
          // Add error item to errors queue
          const newErr: ErrorLogItem = {
            id: `ERR-${newRunId.replace('RUN-', '')}-01`,
            timestamp: `2026-10-19 ${timeStr()}`,
            runId: newRunId,
            rowNumber: 7,
            accountId: 'ACCT-0417',
            company: 'Northgate Dental',
            errorType: failureType === 'api_500' ? 'API_5XX' : failureType === 'duplicate_key' ? 'DUPLICATE_KEY' : 'INVALID_POSTCODE',
            failingField: failingFld,
            message: errReason,
            suggestedFix: 'Review and update field in Error Log drawer before retry',
            status: 'Open',
            rawRecord: {
              accountId: 'ACCT-0417',
              recipientName: 'Kenneth Bradley',
              addressLine1: '712 Oakdale Lane',
              city: 'Akron',
              state: 'OH',
              country: 'US',
            },
          };
          
          const newRun: RunHistoryItem = {
            id: newRunId,
            trigger: 'Manual',
            startedAt: `2026-10-19 ${timeStr()}`,
            duration: '34s',
            durationSec: 34,
            recordsCount: 12,
            deliveredCount: 11,
            errorsCount: 1,
            status: 'Break / Retry',
            modulesStats: {
              watchRows: 12,
              parseDrive: 1,
              parseCsv: 12,
              iterator: 12,
              validateMap: 12,
              sendApi: 11,
              updateStatus: 11,
              breakRoute: 1,
              errorLog: 1,
            },
          };
          
          set((state) => ({
            liveLogs: [...freshLogs],
            isScenarioRunning: false,
            errors: [newErr, ...state.errors],
            runs: [newRun, ...state.runs],
          }));
          
          get().addToast({
            message: 'Run complete · 11 delivered · 1 caught & routed to Break module.',
            type: 'warning',
          });
        } else {
          // Clean run
          freshLogs.push({
            id: `log-${Date.now()}-5`,
            time: timeStr(),
            level: 'success',
            nodeNumber: 5,
            message: 'Validate & Map: All 12 bundles validated with 0 errors',
          });
          freshLogs.push({
            id: `log-${Date.now()}-6`,
            time: timeStr(),
            level: 'success',
            nodeNumber: 6,
            message: 'Send to API: 12 payloads delivered to sandbox endpoint (201 Created)',
          });
          freshLogs.push({
            id: `log-${Date.now()}-7`,
            time: timeStr(),
            level: 'success',
            nodeNumber: 7,
            message: 'Update Status: All 12 records confirmed delivered in Google Sheets',
          });
          
          const newRun: RunHistoryItem = {
            id: newRunId,
            trigger: 'Manual',
            startedAt: `2026-10-19 ${timeStr()}`,
            duration: '28s',
            durationSec: 28,
            recordsCount: 12,
            deliveredCount: 12,
            errorsCount: 0,
            status: 'Success',
            modulesStats: {
              watchRows: 12,
              parseDrive: 1,
              parseCsv: 12,
              iterator: 12,
              validateMap: 12,
              sendApi: 12,
              updateStatus: 12,
              breakRoute: 0,
              errorLog: 0,
            },
          };
          
          set((state) => ({
            liveLogs: [...freshLogs],
            isScenarioRunning: false,
            runs: [newRun, ...state.runs],
          }));
          
          get().addToast({
            message: 'Run complete · 12 delivered · 0 caught (Clean run).',
            type: 'success',
          });
        }
      },
      
      resetScenarioRun: () => {
        set({
          isScenarioRunning: false,
          injectedFailure: 'none',
          liveLogs: [],
        });
      },
      
      resetDemo: () => {
        localStorage.removeItem('quillfold-demo-v1');
        const cleanMerge = performMerge(SEEDED_ACCOUNTS, SEEDED_CSV_ROWS);
        set({
          cart: {
            id: 'cart-1',
            planId: 'growth',
            planName: 'Growth',
            cadence: 'monthly',
            price: 149,
            seats: 1,
          },
          lastRemovedItem: null,
          isCartDrawerOpen: false,
          orderNumber: 'QF-20481',
          accounts: SEEDED_ACCOUNTS,
          csvRows: SEEDED_CSV_ROWS,
          mergedResult: cleanMerge,
          errors: SEEDED_ERRORS,
          runs: SEEDED_RUNS,
          toasts: [],
          isScenarioRunning: false,
          injectedFailure: 'none',
          selectedModuleId: 'node-1',
        });
        get().addToast({
          message: 'Demo state reset to original sandbox baseline.',
          type: 'info',
        });
      },
    }),
    {
      name: 'quillfold-demo-v1',
      partialize: (state) => ({
        cart: state.cart,
        orderNumber: state.orderNumber,
        accounts: state.accounts,
        csvRows: state.csvRows,
        errors: state.errors,
        runs: state.runs,
        guidedTourDismissed: state.guidedTourDismissed,
      }),
    }
  )
);
