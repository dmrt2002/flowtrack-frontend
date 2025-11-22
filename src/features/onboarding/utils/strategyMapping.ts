/**
 * Mapping between frontend strategy IDs and backend strategy IDs
 * Frontend uses user-friendly names, backend uses technical names
 */

export type FrontendStrategyId = 'gatekeeper' | 'nurturer' | 'closer';
export type BackendStrategyId =
  | 'inbound-leads'
  | 'outbound-sales'
  | 'customer-nurture';

const frontendToBackendMap: Record<FrontendStrategyId, BackendStrategyId> = {
  gatekeeper: 'inbound-leads',
  nurturer: 'customer-nurture',
  closer: 'outbound-sales',
};

const backendToFrontendMap: Record<BackendStrategyId, FrontendStrategyId> = {
  'inbound-leads': 'gatekeeper',
  'customer-nurture': 'nurturer',
  'outbound-sales': 'closer',
};

/**
 * Convert frontend strategy ID to backend strategy ID
 */
export function toBackendStrategyId(
  frontendId: FrontendStrategyId
): BackendStrategyId {
  return frontendToBackendMap[frontendId];
}

/**
 * Convert backend strategy ID to frontend strategy ID
 */
export function toFrontendStrategyId(
  backendId: BackendStrategyId
): FrontendStrategyId {
  return backendToFrontendMap[backendId];
}
