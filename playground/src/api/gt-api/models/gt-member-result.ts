import type { GtMemberModel } from '#/api/gt-api/models/gt-member-model';

export interface GtMemberResult {
  data: GtMemberModel;
  msg: string;
  status: string;
}
