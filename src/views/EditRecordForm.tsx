import type { FC } from "react";
import type { PasswordRecordData } from "../types";
import type { ValidationErrors } from "../utils";
import { useState } from "react";
import { Form, Action, ActionPanel, useNavigation, Icon } from "@raycast/api";
import { documentStore } from "../context";
import { records, validation } from "../utils";
import Command from "../raypass";
import { GeneratePasswordAction } from "../actions";

interface Props {
  id: string;
  initialValues: PasswordRecordData;
}

export const EditRecordForm: FC<Props> = ({ id, initialValues }) => {
  const { push } = useNavigation();
  const { ref, password } = documentStore.getState();
  const [errors, setErrors] = useState<ValidationErrors<PasswordRecordData>>({
    name: undefined,
    email: undefined,
    password: undefined,
    username: undefined,
    url: undefined,
    notes: undefined,
  });

  const handleValidation = (name: string, value: string | undefined) => {
    const { error } = validation.validate.field({
      schema: validation.schemas.newRecord,
      field: name,
      value: { [name]: value },
    });

    if (error) return setErrors((prev) => ({ ...prev, [name]: error }));
    return setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (record: PasswordRecordData) => {
    const empty = validation.validate.empty<PasswordRecordData>(record, ["name", "password"]);
    if (empty) return;

    await records.edit({ id, record, password: ref?.isEncrypted ? password : undefined });
    push(<Command />);
  };

  return (
    <Form
      navigationTitle={`Edit Record ${id}`}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} icon={Icon.ArrowRightCircle} />
          <GeneratePasswordAction />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Service Name"
        placeholder="Gmail"
        defaultValue={initialValues.name}
        error={errors.name}
        onChange={(newValue) => handleValidation("name", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />
      <Form.TextField
        id="username"
        title="Username"
        placeholder="PaulB"
        defaultValue={initialValues?.username}
        error={errors.username}
        onChange={(newValue) => handleValidation("username", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />
      <Form.TextField
        id="email"
        title="Email"
        placeholder="you@gmail.com"
        defaultValue={initialValues?.email}
        error={errors.email}
        onChange={(newValue) => handleValidation("email", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />
      <Form.PasswordField
        id="password"
        title="Password"
        info="You can generate a password with the action panel (⌘P)"
        placeholder="My secret password!"
        defaultValue={initialValues.password}
        error={errors.password}
        onChange={(newValue) => handleValidation("password", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />
      <Form.TextField
        id="url"
        info="Add a url to quickly access the website and pull the favicon for quick visual reference"
        title="Service URL"
        placeholder="https://gmail.com/"
        defaultValue={initialValues?.url}
        error={errors.url}
        onChange={(newValue) => handleValidation("url", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />
      <Form.TextArea
        id="notes"
        title="Notes"
        placeholder="Any additional information about the record or how to use it"
        defaultValue={initialValues?.notes}
        error={errors.notes}
        onChange={(newValue) => handleValidation("notes", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />
    </Form>
  );
};
