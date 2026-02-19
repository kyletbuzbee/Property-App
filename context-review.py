#!/usr/bin/env python3
"""
Context-Aware Code Review Tool
Generates a comprehensive 'Full Picture' analysis for AI processing.
Supports React/TypeScript projects with focus on accessibility, architecture, and best practices.
"""

import os
import sys
import json
import re
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional, Any


@dataclass
class ProjectContext:
    """Aggregates project-wide metadata for AI context."""
    project_name: str = "Project"
    description: str = "Code review analysis"
    tech_stack: List[str] = field(default_factory=lambda: ["React", "TypeScript", "Tailwind CSS"])
    architecture_layers: Dict[str, str] = field(default_factory=dict)
    dependency_map: Dict[str, List[str]] = field(default_factory=dict)


class FullPictureAnalyzer:
    """Analyzes project structure and code quality for comprehensive review."""
    
    def __init__(self, source_folder: str, project_name: str = "Project"):
        self.source_folder = Path(source_folder)
        self.context = ProjectContext(project_name=project_name)
        self.report_data = {
            "timestamp": datetime.now().isoformat(),
            "project_root": str(self.source_folder.absolute()),
            "files": []
        }

    def remove_comments(self, content: str) -> str:
        """Removes comments from code to reduce false positives."""
        # Remove single-line comments
        content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
        # Remove multi-line comments
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)
        return content

    def scan_project_structure(self):
        """Builds a map of how files relate to each other."""
        exclude_dirs = {'node_modules', '.git', 'dist', 'build', 'coverage', '.next'}
        
        for root, dirs, files in os.walk(self.source_folder):
            # Skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for f in files:
                if f.endswith(('.tsx', '.ts', '.jsx', '.js')):
                    rel_path = Path(root).relative_to(self.source_folder) / f
                    self.context.dependency_map[str(rel_path)] = []

    def analyze_code_standards(self, content: str, file_path: str) -> List[Dict]:
        """Analyzes code for common issues and best practices."""
        # Remove comments to reduce false positives
        content = self.remove_comments(content)
        violations = []
        
        # 1. UI Consistency - Border radius check
        if 'rounded-' in content and not re.search(r'rounded-(xl|2xl|3xl|full|lg|md|sm)', content):
            violations.append({
                "severity": "LOW",
                "type": "UI_CONSISTENCY",
                "message": "Inconsistent border radius usage. Consider using standard Tailwind radius utilities."
            })

        # 2. Architectural Integrity (Data Layer Bypass)
        is_ui = any(x in file_path for x in ['pages', 'components', 'views'])
        if is_ui and any(pattern in content for pattern in ['from \'../data/', 'from "../data/', 'from \'./data/', 'from "./data/']):
            violations.append({
                "severity": "CRITICAL",
                "type": "ARCH_BYPASS",
                "message": "UI component bypassing Data Access Layer. Use services/api layer instead."
            })

        # 3. Accessibility - ARIA labels on interactive elements
        # Check for buttons without aria-label
        button_pattern = r'<button[^>]*>(?!.*aria-label)'
        if re.search(button_pattern, content, re.IGNORECASE):
            # More precise check - look for buttons with only icon content
            icon_button_pattern = r'<button[^>]*>\s*<[A-Z][^>]*\/?>\s*<\/button>'
            if re.search(icon_button_pattern, content):
                violations.append({
                    "severity": "HIGH",
                    "type": "ACCESSIBILITY",
                    "message": "Icon button missing aria-label. Screen readers require descriptive labels for interactive elements."
                })

        # 4. Accessibility - Images without alt text
        img_without_alt = r'<img[^>]*(?<!alt=)[^>]*>'
        if re.search(img_without_alt, content):
            violations.append({
                "severity": "HIGH",
                "type": "ACCESSIBILITY",
                "message": "Image missing alt text. Provide meaningful alt attributes for screen reader accessibility."
            })

        # 5. Type Safety - any type usage
        if ': any' in content or 'as any' in content:
            violations.append({
                "severity": "MEDIUM",
                "type": "TYPE_SAFETY",
                "message": "Usage of 'any' type detected. Define explicit interfaces for better type safety."
            })

        # 6. Console statement checks (for production code)
        console_pattern = r'console\.(log|warn|error|info|debug)\('
        if re.search(console_pattern, content):
            violations.append({
                "severity": "LOW",
                "type": "CLEAN_CODE",
                "message": "Console statement detected. Remove debug logs before production or use proper logging service."
            })

        # 7. Hardcoded values that should be constants
        hex_color_pattern = r'#[0-9A-Fa-f]{6}'
        if re.search(hex_color_pattern, content) and 'theme' not in file_path.lower():
            violations.append({
                "severity": "LOW",
                "type": "MAINTAINABILITY",
                "message": "Hardcoded hex color detected. Consider using theme constants or CSS variables."
            })

        # 8. Magic numbers
        magic_number_pattern = r'(?<!\w)\d{3,}(?!\w)'
        if re.search(magic_number_pattern, content):
            violations.append({
                "severity": "LOW",
                "type": "MAINTAINABILITY",
                "message": "Magic number detected. Consider defining named constants for clarity."
            })

        # 9. Error handling
        if 'try {' in content and 'catch' not in content:
            violations.append({
                "severity": "MEDIUM",
                "type": "ERROR_HANDLING",
                "message": "Try block without catch detected. Ensure proper error handling for robust code."
            })

        # 10. Missing key prop in map/render
        map_pattern = r'\.map\s*\((.*?)\s*=>\s*<([A-Z][a-zA-Z0-9_]*|div|span|li)'
        matches = re.finditer(map_pattern, content, re.DOTALL)
        for match in matches:
            if 'key=' not in match.group(0):
                violations.append({
                    "severity": "LOW",
                    "type": "REACT_BEST_PRACTICE",
                    "message": "Missing key prop in map/render. React uses keys to optimize rendering."
                })

        # 11. Uncontrolled to controlled component switch
        uncontrolled_pattern = r'<.*?(value|checked).*?(defaultValue|defaultChecked)'
        if re.search(uncontrolled_pattern, content, re.IGNORECASE):
            violations.append({
                "severity": "MEDIUM",
                "type": "REACT_BEST_PRACTICE",
                "message": "Mixing controlled and uncontrolled components. Choose one approach consistently."
            })

        return violations

    def detect_tech_stack(self):
        """Detects the project's technology stack."""
        package_json = self.source_folder / 'package.json'
        if package_json.exists():
            try:
                with open(package_json, 'r', encoding='utf-8') as f:
                    pkg = json.load(f)
                    deps = {**pkg.get('dependencies', {}), **pkg.get('devDependencies', {})}
                    
                    stack = []
                    if 'react' in deps:
                        stack.append('React')
                    if 'next' in deps:
                        stack.append('Next.js')
                    if 'vue' in deps:
                        stack.append('Vue')
                    if 'typescript' in deps:
                        stack.append('TypeScript')
                    if 'tailwindcss' in deps:
                        stack.append('Tailwind CSS')
                    if '@supabase/supabase-js' in deps:
                        stack.append('Supabase')
                    
                    if stack:
                        self.context.tech_stack = stack
            except Exception as e:
                print("Warning: Error reading package.json: " + str(e), file=sys.stderr)

    def generate_report(self, output_file: str = "context_review.json"):
        """Compiles the full picture into a single AI-digestible file."""
        self.scan_project_structure()
        self.detect_tech_stack()
        
        # Create reports folder if it doesn't exist (always at project root)
        # Use the current working directory as the project root
        project_root = Path.cwd()
        reports_folder = project_root / "reports"
        reports_folder.mkdir(exist_ok=True)
        
        # Generate timestamped report filename
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        report_filename = f"context_review_{timestamp}.json"
        reports_output_path = reports_folder / report_filename
        
        total_files = len(self.context.dependency_map)
        processed = 0
        
        for file_path in self.context.dependency_map.keys():
            abs_path = self.source_folder / file_path
            try:
                with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                self.report_data["files"].append({
                    "path": file_path,
                    "violations": self.analyze_code_standards(content, file_path),
                    "summary": content[:1000]  # Provide actual code context to AI
                })
                processed += 1
            except Exception as e:
                print("Warning: Error processing file " + str(file_path) + ": " + str(e), file=sys.stderr)
                continue

        # Generate summary statistics
        all_violations = []
        for file_data in self.report_data["files"]:
            all_violations.extend(file_data["violations"])
        
        severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        type_counts = {}
        
        for v in all_violations:
            severity_counts[v["severity"]] = severity_counts.get(v["severity"], 0) + 1
            v_type = v["type"]
            type_counts[v_type] = type_counts.get(v_type, 0) + 1

        report = {
            "context": asdict(self.context),
            "analysis": {
                **self.report_data,
                "summary": {
                    "total_files_scanned": processed,
                    "total_violations": len(all_violations),
                    "severity_breakdown": severity_counts,
                    "violation_types": type_counts
                }
            }
        }

        try:
            with open(reports_output_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            print("Success: Full Picture Report generated: " + str(reports_output_path))
            print("   Files scanned: " + str(processed))
            print("   Total issues: " + str(len(all_violations)))
            print("   Critical: " + str(severity_counts['CRITICAL']) + ", High: " + str(severity_counts['HIGH']) + ", Medium: " + str(severity_counts['MEDIUM']) + ", Low: " + str(severity_counts['LOW']))
            print("   Latest report: " + report_filename)
        except Exception as e:
            print("Error: Error writing report: " + str(e), file=sys.stderr)
            sys.exit(1)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate comprehensive code review analysis')
    parser.add_argument('--path', default='.', help='Source folder path (default: current directory)')
    parser.add_argument('--output', default='context_review.json', help='Base output filename (saved in reports folder with timestamp)')
    parser.add_argument('--name', default='Project', help='Project name')
    
    args = parser.parse_args()
    
    analyzer = FullPictureAnalyzer(args.path, args.name)
    analyzer.generate_report(args.output)
