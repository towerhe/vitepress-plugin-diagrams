import type { DiagramType } from "./constants.js";
import type { DiagramMetadata } from "./types.js";
/**
 * Extract diagram metadata from markdown tokens
 * @param tokens Markdown tokens
 * @param idx Current token index
 * @returns Diagram metadata
 */
export declare function extractDiagramMetadata(tokens: any[], idx: number): DiagramMetadata;
/**
 * Generate a unique filename for a diagram
 * @param diagramType Type of diagram
 * @param diagramContent Diagram content
 * @param diagramId Optional diagram identifier
 * @param positionId Optional position-based identifier
 * @param sourceFileMtime Optional modification time of source file (for cache invalidation)
 * @returns Unique filename
 */
export declare function generateUniqueFilename(diagramType: DiagramType, diagramContent: string, diagramId?: string, positionId?: string, sourceFileMtime?: number): string;
/**
 * Resolve the base directory for diagram storage
 * @param customDir Optional custom directory
 * @returns Resolved base directory path
 */
export declare function resolveDiagramBaseDir(customDir?: string): string;
/**
 * Remove old diagram files with the same diagram type and ID
 * @param diagramsDir Directory containing diagram files
 * @param diagramType Type of diagram
 * @param diagramId Unique identifier for the diagram
 */
export declare function removeOldDiagramFiles(diagramsDir: string, diagramType: DiagramType, diagramId: string | undefined, filename: string, diagramContent?: string, positionId?: string): void;
/**
 * Helper to recursively find all markdown files under a directory
 * @param docsDir Directory to search documentation markdown
 * @returns Array of markdown file paths
 */
export declare function getMarkdownFilesFromDir(docsDir: string): string[];
/**
 * Extract all diagram metadata from markdown
 * @param filepath Markdown filepath
 * @returns Array of diagram blocks with type, content, and optional id
 */
export declare function extractDiagramsMetadataFromMarkdown(filepath: string): Array<{
    type: string;
    content: string;
    id?: string;
    caption?: string;
}>;
/**
 * Get all unique diagram hashes (filenames) from markdown files in the docs root
 * @param docsRoot Root directory containing markdown files
 * @returns Set of unique diagram filenames (hashes)
 */
export declare function getAllDiagramsHashes(docsRoot?: string): Set<string>;
/**
 * Check if a file extension is considered dangerous
 * @param filePath File path to check
 * @returns true if the file has a dangerous extension
 */
export declare function hasDangerousExtension(filePath: string): boolean;
/**
 * Result of reading a file import, including content and metadata
 */
export interface FileImportResult {
    content: string;
    filePath: string;
    mtime: number;
}
/**
 * Check if content uses @file: syntax for importing diagram from file
 * @param content Code block content
 * @returns true if content starts with @file: syntax
 */
export declare function isFileImportSyntax(content: string): boolean;
/**
 * Parse the file path from @file: syntax
 * @param content Code block content
 * @returns File path or null if not @file: syntax
 */
export declare function parseFileImportPath(content: string): string | null;
/**
 * Resolve file import path relative to the markdown file location
 * @param importPath The path from @file: syntax
 * @param markdownFilePath The path of the markdown file containing the import
 * @returns Resolved absolute path
 */
export declare function resolveFileImportPath(importPath: string, markdownFilePath: string): string;
/**
 * Validate that a file path is within allowed directories (security check)
 * Uses realpath to prevent symlink-based path traversal attacks
 * @param filePath The resolved file path to validate
 * @param allowedDirs Array of allowed base directories (empty means allow all)
 * @returns true if path is safe
 */
export declare function validateFileImportPath(filePath: string, allowedDirs?: string[]): boolean;
/**
 * Read content from a file import with metadata for cache invalidation
 * @param filePath Absolute path to the file
 * @returns FileImportResult with content, path, and modification time
 * @throws Error if file cannot be read or has dangerous extension
 */
export declare function readFileImport(filePath: string): FileImportResult;
