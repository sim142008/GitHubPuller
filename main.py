#!/usr/bin/env python3
"""
GitHub Repository Viewer

A command-line tool to browse and view files from a GitHub repository.
"""

import os
import sys
from github_repo_viewer import GitHubRepoViewer

def main():
    """Main entry point for the application."""
    # The repository we want to browse
    owner = "sim142008"
    repo = "ccc"
    
    # Get GitHub token from environment variable if available
    github_token = os.getenv("GITHUB_TOKEN", None)
    
    # Create the GitHub repository viewer
    viewer = GitHubRepoViewer(owner, repo, github_token)
    
    try:
        # Start the interactive viewer
        viewer.run()
    except KeyboardInterrupt:
        print("\nExiting program...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
