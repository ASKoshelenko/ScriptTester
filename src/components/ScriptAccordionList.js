import React, { useState } from 'react';
import ScriptAccordion from './ScriptAccordion';

const scripts = {
  '1_find_system_groups.sh': 'Find all system groups and save their unique names and IDs to a file.',
  '2_find_files_with_access_rights.sh': 'Find all files and directories with specific access rights.',
  '3_find_all_scripts.sh': 'Find all scripts in the specified directory and its subdirectories.',
  '4_search_scripts_by_user.sh': 'Find all script files owned by the specified user.',
  '5_recursive_search_words.sh': 'Recursively search for words or phrases in files of the specified type.',
  '6_find_duplicate_files.sh': 'Find duplicate files in the specified directories.',
  '7_find_symbolic_links.sh': 'Find all symbolic links pointing to the specified file.',
  '8_find_hard_links.sh': 'Find all hard links pointing to the specified file.',
  '9_find_names_by_inode.sh': 'Find all file names by their inode.',
  '10_find_names_by_inode_multiple_partitions.sh': 'Find all file names by their inode, considering multiple mounted partitions.',
  '11_delete_file_with_links.sh': 'Correctly delete a file considering symbolic or hard links.',
  '12_recursive_change_permissions.sh': 'Recursively change file permissions in the specified directory.',
  '13_compare_directories.sh': 'Recursively compare two directories and show only differing files.',
  '14_get_mac_addresses.sh': 'Get the MAC addresses of network interfaces.',
  '15_list_authorized_users.sh': 'List all authorized users currently logged into the system.',
  '16_list_active_network_connections.sh': 'List all active network connections in a table format.',
  '17_reassign_symbolic_link.sh': 'Reassign an existing symbolic link to a new target.',
  '18_create_symbolic_links.sh': 'Create symbolic links to specified files.',
  '19_copy_directory_with_links.sh': 'Copy a directory, preserving existing symbolic links.',
  '20_copy_directory_with_symlinks.sh': 'Copy a directory, preserving direct and symbolic links.',
  '21_copy_with_attributes.sh': 'Copy all files and directories from the specified directory to a new location, preserving attributes and permissions.',
  '22_convert_relative_to_direct_links.sh': 'Convert all relative links in the project to direct links.',
  '23_convert_direct_to_relative_links.sh': 'Convert all direct links in the project to relative links, relative to the project directory.',
  '24_find_and_delete_broken_links.sh': 'Find and delete all broken links in the specified directory.',
  '25_unpack_archive.sh': 'Unpack a tar, gz, bz2, lz, lzma, xz, Z archive to the specified location.',
  '26_pack_directory_with_attributes.sh': 'Pack a directory structure with files, preserving all attributes and permissions.',
  '27_copy_directory_structure.sh': 'Recursively copy the directory structure from the specified directory.',
  '28_list_users_alphabetically.sh': 'List all system users (only names) in alphabetical order.',
  '29_list_system_users_sorted_by_id.sh': 'List all system users, sorted by ID.',
  '30_list_users_sorted_by_reverse_id.sh': 'List all system users, sorted by ID in reverse order.',
  '31_list_users_without_authorization_rights.sh': 'List all users who do not have login rights.',
  '32_list_users_with_or_without_terminal.sh': 'List all users with or without a terminal.',
  '33_download_all_links_from_page.sh': 'Download all href links from a webpage.',
  '34_stop_long_running_processes.sh': 'Stop processes running for more than 5 days.',
  '35_delete_orphaned_jpeg_files.sh': 'Delete all .jpeg files without corresponding .txt files.',
  '36_find_ip_address.sh': 'Find your IP address using the command line.',
  '37_get_all_ip_addresses_from_file.sh': 'Get all IP addresses from a text file.',
  '38_find_active_hosts.sh': 'Find all active hosts in the specified network or list of IPs.',
  '39_get_raised_interfaces_ips.sh': 'Get the IP addresses of all raised interfaces.',
  '40_get_subdomains_from_ssl.sh': 'Get all subdomains from an SSL certificate.',
  '41_extract_path_name_extension.sh': 'Extract the path, name, and extension of a file from a string in Bash.',
  '42_delete_files_by_size_and_pattern.sh': 'Delete files of the specified size and name pattern from the specified directory.',
  '43_create_files_with_identifiers.sh': 'Create files and write corresponding identifiers to them from a list.'
};

const ScriptAccordionList = () => {
  const [openScript, setOpenScript] = useState(null);

  const handleToggle = (script) => {
    setOpenScript(openScript === script ? null : script);
  };

  return (
    <div className="script-accordion-list">
      {Object.keys(scripts).map((script) => (
        <ScriptAccordion
          key={script}
          script={script}
          description={scripts[script]}
          isOpen={openScript === script}
          onToggle={() => handleToggle(script)}
        />
      ))}
    </div>
  );
};

export default ScriptAccordionList;
