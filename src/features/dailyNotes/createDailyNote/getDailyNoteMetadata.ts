import path from "path";
import { LocalConfig, Vault } from "../../../core/types";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata";
import { findNoteParentVault } from "../../notes/util/findNoteParentVault";
import { DailyCreateArgs } from "./parseCreateDailyNoteArgv";

export function getDailyNoteMetadata({
  args,
  localConfig,
  vaults,
  disabledVaults,
}: {
  args: DailyCreateArgs;
  localConfig: LocalConfig;
  vaults: Vault[];
  disabledVaults: Vault[];
}): {
  note: NoteMetadata & { datetime: string };
} {
  const { relativePath, datetime } = getDailyNoteRelativePath();

  const absolutePath = path.join(
    localConfig.basePath,
    args.dirRelativePath || "",
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
