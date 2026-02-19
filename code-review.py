import os
import sys
import json
import ast
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any, Set
from dataclasses import dataclass, field, asdict
from collections import defaultdict


@dataclass
class FileIssue:
    """Represents a code issue found during analysis."""
    severity: str  # critical, high, medium, low, info
    category: str  # security, performance, type-safety, architecture, style, accessibility
    file: str
    line: Optional[int]
    message: str
    suggestion: str
    code_snippet: Optional[str] = None


@dataclass
class FileAnalysis:
    """Analysis results for a single file."""
    path: str
    language: str
    lines_of_code: int
    issues: List[FileIssue] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)
    suggestions: List[str] = field(default_factory=list)


@dataclass
class ProjectManifest:
    """Project manifest providing global context for AI analysis."""
    project_name: str
    mission_statement: str = "property analyzer"
    architecture_patterns: Dict[str, str] = field(default_factory=dict)
    component_relationships: Dict[str, List[str]] = field(default_factory=dict)
    service_dependencies: Dict[str, List[str]] = field(default_factory=dict)
    high_stakes_components: List[str] = field(default_factory=list)
    brand_colors: Dict[str, str] = field(default_factory=dict)
    accessibility_standards: List[str] = field(default_factory=list)


@dataclass
class ProjectAnalysis:
    """Complete project analysis results."""
    project_name: str
    timestamp: str
    manifest: Dict[str, Any] = field(default_factory=dict)
    summary: Dict[str, Any] = field(default_factory=dict)
    file_analyses: List[FileAnalysis] = field(default_factory=list)
    architectural_issues: List[FileIssue] = field(default_factory=list)
    security_issues: List[FileIssue] = field(default_factory=list)
    performance_issues: List[FileIssue] = field(default_factory=list)
    accessibility_issues: List[FileIssue] = field(default_factory=list)
    dignity_first_violations: List[FileIssue] = field(default_factory=list)
    total_issues: int = 0
    quality_score: int = 0
    recommendations: List[str] = field(default_factory=list)


