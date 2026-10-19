import { CustomerAccount, CsvRecipientRow, MergedRecord } from './seed';

export interface MergeResult {
  merged: MergedRecord[];
  orphans: { row: CsvRecipientRow; reason: string }[];
  duplicates: { row: CsvRecipientRow; reason: string }[];
  stats: {
    totalCsv: number;
    mergedCount: number;
    orphansCount: number;
    duplicatesCount: number;
  };
}

export function performMerge(
  profiles: CustomerAccount[],
  csvRows: CsvRecipientRow[]
): MergeResult {
  const profileMap = new Map<string, CustomerAccount>();
  for (const p of profiles) {
    profileMap.set(p.accountId, p);
  }

  const merged: MergedRecord[] = [];
  const orphans: { row: CsvRecipientRow; reason: string }[] = [];
  const duplicates: { row: CsvRecipientRow; reason: string }[] = [];
  const seenKeys = new Set<string>();

  for (const row of csvRows) {
    const key = `${row.accountId}:${row.recipientName.trim().toLowerCase()}`;
    const profile = profileMap.get(row.accountId);

    if (row.issueType === 'DUPLICATE_KEY' || seenKeys.has(key)) {
      duplicates.push({
        row,
        reason: `Duplicate key: record for "${row.recipientName}" already registered under ${row.accountId}`,
      });
      continue;
    }

    if (!profile || row.issueType === 'ORPHAN_ACCOUNT') {
      orphans.push({
        row,
        reason: `Orphan key: No customer profile found in Google Sheets for ${row.accountId}`,
      });
      continue;
    }

    seenKeys.add(key);

    merged.push({
      recordId: `REC-${row.accountId.replace('ACCT-', '')}-${String(row.rowId).padStart(4, '0')}`,
      accountId: profile.accountId,
      company: profile.company,
      senderName: profile.ownerName,
      senderTitle: profile.ownerTitle,
      senderAddress: profile.address,
      recipientName: row.recipientName,
      recipientAddress: {
        line1: row.addressLine1,
        city: row.city,
        state: row.state,
        postcode: row.postcode,
        country: row.country,
      },
      template: profile.template,
      referenceCode: row.referenceCode,
      attributes: profile.attributes,
      status: row.postcode ? 'READY' : 'FAILED',
    });
  }

  return {
    merged,
    orphans,
    duplicates,
    stats: {
      totalCsv: csvRows.length,
      mergedCount: merged.length,
      orphansCount: orphans.length,
      duplicatesCount: duplicates.length,
    },
  };
}
