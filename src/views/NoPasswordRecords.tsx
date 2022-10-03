import type { FC } from "react";
import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { NewRecordForm, NewDocumentForm, SelectExistingDocument } from ".";

interface Props {
  documentName: string;
}

export const NoPasswordRecords: FC<Props> = ({ documentName }) => {
  return (
    <List
      actions={
        <ActionPanel title="RayPass Actions">
          <Action.Push
            icon={Icon.PlusCircle}
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            title="New Record"
            target={<NewRecordForm />}
          />
          <Action.Push
            icon={Icon.Switch}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            title="Switch Document"
            target={<SelectExistingDocument />}
          />
          <Action.Push
            icon={Icon.NewDocument}
            shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
            title="New Document"
            target={<NewDocumentForm />}
          />
        </ActionPanel>
      }
    >
      <List.EmptyView
        icon={{ source: Icon.MagnifyingGlass }}
        title="No password records"
        description={`There are no password records in the current document (${documentName}). Create a new password record or open an existing document with password records.`}
      />
    </List>
  );
};
