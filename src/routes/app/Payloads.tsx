import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Copy, Send, Check, Search, ShieldCheck, ArrowRight, Code } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { generatePayload, FieldMapping } from '../../mock/payloadMapper';
import { BRAND } from '../../config/brand.config';

export const Payloads: React.FC = () => {
  const mergedResult = useStore((s) => s.mergedResult);
  const addToast = useStore((s) => s.addToast);

  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMappingKey, setHoveredMappingKey] = useState<string | null>(null);

  const [isSending, setIsSending] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState<any | null>(null);

  const filteredRecords = mergedResult.merged.filter(
    (r) =>
      r.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.accountId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeRecord = filteredRecords[selectedRecordIndex] || mergedResult.merged[0];
  const { payload, mappings } = activeRecord ? generatePayload(activeRecord) : { payload: {}, mappings: [] };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    addToast({
      message: 'Payload JSON copied to clipboard.',
      type: 'info',
    });
  };

  const handleSendToSandbox = async () => {
    setIsSending(true);
    setSandboxResponse(null);
    await new Promise((r) => setTimeout(r, 700));
    setIsSending(false);
    setSandboxResponse({
      status: 201,
      statusText: 'Created',
      requestId: (payload as any).request_id || 'req_8H2K1Q',
      timestamp: new Date().toISOString(),
      fulfillmentId: `ful_${Math.random().toString(36).substring(2, 9)}`,
    });
    addToast({
      message: 'POST to sandbox API returned 201 Created.',
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#1F2421] font-medium">
            Payload Inspector & Dynamic REST Schema
          </h1>
          <p className="text-xs text-[#7A817B] font-mono mt-0.5">
            Real-time JSON mapping from merged Google Sheet records to downstream fulfillment endpoint
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-[#E4ECE7] text-[#24473B] font-mono text-xs rounded-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Endpoint: {BRAND.apiPlaceholder}</span>
          </div>
        </div>
      </div>

      {/* Split View Layout: 4 cols Records list, 8 cols Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (4 cols): Searchable records list */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-4 shadow-1 flex flex-col gap-3 max-h-[720px] overflow-hidden">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A817B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter recipient or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-[#FBFAF7] border border-[#CFC8BB] rounded-sm text-xs text-[#1F2421]"
            />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {filteredRecords.map((rec, idx) => {
              const isSelected = activeRecord?.recordId === rec.recordId;
              return (
                <button
                  key={rec.recordId}
                  type="button"
                  onClick={() => setSelectedRecordIndex(idx)}
                  className={`p-3 text-left rounded-sm border transition-colors flex flex-col gap-1 text-xs ${
                    isSelected
                      ? 'bg-[#E4ECE7] border-[#24473B] shadow-1'
                      : 'bg-[#FBFAF7] border-[#E3DED5] hover:bg-[#EFEBE4]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#24473B]">{rec.recordId}</span>
                    <span className="font-mono text-[10px] text-[#7A817B]">{rec.accountId}</span>
                  </div>
                  <div className="font-medium text-[#1F2421]">{rec.recipientName}</div>
                  <div className="text-[11px] text-[#7A817B] truncate">{rec.company}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right (8 cols): Payload Inspector */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-6">
          {/* Top: Mapping Table with Hover Interaction per PRD §10.7 */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-wider text-[#4A524D] font-semibold">
                Field Transformation & Mapping Table
              </span>
              <span className="text-[11px] text-[#7A817B]">
                Hover a row to highlight mapped JSON field
              </span>
            </div>

            <div className="overflow-x-auto border border-[#E3DED5] rounded-md">
              <table className="w-full text-xs text-left min-w-[550px] divide-y divide-[#E3DED5]">
                <thead className="bg-[#FBFAF7] text-[#7A817B] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Source Field</th>
                    <th className="py-2 px-3">Target JSON Key</th>
                    <th className="py-2 px-3">Transform Logic</th>
                    <th className="py-2 px-3">Sample Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3DED5]">
                  {mappings.map((m) => (
                    <tr
                      key={m.id}
                      onMouseEnter={() => setHoveredMappingKey(m.jsonKey)}
                      onMouseLeave={() => setHoveredMappingKey(null)}
                      className={`cursor-pointer transition-colors duration-200 ${
                        hoveredMappingKey === m.jsonKey ? 'bg-[#E4ECE7]/70' : 'hover:bg-[#FBFAF7]'
                      }`}
                    >
                      <td className="py-2 px-3 font-mono text-[#4A524D]">{m.sourceField}</td>
                      <td className="py-2 px-3 font-mono font-semibold text-[#24473B]">{m.targetField}</td>
                      <td className="py-2 px-3 text-[#B5654A] font-mono text-[11px]">{m.transformation}</td>
                      <td className="py-2 px-3 text-[#1F2421] truncate max-w-[150px]">{m.sampleOutput}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formatted JSON in surface-sunken well per PRD §10.7 */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-wider text-[#4A524D] font-semibold">
                Dispatched REST JSON Payload
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyJson}
                  icon={<Copy className="w-3.5 h-3.5" />}
                >
                  Copy JSON
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isSending}
                  onClick={handleSendToSandbox}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Send to Sandbox
                </Button>
              </div>
            </div>

            <pre className="p-4 bg-[#EFEBE4] rounded-md font-mono text-xs text-[#1F2421] overflow-x-auto leading-relaxed border border-[#CFC8BB]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          {/* Simulated 201 Created Response Panel */}
          {sandboxResponse && (
            <div className="p-4 bg-[#E1F0E8] border border-[#2F7D57]/40 rounded-md text-xs flex flex-col gap-2">
              <div className="flex justify-between items-center font-mono">
                <span className="text-[#2F7D57] font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>HTTP 201 Created — Response Acknowledged</span>
                </span>
                <span className="text-[#7A817B]">{sandboxResponse.timestamp}</span>
              </div>
              <div className="font-mono text-[11px] text-[#24473B] bg-white p-2.5 rounded-xs border border-[#2F7D57]/20">
                {`{ "status": "CONFIRMED", "request_id": "${sandboxResponse.requestId}", "fulfillment_tracking": "${sandboxResponse.fulfillmentId}" }`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
