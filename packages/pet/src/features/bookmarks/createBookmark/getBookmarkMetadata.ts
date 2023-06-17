import path from "path";
import { LocalConfig, Vault } from "../../../core/types.js";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata.js";
import { findNoteParentVault } from "../../notes/util/findNoteParentVault.js";
import { CreateBookmarkInput } from "./createBookmark.js";

export function getBookmarkMetadata({
  input,
  localConfig,
  vaults,
  disabledVaults,
}: {
  input: CreateBookmarkInput;
  localConfig: LocalConfig;
  vaults: Vault[];
  disabledVaults: Vault[];
}): {
  note: NoteMetadata & { datetime: string };
} {
  const { relativePath, datetime } = getDailyNoteRelativePath();

  const absolutePath = path.join(
    localConfig.basePath,
    input.vaultRelativePath || "",
    relativePath
  );

  const parentVault = findNoteParentVault(absolutePath, vaults, disabledVaults);

  return {
    note: {
      absolutePath,
      relativePath,
      parentVault,
      datetime,
    },
  };
}

function getDailyNoteRelativePath() {
  const datetime = new Date().toISOString();

  const dateElements = datetime.split("T");
  const dirPath = dateElements[0].replace(/-/g, "/");
  const fileName = dateElements[1].split(".")[0];

  const relativePath = path.join(dirPath, fileName + ".md");

  return { relativePath, datetime };
}
