export interface PasswordRecord {
  id: string;
  name: string;
  username?: string;
  email?: string;
  password: string;
  url?: string;
  notes?: string;
}

export type PasswordRecordData = Omit<PasswordRecord, "id">;
