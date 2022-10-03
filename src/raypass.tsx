import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { local } from "./utils";
import { PasswordRecords, NoDocument } from "./views";
import { documentStore } from "./context";

export default function Command() {
  const {
    isLoading,
    data: ref,
    error,
  } = usePromise(async () => {
    const ref = await local.docs.active();
    documentStore.setState({ ref });
    return ref;
  });

  if (isLoading) return <List isLoading={true} />;

  if (error || !ref) return <NoDocument />;

  return <PasswordRecords />;
}
