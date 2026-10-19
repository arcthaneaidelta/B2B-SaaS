import { SEEDED_CSV_ROWS, CsvRecipientRow } from './seed';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateSampleCsvContent(): string {
  const headers = "recipient_name,recipient_address,city,state,postcode,country,account_id,reference_code";
  const rows = SEEDED_CSV_ROWS.map(r => 
    `"${r.recipientName}","${r.addressLine1}","${r.city}","${r.state}","${r.postcode}","${r.country}","${r.accountId}","${r.referenceCode}"`
  );
  return [headers, ...rows].join('\n');
}

export function downloadSampleCsv(): void {
  const content = generateSampleCsvContent();
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample-recipients.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
