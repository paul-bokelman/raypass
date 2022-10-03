import cp from "child_process";

const copyToClipboard = (text: string) => {
  const proc = cp.spawn("pbcopy");
  proc.stdin.write(text);
  proc.stdin.end();
};

const parseDocumentName = (name: string) => {
  return name.split(".")[0];
};

const isEncrypted = (name: string) => {
  const [ext] = name.split(".").slice(-1);
  return ext === "enc";
};

export const misc = {
  copy: copyToClipboard,
  parseDocumentName,
  isEncrypted,
};
