import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import { SUPPORTED_DIAGRAM_TYPES } from './constants.js';
import type { DiagramType } from "./constants.js";
import type { DiagramMetadata } from "./types.js";
import MarkdownIt from 'markdown-it';

/**
 * Extract diagram metadata from markdown tokens
 * @param tokens Markdown tokens
 * @param idx Current token index
 * @returns Diagram metadata
 */
export function extractDiagramMetadata(
  tokens: any[],
  idx: number,
): DiagramMetadata {
  const nextToken = tokens[idx + 1];
  if (nextToken && nextToken.type === "html_block") {
    // Match optional id and caption
    const idMatch = nextToken.content.match(
      /<!--\s*diagram(?:\s+id="([^"]+)")?/,
    );
    const captionMatch = nextToken.content.match(/\s+caption="([^"]+)"/);
    return {
      id: idMatch?.[1]?.trim(),
      caption: captionMatch?.[1]?.trim() || "",
    };
  }
  return { caption: "", id: undefined };
}

/**
 * Generate a unique filename for a diagram
 * @param diagramType Type of diagram
 * @param diagramContent Diagram content
 * @param diagramId Optional diagram identifier
 * @returns Unique filename
 */
export function generateUniqueFilename(
  diagramType: DiagramType,
  diagramContent: string,
  diagramId?: string,
): string {
  // Create a hash of the diagram content to ensure unique filenames
  const hash = crypto.createHash("md5").update(diagramContent).digest("hex");

  // Include diagram ID in filename if provided
  return diagramId
    ? `${diagramType}-${diagramId}-${hash}.svg`
    : `${diagramType}-${hash}.svg`;
}

/**
 * Resolve the base directory for diagram storage
 * @param customDir Optional custom directory
 * @returns Resolved base directory path
 */
export function resolveDiagramBaseDir(customDir?: string): string {
  const baseDir =
    process?.cwd?.() || process.env.PWD || process.env.INIT_CWD || ".";

  return customDir
    ? path.resolve(baseDir, customDir)
    : path.resolve(baseDir, "docs/public/diagrams");
}

/**
 * Remove old diagram files with the same diagram type and ID
 * @param diagramsDir Directory containing diagram files
 * @param diagramType Type of diagram
 * @param diagramId Unique identifier for the diagram
 */
export function removeOldDiagramFiles(
  diagramsDir: string,
  diagramType: DiagramType,
  diagramId: string,
  filename: string,
): void {
  if (!diagramId) {
    return;
  }

  const oldFiles = fs
    .readdirSync(diagramsDir)
    .filter(
      (file) =>
        file.startsWith(`${diagramType}-${diagramId}-`) && file !== filename,
    );

  oldFiles.forEach((oldFile) => {
    fs.unlinkSync(path.join(diagramsDir, oldFile));
  });
}

/**
 * Helper to recursively find all markdown files under a directory
 * @param docsDir Directory to search documentation markdown
 * @returns Array of markdown file paths
 */
export function getMarkdownFilesFromDir(docsDir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(docsDir);
  for (const file of list) {
    if (file === 'node_modules') continue;
    const filePath = path.join(docsDir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownFilesFromDir(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  }
  return results;
}

/**
 * Extract all diagram metadata from markdown
 * @param filepath Markdown filepath
 * @returns Array of diagram blocks with type, content, and optional id
 */
export function extractDiagramsMetadataFromMarkdown(filepath: string): Array<{type: string, content: string, id?: string, caption?: string}> {
  const diagrams: Array<{ type: string, content: string, id?: string, caption?: string }> = [];
  const markdownString = fs.readFileSync(filepath, 'utf-8');
  const md = new MarkdownIt();
  const tokens = md.parse(markdownString, {});
  tokens.forEach((token, idx) => {
    if (token.type === 'fence' && SUPPORTED_DIAGRAM_TYPES.includes(token.info.trim() as any)) {
      const type = token.info.trim();
      const content = token.content.trim();
      const { caption, id } = extractDiagramMetadata(tokens, idx);
      diagrams.push({ type, content, id, caption });
    }
  });
  return diagrams;
}

/**
 * Get all unique diagram hashes (filenames) from markdown files in the docs root
 * @param docsRoot Root directory containing markdown files
 * @returns Set of unique diagram filenames (hashes)
 */
export function getAllDiagramsHashes(docsRoot?: string): Set<string> {
  const dir: string = docsRoot || 'docs';
  const hashes = new Set<string>();

  const mdFiles = getMarkdownFilesFromDir(dir);
  for (const mdFile of mdFiles) {
    for (const { type, content, id, caption } of extractDiagramsMetadataFromMarkdown(mdFile)) {
      const filename = generateUniqueFilename(type as any, content, id);
      hashes.add(filename);
    }
  }
  return hashes;
}
