import { List } from "@raycast/api";
import { useRecords } from "../hooks";
import { Record, NoRecords } from "../components";

//? EncryptedPasswordForm.tsx should exist in here to avoid weird view changes

export const Records: React.FC = () => {
  const { data, isLoading, revalidate } = useRecords();
  if (!data) return <List isLoading={true} />;

  const { document, records } = data;
  const showEmptyState = records.length === 0;

  return (
    <List
      isShowingDetail={!showEmptyState}
      isLoading={isLoading}
      navigationTitle={`RayPass - ${document.name}`}
      searchBarPlaceholder="Search Records"
    >
      {showEmptyState ? (
        <NoRecords documentName={document?.name} revalidateRecords={revalidate} />
      ) : (
        <List.Section title={`Records (${records.length})`}>
          {records.map((record, index) => (
            <Record key={index} documentName={document.name} {...record} revalidateRecords={revalidate} />
          ))}
        </List.Section>
      )}
    </List>
  );
};
