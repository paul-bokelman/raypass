import type { FC } from "react";
import { List, ActionPanel, Icon } from "@raycast/api";
import { NewDocumentAction, RefreshLocalReferencesActions } from "../actions";

export const NoDocument: FC = () => {
  return (
    <List>
      <List.EmptyView
        icon={Icon.BlankDocument}
        actions={
          <ActionPanel title="No document actions">
            <ActionPanel.Section>
              <NewDocumentAction />
              <RefreshLocalReferencesActions />
            </ActionPanel.Section>
          </ActionPanel>
        }
        title="No Documents"
        description="No password documents were found, open the action panel to create a new document (⌘⇧D) or refresh the local references (⌘⇧R)."
      />
    </List>
  );
};
