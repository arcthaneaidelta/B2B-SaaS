import React, { useState } from 'react';
import { useDemoStore } from '../../data/store';
import { selectSchoolsWithRollups, SchoolWithRollup } from '../../data/selectors';
import { School } from '../../data/schema';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Drawer } from '../../components/ui/Drawer';
import { useToast } from '../../components/ui/Toast';
import {
  School as SchoolIcon,
  Search,
  Plus,
  ArrowUpDown,
  Mail,
  Award,
  Package,
  Sparkles,
} from 'lucide-react';

export const SchoolsPage: React.FC = () => {
  const { schools, records, addSchool } = useDemoStore();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'totalPatchesOrdered'>('totalPatchesOrdered');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modals & Drawers
  const [addSchoolModalOpen, setAddSchoolModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolWithRollup | null>(null);

  // New school form state
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newConference, setNewConference] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  const schoolsWithRollups = selectSchoolsWithRollups(schools, records);

  // Filter & sort
  const filtered = schoolsWithRollups
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.conference.toLowerCase().includes(search.toLowerCase()) ||
        s.contact.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const mult = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'name') return a.name.localeCompare(b.name) * mult;
      return (a.totalPatchesOrdered - b.totalPatchesOrdered) * mult;
    });

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    const created = addSchool({
      name: newSchoolName.trim(),
      conference: newConference.trim() || 'Independent Conference',
      contact: newContact.trim() || 'Athletic Director',
      contactEmail: newContactEmail.trim() || 'contact@school.example',
    });

    addToast({
      type: 'success',
      title: 'School added to directory',
      description: `${created.name} (${created.id}) is now available in registration and ordering forms.`,
    });

    setAddSchoolModalOpen(false);
    setNewSchoolName('');
    setNewConference('');
    setNewContact('');
    setNewContactEmail('');
  };

  return (
    <div className="space-y-6 font-ui">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-ink-900">
            Schools Directory
          </h2>
          <p className="text-xs text-text-2 mt-0.5">
            Partner high schools with live order rollup calculations from the Orders ledger.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          onClick={() => setAddSchoolModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-semibold"
        >
          Add High School
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-paper-0 p-3 sm:p-4 rounded-lg border border-border flex items-center justify-between gap-3 shadow-sh-1">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-3 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search school name, conference, or AD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm bg-paper-100 border border-border rounded-md text-ink-900 focus:outline-none focus:border-thread-600"
          />
        </div>

        <div className="text-xs text-text-3 font-medium">
          Showing {filtered.length} of {schools.length} schools
        </div>
      </div>

      {/* Desktop Spreadsheet Table */}
      <div className="bg-paper-0 rounded-lg border border-border shadow-sh-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead className="bg-paper-100 border-b border-border text-text-3 select-none">
              <tr>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-ink-900"
                  onClick={() => {
                    if (sortField === 'name') {
                      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                    } else {
                      setSortField('name');
                      setSortDirection('asc');
                    }
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>School Name</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Conference / League</th>
                <th className="py-3 px-4 font-semibold">Primary Athletic Contact</th>
                <th
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-ink-900"
                  onClick={() => {
                    if (sortField === 'totalPatchesOrdered') {
                      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                    } else {
                      setSortField('totalPatchesOrdered');
                      setSortDirection('desc');
                    }
                  }}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Patches Ordered</span>
                    <span className="text-[10px] bg-paper-0 px-1 py-0.5 rounded border border-border uppercase font-mono text-thread-600">
                      Auto
                    </span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Student Registrations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((school) => (
                <tr
                  key={school.id}
                  onClick={() => setSelectedSchool(school)}
                  className="hover:bg-paper-100/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-ink-900 flex items-center gap-2">
                      <SchoolIcon className="w-4 h-4 text-text-3 flex-shrink-0" />
                      <span>{school.name}</span>
                    </div>
                    <span className="text-[10px] text-text-3 font-mono">{school.id}</span>
                  </td>
                  <td className="py-3 px-4 text-text-2">{school.conference}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-ink-900">{school.contact}</div>
                    <div className="text-text-3 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-text-3" />
                      <span>{school.contactEmail}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-display font-bold text-ink-900 text-sm tabular-nums">
                      {school.totalPatchesOrdered}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-display font-medium text-text-2 text-sm tabular-nums">
                      {school.totalRegistrations}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add School Modal */}
      <Modal
        isOpen={addSchoolModalOpen}
        onClose={() => setAddSchoolModalOpen(false)}
        title="Add High School to Directory"
        description="Newly added schools appear immediately in student registration and bulk order dropdowns."
      >
        <form onSubmit={handleCreateSchool} className="space-y-4 font-ui">
          <Input
            label="High School Name"
            placeholder="e.g. Oakridge Senior High School"
            required
            value={newSchoolName}
            onChange={(e) => setNewSchoolName(e.target.value)}
          />

          <Input
            label="Athletic Conference or League"
            placeholder="e.g. Metro Valley Conference"
            value={newConference}
            onChange={(e) => setNewConference(e.target.value)}
          />

          <Input
            label="Athletic Director / Contact Name"
            placeholder="e.g. Coach Sarah Jenkins"
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
          />

          <Input
            label="Contact Email"
            type="email"
            placeholder="sjenkins@oakridge.example"
            value={newContactEmail}
            onChange={(e) => setNewContactEmail(e.target.value)}
          />

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAddSchoolModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Save School
            </Button>
          </div>
        </form>
      </Modal>

      {/* School Detail Drawer */}
      <Drawer
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        title={selectedSchool?.name}
        subtitle={selectedSchool?.conference}
      >
        {selectedSchool && (
          <div className="space-y-6 text-xs font-ui">
            {/* Contact Details */}
            <div className="p-3.5 bg-paper-100 rounded-lg border border-border space-y-1.5">
              <span className="font-semibold text-ink-900 block text-sm">Athletic Leadership</span>
              <div className="text-ink-900 font-medium">{selectedSchool.contact}</div>
              <div className="text-text-3 font-mono">{selectedSchool.contactEmail}</div>
            </div>

            {/* School Rollups */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-paper-100 rounded-lg border border-border">
                <span className="text-text-3 block text-[11px]">Total Patches Ordered</span>
                <span className="text-2xl font-display font-bold text-thread-600 tabular-nums">
                  {selectedSchool.totalPatchesOrdered}
                </span>
                <span className="text-[10px] text-text-3 block mt-0.5">Computed from Orders table</span>
              </div>
              <div className="p-3.5 bg-paper-100 rounded-lg border border-border">
                <span className="text-text-3 block text-[11px]">Student Registrations</span>
                <span className="text-2xl font-display font-bold text-moss-600 tabular-nums">
                  {selectedSchool.totalRegistrations}
                </span>
                <span className="text-[10px] text-text-3 block mt-0.5">Computed from Registrations</span>
              </div>
            </div>

            {/* Linked Records List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-ink-900 text-sm">Linked Activity for this School:</h4>
              <div className="divide-y divide-border border border-border rounded-lg bg-paper-0 max-h-72 overflow-y-auto p-2">
                {records
                  .filter((r) => r.schoolId === selectedSchool.id)
                  .map((r) => (
                    <div key={r.id} className="py-2.5 px-2 text-xs flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-semibold text-ink-900 truncate">{r.patchName}</div>
                        <div className="text-[11px] text-text-3">
                          {r.recordType === 'Registration' ? (
                            <span>Student: {r.student} ({r.gradYear})</span>
                          ) : (
                            <span>Bulk Order: {r.contactName}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-mono text-xs font-bold text-ink-900">
                          {r.quantity} qty
                        </span>
                        <div className="text-[10px] text-text-3 font-mono">{r.ref}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
