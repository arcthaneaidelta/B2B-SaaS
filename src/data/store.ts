import { create } from 'zustand';
import { School, PatchItem, PatchRecord, NotificationItem, PatchCategory } from './schema';
import { SEED_SCHOOLS, SEED_PATCHES, SEED_RECORDS } from './seed';

interface FilterState {
  dateRange: '7d' | '30d' | 'season' | 'all';
  recordType: 'all' | 'Registration' | 'Order';
  category: 'all' | PatchCategory;
  schoolId: 'all' | string;
}

interface DemoStore {
  schools: School[];
  patches: PatchItem[];
  records: PatchRecord[];
  notifications: NotificationItem[];
  filters: FilterState;
  showConsoleAlongside: boolean;
  isOwnerSignedIn: boolean;
  guidedTourStep: number;
  isTourDismissed: boolean;

  // Actions
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  toggleConsoleAlongside: () => void;
  setOwnerSignedIn: (signedIn: boolean) => void;
  setTourStep: (step: number) => void;
  dismissTour: () => void;
  resetTour: () => void;

  addRegistration: (data: {
    student: string;
    gradYear: string;
    schoolId: string;
    sportOrProgram: string;
    patchSku: string;
    quantity?: number;
  }) => { ok: boolean; ref: string; record: PatchRecord };

  addOrder: (data: {
    schoolId: string;
    contactName: string;
    contactEmail: string;
    contactRole: string;
    sportOrProgram?: string;
    notes?: string;
    items: Array<{ patchSku: string; quantity: number }>;
  }) => { ok: boolean; ref: string; totalQuantity: number };

  updatePatchStock: (sku: string, newStock: number) => void;
  addSchool: (school: Omit<School, 'id'>) => School;
  markOrderQuoted: (ref: string) => void;
  resetDemoData: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const STORAGE_KEY = 'aap-demo-v1';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    timestamp: '2026-10-16T11:20:00Z',
    title: 'New order awaiting quote',
    message: 'Westbrook Senior High requested 30 Honor Roll Scholar patches.',
    type: 'order',
    read: false,
  },
  {
    id: 'notif-2',
    timestamp: '2026-10-16T09:45:00Z',
    title: 'Low stock notice',
    message: 'Varsity Letter: Basketball is at 38 units (below 50 reorder point).',
    type: 'stock',
    read: false,
  },
  {
    id: 'notif-3',
    timestamp: '2026-10-15T16:15:00Z',
    title: 'New student registration',
    message: 'Marcus T. (Class of 2027) logged Varsity Letter: Track.',
    type: 'registration',
    read: true,
  },
];

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        schools: parsed.schools || SEED_SCHOOLS,
        patches: parsed.patches || SEED_PATCHES,
        records: parsed.records || SEED_RECORDS,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        isOwnerSignedIn: parsed.isOwnerSignedIn ?? true,
        isTourDismissed: parsed.isTourDismissed ?? false,
      };
    }
  } catch (e) {
    console.warn('Failed to parse stored state, using seed', e);
  }
  return {
    schools: SEED_SCHOOLS,
    patches: SEED_PATCHES,
    records: SEED_RECORDS,
    notifications: INITIAL_NOTIFICATIONS,
    isOwnerSignedIn: true,
    isTourDismissed: false,
  };
};

const initialState = loadInitialState();

