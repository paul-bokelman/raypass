import type { LocalDocumentReferences, NewDocumentData, PasswordRecord } from "../types";
import fs from "node:fs";
import os from "node:os";
import { local, c, misc } from ".";
import { documentStore } from "../context";

const root = os.homedir();
const baseDir = `${root}/.raypass`;

const documentDir = ({ name, encrypted }: { name: string; encrypted: boolean }) => {
  const location = `${baseDir}/${name}.${encrypted ? "enc" : "json"}`;
  return {
    root,
    baseDir,
    docLocation: location,
  };
};

//! delete document

const createDocument = async ({ name, password }: NewDocumentData): Promise<boolean> => {
  const { baseDir, docLocation } = documentDir({ name, encrypted: password ? true : false });

  if (!fs.existsSync(baseDir)) {
    try {
      await fs.promises.mkdir(baseDir);
    } catch (error) {
      throw new Error(`Could not create directory at ${baseDir}`);
    }
  }

  if (fs.existsSync(docLocation)) {
    throw new Error(`Document already exists at ${docLocation}`);
  }

  try {
    const payload = JSON.stringify([]);
    const data = password ? c.encrypt({ text: payload, password }) : payload;

    await fs.promises.writeFile(docLocation, data, "utf-8");
    await local.docs.append({ name, location: docLocation, isEncrypted: password ? true : false });
  } catch (error) {
    console.log(error);
    throw new Error(`Could not create document at ${docLocation}`);
  }

  return true;
};

const deleteDocument = async ({ documentName }: { documentName: string }): Promise<boolean> => {
  const { selected } = await local.docs.get([documentName]);

  if (selected.length === 0) return false;

  const { docLocation } = documentDir({ name: documentName, encrypted: selected[0].isEncrypted });

  if (!fs.existsSync(docLocation)) return false;

  try {
    await local.docs.remove({ documentName });
    await fs.promises.unlink(docLocation);
    return true;
  } catch (error) {
    return false;
  }
};

const setActiveDocument = async ({ documentName }: { documentName: string }): Promise<void> => {
  try {
    const { all: refs } = await local.docs.get();

    const needsNewRef = refs.length === 0 || refs.filter((ref) => ref.name === documentName).length === 0;

    const ref = !needsNewRef
      ? await local.docs.edit({ name: documentName, data: { isActive: true } })
      : await local.docs.append({
          name: documentName,
          location: `${baseDir}/${documentName}`,
          isEncrypted: misc.isEncrypted(documentName),
        });

    documentStore.setState({ ref, password: undefined });
  } catch (error) {
    throw new Error(`Could not set ${documentName} as active document`);
  }
};

const getDocument = async ({ documentName, password }: { documentName: string; password?: string }) => {
  const { all, selected } = await local.docs.get([documentName]);

  if (all.length === 0 || selected.length === 0) {
    throw new Error("No local document found");
  }

  const { name, location, isEncrypted } = selected[0];

  if (isEncrypted && !password) {
    throw new Error("Document is encrypted, and no password was provided");
  }

  try {
    const data = await fs.promises.readFile(location, "utf-8");

    const records =
      isEncrypted && password ? c.decrypt({ text: data, password }) : (JSON.parse(data) as Array<PasswordRecord>);

    return { name, location, records };
  } catch (error) {
    throw new Error(`Could not read document at ${location}`);
  }
};

const documentNameCollision = async ({ name }: { name: string }): Promise<boolean> => {
  const indexedDocs = await indexDocumentDirectory();
  if (!indexedDocs) return false;
  const { documents } = indexedDocs;
  return documents.filter((doc) => doc.name === name).length > 0;
};

const indexDocumentDirectory = async (): Promise<{
  activeRef: boolean;
  documents: LocalDocumentReferences;
}> => {
  const active = await local.docs.active();

  if (!fs.existsSync(baseDir)) {
    throw new Error(`No documents found at ${baseDir}`);
  }

  try {
    const documentNames = await fs.promises.readdir(baseDir);
    if (documentNames.length === 0) return { activeRef: !!active, documents: [] };
    const documents = documentNames.map((name) => {
      const isActive = active ? active.name === name : documentNames[0] === name;
      return { name, isActive, location: misc.getDocLocation(name), isEncrypted: misc.isEncrypted(name) };
    });

    return { activeRef: !!active, documents };
  } catch (error) {
    throw new Error(`Could not read documents at ${baseDir}`);
  }
};

const getActiveDocument = async ({
  password,
}: {
  password?: string;
}): Promise<{ exists: boolean; name: string; records: Array<PasswordRecord>; isEncrypted: boolean }> => {
  const ref = await local.docs.active();
  if (!ref) return { exists: false, name: "", records: [], isEncrypted: false };

  try {
    const { records } = await getDocument({ documentName: ref.name, password: ref.isEncrypted ? password : undefined });
    return { exists: true, name: ref.name, records, isEncrypted: ref.isEncrypted };
  } catch (error) {
    // unsafe?
    return { exists: true, name: "", records: [], isEncrypted: ref.isEncrypted };
  }
};

export const docs = {
  new: createDocument,
  get: getDocument,
  delete: deleteDocument,
  collision: documentNameCollision,
  set: setActiveDocument,
  index: indexDocumentDirectory,
  active: getActiveDocument,
};
