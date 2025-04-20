#!/usr/bin/env python3
"""
GitHub Repository Downloader

This module downloads all files and folders from a GitHub repository to the local filesystem.
"""

import os
import sys
import requests
import base64
from typing import List, Dict, Any, Optional
import time

class GitHubRepoDownloader:
    """A class for downloading files from a GitHub repository."""
    
    def __init__(self, owner: str, repo: str, token: Optional[str] = None, target_dir: str = '.'):
        """
        Initialize the GitHub repository downloader.
        
        Args:
            owner: GitHub username/organization that owns the repository
            repo: Name of the repository
            token: GitHub personal access token (optional)
            target_dir: Local directory to save files to
        """
        self.owner = owner
        self.repo = repo
        self.api_base_url = f"https://api.github.com/repos/{owner}/{repo}/contents"
        self.headers = {}
        self.target_dir = target_dir
        
        if token:
            self.headers["Authorization"] = f"token {token}"
        
        # Create target directory if it doesn't exist
        os.makedirs(self.target_dir, exist_ok=True)
    
    def download_repository(self) -> None:
        """Download all files and folders from the repository."""
        print(f"\nDownloading GitHub repository: {self.owner}/{self.repo}")
        print("="*60)
        
        try:
            # Start from the root directory
            self._download_contents("")
            print("\nRepository download complete!")
        except KeyboardInterrupt:
            print("\nDownload interrupted. Some files may not have been downloaded.")
        except Exception as e:
            print(f"Error during download: {e}")
    
    def _download_contents(self, path: str) -> None:
        """
        Recursively download contents from the specified path.
        
        Args:
            path: The path within the repository
        """
        try:
            contents = self._fetch_contents(path)
            
            # Create local directory for this path
            local_path = os.path.join(self.target_dir, path) if path else self.target_dir
            os.makedirs(local_path, exist_ok=True)
            
            for item in contents:
                if item["type"] == "dir":
                    # Handle directory: recursive call
                    print(f"Processing directory: {item['path']}")
                    self._download_contents(item["path"])
                else:
                    # Handle file: download it
                    file_path = os.path.join(local_path, item["name"])
                    print(f"Downloading file: {item['path']}")
                    self._download_file(item, file_path)
                    # Add a small delay to avoid hitting API rate limits
                    time.sleep(0.1)
        
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch contents at path {path}: {e}")
    
    def _fetch_contents(self, path: str) -> List[Dict[str, Any]]:
        """
        Fetch the contents of the specified path in the repository.
        
        Args:
            path: The path within the repository
            
        Returns:
            List of items in the specified path
        """
        url = self.api_base_url
        if path:
            url = f"{url}/{path}"
        
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 404:
            print(f"Path not found: {path}")
            return []
        
        if response.status_code == 403 and 'rate limit' in response.text.lower():
            print("GitHub API rate limit exceeded. Please try again later or use a token.")
            print("Sleeping for 60 seconds...")
            time.sleep(60)  # Wait for a minute and try again
            return self._fetch_contents(path)
        
        response.raise_for_status()
        return response.json()
    
    def _download_file(self, file_info: Dict[str, Any], target_path: str) -> None:
        """
        Download a file from the repository.
        
        Args:
            file_info: File information from the GitHub API
            target_path: Local path to save the file to
        """
        try:
            response = requests.get(file_info["download_url"], headers=self.headers)
            response.raise_for_status()
            
            with open(target_path, 'wb') as f:
                f.write(response.content)
                
        except requests.exceptions.RequestException as e:
            print(f"Failed to download file {file_info['path']}: {e}")