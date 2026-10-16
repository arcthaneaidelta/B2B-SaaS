import React, { useState } from 'react';
import { useDemoStore } from '../../data/store';
import { PatchItem, PatchCategory } from '../../data/schema';
import { PatchArt } from '../../components/brand/PatchArt';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { useToast } from '../../components/ui/Toast';
import {
  Search,
  AlertTriangle,
  Edit2,
  Check,
  X,
  PackageCheck,
  Filter,
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const { patches, records, updatePatchStock } = useDemoStore();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | PatchCategory>('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [selectedPatch, setSelectedPatch] = useState<PatchItem | null>(null);

  const filteredPatches = patches.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (lowStockOnly && p.stock >= 50) return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.sku.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleStartEdit = (patch: PatchItem) => {
    setEditingSku(patch.sku);
    setEditValue(patch.stock);
  };

  const handleSaveStock = (sku: string) => {
    updatePatchStock(sku, editValue);
    setEditingSku(null);
    addToast({
      type: 'success',
      title: 'Inventory stock updated',
      description: `Stock for ${sku} updated to ${editValue} units.`,
    });
  };

  return (
    <div className="space-y-6 font-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-ink-900">
            Patch Catalog &amp; Inventory
          </h2>
          <p className="text-xs text-text-2 mt-0.5">
            Active varsity letter and merit patch SKUs. Click stock counts directly to edit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={lowStockOnly ? 'accent' : 'secondary'}
            size="sm"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
          >
            {lowStockOnly ? 'Showing Low Stock Only' : 'Filter Low Stock (<50)'}
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-paper-0 p-3 sm:p-4 rounded-lg border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sh-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-text-3 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patch name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm bg-paper-100 border border-border rounded-md text-ink-900 focus:outline-none focus:border-thread-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-3 font-medium">Category:</span>
          <div className="inline-flex rounded-md border border-border bg-paper-100 p-0.5 text-xs font-medium">
            {(['all', 'Academic', 'Athletic', 'Leadership'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-paper-0 text-ink-900 font-semibold shadow-sh-1'
                    : 'text-text-2 hover:text-ink-900'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-paper-0 rounded-lg border border-border shadow-sh-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead className="bg-paper-100 border-b border-border text-text-3 select-none">
              <tr>
                <th className="py-3 px-4 font-semibold">Patch Emblem</th>
                <th className="py-3 px-4 font-semibold">Patch Name / Description</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-right">In-Stock Count</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPatches.map((patch) => {
                const isEditing = editingSku === patch.sku;
                const isLow = patch.stock < 50;

                return (
                  <tr
                    key={patch.sku}
                    className="hover:bg-paper-100/80 transition-colors cursor-pointer"
                    onClick={(e) => {
                      // Prevent drawer if clicking inline input
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                        setSelectedPatch(patch);
                      }
                    }}
                  >
                    {/* Emblem */}
                    <td className="py-3 px-4 w-16">
                      <PatchArt
                        sku={patch.sku}
                        category={patch.category}
                        shape={patch.shape}
                        size={40}
                      />
                    </td>

                    {/* Name & Desc */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ink-900 text-sm font-display">
                        {patch.name}
                      </div>
                      <div className="text-[11px] text-text-3 mt-0.5 line-clamp-1 max-w-md">
                        {patch.description}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono text-ink-700 font-semibold">
                      {patch.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <Chip label={patch.category} category={patch.category} size="sm" />
                    </td>

                    {/* Stock with Inline Editing */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div
                          className="inline-flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="number"
                            min={0}
                            max={9999}
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveStock(patch.sku);
                              if (e.key === 'Escape') setEditingSku(null);
                            }}
                            className="w-18 h-8 px-2 text-right font-bold font-mono text-sm border border-thread-600 rounded bg-paper-0 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveStock(patch.sku)}
                            className="p-1 rounded bg-thread-600 text-paper-0 hover:bg-thread-700"
                            title="Save stock"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSku(null)}
                            className="p-1 rounded text-text-3 hover:text-ink-900"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(patch);
                          }}
                          className="group inline-flex items-center gap-1.5 font-display font-bold text-sm text-ink-900 tabular-nums px-2 py-1 rounded hover:bg-paper-100 hover:ring-1 hover:ring-border-strong transition-all"
                          title="Click to inline edit stock count"
                        >
                          <span>{patch.stock}</span>
                          <Edit2 className="w-3 h-3 text-text-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gold-500/10 text-gold-600 border border-gold-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-success/10 text-status-success border border-status-success/30">
                          Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patch Detail Drawer */}
      <Drawer
        isOpen={!!selectedPatch}
        onClose={() => setSelectedPatch(null)}
        title={selectedPatch?.name}
        subtitle={`${selectedPatch?.sku} · ${selectedPatch?.category}`}
      >
        {selectedPatch && (
          <div className="space-y-6 text-xs font-ui">
            <div className="flex items-center justify-center p-6 bg-paper-100 rounded-xl border border-border">
              <PatchArt
                sku={selectedPatch.sku}
                category={selectedPatch.category}
                shape={selectedPatch.shape}
                size={96}
              />
            </div>

            <div className="p-4 bg-paper-100 rounded-lg border border-border space-y-2">
              <span className="text-sm font-semibold text-ink-900 block font-display">
                Patch Specifications
              </span>
              <p className="text-text-2 leading-relaxed">{selectedPatch.description}</p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-text-3">Shape:</span>
                <span className="font-semibold text-ink-900 capitalize">
                  {selectedPatch.shape}
                </span>
                <span className="text-text-3 ml-4">Category:</span>
                <Chip label={selectedPatch.category} category={selectedPatch.category} size="sm" />
              </div>
            </div>

            <div className="p-4 bg-paper-0 border border-border rounded-lg space-y-2">
              <span className="text-xs font-semibold text-ink-900 block uppercase tracking-wider">
                Current Inventory Balance
              </span>
              <div className="text-2xl font-bold font-display text-ink-900 tabular-nums">
                {selectedPatch.stock} units
              </div>
              <p className="text-[11px] text-text-3">
                Minimum reorder threshold is 50 units. When stock falls below 50, an alert is triggered in the Owner Console.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
