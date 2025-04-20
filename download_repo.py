#!/usr/bin/env python3
"""
Download GitHub Repository

A script to download all files and folders from a GitHub repository to the local filesystem.
"""

import os
import sys
from github_repo_downloader import GitHubRepoDownloader

def main():
    """Main entry point for the application."""
    # The repository we want to download
    owner = "sim142008"
    repo = "ccc"
    
    # Get GitHub token from environment variable if available
    github_token = os.getenv("GITHUB_TOKEN", None)
    
    # Target directory for downloaded files (create a subdirectory with repo name)
    target_dir = repo
    
    # Create the GitHub repository downloader
    downloader = GitHubRepoDownloader(owner, repo, github_token, target_dir)
    
    try:
        # Start the download process
        downloader.download_repository()
    except KeyboardInterrupt:
        print("\nDownload interrupted...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()