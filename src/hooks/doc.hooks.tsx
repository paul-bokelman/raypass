import { usePromise } from "@raycast/utils";
import { popToRoot, useNavigation, showToast, Toast } from "@raycast/api";
import { docs, local } from "../utils";
import { documentStore } from "../context";
import { Documents, NoDocument } from "../views";

export const useDocuments = () => {
  const { push } = useNavigation();
  return usePromise(
    async () => {
      const { activeRef, documents } = await docs.index();
      if (documents.length === 0 && activeRef === null) {
        push(<NoDocument />);
      }
      if (!activeRef) {
        await showToast(Toast.Style.Failure, "No active document", "Please select or create a document");
        const refs = await local.docs.refresh();
        console.log("refs", refs);
        return refs;
      }

      return documents;
    },
    [],
    {
      onError: async () => {
        await showToast(Toast.Style.Failure, "Error", "An error occurred while fetching documents.");
        popToRoot(); //? push to view instead?
      },
    }
  );
};

export const useActiveRef = (options?: { set: boolean }) => {
  const { push } = useNavigation();
  return usePromise(
    async () => {
      const ref = await local.docs.active();
      if (!ref) push(<Documents />);
      if (options?.set) documentStore.setState({ ref, password: undefined });
      return ref;
    },
    [],
    {
      onError: async () => {
        await showToast(Toast.Style.Failure, "Failed to get active ref");
        return;
      },
    }
  );
};
