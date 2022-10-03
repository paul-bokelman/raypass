import type { FC } from "react";
import { List, Action, ActionPanel, Icon, Color, useNavigation, showToast, Toast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { docs, misc } from "../utils";
import Command from "../raypass";
import { NewDocumentForm } from "./NewDocumentForm";

export const SelectExistingDocument: FC = () => {
  const { push } = useNavigation();

  const { data: documents, isLoading } = usePromise(async () => {
    const indexedDocs = await docs.index();
    if (!indexedDocs) {
      await showToast(Toast.Style.Failure, "No documents found", "Please create a new document.");
      return push(<NewDocumentForm />);
    }
    return indexedDocs;
  });

  const setAsActive = async ({ documentName, isActive }: { documentName: string; isActive: boolean }) => {
    if (isActive) {
      return push(<Command />);
    }

    try {
      await docs.set({ documentName });
      return push(<Command />);
    } catch (err) {
      console.log(err);
      return;
    }
  };

  if (isLoading || !documents) return <List isLoading={true} />;

  const { active, documentNames } = documents;

  // sort documents by active
  const sortedDocuments = documentNames.sort((a, b) => {
    if (a === active) return -1;
    if (b === active) return 1;
    return 0;
  });

  return (
    <List isLoading={isLoading} navigationTitle="Switch Document">
      <List.Section title="Documents">
        {sortedDocuments.map((name) => {
          const isActive = active === name;
          const isEncrypted = misc.isEncrypted(name);
          return (
            <List.Item
              key={name}
              subtitle={isActive ? "Active" : undefined}
              title={name}
              icon={{ source: Icon.Document, tintColor: isActive ? Color.Green : Color.SecondaryText }}
              accessories={[
                { text: isEncrypted ? "Encrypted" : "Plain", icon: isEncrypted ? Icon.Lock : Icon.LockUnlocked },
                // { text: "73 Records", icon: Icon.Key },
              ]}
              actions={
                <ActionPanel>
                  <Action
                    icon={Icon.SaveDocument}
                    title="Select"
                    onAction={() => setAsActive({ documentName: name, isActive })}
                  />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
    </List>
  );
};
