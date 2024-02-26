/**
 * Source: https://community.cloudflare.com/t/algorithm-to-generate-a-preview-dns-subdomain-from-a-branch-name/477633
 */
import { setOutput } from '@actions/core';

const INVALID_CHARS_REGEX = /[^a-z0-9-]/g;
const MAX_ALIAS_LENGTH = 28

const [branch, project] = process.argv.slice(2);
if (!branch || !project) {
  throw new Error(`Invalid arguments. branch=${branch}, project=${project}`);
}

setOutput('alias', generateBranchAliasUrl(branch, project))

function generateBranchAliasUrl(branch: string, project: string) {
  let sanitisedBranch = trimFromEdges(branch.toLowerCase().replace(INVALID_CHARS_REGEX, '-'), '-');

  if (sanitisedBranch.length > MAX_ALIAS_LENGTH) {
    sanitisedBranch = sanitisedBranch.substring(0, MAX_ALIAS_LENGTH);
  }

  return sanitisedBranch ? `https://${sanitisedBranch}.${project}.pages.dev` : '';
}

function trimFromEdges(str: string, char: string) {
  while (str.charAt(0) === char) {
    if (str.length === 1) {
      return '';
    }
    str = str.substring(1);
  }

  while (str.charAt(str.length - 1) === char) {
    if (str.length === 1) {
      return '';
    }
    str = str.substring(0, str.length - 1);
  }

  return str;
}
