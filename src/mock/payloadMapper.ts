import { MergedRecord } from './seed';

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  section: 'sender' | 'recipient' | 'attributes';
  transformation: string;
  sampleInput: string;
  sampleOutput: string;
  jsonKey: string;
}

export function generatePayload(record: MergedRecord) {
  const payload = {
    request_id: `req_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    account_id: record.accountId,
    sender: {
      name: record.senderName,
      title: record.senderTitle,
      company: record.company,
      address: {
        line1: record.senderAddress.line1,
        city: record.senderAddress.city,
        state: record.senderAddress.state,
        postcode: record.senderAddress.postcode,
        country: record.senderAddress.country,
      },
    },
    recipient: {
      name: record.recipientName,
      address: {
        line1: record.recipientAddress.line1,
        city: record.recipientAddress.city,
        state: record.recipientAddress.state,
        postcode: record.recipientAddress.postcode || "MISSING",
        country: record.recipientAddress.country,
      },
    },
    attributes: {
      template: record.template,
      personalize_first_name: record.attributes.personalizeFirstName,
      reference_code: record.referenceCode,
      include_logo: record.attributes.includeLogo,
    },
  };

  const mappings: FieldMapping[] = [
    {
      id: 'm1',
      sourceField: 'Profile.ownerName',
      targetField: 'sender.name',
      section: 'sender',
      transformation: 'trim()',
      sampleInput: `"${record.senderName} "`,
      sampleOutput: `"${record.senderName}"`,
      jsonKey: 'sender.name',
    },
    {
      id: 'm2',
      sourceField: 'Profile.company',
      targetField: 'sender.company',
      section: 'sender',
      transformation: 'titleCase()',
      sampleInput: record.company.toLowerCase(),
      sampleOutput: record.company,
      jsonKey: 'sender.company',
    },
    {
      id: 'm3',
      sourceField: 'CSV.recipientName',
      targetField: 'recipient.name',
      section: 'recipient',
      transformation: 'cleanWhitespace()',
      sampleInput: record.recipientName,
      sampleOutput: record.recipientName,
      jsonKey: 'recipient.name',
    },
    {
      id: 'm4',
      sourceField: 'CSV.addressLine1',
      targetField: 'recipient.address.line1',
      section: 'recipient',
      transformation: 'normalizeStreet()',
      sampleInput: record.recipientAddress.line1,
      sampleOutput: record.recipientAddress.line1,
      jsonKey: 'recipient.address.line1',
    },
    {
      id: 'm5',
      sourceField: 'CSV.postcode',
      targetField: 'recipient.address.postcode',
      section: 'recipient',
      transformation: 'validatePostal(country)',
      sampleInput: record.recipientAddress.postcode || '[empty]',
      sampleOutput: record.recipientAddress.postcode || 'null [flagged]',
      jsonKey: 'recipient.address.postcode',
    },
    {
      id: 'm6',
      sourceField: 'Profile.attributes.personalizeFirstName',
      targetField: 'attributes.personalize_first_name',
      section: 'attributes',
      transformation: 'toBoolean()',
      sampleInput: String(record.attributes.personalizeFirstName),
      sampleOutput: String(record.attributes.personalizeFirstName),
      jsonKey: 'attributes.personalize_first_name',
    },
    {
      id: 'm7',
      sourceField: 'CSV.referenceCode',
      targetField: 'attributes.reference_code',
      section: 'attributes',
      transformation: 'uppercase()',
      sampleInput: record.referenceCode,
      sampleOutput: record.referenceCode.toUpperCase(),
      jsonKey: 'attributes.reference_code',
    },
  ];

  return { payload, mappings };
}
