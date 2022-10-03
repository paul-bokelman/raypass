import type { PasswordRecord, LocalDocumentReference } from "../types";
import fs from "node:fs";
import { nanoid } from "nanoid";
import { showToast, Toast } from "@raycast/api";
import { docs, local, c } from ".";

const getRecords = async ({
  password,
}: {
  password?: string;
}): Promise<{ ref: LocalDocumentReference | null; records: PasswordRecord[] | null }> => {
  const ref = await local.docs.active();
  if (!ref) {
    await showToast(Toast.Style.Failure, "Error", "No active document");
    return { ref: null, records: null };
  }

  try {
    const { records } = await docs.get({ documentName: ref.name, password: ref.isEncrypted ? password : undefined });
    return { ref, records };
  } catch (error) {
    await showToast(Toast.Style.Failure, "Error", "Could not get records");
    return { ref, records: [] };
  }
};

const editRecord = async ({
  id,
  record,
  password,
}: {
  id: string;
  record: Omit<PasswordRecord, "id">;
  password?: string;
}): Promise<{ success: boolean }> => {
  const { ref, records: currentRecords } = await getRecords({ password });

  if (!ref) throw new Error("No active document");
  if (!currentRecords) throw new Error("No records found in active document");

  const updatedDocument = currentRecords.map((currentRecord) => {
    if (currentRecord.id === id) {
      return { ...currentRecord, ...record };
    }
    return currentRecord;
  });

  try {
    const payload = JSON.stringify(updatedDocument);
    const data = ref.isEncrypted && password ? c.encrypt({ text: payload, password }) : payload;

    await fs.promises.writeFile(ref.location, data, "utf-8");
    await showToast(Toast.Style.Success, "Record Edited", `Password record ${id} edited in ${ref.name}`);
    return { success: true };
  } catch (error) {
    await showToast(Toast.Style.Failure, "Error", `Could not edit record ${id} in ${ref.name}`);
    return { success: false };
  }
};

const deleteRecord = async ({ id, password }: { id: string; password?: string }): Promise<{ success: boolean }> => {
  const { ref, records } = await getRecords({ password });
  if (!ref) throw new Error("No active document");
  if (!records) throw new Error("No records found in active document");

  const updatedDocument = records.filter((record) => record.id !== id);

  if (ref.isEncrypted && !password) {
    await showToast(Toast.Style.Failure, "Error", "Document is encrypted, please provide password");
    return { success: false };
  }

  try {
    const payload = JSON.stringify(updatedDocument);
    const data = ref.isEncrypted && password ? c.encrypt({ text: payload, password }) : payload;
    await fs.promises.writeFile(ref.location, data, "utf-8");
    await showToast(Toast.Style.Success, "Record deleted", `Password record ${id} deleted from ${ref.name}`);
    return { success: true };
  } catch (error) {
    await showToast(Toast.Style.Failure, "Error", `Could not delete record ${id} from ${ref.name}`);
    return { success: false };
  }
};

const createRecord = async ({
  record,
  password,
}: {
  record: Omit<PasswordRecord, "id">;
  password?: string;
}): Promise<void> => {
  const activeRef = await local.docs.active();
  if (!activeRef) {
    await showToast(Toast.Style.Failure, "Error", "No active document");
    throw new Error("No active document");
  }

  const { name, isEncrypted } = activeRef;

  if (isEncrypted && !password) {
    await showToast(Toast.Style.Failure, "Error", "Document is encrypted, please provide password");
    throw new Error("Document is encrypted, please provide password");
  }

  const { location, records: currentRecords } = await docs.get({
    documentName: name,
    password: isEncrypted ? password : undefined,
  });
  const updatedDocument = [...currentRecords, { ...record, id: nanoid() }];

  try {
    const payload = JSON.stringify(updatedDocument);
    const data = isEncrypted && password ? c.encrypt({ text: payload, password }) : payload;

    await fs.promises.writeFile(location, data, "utf-8");

    await showToast(Toast.Style.Success, "Password added", `Password record added to ${name}`);
    return;
  } catch (error) {
    await showToast(Toast.Style.Failure, "Error", `Could not append to document at ${location}`);
    throw new Error(`Could not append to document at ${location}`);
  }
};

export const records = {
  create: createRecord,
  edit: editRecord,
  delete: deleteRecord,
  get: getRecords,
};
