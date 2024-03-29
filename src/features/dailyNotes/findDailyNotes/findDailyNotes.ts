import clc from "cli-color";
import yaml from "yaml";
import { z } from "zod";
import { ArgvOptions } from "../../../cli/types.js";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { exec, execResolve } from "../../../core/exec.js";
import { Vault } from "../../../core/types.js";
import { flattenVault } from "../../../core/vault/flattenVault.js";
import { FileWithVault, readFiles } from "../../notes/findNotes/readFiles.js";
import { dailyNotes } from "../DailyNotes.js";
import {
  DailyFindArgs,
  parseFindDailyNotesArgv,
} from "./parseFindDailyNotesArgv.js";

export function findDailyNotes({ argv }: ArgvOptions) {
  return Promise.resolve({ ...dailyNotes.getMeta(), argv })
    .then((x) => exec(x, parseFindDailyNotesArgv))
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => execResolve(x, readFiles))
    .then((x) => exec(x, flattenFiles))
    .then((x) => exec(x, readFilesWithFrontmatter))
    .then((x) => exec(x, filterByTag))
    .then((x) => exec(x, printResults));
}

function flattenFiles({ vault }: { vault: Vault<{ files: FileWithVault[] }> }) {
  const files = flattenVault(vault).flatMap((vault) => vault.files);
  return { files };
}

function readFilesWithFrontmatter({ files }: { files: FileWithVault[] }) {
  const filesWithFrontmatter = files.map((file) => {
    const { content, frontmatter } = parseFrontmatter(file.content);
    return { ...file, content, frontmatter };
  });
  return { files: filesWithFrontmatter };
}

function filterByTag({
  args,
  files,
}: {
  args: DailyFindArgs;
  files: FileWithOptionalFrontmatter[];
}) {
  const { tags } = args;
  if (!tags) {
    return { filteredFiles: files as FileWithFrontmatter[] };
  }
  const filteredFiles = files.filter((file) =>
    tags.every((tag) => file.frontmatter?.tags.includes(tag))
  ) as FileWithFrontmatter[];
  return { filteredFiles };
}

type Frontmatter = z.infer<typeof schema>;
type FileWithOptionalFrontmatter = FileWithVault & {
  frontmatter?: Frontmatter;
};

type FileWithFrontmatter = FileWithVault & {
  frontmatter: Frontmatter;
};

const schema = z.object({
  datetime: z.string(),
  tags: z.array(z.string()),
});

function parseFrontmatter(file: string) {
  try {
    const frontmatter = file.split("---")[1];
    const content = file.split("---")[2].trim();
    return {
      frontmatter: schema.parse(yaml.parse(frontmatter)),
      content,
    };
  } catch (e) {
    return {
      content: file.trim(),
    };
  }
}

function printResults({
  filteredFiles,
}: {
  filteredFiles: FileWithFrontmatter[];
}) {
  groupByDays(filteredFiles).forEach(([day, files]) => {
    console.log(clc.green.bold(`${day}`));

    files.forEach((file) => {
      const time = new Date(file.frontmatter.datetime).toLocaleTimeString();
      console.log(
        `${clc.green(time)} ${clc.green(
          `(${file.frontmatter.tags.join(", ")})`
        )}`
      );
      console.log(`${file.content}`);
      console.log();
    });
  });
}

function groupByDays(filteredFiles: FileWithFrontmatter[]) {
  const groupedByDays = filteredFiles.reduce((acc, file) => {
    const day = new Date(file.frontmatter.datetime).toLocaleDateString("en", {
      weekday: "long",
    });
    const date = `${day} (${file.frontmatter.datetime.split("T")[0]})`;
    // const date = day;
    if (acc[date]) {
      acc[date].push(file);
    } else {
      acc[date] = [file];
    }
    return acc;
  }, {} as Record<string, FileWithFrontmatter[]>);
  return Object.entries(groupedByDays);
}
