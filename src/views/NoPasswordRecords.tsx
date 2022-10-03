import type { FC } from "react";
import { List, ActionPanel, Icon } from "@raycast/api";
import { NewRecordAction, NewDocumentAction, ManageDocumentsAction, RefreshLocalReferencesActions } from "../actions";

interface Props {
  documentName: string;
}

export const NoPasswordRecords: FC<Props> = ({ documentName }) => {
  return (
    <List
      actions={
        <ActionPanel title="RayPass Actions">
          <NewRecordAction />
          <NewDocumentAction />
          <ManageDocumentsAction />
          <RefreshLocalReferencesActions />
        </ActionPanel>
      }
    >
      <List.EmptyView
        icon={Icon.MagnifyingGlass}
        title="No password records"
        description={`There are no password records in the current document (${documentName}). Create a new password record (⌘N) or open an existing document with password records (⌘O).`}
      />
    </List>
  );
};
