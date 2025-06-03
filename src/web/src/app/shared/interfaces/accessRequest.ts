export interface AccessRequest {
  id: number;
  material_id: number;
  requester_id: number;
  justification?: string;
  status: string;
  created_at: string;
  updated_at: string;
}
