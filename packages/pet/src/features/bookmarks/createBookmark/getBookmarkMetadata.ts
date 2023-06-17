import path from "path";
import { LocalConfig, Vault } from "../../../core/types.js";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata.js";
import { findNoteParentVault } from "../../notes/util/findNoteParentVault.js";
import { CreateBookmarkInput } from "./createBookmark.js";
import { fileExists } from "../../../utils/files.js";
import { PetError } from "../../../core/PetError.js";

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
  note: NoteMetadata;
} {
  const relativePath = path.join(
    input.vaultRelativePath || "",
    `${input.title} (${encodeURIComponent(input.url)}).md`
  );
  const absolutePath = path.join(localConfig.basePath, relativePath);

  if (fileExists(absolutePath)) {
    throw new PetError(`Bookmark already exists: ${absolutePath}`);
  }

  const parentVault = findNoteParentVault(absolutePath, vaults, disabledVaults);

  return {
    note: {
      absolutePath,
      relativePath,
      parentVault,
    },
  };
}
