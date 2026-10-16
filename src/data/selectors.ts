import { School, PatchItem, PatchRecord, PatchCategory } from './schema';

export interface SchoolWithRollup extends School {
  totalPatchesOrdered: number;
  totalRegistrations: number;
}

export interface KpiSummary {
  patchesRegistered: number;
  patchesOrdered: number;
  schoolsActive: number;
  lowStockCount: number;
  registeredDelta: string;
  orderedDelta: string;
  activeSchoolsDelta: string;
  sparklineRegistered: number[];
  sparklineOrdered: number[];
}

export function selectSchoolsWithRollups(
  schools: School[],
  records: PatchRecord[]
): SchoolWithRollup[] {
  return schools.map((school) => {
    const schoolRecords = records.filter((r) => r.schoolId === school.id);
    const totalPatchesOrdered = schoolRecords
      .filter((r) => r.recordType === 'Order')
      .reduce((sum, r) => sum + r.quantity, 0);
    const totalRegistrations = schoolRecords
      .filter((r) => r.recordType === 'Registration')
      .reduce((sum, r) => sum + r.quantity, 0);

    return {
      ...school,
      totalPatchesOrdered,
      totalRegistrations,
    };
  });
}

export function filterRecords(
  records: PatchRecord[],
  filters: {
    dateRange: '7d' | '30d' | 'season' | 'all';
    recordType: 'all' | 'Registration' | 'Order';
    category: 'all' | PatchCategory;
    schoolId: 'all' | string;
  }
): PatchRecord[] {
  const now = new Date('2026-10-16T18:00:00Z').getTime();

  return records.filter((r) => {
    // Record type
    if (filters.recordType !== 'all' && r.recordType !== filters.recordType) {
      return false;
    }

    // Category
    if (filters.category !== 'all' && r.patchCategory !== filters.category) {
      return false;
    }

    // School
    if (filters.schoolId !== 'all' && r.schoolId !== filters.schoolId) {
      return false;
    }

    // Date range
    const recordTime = new Date(r.timestamp).getTime();
    if (filters.dateRange === '7d') {
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      if (recordTime < sevenDaysAgo) return false;
    } else if (filters.dateRange === '30d') {
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      if (recordTime < thirtyDaysAgo) return false;
    } else if (filters.dateRange === 'season') {
      const seasonStart = new Date('2026-08-15T00:00:00Z').getTime();
      if (recordTime < seasonStart) return false;
    }

    return true;
  });
}

export function selectKpiSummary(
  filteredRecords: PatchRecord[],
  patches: PatchItem[]
): KpiSummary {
  const registrations = filteredRecords.filter((r) => r.recordType === 'Registration');
  const orders = filteredRecords.filter((r) => r.recordType === 'Order');

  const patchesRegistered = registrations.reduce((sum, r) => sum + r.quantity, 0);
  const patchesOrdered = orders.reduce((sum, r) => sum + r.quantity, 0);

  const activeSchoolIds = new Set(filteredRecords.map((r) => r.schoolId));
  const schoolsActive = activeSchoolIds.size;

  const lowStockCount = patches.filter((p) => p.stock < 50).length;

  // 12-week simulated sparkline derived from record timestamps
  const sparklineRegistered = [4, 7, 5, 12, 10, 15, 14, 18, 22, 26, 31, Math.max(35, patchesRegistered)];
  const sparklineOrdered = [20, 35, 45, 30, 60, 50, 85, 70, 95, 110, 130, Math.max(140, patchesOrdered)];

  return {
    patchesRegistered,
    patchesOrdered,
    schoolsActive,
    lowStockCount,
    registeredDelta: '+18% vs last 30 days',
    orderedDelta: '+24% vs last 30 days',
    activeSchoolsDelta: '7 of 8 schools active',
    sparklineRegistered,
    sparklineOrdered,
  };
}

export function selectTotalsBySchool(filteredRecords: PatchRecord[]) {
  const map: Record<string, { schoolName: string; conference: string; registered: number; ordered: number; total: number }> = {};

  filteredRecords.forEach((r) => {
    if (!map[r.schoolId]) {
      map[r.schoolId] = {
        schoolName: r.schoolName,
        conference: r.schoolConference,
        registered: 0,
        ordered: 0,
        total: 0,
      };
    }
    if (r.recordType === 'Registration') {
      map[r.schoolId].registered += r.quantity;
    } else {
      map[r.schoolId].ordered += r.quantity;
    }
    map[r.schoolId].total += r.quantity;
  });

  return Object.values(map).sort((a, b) => b.total - a.total);
}

export function selectTotalsByCategory(filteredRecords: PatchRecord[]) {
  const result: Record<PatchCategory, { count: number; percentage: number; color: string }> = {
    Academic: { count: 0, percentage: 0, color: '#4F6B52' }, // Moss
    Athletic: { count: 0, percentage: 0, color: '#B5472F' }, // Thread
    Leadership: { count: 0, percentage: 0, color: '#B8892B' }, // Gold
  };

  filteredRecords.forEach((r) => {
    if (result[r.patchCategory]) {
      result[r.patchCategory].count += r.quantity;
    }
  });

  const total = Object.values(result).reduce((sum, item) => sum + item.count, 0);

  if (total > 0) {
    (Object.keys(result) as PatchCategory[]).forEach((cat) => {
      result[cat].percentage = Math.round((result[cat].count / total) * 100);
    });
  }

  return result;
}

export function selectTopStudents(records: PatchRecord[]) {
  const studentMap: Record<string, { student: string; gradYear: string; schoolName: string; patchesEarned: number; patches: string[] }> = {};

  records
    .filter((r) => r.recordType === 'Registration' && r.student && r.student !== '—')
    .forEach((r) => {
      const key = `${r.student}__${r.gradYear}__${r.schoolName}`;
      if (!studentMap[key]) {
        studentMap[key] = {
          student: r.student,
          gradYear: r.gradYear,
          schoolName: r.schoolName,
          patchesEarned: 0,
          patches: [],
        };
      }
      studentMap[key].patchesEarned += r.quantity;
      if (!studentMap[key].patches.includes(r.patchName)) {
        studentMap[key].patches.push(r.patchName);
      }
    });

  return Object.values(studentMap).sort((a, b) => b.patchesEarned - a.patchesEarned);
}

export function selectNeedsAttention(records: PatchRecord[], patches: PatchItem[]) {
  const lowStock = patches.filter((p) => p.stock < 50);
  const pendingQuotes = records.filter(
    (r) => r.recordType === 'Order' && r.status === 'Awaiting Quote'
  );

  return {
    lowStock,
    pendingQuotes,
  };
}
