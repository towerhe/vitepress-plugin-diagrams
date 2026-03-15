import type { DiagramPluginOptions } from "./types.js";
import type { MarkdownRenderer } from "vitepress";
/**
 * Convert diagram to SVG and generate HTML representation
 * @param diagram Diagram content
 * @param diagramType Diagram type
 * @param caption Optional diagram caption
 * @param diagramId Optional diagram identifier
 * @param diagramsPluginOptions Plugin configuration options
 * @param positionId Optional position-based identifier
 * @param sourceFileMtime Optional modification time of source file (for cache invalidation)
 * @returns HTML string with diagram and optional caption
 */
export declare function diagramToSvg(diagram: string, diagramType: string, caption?: string, diagramId?: string, diagramsPluginOptions?: DiagramPluginOptions, positionId?: string, sourceFileMtime?: number): string;
/**
 * Configure VitePress markdown renderer to support diagram generation
 * @param md Markdown renderer
 * @param diagramsPluginOptions Plugin configuration options
 */
export declare function configureDiagramsPlugin(md: MarkdownRenderer, diagramsPluginOptions?: DiagramPluginOptions): void;
export { SUPPORTED_DIAGRAM_TYPES } from "./constants";
export type { DiagramMetadata, DiagramPluginOptions } from "./types";
export { generateUniqueFilename, removeOldDiagramFiles, isFileImportSyntax, parseFileImportPath, resolveFileImportPath, validateFileImportPath, readFileImport, hasDangerousExtension, type FileImportResult, } from "./utils";
