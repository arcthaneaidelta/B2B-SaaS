import * as XLSX from 'xlsx';
import { School, PatchItem, PatchRecord } from '../data/schema';

export interface ExportOptions {
  includeFlatData: boolean;
  includeSchools: boolean;
  includeCatalog: boolean;
  includeSummary: boolean;
  scope: 'all' | 'filtered';
}

export function exportToExcel(
  records: PatchRecord[],
  schools: School[],
  patches: PatchItem[],
  options: ExportOptions = {
    includeFlatData: true,
    includeSchools: true,
    includeCatalog: true,
    includeSummary: true,
    scope: 'all',
  }
) {
  const wb = XLSX.utils.book_new();

  // 1. Flat Data Sheet (Pivot-Ready)
  if (options.includeFlatData) {
    const flatData = records.map((r) => {
      const school = schools.find((s) => s.id === r.schoolId);
      const patch = patches.find((p) => p.sku === r.patchSku);
      const d = new Date(r.timestamp);

      return {
        'Reference #': r.ref,
        'Timestamp': d.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        'Date': d.toISOString().split('T')[0],
        'Month': d.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        'Record Type': r.recordType,
        'Student Name': r.student,
        'Graduation Year': r.gradYear,
        'School Name': r.schoolName,
        'Conference': r.schoolConference || school?.conference || '—',
        'Sport / Program': r.sportOrProgram,
        'Patch SKU': r.patchSku,
        'Patch Name': r.patchName,
        'Category': r.patchCategory || patch?.category || '—',
        'Quantity': r.quantity,
        'Status': r.status || 'Registered',
        'Contact Name': r.contactName || '—',
        'Contact Email': r.contactEmail || '—',
        'Contact Role': r.contactRole || '—',
        'Notes': r.notes || '',
      };
    });

    const wsFlat = XLSX.utils.json_to_sheet(flatData);

    // Set column widths for clean readability in Excel
    wsFlat['!cols'] = [
      { wch: 14 }, // Ref
      { wch: 20 }, // Timestamp
      { wch: 12 }, // Date
      { wch: 12 }, // Month
      { wch: 14 }, // Record Type
      { wch: 16 }, // Student
      { wch: 12 }, // Grad Year
      { wch: 28 }, // School Name
      { wch: 30 }, // Conference
      { wch: 18 }, // Sport/Program
      { wch: 12 }, // SKU
      { wch: 26 }, // Patch Name
      { wch: 14 }, // Category
      { wch: 10 }, // Quantity
      { wch: 14 }, // Status
      { wch: 18 }, // Contact Name
      { wch: 26 }, // Contact Email
      { wch: 12 }, // Contact Role
      { wch: 24 }, // Notes
    ];

    // Autofilter for Excel
    if (flatData.length > 0) {
      wsFlat['!autofilter'] = {
        ref: `A1:S${flatData.length + 1}`,
      };
    }

    XLSX.utils.book_append_sheet(wb, wsFlat, 'Registry & Orders (Pivot)');
  }

  // 2. Schools Sheet
  if (options.includeSchools) {
    const schoolsData = schools.map((s) => {
      const schoolRecords = records.filter((r) => r.schoolId === s.id);
      const ordersCount = schoolRecords
        .filter((r) => r.recordType === 'Order')
        .reduce((sum, r) => sum + r.quantity, 0);
      const regCount = schoolRecords
        .filter((r) => r.recordType === 'Registration')
        .reduce((sum, r) => sum + r.quantity, 0);

      return {
        'School ID': s.id,
        'School Name': s.name,
        'Conference': s.conference,
        'Primary Contact': s.contact,
        'Email Address': s.contactEmail,
        'Total Patches Ordered': ordersCount,
        'Total Registrations': regCount,
      };
    });

    const wsSchools = XLSX.utils.json_to_sheet(schoolsData);
    wsSchools['!cols'] = [
      { wch: 10 },
      { wch: 30 },
      { wch: 32 },
      { wch: 22 },
      { wch: 32 },
      { wch: 22 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, wsSchools, 'Schools');
  }

  // 3. Patch Catalog Sheet
  if (options.includeCatalog) {
    const catalogData = patches.map((p) => ({
      'SKU': p.sku,
      'Patch Name': p.name,
      'Category': p.category,
      'Current Stock': p.stock,
      'Stock Status': p.stock < 50 ? 'LOW STOCK - REORDER' : 'Healthy',
      'Badge Shape': p.shape,
      'Description': p.description,
    }));

    const wsCatalog = XLSX.utils.json_to_sheet(catalogData);
    wsCatalog['!cols'] = [
      { wch: 12 },
      { wch: 28 },
      { wch: 14 },
      { wch: 14 },
      { wch: 22 },
      { wch: 14 },
      { wch: 45 },
    ];
    XLSX.utils.book_append_sheet(wb, wsCatalog, 'Patch Catalog');
  }

  // 4. Summary & Instructions Sheet
  if (options.includeSummary) {
    const totalRegistrations = records
      .filter((r) => r.recordType === 'Registration')
      .reduce((sum, r) => sum + r.quantity, 0);
    const totalOrdered = records
      .filter((r) => r.recordType === 'Order')
      .reduce((sum, r) => sum + r.quantity, 0);

    const summaryData = [
      { 'Metric / Field': 'Business Name', 'Value / Detail': 'A&A Patch Work' },
      { 'Metric / Field': 'Export Date', 'Value / Detail': new Date().toLocaleDateString('en-US', { dateStyle: 'full' }) },
      { 'Metric / Field': 'Total Records Exported', 'Value / Detail': records.length },
      { 'Metric / Field': 'Total Patches Registered (Students)', 'Value / Detail': totalRegistrations },
      { 'Metric / Field': 'Total Patches Ordered (Schools)', 'Value / Detail': totalOrdered },
      { 'Metric / Field': 'Active Schools Count', 'Value / Detail': new Set(records.map((r) => r.schoolId)).size },
      { 'Metric / Field': '', 'Value / Detail': '' },
      { 'Metric / Field': 'PIVOT TABLE INSTRUCTIONS:', 'Value / Detail': '' },
      { 'Metric / Field': 'Step 1', 'Value / Detail': 'Open sheet "Registry & Orders (Pivot)"' },
      { 'Metric / Field': 'Step 2', 'Value / Detail': 'Click Excel Menu: Insert -> PivotTable -> OK' },
      { 'Metric / Field': 'Step 3', 'Value / Detail': 'Drag "School Name" to Rows, "Category" to Columns, and "Quantity" to Values.' },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 28 }, { wch: 45 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary & Instructions');
  }

  // Generate file name with current date
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `AA-Patch-Work_Export_${dateStr}.xlsx`;

  XLSX.writeFile(wb, filename);

  return { filename, rowCount: records.length };
}
