import { parseArgs, type ParseOptions } from "jsr:@std/cli/parse-args";

type FormatHelpMessageInput = {
  DESCRIPTION: string;
  USAGE: string;
};

export function formatHelpMessage({
  DESCRIPTION,
  USAGE,
}: FormatHelpMessageInput) {
  return `${DESCRIPTION}\n\n${USAGE}`;
}

type ApplyHelpInput = {
  DESCRIPTION: string;
  USAGE: string;
  args?: string[];
};

export function applyHelp({ DESCRIPTION, USAGE, args }: ApplyHelpInput) {
  const parseOptions: ParseOptions = {
    boolean: ["help", "description"],
    alias: { help: "h" },
  };

  const { help, description } = parseArgs(args, parseOptions);

  if (help) {
    console.log(formatHelpMessage({ DESCRIPTION, USAGE }));
    Deno.exit(0);
  }

  if (description) {
    console.log(DESCRIPTION);
    Deno.exit(0);
  }
}
