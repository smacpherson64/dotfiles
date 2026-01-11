import { join, dirname, fromFileUrl } from "jsr:@std/path";

export const _helpers = dirname(fromFileUrl(import.meta.url));
export const dotfiles = dirname(dirname(fromFileUrl(import.meta.url)));
export const desktop = join(dotfiles, "..", "Desktop");
export const notes = join(desktop, "@notes");
