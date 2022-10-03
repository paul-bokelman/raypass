import { FC } from "react";
import { usePromise } from "@raycast/utils";
import { List, ActionPanel, Color, Icon, useNavigation } from "@raycast/api";
import { docs } from "../utils";
import { NoPasswordRecords, EncryptedPasswordForm, SelectExistingDocument } from ".";
import { PasswordRecord } from "../components";
import { documentStore } from "../context";
import { NewRecordAction, NewDocumentAction, ChangeDocumentAction, RefreshLocalReferencesActions } from "../actions";

export const PasswordRecords: FC = () => {
  const { push } = useNavigation();
  const { ref, password } = documentStore.getState();

  const {
    isLoading,
    data: document,
    revalidate: revalidateDocument,
  } = usePromise(
    async (password: string | undefined) => {
      if (!ref) return push(<SelectExistingDocument />);
      const document = await docs.get({ documentName: ref.name, password });
      return document;
    },
    [password],
    {
      onWillExecute: () => {
        if (ref && ref.isEncrypted && !password) {
          return push(<EncryptedPasswordForm documentName={ref.name} />);
        }
      },
      onError: () => {
        if (ref && ref.isEncrypted && !password) {
          return push(<EncryptedPasswordForm documentName={ref.name} />);
        }
        return push(<SelectExistingDocument />);
      },
    }
  );

  const noPasswordRecords = document && document.records.length === 0;

  const mdCodeTags = {
    document: "`Document`",
    passwordRecord: "`Password Record`",
    code: "```ts\ninterface PasswordRecord {\n  name: string;\n  username?: string;\n  email?: string;\n  password: string;\n  url?: string;\n  notes?: string;\n}\n```",
  };

  const md = `
  # RayPass Reference
  
  ${mdCodeTags.document} - A document is a collection of password records stored on your disk in JSON format and encrypted with your master password. You can have multiple documents, each with its own master password and unique set of records.
  
  ${mdCodeTags.passwordRecord} - A JSON object entry in your document that follows the following format:
  
  ${mdCodeTags.code}`;

  if (isLoading) return <List isLoading={true} />;

  if (noPasswordRecords) return <NoPasswordRecords documentName={document.name} />;
  return (
    <List isShowingDetail navigationTitle={`RayPass - ${ref?.name}`}>
      <List.Section title="RayPass Reference">
        <List.Item
          title="RayPass Actions"
          icon={{ source: Icon.Compass, tintColor: Color.Green }}
          actions={
            <ActionPanel title="RayPass Actions">
              <NewRecordAction />
              <NewDocumentAction />
              <ChangeDocumentAction />
              <RefreshLocalReferencesActions />
            </ActionPanel>
          }
          detail={
            <List.Item.Detail
              markdown={md}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Commands" />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Create New Record" text="⌘N" />
                  <List.Item.Detail.Metadata.Label title="Switch Active Document" text="⌘O" />
                  <List.Item.Detail.Metadata.Label title="New Document" text="⌘⇧D" />
                  <List.Item.Detail.Metadata.Label title="Refresh Local References" text="⌘⇧R" />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      </List.Section>
      {document ? (
        <List.Section title={`Password Records [${document.records.length}] (${document.name})`}>
          {document.records.map((record, index) => (
            <PasswordRecord key={index} {...record} revalidateDocument={revalidateDocument} />
          ))}
        </List.Section>
      ) : null}
    </List>
  );
};
