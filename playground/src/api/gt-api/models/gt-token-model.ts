import type { GtMemberModel } from '#/api/gt-api/models/gt-member-model';

export interface GtTokenModel {
  data: GtMemberModel;
  msg: string;
  status: number;
  token: string;
}
