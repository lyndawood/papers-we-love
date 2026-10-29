#!/usr/bin/env python3
"""
Parse papers from README.md files in the papers-we-love repository.
Extracts paper metadata and saves to a JSON file for the web app.
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Any

def parse_readme(filepath: str, category: str) -> List[Dict[str, Any]]:
    """Parse a README.md file and extract papers."""
    papers = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return papers
    
    # Split by lines
    lines = content.split('\n')
    
    # Pattern to match paper entries
    # Matches: * [Title](url) or * [:scroll:] [Title](url)
    paper_pattern = r'\*\s*(?:\[:scroll:\])?\s*\[([^\]]+)\]\(([^)]+)\)'
    
    for i, line in enumerate(lines):
        match = re.search(paper_pattern, line)
        if match:
            title = match.group(1).strip()
            url = match.group(2).strip()
            
            # Get description from next lines if available
            description = ""
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                # Check if next line is a description (indented or starts with text)
                if next_line and not next_line.startswith('*') and not next_line.startswith('#'):
                    description = next_line
            
            # Skip if title is empty
            if not title:
                continue
            
            papers.append({
                'title': title,
                'url': url,
                'category': category,
                'description': description,
                'local_pdf': url.endswith('.pdf') and not url.startswith('http')
            })
    
    return papers

def get_category_name(path: str) -> str:
    """Convert directory path to category name."""
    # Get the directory name
    dirname = os.path.basename(os.path.dirname(path))
    # Convert underscores and hyphens to spaces, title case
    return dirname.replace('_', ' ').replace('-', ' ').title()

def main():
    """Main function to parse all papers."""
    all_papers = []
    repo_root = Path('.')
    
    # Find all README.md files in subdirectories
    for readme_path in sorted(repo_root.glob('*/README.md')):
        category = get_category_name(str(readme_path))
        papers = parse_readme(str(readme_path), category)
        all_papers.extend(papers)
        print(f"Found {len(papers)} papers in {category}")
    
    # Also check nested directories (e.g., languages/haskell/README.md)
    for readme_path in sorted(repo_root.glob('*/*/README.md')):
        parent_dir = readme_path.parent.name
        grandparent_dir = readme_path.parent.parent.name
        category = f"{grandparent_dir.replace('_', ' ').replace('-', ' ').title()} - {parent_dir.replace('_', ' ').replace('-', ' ').title()}"
        papers = parse_readme(str(readme_path), category)
        all_papers.extend(papers)
        if papers:
            print(f"Found {len(papers)} papers in {category}")
    
    # Save to JSON
    output_file = 'papers.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_papers, f, indent=2, ensure_ascii=False)
    
    print(f"\nTotal papers found: {len(all_papers)}")
    print(f"Saved to {output_file}")
    
    # Print categories
    categories = sorted(set(p['category'] for p in all_papers))
    print(f"\nCategories ({len(categories)}):")
    for cat in categories:
        count = len([p for p in all_papers if p['category'] == cat])
        print(f"  - {cat}: {count} papers")

if __name__ == '__main__':
    main()