class CodeReviewAnalyzer:
    """Comprehensive code review analyzer for Properties 4 Creation with dignity-first heuristics."""

    # Properties 4 Creation Brand Colors - Must use these instead of random hex codes
    P4C_BRAND_COLORS = {
        'navy': '#0B1120',
        'gold': '#C5A059',
        'navy_light': '#1E293B',
        'gold_light': '#D4B47C',
        'white': '#FFFFFF',
        'gray_100': '#F1F5F9',
        'gray_200': '#E2E8F0',
        'gray_600': '#475569',
        'gray_900': '#0F172A',
    }

    # Properties 4 Creation High-Stakes Components (must use ToastContext and AuthContext)
    HIGH_STAKES_COMPONENTS = [
        'Application.tsx',
        'AdminDashboard.tsx',
        'TenantLogin.tsx',
        'PropertyDetails.tsx',
        'VeteranServices.tsx',
    ]

    # Properties 4 Creation Mission Prompt for AI Context
    P4C_MISSION = """
    Properties 4 Creation MISSION: Housing veterans and families with dignity.
    
    As an AI reviewing Properties 4 Creation code, you must prioritize:
    - TRUST: Veterans depend on this platform for stable housing. Code must be reliable.
    - TRANSPARENCY: Clear error messages and feedback are essential.
    - ACCESSIBILITY: Many veterans have disabilities. WCAG 2.1 AA compliance is mandatory.
    - DIGNITY: Avoid "slumlord patterns" - cheap-looking UI that undermines trust.
    
    Quality is not just syntax—it's about serving those who served us.
    """

    def __init__(self, source_folder: str):
        self.source_folder = Path(source_folder)
        self.project_analysis = ProjectAnalysis(
            project_name=source_folder.split('/')[-1] or source_folder.split('\\')[-1],
            timestamp=datetime.now().isoformat()
        )
        
        # Generate project manifest for AI context
        self.manifest = self._generate_project_manifest()
        
        # Language handlers with extensions and patterns
        self.language_handlers = {
            'typescript': {
                'extensions': ['.ts', '.tsx'],
                'comments': ['//', '/*', '*', '*/'],
                'line_comment': '//'
            },
            'javascript': {
                'extensions': ['.js', '.jsx', '.mjs', '.cjs'],
                'comments': ['//', '/*', '*', '*/'],
                'line_comment': '//'
            },
            'python': {
                'extensions': ['.py', '.pyw'],
                'comments': ['#', '"""', "'''"],
                'line_comment': '#'
            },
            'css': {
                'extensions': ['.css', '.scss', '.sass'],
                'comments': ['/*', '*', '*/'],
                'line_comment': None
            },
            'html': {
                'extensions': ['.html', '.htm', '.xhtml'],
                'comments': ['<!--', '-->'],
                'line_comment': None
            },
            'json': {
                'extensions': ['.json', '.jsonc'],
                'comments': [],
                'line_comment': None
            },
            'config': {
                'extensions': ['.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf'],
                'comments': ['#', ';', '//'],
                'line_comment': '#'
            },
        }

        # Security patterns to detect
        self.security_patterns = [
            (r'(?i)(password|secret|api_key|apikey|auth_token|access_token)\s*=\s*["\'][^"\']+["\']', 'HIGH', 'security', 'Hardcoded secret detected'),
            (r'(?i)(eval|exec)\s*\(', 'HIGH', 'security', 'Dangerous eval/exec usage'),
            (r'(?i)(innerHTML|outerHTML)\s*=', 'MEDIUM', 'security', 'DOM XSS vulnerability with innerHTML'),
            (r'(?i)(crypto\.randomBytes|Math\.random)\s*\(', 'LOW', 'security', 'Use cryptographically secure random values'),
            (r'(?i)(http://)', 'MEDIUM', 'security', 'Insecure HTTP protocol - use HTTPS'),
        ]

        # Performance patterns
        self.performance_patterns = [
            (r'setTimeout\s*\(\s*\w+\s*,\s*0\s*\)', 'MEDIUM', 'performance', 'Consider using requestAnimationFrame or microtasks'),
            (r'\.forEach\s*\(', 'LOW', 'performance', 'forEach creates unnecessary function overhead'),
            (r'useEffect\s*\(\s*\[\s*\]\s*\)', 'MEDIUM', 'performance', 'Empty dependency array in useEffect may cause stale closures'),
            (r'JSON\.parse\s*\(\s*\w+\s*\)', 'LOW', 'performance', 'Consider validating JSON before parsing'),
        ]

        # TypeScript/React patterns
        self.typescript_patterns = [
            (r':\s*any\b', 'MEDIUM', 'type-safety', 'Avoid using `any` type - use specific types or `unknown`'),
            (r'console\.(log|error|warn|info)\s*\(', 'LOW', 'style', 'Remove debug console statements in production code'),
            (r'useState\s*\(\s*undefined\s*\)', 'LOW', 'type-safety', 'Provide explicit type for useState or use null'),
            (r'catch\s*\(\s*\w+\s*\)', 'LOW', 'type-safety', 'Catch clause should type the error as `unknown` before handling'),
        ]

        # Architecture patterns
        self.architecture_patterns = [
            (r'import\s+.*\s+from\s+[\'"]\.{1,2}/data/', 'HIGH', 'architecture', 'Direct data imports violate data access layer pattern'),
            (r'import\s+.*\s+from\s+[\'"]\.{1,2}/components/', 'MEDIUM', 'architecture', 'Check if component imports follow proper patterns'),
            (r'export\s+default\s+function', 'LOW', 'architecture', 'Prefer named exports for better tree-shaking'),
            (r'React\.Component', 'MEDIUM', 'architecture', 'Use functional components with hooks instead of class components'),
        ]

        # Properties 4 Creation-specific Dignity-First UI Heuristics
        self.dignity_first_patterns = [
            # Direct AI imports instead of geminiService
            (r'import\s+.*\s+from\s+[\'"]@google/generative-ai[\'"]', 'MEDIUM', 'architecture', 
             'Use geminiService.ts instead of direct AI imports for consistent error handling'),
        ]

        # Accessibility patterns for Veterans
        self.accessibility_patterns = [
            (r'<button(?!.*aria-label)', 'HIGH', 'accessibility', 
             'Button lacks aria-label - required for veteran accessibility (may have disabilities)'),
            (r'<input(?!.*aria-label)(?!.*type="(hidden|submit|button)")', 'HIGH', 'accessibility', 
             'Input lacks aria-label - required for veteran accessibility'),
            (r'<a(?!.*aria-label)(?!.*title)', 'MEDIUM', 'accessibility', 
             'Link lacks aria-label or title - affects screen reader users'),
            (r'<img(?!.*alt)', 'HIGH', 'accessibility', 
             'Image missing alt attribute - required for accessibility'),
        ]

        # Gemini Service Technical Requirements
        self.gemini_service_patterns = [
            # Check for missing try/catch around API calls
            (r'(?:\.generateContent|\.generateContentStream|\.countTokens|\.embedContent)\s*\(', 'HIGH', 'gemini-service', 
             'Gemini API call must be wrapped in try/catch with errorBoundaryService'),
            
            # Missing exponential backoff (simplified pattern without variable-width lookbehind)
            (r'[^a-zA-Z_](?:sleep|backoff|retry|exponential)[^a-zA-Z_]', 'MEDIUM', 'gemini-service', 
             'AI service should implement exponential backoff for resilience'),
        ]

        # Context usage patterns for high-stakes components
        self.context_patterns = [
            (r'useContext\s*\(\s*ToastContext', 'MEDIUM', 'context-usage', 
             'High-stakes component should use ToastContext for user feedback'),
            (r'useContext\s*\(\s*(AuthContext|EnhancedAuthContext)', 'MEDIUM', 'context-usage', 
             'Component should use AuthContext for secure veteran applications'),
        ]

    def _generate_project_manifest(self) -> Dict[str, Any]:
        """Generate project manifest with Properties 4 Creation-specific context for AI analysis."""
        return {
            'mission_statement': 'Housing veterans and families with dignity',
            'mission_prompt': self.P4C_MISSION,
            'architecture_patterns': {
                'data_access_layer': 'All data fetching must go through services/api.ts',
                'ui_components': 'Components must remain blind to data source',
                'error_handling': 'All async operations must use errorBoundaryService',
            },
            'component_relationships': {
                'pages/': ['Should import from services/api.ts for data', 'Should use ToastContext for feedback'],
                'components/': ['Atomic design - UI only, no data logic'],
                'services/': ['Data access layer - can import from data/'],
                'context/': ['Global state management - AuthContext, ToastContext'],
            },
            'service_dependencies': {
                'geminiService.ts': ['errorBoundaryService for error handling', 'exponential backoff for retries'],
                'api.ts': ['Single source for data fetching', 'Centralized error handling'],
            },
            'high_stakes_components': self.HIGH_STAKES_COMPONENTS,
            'brand_colors': self.P4C_BRAND_COLORS,
            'accessibility_standards': [
                'WCAG 2.1 AA compliance required',
                'All interactive elements must have aria-labels',
                'Images must have alt attributes',
                'Links must have aria-labels or titles',
            ],
        }

    def detect_language(self, file_path: Path) -> str:
        """Detect the programming language of a file."""
        ext = file_path.suffix.lower()
        for lang, config in self.language_handlers.items():
            if ext in config['extensions']:
                return lang
        return 'unknown'

    def count_lines_of_code(self, content: str) -> int:
        """Count lines of code (excluding empty lines and comments)."""
        lines = content.split('\n')
        code_lines = 0
        in_multiline_comment = False
        
        for line in lines:
            stripped = line.strip()
            
            # Handle multiline comments
            if '/*' in stripped and '*/' not in stripped:
                in_multiline_comment = True
                continue
            if '*/' in stripped:
                in_multiline_comment = False
                continue
            
            if in_multiline_comment:
                continue
            
            # Skip empty lines and pure comments
            if not stripped or stripped.startswith('//') or stripped.startswith('#'):
                continue
            
            code_lines += 1
        
        return code_lines

    def count_functions(self, content: str, language: str) -> int:
        """Count the number of functions in the file."""
        if language not in ['typescript', 'javascript', 'python']:
            return 0
        
        patterns = {
            'typescript': [r'function\s+\w+\s*\(', r'const\s+\w+\s*=\s*\([^)]*\)\s*=>', r'=>\s*{'],
            'python': [r'def\s+\w+\s*\(']
        }
        
        count = 0
        for pattern in patterns.get(language, []):
            count += len(re.findall(pattern, content))
        return count

    def count_imports(self, content: str) -> int:
        """Count the number of imports in the file."""
        return len(re.findall(r'^import\s+', content, re.MULTILINE))

    def analyze_file(self, file_path: Path) -> FileAnalysis:
        """Analyze a single file and return results."""
        language = self.detect_language(file_path)
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            return FileAnalysis(
                path=str(file_path),
                language='unknown',
                lines_of_code=0,
                issues=[FileIssue(
                    severity='HIGH',
                    category='io',
                    file=str(file_path),
                    line=None,
                    message=f'Failed to read file: {e}',
                    suggestion='Check file permissions and encoding'
                )]
            )

        analysis = FileAnalysis(
            path=str(file_path),
            language=language,
            lines_of_code=self.count_lines_of_code(content)
        )

        # Calculate metrics
        analysis.metrics = {
            'functions': self.count_functions(content, language),
            'imports': self.count_imports(content),
            'file_size': file_path.stat().st_size,
            'has_typescript': language == 'typescript',
        }

        # Run pattern checks
        all_patterns = [
            (self.security_patterns, 'security'),
            (self.performance_patterns, 'performance'),
            (self.typescript_patterns, 'type-safety'),
            (self.architecture_patterns, 'architecture'),
            (self.accessibility_patterns, 'accessibility'),
            (self.dignity_first_patterns, 'dignity-first'),
            (self.gemini_service_patterns, 'gemini-service'),
            (self.context_patterns, 'context-usage'),
        ]

        for patterns, category in all_patterns:
            for pattern, severity, cat, message in patterns:
                matches = list(re.finditer(pattern, content, re.MULTILINE))
                for match in matches:
                    line_no = content[:match.start()].count('\n') + 1
                    lines = content.split('\n')
                    snippet = lines[line_no - 1] if line_no <= len(lines) else None
                    
                    analysis.issues.append(FileIssue(
                        severity=severity,
                        category=cat,
                        file=str(file_path),
                        line=line_no,
                        message=message,
                        suggestion=f'Review line {line_no} for {cat} issue',
                        code_snippet=snippet.strip() if snippet else None
                    ))

        return analysis

    def check_imports_for_architecture(self, file_path: Path, content: str) -> List[FileIssue]:
        """Check imports for architectural violations with path-aware enforcement."""
        issues = []
        file_path_str = str(file_path)
        
        # Check for direct data imports (CRITICAL violation in pages/components)
        if re.search(r'import\s+.*\s+from\s+[\'"]\.{1,2}/data/', content):
            # Determine severity based on location
            if file_path_str.startswith(('pages/', 'components/')):
                severity = 'CRITICAL'
                message = 'CRITICAL: Direct data import from /data folder in UI component'
            elif file_path_str.startswith('services/'):
                severity = 'LOW'  # Allowed in services
                message = 'Data import allowed in services layer'
            else:
                severity = 'HIGH'
                message = 'Direct data import from /data folder'
            
            if severity != 'LOW':
                issues.append(FileIssue(
                    severity=severity,
                    category='architecture',
                    file=file_path_str,
                    line=None,
                    message=message,
                    suggestion='Use the API service layer instead: import { api } from "../services/api"'
                ))

        # Check for proper API service usage in pages/components
        if file_path_str.startswith(('pages/', 'components/')) and 'services/api' not in content:
            if content.startswith('import'):
                issues.append(FileIssue(
                    severity='MEDIUM',
                    category='architecture',
                    file=file_path_str,
                    line=None,
                    message='Missing API service import in UI component',
                    suggestion='Data fetching should go through services/api.ts'
                ))

        # Check high-stakes components for context usage
        filename = file_path.name
        if filename in self.HIGH_STAKES_COMPONENTS:
            if 'ToastContext' not in content:
                issues.append(FileIssue(
                    severity='MEDIUM',
                    category='context-usage',
                    file=file_path_str,
                    line=None,
                    message=f'High-stakes component {filename} should use ToastContext',
                    suggestion='Import and use ToastContext for user feedback'
                ))
            if 'AuthContext' not in content and 'EnhancedAuthContext' not in content:
                issues.append(FileIssue(
                    severity='MEDIUM',
                    category='context-usage',
                    file=file_path_str,
                    line=None,
                    message=f'High-stakes component {filename} should use AuthContext',
                    suggestion='Import and use AuthContext for secure veteran applications'
                ))

        return issues

    def calculate_quality_score(self, analyses: List[FileAnalysis]) -> Tuple[int, List[str]]:
        """Calculate overall project quality score and recommendations."""
        if not analyses:
            return 0, ['No files analyzed']

        score = 100
        recommendations = []

        total_issues = sum(len(a.issues) for a in analyses)
        critical_issues = sum(1 for a in analyses for i in a.issues if i.severity == 'CRITICAL')
        high_issues = sum(1 for a in analyses for i in a.issues if i.severity == 'HIGH')
        medium_issues = sum(1 for a in analyses for i in a.issues if i.severity == 'MEDIUM')

        # Deduct for issues
        score -= critical_issues * 15
        score -= high_issues * 10
        score -= medium_issues * 5
        score -= (total_issues - critical_issues - high_issues - medium_issues) * 1

        # Bonus for TypeScript (type safety)
        ts_count = sum(1 for a in analyses if a.language == 'typescript')
        if ts_count > 0:
            score += 5

        # Cap score
        score = max(0, min(100, score))

        # Generate recommendations
        if critical_issues > 0:
            recommendations.append(f'🔴 CRITICAL: Fix {critical_issues} critical architectural violations immediately')
        if high_issues > 0:
            recommendations.append(f'🟠 HIGH: Address {high_issues} high-priority issues')
        if medium_issues > 0:
            recommendations.append(f'🟡 MEDIUM: Consider fixing {medium_issues} medium-priority issues')
        if ts_count == 0:
            recommendations.append('ℹ️ Consider using TypeScript for better type safety')

        # Properties 4 Creation-specific recommendations
        accessibility_issues = sum(1 for a in analyses for i in a.issues if i.category == 'accessibility')
        if accessibility_issues > 0:
            recommendations.append(f'♿ ACCESSIBILITY: {accessibility_issues} issues found - veterans may have disabilities')

        return score, recommendations

    def run_analysis(self) -> ProjectAnalysis:
        """Run complete project analysis."""
        print(f"🔍 Analyzing project: {self.project_analysis.project_name}")
        print(f"📋 Properties 4 Creation Mission: {self.manifest['mission_statement']}")
        
        # Collect files
        extensions = []
        for config in self.language_handlers.values():
            extensions.extend(config['extensions'])
        
        files = []
        for root, dirs, filenames in os.walk(self.source_folder):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build', 'coverage', '.qodo', 'ai_logic_review', '__pycache__', 'test', 'tests']]
            
            for filename in filenames:
                file_path = Path(root) / filename
                if file_path.suffix.lower() in extensions:
                    files.append(file_path)

        # Analyze each file
        all_analyses = []
        for file_path in sorted(files):
            print(f"  📄 Analyzing: {file_path.relative_to(self.source_folder)}")
            analysis = self.analyze_file(file_path)
            
            # Check for architecture violations in imports
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                arch_issues = self.check_imports_for_architecture(file_path, content)
                analysis.issues.extend(arch_issues)
            except:
                pass
            
            all_analyses.append(analysis)
            self.project_analysis.file_analyses.append(analysis)

        # Categorize issues
        for analysis in all_analyses:
            for issue in analysis.issues:
                if issue.category == 'security':
                    self.project_analysis.security_issues.append(issue)
                elif issue.category == 'performance':
                    self.project_analysis.performance_issues.append(issue)
                elif issue.category == 'architecture':
                    self.project_analysis.architectural_issues.append(issue)
                elif issue.category == 'accessibility':
                    self.project_analysis.accessibility_issues.append(issue)
                elif issue.category == 'dignity-first':
                    self.project_analysis.dignity_first_violations.append(issue)

        # Calculate summary
        total_loc = sum(a.lines_of_code for a in all_analyses)
        self.project_analysis.summary = {
            'total_files': len(all_analyses),
            'total_lines_of_code': total_loc,
            'total_issues': sum(len(a.issues) for a in all_analyses),
            'critical_issues': sum(1 for a in all_analyses for i in a.issues if i.severity == 'CRITICAL'),
            'high_issues': sum(1 for a in all_analyses for i in a.issues if i.severity == 'HIGH'),
            'medium_issues': sum(1 for a in all_analyses for i in a.issues if i.severity == 'MEDIUM'),
            'low_issues': sum(1 for a in all_analyses for i in a.issues if i.severity == 'LOW'),
            'files_by_language': defaultdict(int),
            'files_with_issues': sum(1 for a in all_analyses if a.issues)
        }

        for a in all_analyses:
            self.project_analysis.summary['files_by_language'][a.language] += 1

        # Store manifest
        self.project_analysis.manifest = self.manifest

        # Calculate quality score
        self.project_analysis.quality_score, self.project_analysis.recommendations = \
            self.calculate_quality_score(all_analyses)
        
        self.project_analysis.total_issues = self.project_analysis.summary['total_issues']

        return self.project_analysis

    def generate_ai_report(self) -> str:
        """Generate a comprehensive AI-readable report with Properties 4 Creation context."""
        analysis = self.run_analysis()
        
        report = []
        report.append("=" * 80)
        report.append("🤝 Properties 4 Creation CODE REVIEW REPORT")
        report.append("=" * 80)
        report.append(f"\n📊 PROJECT SUMMARY")
        report.append(f"   Project: {analysis.project_name}")
        report.append(f"   Timestamp: {analysis.timestamp}")
        report.append(f"   Quality Score: {analysis.quality_score}/100")
        report.append(f"   Total Issues: {analysis.total_issues}")
        report.append(f"   Files Analyzed: {analysis.summary['total_files']}")
        report.append(f"   Lines of Code: {analysis.summary['total_lines_of_code']}")
        
        report.append("\n" + "=" * 80)
        report.append("🎖️ Properties 4 Creation MISSION CONTEXT")
        report.append("=" * 80)
        report.append(f"   Mission: {self.manifest['mission_statement']}")
        report.append(f"   High-Stakes Components: {', '.join(self.HIGH_STAKES_COMPONENTS)}")
        report.append(f"   Brand Colors: Navy (#0B1120), Gold (#C5A059)")
        
        report.append("\n" + "=" * 80)
        report.append("📈 QUALITY METRICS")
        report.append("=" * 80)
        report.append(f"   🔴 Critical: {analysis.summary['critical_issues']}")
        report.append(f"   🟠 High: {analysis.summary['high_issues']}")
        report.append(f"   🟡 Medium: {analysis.summary['medium_issues']}")
        report.append(f"   🟢 Low: {analysis.summary['low_issues']}")
        
        report.append("\n📁 FILES BY LANGUAGE:")
        for lang, count in sorted(analysis.summary['files_by_language'].items()):
            report.append(f"   {lang}: {count} files")

        report.append("\n" + "=" * 80)
        report.append("🚨 ISSUES BY CATEGORY")
        report.append("=" * 80)
        
        if analysis.security_issues:
            report.append("\n🔒 SECURITY ISSUES:")
            for issue in analysis.security_issues:
                report.append(f"   [{issue.severity}] {issue.file}:{issue.line or 'N/A'} - {issue.message}")
        
        if analysis.architectural_issues:
            report.append("\n🏗️ ARCHITECTURAL ISSUES:")
            for issue in analysis.architectural_issues:
                report.append(f"   [{issue.severity}] {issue.file}:{issue.line or 'N/A'} - {issue.message}")
        
        if analysis.performance_issues:
            report.append("\n⚡ PERFORMANCE ISSUES:")
            for issue in analysis.performance_issues:
                report.append(f"   [{issue.severity}] {issue.file}:{issue.line or 'N/A'} - {issue.message}")

        if analysis.accessibility_issues:
            report.append("\n♿ ACCESSIBILITY ISSUES (Veteran Support):")
            for issue in analysis.accessibility_issues:
                report.append(f"   [{issue.severity}] {issue.file}:{issue.line or 'N/A'} - {issue.message}")

        if analysis.dignity_first_violations:
            report.append("\n✨ DIGNITY-FIRST VIOLATIONS:")
            for issue in analysis.dignity_first_violations:
                report.append(f"   [{issue.severity}] {issue.file}:{issue.line or 'N/A'} - {issue.message}")

        report.append("\n" + "=" * 80)
        report.append("💡 RECOMMENDATIONS")
        report.append("=" * 80)
        for rec in analysis.recommendations:
            report.append(f"   {rec}")

        report.append("\n" + "=" * 80)
        report.append("📋 DETAILED FILE ANALYSIS")
        report.append("=" * 80)
        
        # Sort files by issue count
        sorted_files = sorted(analysis.file_analyses, key=lambda x: len(x.issues), reverse=True)
        
        for file_analysis in sorted_files[:20]:  # Top 20 files with most issues
            if file_analysis.issues:
                report.append(f"\n📄 {file_analysis.path}")
                report.append(f"   Issues: {len(file_analysis.issues)} | LOC: {file_analysis.lines_of_code}")
                for issue in file_analysis.issues[:5]:  # Top 5 issues per file
                    report.append(f"   [{issue.severity}] {issue.message}")
                    if issue.suggestion:
                        report.append(f"      💡 {issue.suggestion}")

        report.append("\n" + "=" * 80)
        report.append("END OF REPORT")
        report.append("=" * 80)
        
        return '\n'.join(report)

    def generate_json_report(self) -> str:
        """Generate a JSON report for programmatic consumption."""
        analysis = self.run_analysis()
        return json.dumps(asdict(analysis), indent=2)


if __name__ == "__main__":
    import argparse
    import codecs
    
    # Set UTF-8 encoding for Windows
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    
    parser = argparse.ArgumentParser(description='Properties 4 Creation AI-Optimized Code Review Tool')
    parser.add_argument('source', nargs='?', default='.', help='Source folder to analyze')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    parser.add_argument('--output', '-o', help='Output file path')
    
    args = parser.parse_args()
    
    analyzer = CodeReviewAnalyzer(args.source)
    
    if args.json:
        report = analyzer.generate_json_report()
    else:
        report = analyzer.generate_ai_report()
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"Report saved to: {args.output}")
    else:
        print(report)
