import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/demo-store';
import { DEMO_PERSONAS } from '../../data/personas';
import { PersonaRole } from '../../types';
import { Users, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { ResetModal } from '../ui/ResetModal';

export const PersonaSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const currentPersona = DEMO_PERSONAS.find(p => p.id === state.currentPersona) || DEMO_PERSONAS[0];

  const handleSelect = (role: PersonaRole, defaultPath: string) => {
    dispatch({ type: 'SWITCH_PERSONA', payload: role });
    setIsOpen(false);
    navigate(defaultPath);
  };

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#E5E5DD] bg-white hover:bg-[#FAF9F6] transition-colors shadow-xs ${
            compact ? 'text-xs' : 'text-sm'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-[#E7EEE7] text-[#24483D] font-bold text-xs flex items-center justify-center border border-[#C5D9C5]">
            {currentPersona.avatarInitials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-semibold text-[#28332F] leading-tight text-xs flex items-center gap-1.5">
              <span>{currentPersona.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#E7EEE7] text-[#24483D] rounded font-medium">
                {currentPersona.id.toUpperCase()}
              </span>
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#777F79]" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E5DD] rounded-xl shadow-xl z-50 p-2 animate-fade-in">
              <div className="px-3 py-2 border-b border-[#E5E5DD]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#777F79] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#24483D]" />
                  Switch Demo Persona
                </p>
                <p className="text-[11px] text-[#777F79] mt-0.5">
                  Convenience switcher for exploring client workflows
                </p>
              </div>

              <div className="py-1 space-y-1">
                {DEMO_PERSONAS.map(p => {
                  const isCurrent = p.id === state.currentPersona;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(p.id, p.defaultPath)}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-3 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#E7EEE7]/80 text-[#24483D]'
                          : 'hover:bg-[#FAF9F6] text-[#28332F]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCurrent
                            ? 'bg-[#24483D] text-white'
                            : 'bg-[#F0EFEB] text-[#777F79] border border-[#DDDCD4]'
                        }`}
                      >
                        {p.avatarInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-[#28332F]">{p.name}</span>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[#24483D]" />}
                        </div>
                        <p className="text-[11px] text-[#356653] font-medium">{p.roleTitle}</p>
                        <p className="text-[10px] text-[#777F79] mt-0.5 line-clamp-2">
                          {p.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#E5E5DD] mt-1 px-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowResetModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-[#A84F4B] hover:bg-[#FDF2F2] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo State to Baseline</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ResetModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
    </>
  );
};
