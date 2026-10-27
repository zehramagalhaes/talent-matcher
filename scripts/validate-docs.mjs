import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "AGENTS.md",
  "docs/README.md",
  "docs/PROJECT_OVERVIEW.md",
  "docs/ARCHITECTURE.md",
  "docs/FEATURES.md",
  "docs/ENGINEERING_DIRECTIVES.md",
  "docs/AI_WORKFLOW.md",
  "docs/DECISIONS.md",
  "docs/IMPROVEMENT_LOG.md",
  "docs/CURRENT_STATE.md",
  "docs/templates/IMPROVEMENT_RECORD.md",
];
const allowedStatuses = new Set([
  "Implemented and verified",
  "Implemented, verification incomplete",
  "Planned",
  "Blocked",
  "Deprecated",
]);
const errors = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Required file is missing: ${file}`);
}

function markdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory()
      ? markdownFiles(absolute)
      : absolute.endsWith(".md")
        ? [absolute]
        : [];
  });
}

const docsFiles = markdownFiles(path.join(root, "docs"));
const rootMarkdown = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => path.join(root, entry.name));
const checkedMarkdown = [...rootMarkdown, ...docsFiles].filter(fs.existsSync);

for (const absolute of checkedMarkdown) {
  const source = fs.readFileSync(absolute, "utf8");
  const relative = path.relative(root, absolute);
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, "").split(/\s+/, 1)[0];
    if (!target || /^(?:[a-z]+:|#)/i.test(target)) continue;
    const localTarget = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    if (!localTarget) continue;
    const resolved = path.resolve(path.dirname(absolute), localTarget);
    if (!resolved.startsWith(`${root}${path.sep}`) && resolved !== root) {
      errors.push(`${relative}: local link escapes the repository: ${target}`);
    } else if (!fs.existsSync(resolved)) {
      errors.push(`${relative}: local link target does not exist: ${target}`);
    }
  }
}

const agentEntry = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
for (const reference of [
  "docs/README.md",
  "docs/ENGINEERING_DIRECTIVES.md",
  "docs/AI_WORKFLOW.md",
  "npm run docs:check",
]) {
  if (!agentEntry.includes(reference)) errors.push(`AGENTS.md must reference ${reference}`);
}

const improvementLogPath = path.join(root, "docs/IMPROVEMENT_LOG.md");
const improvementLog = fs.existsSync(improvementLogPath)
  ? fs.readFileSync(improvementLogPath, "utf8")
  : "";
const records = [...improvementLog.matchAll(/^## (.+)$/gm)].filter(
  ([, heading]) => heading !== "Improvement log"
);
const requiredRecordFields = [
  "Status",
  "Date",
  "Problem",
  "Expected outcome",
  "Implementation summary",
  "Affected features/components",
  "Files/modules",
  "Decisions and trade-offs",
  "Verification",
  "Actual results",
  "Known limitations",
  "Follow-up",
  "Related documentation/decisions",
];

if (!records.length)
  errors.push("IMPROVEMENT_LOG.md must contain at least one improvement record.");
for (let index = 0; index < records.length; index += 1) {
  const [recordMatch, heading] = records[index];
  const start = recordMatch.index + recordMatch[0].length;
  const end = records[index + 1]?.index ?? improvementLog.length;
  const body = improvementLog.slice(start, end);
  for (const field of requiredRecordFields) {
    if (!new RegExp(`^- \\*\\*${field}:\\*\\*`, "m").test(body)) {
      errors.push(`Improvement record “${heading}” is missing the ${field} field.`);
    }
  }
}

const statusBearingFiles = checkedMarkdown.filter(
  (file) =>
    file.startsWith(`${path.join(root, "docs")}${path.sep}`) &&
    !file.includes(`${path.sep}templates${path.sep}`)
);
for (const absolute of statusBearingFiles) {
  const source = fs.readFileSync(absolute, "utf8");
  for (const match of source.matchAll(/^\s*- \*\*Status:\*\*\s*(.+?)\s*$/gm)) {
    const status = match[1].replace(/[.;]\s*$/, "");
    if (!allowedStatuses.has(status)) {
      errors.push(`${path.relative(root, absolute)} uses an unknown status label: ${status}`);
    }
  }
}

if (errors.length) {
  console.error("Documentation validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Documentation validation passed (${checkedMarkdown.length} Markdown files, ${records.length} improvement records).`
  );
  console.log("Manual documentation-impact review remains required; see docs/AI_WORKFLOW.md.");
}
