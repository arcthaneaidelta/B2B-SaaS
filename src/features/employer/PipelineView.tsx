import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { PipelineStage, PipelineItem } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Kanban,
  MoreVertical,
  ArrowRight,
  Eye,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';

const PIPELINE_STAGES: PipelineStage[] = [
  'New Match',
  'Shortlisted',
  'Contact Requested',
  'Interview',
  'Decision'
];

export const PipelineView: React.FC = () => {
  const { state, dispatch, showToast } = useDemo();
  const navigate = useNavigate();

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedItemId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (itemId) {
      dispatch({
        type: 'MOVE_PIPELINE_STAGE',
        payload: { itemId, newStage: targetStage }
      });
      setDraggedItemId(null);
    }
  };

  const handleMoveStage = (itemId: string, newStage: PipelineStage) => {
    dispatch({
      type: 'MOVE_PIPELINE_STAGE',
      payload: { itemId, newStage }
    });
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#E7EEE7] text-[#24483D]">
              <Kanban className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#28332F]">
              Recruitment Pipeline
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#777F79] mt-0.5">
            Interactive multi-stage recruitment workflow with drag-and-drop and real-time state logging.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/employer/matches')}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Candidates to Pipeline
        </Button>
      </div>

      {/* Kanban Board Container (5 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start min-h-[620px] overflow-x-auto pb-4">
        {PIPELINE_STAGES.map(stage => {
          const itemsInStage = state.pipeline.filter(p => p.stage === stage);

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, stage)}
              className="bg-[#FAF9F6] border border-[#E5E5DD] rounded-xl p-3 flex flex-col min-w-[240px] max-w-full min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E5E5DD]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#28332F]">{stage}</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-white rounded-full border border-[#E5E5DD] text-[#777F79]">
                    {itemsInStage.length}
                  </span>
                </div>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1">
                {itemsInStage.map(item => {
                  const cand = state.candidates.find(c => c.id === item.candidateId);
                  if (!cand) return null;

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={e => handleDragStart(e, item.id)}
                      className="bg-white border border-[#E5E5DD] rounded-xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative group space-y-2.5"
                    >
                      {/* Top info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-[#24483D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {cand.initials}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#28332F] hover:text-[#24483D] cursor-pointer"
                                onClick={() => navigate(`/app/employer/candidates/${cand.id}`)}>
                              {cand.name}
                            </h4>
                            <p className="text-[10px] text-[#356653] font-medium truncate max-w-[140px]">
                              {cand.title}
                            </p>
                          </div>
                        </div>

                        {/* Stage Move Menu Trigger */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                            className="p-1 rounded text-[#777F79] hover:text-[#28332F] hover:bg-[#FAF9F6]"
                            aria-label="Change stage"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {activeMenuId === item.id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E5DD] rounded-lg shadow-xl z-40 p-1 text-[11px] space-y-0.5">
                                <p className="px-2 py-1 font-bold text-[#777F79] uppercase text-[9px]">
                                  Move to Stage:
                                </p>
                                {PIPELINE_STAGES.map(s => (
                                  <button
                                    key={s}
                                    disabled={s === stage}
                                    onClick={() => handleMoveStage(item.id, s)}
                                    className={`w-full text-left px-2 py-1 rounded transition-colors ${
                                      s === stage
                                        ? 'opacity-40 font-semibold'
                                        : 'hover:bg-[#FAF9F6] text-[#28332F]'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status and Score */}
                      <div className="flex items-center justify-between text-[11px]">
                        <StatusBadge status={cand.verificationLevel} size="sm" />
                        <span className="font-bold text-[#24483D]">{item.matchScore}% Match</span>
                      </div>

                      {item.notes && (
                        <p className="text-[10px] text-[#777F79] line-clamp-2 leading-relaxed bg-[#FAF9F6] p-1.5 rounded">
                          {item.notes}
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-between text-[10px] text-[#777F79] border-t border-[#E5E5DD]/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.updatedAt}
                        </span>
                        <button
                          onClick={() => navigate(`/app/employer/candidates/${cand.id}`)}
                          className="font-semibold text-[#24483D] hover:underline"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}

                {itemsInStage.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#777F79] border border-dashed border-[#E5E5DD] rounded-lg">
                    Drop candidates here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
