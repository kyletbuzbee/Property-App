#!/usr/bin/env python3
import os
from pathlib import Path
from datetime import datetime
import re

class ProjectIntelligenceExporter:
    def __init__(self, source_dir='.', output_dir='ai_logic_review'):
        self.source_dir = Path(source_dir).resolve()
        self.output_dir = Path(output_dir).resolve()
        # Extensions to include for analysis
        self.include_ext = {
            '.gs', '.html', '.js', '.css', '.json', '.csv', 
            '.yml', '.yaml', '.tsx', '.ts', '.jsx', '.tsx', '.csv', '.prisma', '.js'   
        }
        # Directories and patterns to ignore
        self.exclude_dirs = {
            'node_modules', '.git', 'dist', 'build', '__pycache__', 
            'backup', 'ai_logic_review', 'plans', 'coverage', '.qodo', 'logs', 'temp', 'tmp', 'venv', 'env', '.venv', '.env', '.idea', '.vscode', '.next', 'dist', 'out', 'public', 'assets', 'static', 'media'
        }
        self.exclude_ext = {'.md', '.txt', '.png', '.jpg', '.pdf', '.jpeg', '.gif', '.svg', '.py', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'}

    def generate_tree(self):
        """Creates a visual directory tree to give the AI structural context."""
        tree = ["PROJECT_STRUCTURE:"]
        for root, dirs, files in os.walk(self.source_dir):
            dirs[:] = [d for d in dirs if d not in self.exclude_dirs]
            rel_path = Path(root).relative_to(self.source_dir)
            level = len(rel_path.parts)
            indent = "  " * level
            if str(rel_path) != ".":
                tree.append(f"{indent}📁 {rel_path.name}/")
            for f in sorted(files):
                f_path = Path(f)
                if f_path.suffix in self.include_ext:
                    tree.append(f"{indent}  📄 {f}")
        return "\n".join(tree)

    def extract_csv_schema(self, file_path):
        """Extracts headers from CSVs to provide 'database' context to the AI."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                header = f.readline().strip()
                return f"DATABASE_SCHEMA (Headers): {header}"
        except Exception:
            return "SCHEMA_ERROR: Could not parse headers."

    def find_references(self, content):
        """Identifies backend function calls made from frontend code for dependency mapping."""
        # Specifically looks for Google Apps Script 'google.script.run' patterns
        gs_calls = re.findall(r'google\.script\.run\.(?:with\w+Handler\(.*?\)\.)?(\w+)\(', content)
        return list(set(gs_calls))

    def process(self):
        # Create output folder if it doesn't exist
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # 1. Generate Master Context
        master_context = [
            f"PROJECT_ANALYSIS_DATE: {datetime.now()}",
            self.generate_tree(),
            "\n" + "="*80 + "\n"
        ]

        # Group data storage
        groups = {}
        all_files = []
        
        for root, dirs, files in os.walk(self.source_dir):
            dirs[:] = [d for d in dirs if d not in self.exclude_dirs]
            for f in files:
                f_path = Path(root) / f
                if f_path.suffix in self.include_ext and f_path.suffix not in self.exclude_ext:
                    all_files.append(f_path)

        for f_path in sorted(all_files):
            rel_path = f_path.relative_to(self.source_dir)
            ext = f_path.suffix.lower().replace('.', '')
            
            try:
                # Read source with utf-8, ignoring errors for binary or corrupt files
                with open(f_path, 'r', encoding='utf-8', errors='ignore') as src:
                    content = src.read()

                # Build AI Metadata Block for context grounding
                meta_block = [
                    f"\n{'='*80}",
                    f"FILE_BEGIN: {rel_path}",
                    f"TYPE: {ext.upper()}",
                    f"SIZE: {f_path.stat().st_size} bytes"
                ]

                # Context-specific logic
                if ext == 'csv':
                    meta_block.append(self.extract_csv_schema(f_path))
                
                refs = self.find_references(content)
                if refs:
                    meta_block.append(f"OUTBOUND_REFERENCES (API Calls): {', '.join(refs)}")

                meta_block.append("="*80 + "\n")

                # Grouping logic
                group_key = f"{ext}_logic_group.txt"
                if group_key not in groups:
                    groups[group_key] = []
                
                groups[group_key].append("\n".join(meta_block) + content + f"\n\n[FILE_END: {rel_path}]\n{'#'*80}\n")
                print(f"✅ Analyzed: {rel_path}")

            except Exception as e:
                print(f"❌ Error processing {rel_path}: {e}")

        # Write Grouped Files (forcing utf-8 to handle markers and special characters)
        for filename, blocks in groups.items():
            with open(self.output_dir / filename, 'w', encoding='utf-8') as f:
                f.write("".join(blocks))

        # Write Final Master Context (THIS FIXES THE UNICODEENCODEERROR)
        with open(self.output_dir / "00_master_context.txt", "w", encoding='utf-8') as f:
            f.write("\n".join(master_context))

        print(f"\n🚀 Success! AI-optimized analysis files are in: '{self.output_dir}'")

if __name__ == "__main__":
    exporter = ProjectIntelligenceExporter()
    exporter.process()