import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  BookmarkCheck,
  Plus,
  Users2,
  Trash2,
  Columns,
  Eye,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale
} from 'lucide-react';

export const ShortlistsView: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();
  const navigate = useNavigate();

  const [activeListId, setActiveListId] = useState<string>(state.shortlists[0]?.id || 'sl-1');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // Comparison State (2 or 3 candidate IDs)
  const [compareCandidateIds, setCompareCandidateIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const activeList = state.shortlists.find(s => s.id === activeListId) || state.shortlists[0];
  const listCandidates = state.candidates.filter(c => activeList?.candidateIds.includes(c.id));

  const handleCreateShortlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    dispatch({
      type: 'CREATE_SHORTLIST',
      payload: {
        name: newListName,
        description: newListDesc,
        candidateIds: []
      }
    });
    setNewListName('');
    setNewListDesc('');
    setShowCreateModal(false);
  };

  const handleRemoveFromList = (candId: string) => {
    dispatch({
      type: 'TOGGLE_SHORTLIST_CANDIDATE',
      payload: { shortlistId: activeList.id, candidateId: candId }
    });
  };

  const toggleCompareCandidate = (candId: string) => {
    if (compareCandidateIds.includes(candId)) {
      setCompareCandidateIds(compareCandidateIds.filter(id => id !== candId));
    } else {
      if (compareCandidateIds.length >= 3) {
        showToast('Maximum 3 candidates can be compared simultaneously', 'warning');
        return;
      }
      setCompareCandidateIds([...compareCandidateIds, candId]);
    }
  };

  const compareCandidates = state.candidates.filter(c => compareCandidateIds.includes(c.id));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">Candidate Shortlists</h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Organize project candidate pools and run side-by-side credential gap comparisons.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {compareCandidateIds.length >= 2 && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Scale className="w-4 h-4" />}
              onClick={() => setShowCompareModal(true)}
            >
              Compare Selected ({compareCandidateIds.length})
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create New Shortlist
          </Button>
        </div>
      </div>

      {/* Shortlist Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E5DD] pb-3 overflow-x-auto">
        {state.shortlists.map(list => {
          const isActive = list.id === activeListId;
          return (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#24483D] text-white shadow-xs'
                  : 'bg-white text-[#777F79] hover:text-[#28332F] border border-[#E5E5DD]'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{list.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FAF9F6] text-[#777F79]'
                }`}
              >
                {list.candidateIds.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active List Information */}
      {activeList && (
        <div className="bg-white border border-[#E5E5DD] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#28332F]">{activeList.name}</h2>
            <p className="text-xs text-[#777F79] mt-0.5">{activeList.description}</p>
          </div>
          <span className="text-xs text-[#777F79]">
            Created {activeList.createdAt} · {activeList.candidateIds.length} candidates saved
          </span>
        </div>
      )}

      {/* Candidate List Cards */}
      {listCandidates.length === 0 ? (
        <div className="bg-white border border-dashed border-[#E5E5DD] rounded-xl p-12 text-center space-y-3">
          <BookmarkCheck className="w-8 h-8 text-[#777F79] mx-auto" />
          <h3 className="text-sm font-bold text-[#28332F]">No candidates shortlisted yet</h3>
          <p className="text-xs text-[#777F79] max-w-sm mx-auto">
            Browse explainable matches and click "Shortlist" to add Swedish technicians to this list.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/employer/matches')}
          >
            Find Candidates to Add
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listCandidates.map(cand => {
            const isCompared = compareCandidateIds.includes(cand.id);

            return (
              <div
                key={cand.id}
                className={`bg-white border rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  isCompared ? 'border-[#24483D] ring-2 ring-[#24483D]/20' : 'border-[#E5E5DD]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#24483D] text-white font-bold text-sm flex items-center justify-center">
                        {cand.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#28332F]">{cand.name}</h4>
                        <p className="text-xs text-[#356653] font-medium">{cand.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromList(cand.id)}
                      className="text-[#777F79] hover:text-[#A84F4B] p-1 rounded transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#777F79]">
                    <span>{cand.location}</span>
                    <span className="font-semibold text-[#24483D]">{cand.availability}</span>
                  </div>

                  <StatusBadge status={cand.verificationLevel} size="sm" />

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">
                      Verified Credentials ({cand.documents.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cand.documents.slice(0, 2).map(doc => (
                        <span
                          key={doc.id}
                          className="px-2 py-0.5 bg-[#FAF9F6] border border-[#E5E5DD] rounded text-[11px] text-[#28332F] truncate max-w-[200px]"
                        >
                          {doc.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E5DD] flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/app/employer/candidates/${cand.id}`)}
                  >
                    View Dossier
                  </Button>
                  <Button
                    variant={isCompared ? 'secondary' : 'outline'}
                    size="sm"
                    icon={<Scale className="w-3.5 h-3.5" />}
                    onClick={() => toggleCompareCandidate(cand.id)}
                  >
                    {isCompared ? 'Selected' : 'Compare'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Comparison Modal (PRD Page 14) */}
      <Modal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        title={
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#24483D]" />
            <span>Candidate Side-by-Side Comparison Matrix</span>
          </div>
        }
        subtitle="Evaluating credentials, experience, availability and evidence gaps"
        maxWidth="4xl"
      >
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5DD] bg-[#FAF9F6]">
                  <th className="py-3 px-4 font-bold text-[#777F79] uppercase tracking-wider w-40">
                    Dimension
                  </th>
                  {compareCandidates.map(cand => (
                    <th key={cand.id} className="py-3 px-4 font-bold text-[#28332F]">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#24483D] text-white font-bold text-[10px] flex items-center justify-center">
                          {cand.initials}
                        </span>
                        <span>{cand.name}</span>
                      </div>
                      <span className="block text-[11px] text-[#356653] font-normal mt-0.5">{cand.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5DD]">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#777F79]">Verification Level</td>
                  {compareCandidates.map(c => (
                    <td key={c.id} className="py-3 px-4">
                      <StatusBadge status={c.verificationLevel} size="sm" />
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#777F79]">Documented Experience</td>
                  {compareCandidates.map(c => (
                    <td key={c.id} className="py-3 px-4 font-semibold text-[#28332F]">
                      {c.experienceYears} Years
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#777F79]">Location & Travel</td>
                  {compareCandidates.map(c => (
                    <td key={c.id} className="py-3 px-4 text-[#28332F]">
                      <p className="font-medium">{c.location}</p>
                      <p className="text-[11px] text-[#777F79]">{c.travelFlexibility}</p>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#777F79]">Availability Readiness</td>
                  {compareCandidates.map(c => (
                    <td key={c.id} className="py-3 px-4 font-bold text-[#24483D]">
                      {c.availability}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#777F79]">Verified Licenses</td>
                  {compareCandidates.map(c => (
                    <td key={c.id} className="py-3 px-4 space-y-1">
                      {c.documents.map(d => (
                        <div key={d.id} className="text-[11px] text-[#28332F] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#24483D] shrink-0" />
                          <span>{d.title}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-[#777F79]">Evidence Gaps / Expiring</td>
                  {compareCandidates.map(c => {
                    const expiring = c.documents.filter(d => d.expiryDate);
                    return (
                      <td key={c.id} className="py-3 px-4 text-[11px] text-[#777F79]">
                        {expiring.length > 0 ? (
                          expiring.map(d => (
                            <span key={d.id} className="block text-[#A87532]">
                              • {d.title} expires {d.expiryDate}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#356653]">No expiring licenses recorded</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#E5E5DD]">
            <Button variant="outline" size="sm" onClick={() => setShowCompareModal(false)}>
              Close Comparison Matrix
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Shortlist Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Shortlist Pool"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateShortlist} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Shortlist Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Scania Södertälje Line 3"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#28332F] mb-1">Description / Project Scope</label>
            <textarea
              rows={3}
              placeholder="Project requirements and timeline notes..."
              value={newListDesc}
              onChange={e => setNewListDesc(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5DD] rounded-lg bg-[#FAF9F6] focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create List
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
