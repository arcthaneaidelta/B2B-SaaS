import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface SampleRow {
  id: number;
  name: string;
  address: string;
  postcode: string;
  country: string;
  status: 'pending' | 'valid' | 'invalid';
  fixSuggestion?: string;
}

export const MessyRowValidator: React.FC = () => {
  const [rows, setRows] = useState<SampleRow[]>([
    {
      id: 1,
      name: 'Claire Beauchamp',
      address: '144 Highcrest St, Cincinnati, OH',
      postcode: '45202',
      country: 'US',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Kenneth Bradley',
      address: '712 Oakdale Lane, Akron, OH',
      postcode: 'INVALID-ZIP',
      country: 'US',
      status: 'pending',
      fixSuggestion: 'Expected 5-digit US ZIP (e.g. 44308 for Akron, OH)',
    },
    {
      id: 3,
      name: 'Arthur Pendelton',
      address: '52 Ocean Cliff Rd, Cape Elizabeth, ME',
      postcode: '04107',
      country: 'US',
      status: 'pending',
    },
  ]);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidate = () => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        status: r.postcode === 'INVALID-ZIP' ? 'invalid' : 'valid',
      }))
    );
    setIsValidated(true);
  };

  const handleFixAndReset = () => {
    setRows([
      {
        id: 1,
        name: 'Claire Beauchamp',
        address: '144 Highcrest St, Cincinnati, OH',
        postcode: '45202',
        country: 'US',
        status: 'valid',
      },
      {
        id: 2,
        name: 'Kenneth Bradley',
        address: '712 Oakdale Lane, Akron, OH',
        postcode: '44308',
        country: 'US',
        status: 'valid',
      },
      {
        id: 3,
        name: 'Arthur Pendelton',
        address: '52 Ocean Cliff Rd, Cape Elizabeth, ME',
        postcode: '04107',
        country: 'US',
        status: 'valid',
      },
    ]);
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E3DED5]">
        <div>
          <h4 className="font-display text-base font-medium text-[#1F2421]">
            Pre-flight Validation Sandbox
          </h4>
          <p className="text-xs text-[#7A817B]">
            Interactive test: Inspect how regex and schema rules catch errors before Make runs
          </p>
        </div>
        {!isValidated ? (
          <Button size="sm" variant="primary" onClick={handleValidate}>
            Validate 3 rows
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleFixAndReset}
          >
            Auto-apply fix
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-[#E3DED5] text-[#7A817B] font-mono uppercase text-[10px]">
              <th className="py-2 px-2.5">Row</th>
              <th className="py-2 px-2.5">Recipient</th>
              <th className="py-2 px-2.5">Address</th>
              <th className="py-2 px-2.5">Postcode</th>
              <th className="py-2 px-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3DED5]">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors duration-150 ${
                  row.status === 'invalid' ? 'bg-[#F7E0DE]/40' : 'hover:bg-[#FBFAF7]'
                }`}
              >
                <td className="py-2.5 px-2.5 font-mono text-[#7A817B]">#{row.id}</td>
                <td className="py-2.5 px-2.5 font-medium text-[#1F2421]">{row.name}</td>
                <td className="py-2.5 px-2.5 text-[#4A524D]">{row.address}</td>
                <td className="py-2.5 px-2.5 font-mono">
                  <span
                    className={
                      row.status === 'invalid'
                        ? 'text-[#B23A3A] font-bold underline decoration-dotted'
                        : 'text-[#1F2421]'
                    }
                  >
                    {row.postcode}
                  </span>
                </td>
                <td className="py-2.5 px-2.5">
                  {row.status === 'pending' && (
                    <span className="text-[11px] text-[#7A817B] font-mono">Pending</span>
                  )}
                  {row.status === 'valid' && (
                    <span className="inline-flex items-center gap-1 text-[#2F7D57] font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  )}
                  {row.status === 'invalid' && (
                    <span className="inline-flex items-center gap-1 text-[#B23A3A] font-medium text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Flagged
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isValidated && rows.some((r) => r.status === 'invalid') && (
        <div className="p-3 bg-[#F7E0DE] border border-[#B23A3A]/20 rounded-sm text-xs text-[#B23A3A] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Row 2 flagged: </span>
            {rows[1].fixSuggestion}
          </div>
        </div>
      )}
    </div>
  );
};
