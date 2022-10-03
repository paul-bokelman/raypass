import { usePromise } from "@raycast/utils";
import { useNavigation } from "@raycast/api";
import { docs } from "../utils";
import { documentStore } from "../context";
import { Documents, NoPasswordRecords, EncryptedPasswordForm } from "../views";

export const useRecords = () => {
  const { push } = useNavigation();
  const { ref, password } = documentStore.getState();
  const encryptedWithNoPassword = ref && ref.isEncrypted && !password;

  return usePromise(
    async (password: string | undefined) => {
      const { name, location, records } = await docs.get({ documentName: ref?.name || "_", password }); // hacky but ref is always defined but typescript doesn't know
      return { document: { name, location }, records };
    },
    [password],
    {
      onWillExecute: () => {
        if (!ref) return push(<Documents />);
        if (encryptedWithNoPassword) {
          return push(<EncryptedPasswordForm documentName={ref.name} />);
        }
      },
      onData: ({ document, records }) => {
        if (records.length === 0) {
          return push(<NoPasswordRecords documentName={document.name} />);
        }
      },
      onError: () => {
        if (encryptedWithNoPassword) {
          return push(<EncryptedPasswordForm documentName={ref.name} />);
        }
        return push(<Documents />);
      },
    }
  );
};
