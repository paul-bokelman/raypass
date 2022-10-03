import type { LocalDocumentReference, LocalDocumentReferences } from "../types";
import { LocalStorage, showToast, Toast } from "@raycast/api";

export const referenceKey = "doc_refs";

const createLocalDocumentReference = async (): Promise<void> => {
  try {
    await LocalStorage.setItem(referenceKey, JSON.stringify([]));
    return;
  } catch (error) {
    const msg = "Could not create local document reference";
    await showToast(Toast.Style.Failure, "Error", msg);
    throw new Error(msg);
  }
};

const removeLocalDocumentReference = async ({ name }: { name: string }) => {
  const { all, selected } = await getLocalDocumentReferences(["name"]);
  if (selected.length === 0) return;

  if (selected[0].isActive) {
    const msg = `Switch active document before deleting (${name})`;
    await showToast(Toast.Style.Failure, "Error", msg);
    throw new Error(msg);
  }

  const newRefs = all.filter((ref) => ref.name !== name);

  try {
    await LocalStorage.setItem(referenceKey, JSON.stringify(newRefs));
    return;
  } catch (error) {
    const msg = `Could not remove local document reference for ${name}`;
    await showToast(Toast.Style.Failure, "Error", msg);
    throw new Error(msg);
  }
};

const appendLocalDocumentReference = async ({
  name,
  location,
  isEncrypted,
}: Omit<LocalDocumentReference, "isActive">): Promise<LocalDocumentReference> => {
  try {
    const { all } = await getLocalDocumentReferences([name]);

    const ref = { name, location, isEncrypted, isActive: true };

    const refs =
      all.length !== 0
        ? all
            .map((ref) => {
              return { ...ref, isActive: false };
            })
            .concat(ref)
        : [ref];

    await LocalStorage.setItem(referenceKey, JSON.stringify(refs));

    return ref;
  } catch (error) {
    console.log(error);
    const msg = `Failed to edit local document reference (${name})`;
    await showToast(Toast.Style.Failure, "Error", msg);
    throw new Error(msg);
  }
};

const editLocalDocumentReference = async ({
  name,
  data,
}: {
  name: string;
  data: Partial<LocalDocumentReference>;
}): Promise<LocalDocumentReference> => {
  try {
    const { all, refCreated } = await getLocalDocumentReferences([name]);
    if (refCreated) throw new Error("Cannot edit docs that do not exist");

    const updatedRefs =
      all.length !== 0
        ? all.map((ref) => {
            if (ref.name === name) return { ...ref, ...data };
            if (data.isActive !== undefined) return { ...ref, isActive: false };
            return ref;
          })
        : [];

    await LocalStorage.setItem(referenceKey, JSON.stringify(updatedRefs));

    return updatedRefs.filter((ref) => ref.name === name)[0];
  } catch (error) {
    console.log(error);
    const msg = `Failed to edit local document reference (${name})`;
    await showToast(Toast.Style.Failure, "Error", msg);
    throw new Error(msg);
  }
};

export const getActiveLocalDocumentReference = async (): Promise<LocalDocumentReference | null> => {
  const { all, refCreated } = await getLocalDocumentReferences();
  if (refCreated) return null;
  const ref = all.find((ref) => ref.isActive);
  if (!ref) return null;
  return ref;
};

const getLocalDocumentReferences = async (
  names?: Array<string>
): Promise<{ all: LocalDocumentReferences; selected: LocalDocumentReferences; refCreated: boolean }> => {
  const refs = await LocalStorage.getItem<string>(referenceKey);
  if (!refs) {
    await createLocalDocumentReference();
    return { all: [], selected: [], refCreated: true };
  }
  const parsedRefs = JSON.parse(refs) as LocalDocumentReferences;
  return {
    all: parsedRefs,
    selected: names ? parsedRefs.filter((ref) => names.includes(ref.name)) : [],
    refCreated: false,
  };
};

export const local = {
  docs: {
    create: createLocalDocumentReference,
    remove: removeLocalDocumentReference,
    append: appendLocalDocumentReference,
    get: getLocalDocumentReferences,
    active: getActiveLocalDocumentReference,
    edit: editLocalDocumentReference,
  },
  user: {}, // user preferences (e.g. default document, use password)
};
