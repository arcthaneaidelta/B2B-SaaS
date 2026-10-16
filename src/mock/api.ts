import { useDemoStore } from '../data/store';
import { PatchRecord } from '../data/schema';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RegistrationPayload {
  firstName: string;
  lastInitial: string;
  gradYear: string;
  schoolId: string;
  sportOrProgram: string;
  patchSku: string;
  quantity?: number;
}

export interface OrderItemPayload {
  patchSku: string;
  quantity: number;
}

export interface OrderPayload {
  schoolId: string;
  contactName: string;
  contactEmail: string;
  contactRole: string;
  sportOrProgram?: string;
  notes?: string;
  items: OrderItemPayload[];
}

export async function checkDuplicate(
  student: string,
  gradYear: string,
  schoolId: string,
  patchSku: string
): Promise<{ isDuplicate: boolean; existingRef?: string; existingDate?: string }> {
  await delay(120);
  const records = useDemoStore.getState().records;
  const match = records.find(
    (r) =>
      r.recordType === 'Registration' &&
      r.student.toLowerCase() === student.toLowerCase() &&
      r.gradYear === gradYear &&
      r.schoolId === schoolId &&
      r.patchSku === patchSku
  );

  if (match) {
    return {
      isDuplicate: true,
      existingRef: match.ref,
      existingDate: new Date(match.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  }
  return { isDuplicate: false };
}

export async function submitRegistration(payload: RegistrationPayload): Promise<{
  ok: boolean;
  ref: string;
  record: PatchRecord;
}> {
  // Simulate network latency (400-800ms)
  const simulatedDelay = 400 + Math.floor(Math.random() * 400);
  await delay(simulatedDelay);

  // Check URL fail simulation ?fail=1
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('fail') === '1') {
    throw new Error("We couldn't save that. Your answers are kept: try again.");
  }

  const studentName = `${payload.firstName.trim()} ${payload.lastInitial.trim().toUpperCase()}.`;

  const result = useDemoStore.getState().addRegistration({
    student: studentName,
    gradYear: payload.gradYear,
    schoolId: payload.schoolId,
    sportOrProgram: payload.sportOrProgram,
    patchSku: payload.patchSku,
    quantity: payload.quantity || 1,
  });

  return result;
}

export async function submitOrder(payload: OrderPayload): Promise<{
  ok: boolean;
  ref: string;
  totalQuantity: number;
}> {
  const simulatedDelay = 500 + Math.floor(Math.random() * 400);
  await delay(simulatedDelay);

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('fail') === '1') {
    throw new Error("We couldn't save that order. Please check your connection and try again.");
  }

  const result = useDemoStore.getState().addOrder(payload);
  return result;
}
