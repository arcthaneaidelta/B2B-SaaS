import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '../../components/ui/Button';
import { Monogram } from '../../components/brand/Monogram';
import {
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const QRPage: React.FC = () => {
  const { addToast } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSize, setQrSize] = useState<number>(240);
  const [copied, setCopied] = useState(false);

  // Target landing URL
  const targetUrl = `${window.location.origin}/s`;

  useEffect(() => {
    QRCode.toDataURL(
      targetUrl,
      {
        width: 600,
        margin: 2,
        color: {
          dark: '#1C2B3A',
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [targetUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Link copied',
      description: targetUrl,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'AA-Patch-Work_Universal-QR.png';
    a.click();
  };

  return (
    <div className="space-y-6 font-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-ink-900">
            Universal Packaging QR Code
          </h2>
          <p className="text-xs text-text-2 mt-0.5">
            The single universal code printed on all patch backing cards, envelopes, and stickers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print 6-Up Label Sheet
          </Button>
          <Button
            variant="accent"
            size="md"
            onClick={handleDownloadPng}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download High-Res PNG
          </Button>
        </div>
      </div>

      {/* Main Display Card */}
      <div className="bg-paper-0 p-6 sm:p-8 rounded-xl border border-border shadow-sh-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center no-print">
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 bg-paper-100 rounded-xl border-2 border-dashed border-border-strong text-center space-y-4">
          <div
            style={{ width: qrSize, height: qrSize }}
            className="p-3 bg-paper-0 rounded-lg shadow-sh-2 border border-border flex items-center justify-center"
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="A&A Patch Work Universal QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-text-3">
                Generating QR…
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-3">Display Size:</span>
            <div className="inline-flex rounded border border-border bg-paper-0 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setQrSize(160)}
                className={`px-2.5 py-1 rounded ${qrSize === 160 ? 'bg-ink-900 text-paper-0 font-semibold' : 'text-text-2'}`}
              >
                Small
              </button>
              <button
                type="button"
                onClick={() => setQrSize(240)}
                className={`px-2.5 py-1 rounded ${qrSize === 240 ? 'bg-ink-900 text-paper-0 font-semibold' : 'text-text-2'}`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setQrSize(320)}
                className={`px-2.5 py-1 rounded ${qrSize === 320 ? 'bg-ink-900 text-paper-0 font-semibold' : 'text-text-2'}`}
              >
                Large
              </button>
            </div>
          </div>
        </div>

        {/* Technical Explanations */}
        <div className="space-y-4 text-xs text-text-2">
          <div className="p-4 bg-paper-100 rounded-lg border border-border space-y-2">
            <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-thread-600" />
              <span>Universal Redirect Architecture</span>
            </div>
            <p className="leading-relaxed">
              <strong>One permanent QR code for all merchandise.</strong> The printed QR points to a permanent short redirect link (e.g. <code>aapatchwork.example/s</code>).
            </p>
            <p className="text-[11px] text-text-3">
              If you ever change forms or databases in the future, you simply update the redirect destination in your domain DNS without reprinting a single patch packaging card.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-ink-900 block">Encoded Destination URL:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={targetUrl}
                className="w-full bg-paper-100 border border-border rounded px-3 py-2 text-xs font-mono text-ink-900 select-all focus:outline-none"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="p-3 bg-paper-50 rounded border border-border flex items-center justify-between">
            <span className="font-medium text-ink-900">Test live scan in browser:</span>
            <a
              href="/s"
              target="_blank"
              rel="noreferrer"
              className="text-thread-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Open mobile landing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Printable 6-Up Label Sheet (Visible during Print Preview) */}
      <div className="hidden print-only p-4">
        <h3 className="text-center font-display font-bold text-lg mb-4">
          A&amp;A Patch Work — Packaging Sticker Sheet (6-Up)
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center flex flex-col items-center justify-between"
            >
              <div className="font-display font-bold text-sm tracking-wide">
                A&amp;A Patch Work
              </div>
              <div className="w-32 h-32 my-2">
                {qrDataUrl && <img src={qrDataUrl} alt="QR" className="w-full h-full object-contain" />}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-700">
                Scan to Register or Order
              </div>
              <div className="text-[9px] text-gray-500 font-mono mt-0.5">
                aapatchwork.example/s
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