export const useDemoStore = create<DemoStore>((set, get) => ({
  schools: initialState.schools,
  patches: initialState.patches,
  records: initialState.records,
  notifications: initialState.notifications,
  filters: {
    dateRange: 'season',
    recordType: 'all',
    category: 'all',
    schoolId: 'all',
  },
  showConsoleAlongside: false,
  isOwnerSignedIn: initialState.isOwnerSignedIn,
  guidedTourStep: 1,
  isTourDismissed: initialState.isTourDismissed,

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () =>
    set({
      filters: {
        dateRange: 'season',
        recordType: 'all',
        category: 'all',
        schoolId: 'all',
      },
    }),

  toggleConsoleAlongside: () =>
    set((state) => ({ showConsoleAlongside: !state.showConsoleAlongside })),

  setOwnerSignedIn: (signedIn) => {
    set({ isOwnerSignedIn: signedIn });
    persistToStorage({ ...get(), isOwnerSignedIn: signedIn });
  },

  setTourStep: (step) => set({ guidedTourStep: step }),

  dismissTour: () => {
    set({ isTourDismissed: true });
    persistToStorage({ ...get(), isTourDismissed: true });
  },

  resetTour: () => {
    set({ isTourDismissed: false, guidedTourStep: 1 });
    persistToStorage({ ...get(), isTourDismissed: false });
  },

  addRegistration: (data) => {
    const { schools, patches, records, notifications } = get();
    const school = schools.find((s) => s.id === data.schoolId) || schools[0];
    const patch = patches.find((p) => p.sku === data.patchSku) || patches[0];

    // Reference generation: AAP-R-01xx
    const regCount = records.filter((r) => r.recordType === 'Registration').length;
    const ref = `AAP-R-0${132 + regCount}`;

    const newRecord: PatchRecord = {
      id: `rec-${Date.now()}`,
      ref,
      timestamp: new Date().toISOString(),
      recordType: 'Registration',
      student: data.student,
      gradYear: data.gradYear,
      schoolId: school.id,
      schoolName: school.name,
      schoolConference: school.conference,
      sportOrProgram: data.sportOrProgram,
      patchSku: patch.sku,
      patchName: patch.name,
      patchCategory: patch.category,
      quantity: data.quantity || 1,
      status: 'Registered',
    };

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: 'New registration received',
      message: `${data.student} (${data.gradYear}) logged ${patch.name} at ${school.name}.`,
      type: 'registration',
      read: false,
    };

    const updatedRecords = [newRecord, ...records];
    const updatedNotifications = [newNotification, ...notifications];

    set({
      records: updatedRecords,
      notifications: updatedNotifications,
    });

    persistToStorage({ ...get(), records: updatedRecords, notifications: updatedNotifications });

    return { ok: true, ref, record: newRecord };
  },

  addOrder: (data) => {
    const { schools, patches, records, notifications } = get();
    const school = schools.find((s) => s.id === data.schoolId) || schools[0];

    const orderCount = records.filter((r) => r.recordType === 'Order').length;
    const ref = `AAP-O-00${57 + orderCount}`;
    const timestamp = new Date().toISOString();

    let totalQuantity = 0;
    const newRecords: PatchRecord[] = [];
    const updatedPatches = [...patches];

    data.items.forEach((item, index) => {
      const patch = updatedPatches.find((p) => p.sku === item.patchSku);
      if (patch) {
        // decrement stock (floored at 0)
        patch.stock = Math.max(0, patch.stock - item.quantity);
        totalQuantity += item.quantity;

        newRecords.push({
          id: `rec-${Date.now()}-${index}`,
          ref,
          timestamp,
          recordType: 'Order',
          student: '—',
          gradYear: '—',
          schoolId: school.id,
          schoolName: school.name,
          schoolConference: school.conference,
          sportOrProgram: data.sportOrProgram || 'Athletics & Academics',
          patchSku: patch.sku,
          patchName: patch.name,
          patchCategory: patch.category,
          quantity: item.quantity,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactRole: data.contactRole,
          status: 'Awaiting Quote',
          notes: data.notes,
        });
      }
    });

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp,
      title: 'New bulk order request',
      message: `${school.name} requested ${totalQuantity} patches (${ref}).`,
      type: 'order',
      read: false,
    };

    const updatedRecords = [...newRecords, ...records];
    const updatedNotifications = [newNotification, ...notifications];

    set({
      patches: updatedPatches,
      records: updatedRecords,
      notifications: updatedNotifications,
    });

    persistToStorage({
      ...get(),
      patches: updatedPatches,
      records: updatedRecords,
      notifications: updatedNotifications,
    });

    return { ok: true, ref, totalQuantity };
  },

  updatePatchStock: (sku, newStock) => {
    const { patches } = get();
    const updatedPatches = patches.map((p) =>
      p.sku === sku ? { ...p, stock: Math.max(0, newStock) } : p
    );
    set({ patches: updatedPatches });
    persistToStorage({ ...get(), patches: updatedPatches });
  },

  addSchool: (schoolData) => {
    const { schools } = get();
    const newId = `S0${schools.length + 1}`;
    const newSchool: School = {
      id: newId,
      ...schoolData,
    };
    const updatedSchools = [...schools, newSchool];
    set({ schools: updatedSchools });
    persistToStorage({ ...get(), schools: updatedSchools });
    return newSchool;
  },

  markOrderQuoted: (ref) => {
    const { records } = get();
    const updatedRecords = records.map((r) =>
      r.ref === ref ? { ...r, status: 'Quoted' as const } : r
    );
    set({ records: updatedRecords });
    persistToStorage({ ...get(), records: updatedRecords });
  },

  resetDemoData: () => {
    set({
      schools: SEED_SCHOOLS,
      patches: SEED_PATCHES,
      records: SEED_RECORDS,
      notifications: INITIAL_NOTIFICATIONS,
      filters: {
        dateRange: 'season',
        recordType: 'all',
        category: 'all',
        schoolId: 'all',
      },
      guidedTourStep: 1,
      isTourDismissed: false,
    });
    localStorage.removeItem(STORAGE_KEY);
  },

  markNotificationRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications: updated });
    persistToStorage({ ...get(), notifications: updated });
  },

  markAllNotificationsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated });
    persistToStorage({ ...get(), notifications: updated });
  },
}));

function persistToStorage(state: {
  schools: School[];
  patches: PatchItem[];
  records: PatchRecord[];
  notifications: NotificationItem[];
  isOwnerSignedIn: boolean;
  isTourDismissed: boolean;
}) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schools: state.schools,
        patches: state.patches,
        records: state.records,
        notifications: state.notifications,
        isOwnerSignedIn: state.isOwnerSignedIn,
        isTourDismissed: state.isTourDismissed,
      })
    );
  } catch (e) {
    console.error('Failed to persist demo state', e);
  }
}
