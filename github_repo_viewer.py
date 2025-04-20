#!/usr/bin/env python3
"""
GitHub Repository Viewer Module

This module provides functionality to browse and view files from a GitHub repository.
"""

import os
import sys
import requests
import base64
from typing import List, Dict, Any, Optional
import textwrap

class GitHubRepoViewer:
    """A class for browsing and viewing files from a GitHub repository."""
    
    def __init__(self, owner: str, repo: str, token: Optional[str] = None):
        """
        Initialize the GitHub repository viewer.
        
        Args:
            owner: GitHub username/organization that owns the repository
            repo: Name of the repository
            token: GitHub personal access token (optional)
        """
        self.owner = owner
        self.repo = repo
        self.api_base_url = f"https://api.github.com/repos/{owner}/{repo}/contents"
        self.headers = {}
        
        if token:
            self.headers["Authorization"] = f"token {token}"
        
        self.current_path = ""
        self.nav_history = []
        self.binary_extensions = [
            '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp',
            '.mp3', '.wav', '.ogg', '.m4a', '.mp4', '.avi', '.mov',
            '.ttf', '.otf', '.woff', '.woff2', '.eot',
            '.zip', '.tar', '.gz', '.rar', '.exe', '.dll', '.so', '.dylib'
        ]
    
    def run(self) -> None:
        """Start the interactive GitHub repository viewer."""
        print(f"\nViewing GitHub repository: {self.owner}/{self.repo}")
        print("="*60)
        
        while True:
            try:
                self._display_current_directory()
                self._handle_user_input()
            except KeyboardInterrupt:
                print("\nExiting program...")
                break
            except Exception as e:
                print(f"Error: {e}")
                input("Press Enter to continue...")
    
    def _display_current_directory(self) -> None:
        """Display the contents of the current directory."""
        try:
            contents = self._fetch_contents(self.current_path)
            
            # Sort directories first, then files
            directories = [item for item in contents if item["type"] == "dir"]
            files = [item for item in contents if item["type"] == "file"]
            
            directories.sort(key=lambda x: x["name"].lower())
            files.sort(key=lambda x: x["name"].lower())
            
            path_display = f"/{self.current_path}" if self.current_path else "/"
            print(f"\nCurrent path: {path_display}")
            print("-"*60)
            
            # Print navigation options
            if self.nav_history:
                print("[0] Go back to previous directory")
            
            # Print directories
            for i, directory in enumerate(directories, 1):
                print(f"[{i}] 📁 {directory['name']}/")
            
            # Print files
            for i, file in enumerate(files, len(directories) + 1):
                print(f"[{i}] 📄 {file['name']}")
            
            print("-"*60)
            
            self.contents = directories + files
            
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch repository contents: {e}")
            self.contents = []
    
    def _handle_user_input(self) -> None:
        """Handle user input for navigation and file viewing."""
        choice = input("Enter number to navigate or view file (q to quit): ")
        
        if choice.lower() == 'q':
            raise KeyboardInterrupt
        
        try:
            index = int(choice)
            
            # Handle "go back" option
            if index == 0 and self.nav_history:
                self.current_path = self.nav_history.pop()
                return
            
            # Adjust index to account for the contents list
            adjusted_index = index - 1
            
            if 0 <= adjusted_index < len(self.contents):
                selected = self.contents[adjusted_index]
                
                if selected["type"] == "dir":
                    # Navigate to directory
                    self.nav_history.append(self.current_path)
                    self.current_path = selected["path"]
                else:
                    # View file
                    self._display_file(selected)
                    input("\nPress Enter to return to directory view...")
            else:
                print("Invalid selection. Please try again.")
        except ValueError:
            print("Please enter a valid number.")
    
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
        
        response.raise_for_status()
        return response.json()
    
    def _display_file(self, file_info: Dict[str, Any]) -> None:
        """
        Display the contents of a file.
        
        Args:
            file_info: File information from the GitHub API
        """
        print(f"\nFile: {file_info['name']}")
        print("="*60)
        
        # Check if file is too large
        if file_info.get("size", 0) > 1000000:  # 1MB limit
            print("File is too large to display. Please download it from GitHub.")
            print(f"View online: {file_info['html_url']}")
            return
        
        # Check if file has a binary extension
        file_ext = os.path.splitext(file_info['name'])[1].lower()
        if file_ext in self.binary_extensions:
            print(f"Binary file. Cannot display contents in terminal.")
            print(f"View online: {file_info['html_url']}")
            return
        
        try:
            # Fetch file content
            response = requests.get(file_info["download_url"], headers=self.headers)
            response.raise_for_status()
            
            try:
                # Try to display as text
                content = response.text
                terminal_width = os.get_terminal_size().columns - 4
                
                # Wrap text to terminal width
                wrapped_content = "\n".join([
                    textwrap.fill(line, width=terminal_width, replace_whitespace=False, 
                                 drop_whitespace=False) 
                    for line in content.split("\n")
                ])
                
                print(wrapped_content)
            except UnicodeDecodeError:
                print("Cannot display binary file contents.")
                print(f"View online: {file_info['html_url']}")
                
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch file contents: {e}")
