import { FC } from "react";
import { List, ActionPanel, Color, Icon } from "@raycast/api";
import { useRecords } from "../hooks";
import {
  NewRecordAction,
  NewDocumentAction,
  ManageDocumentsAction,
  RefreshLocalReferencesActions,
  ShowDocument,
} from "../actions";
import { PasswordRecord } from "../components";

export const PasswordRecords: FC = () => {
  const { data, isLoading, revalidate } = useRecords();
  if (!data) return null; // impossible to get here but for ts

  const { document, records } = data;

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

  return (
    <List isShowingDetail isLoading={isLoading} navigationTitle={`RayPass - ${document.name}`}>
      <List.Section title="RayPass Reference">
        <List.Item
          title="RayPass Actions"
          icon={{ source: Icon.Compass, tintColor: Color.Blue }}
          actions={
            <ActionPanel title="RayPass Actions">
              <NewRecordAction />
              <NewDocumentAction />
              <ManageDocumentsAction />
              <ShowDocument name={document.name} />
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
                  <List.Item.Detail.Metadata.Label title="Records" />
                  <List.Item.Detail.Metadata.Label title="Copy Password" text="⌘C or Enter" />
                  <List.Item.Detail.Metadata.Label title="Copy Username" text="⌘U" />
                  <List.Item.Detail.Metadata.Label title="Copy Email" text="⌘E" />
                  <List.Item.Detail.Metadata.Label title="Copy Record (JSON)" text="⌘J" />
                  <List.Item.Detail.Metadata.Label title="Open URL" text="⌘⇧W" />
                  <List.Item.Detail.Metadata.Label title="Create New Record" text="⌘N" />
                  <List.Item.Detail.Metadata.Label title="Edit Record" text="⌘⇧E" />
                  <List.Item.Detail.Metadata.Label title="Delete Record" text="⌘Backspace" />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Documents" />
                  <List.Item.Detail.Metadata.Label title="Manage/Switch Documents" text="⌘O" />
                  <List.Item.Detail.Metadata.Label title="New Document" text="⌘⇧D" />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="General" />
                  <List.Item.Detail.Metadata.Label title="Refresh Local References" text="⌘⇧R" />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      </List.Section>
      {document ? (
        <List.Section title={`Records (${records.length})`}>
          {records.map((record, index) => (
            <PasswordRecord key={index} {...record} revalidateDocument={revalidate} />
          ))}
        </List.Section>
      ) : null}
    </List>
  );
};
