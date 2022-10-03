import type { FC } from "react";
import { List, ActionPanel, Icon, Color } from "@raycast/api";
import { useDocuments } from "../hooks";
import {
  DeleteDocumentAction,
  SetActiveDocument,
  ShowDocument,
  RefreshLocalReferencesActions,
  NewDocumentAction,
} from "../actions";

export const Documents: FC = () => {
  const { data: documents, isLoading } = useDocuments();

  if (!documents) return null; // documents will never be undefined but this makes ts happy

  return (
    <List isLoading={isLoading} navigationTitle="Manage Documents" searchBarPlaceholder="Search Documents">
      <List.Section title="Documents">
        {documents
          .sort((a, b) => {
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            return a.name.localeCompare(b.name);
          })
          .map(({ name, isActive, isEncrypted }) => {
            return (
              <List.Item
                key={name}
                subtitle={isActive ? "Active" : undefined}
                title={name}
                icon={{ source: Icon.Document, tintColor: isActive ? Color.Green : Color.SecondaryText }}
                accessories={[
                  { text: isEncrypted ? "Encrypted" : "Plain", icon: isEncrypted ? Icon.Lock : Icon.LockUnlocked },
                ]}
                actions={
                  <ActionPanel>
                    <ActionPanel.Section title="Manage Document">
                      <SetActiveDocument documentName={name} isActive={isActive} />
                      <DeleteDocumentAction documentName={name} />
                      <ShowDocument name={name} />
                    </ActionPanel.Section>
                    <ActionPanel.Section title="RayPass Actions">
                      <NewDocumentAction />
                      <RefreshLocalReferencesActions />
                    </ActionPanel.Section>
                  </ActionPanel>
                }
              />
            );
          })}
      </List.Section>
    </List>
  );
};
