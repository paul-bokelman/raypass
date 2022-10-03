import { List } from "@raycast/api";
import { PasswordRecords, NoDocument } from "./views";
import { useActiveRef } from "./hooks";

export default function Command() {
  const { isLoading, data: ref, error } = useActiveRef({ set: true });

  if (isLoading) return <List isLoading={true} />;
  if (error || !ref) return <NoDocument />;
  return <PasswordRecords />;
}
