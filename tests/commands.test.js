const { setupCommands, commands, destroyCommands } = require('../server/scripts/commands');

test('setupCommands contains valid command for 1_find_system_groups.sh', () => {
  expect(setupCommands['1_find_system_groups.sh']).toBeDefined();
  expect(typeof setupCommands['1_find_system_groups.sh']).toBe('string');
});

test('commands contains valid command for 1_find_system_groups.sh', () => {
  expect(commands['1_find_system_groups.sh']).toBeDefined();
  expect(typeof commands['1_find_system_groups.sh']).toBe('string');
});

test('destroyCommands contains valid command for 1_find_system_groups.sh', () => {
  expect(destroyCommands['1_find_system_groups.sh']).toBeDefined();
  expect(typeof destroyCommands['1_find_system_groups.sh']).toBe('string');
});

// Adding more tests for other scripts
const scripts = [
  '2_find_files_with_access_rights.sh',
  '3_find_all_scripts.sh',
  '4_search_scripts_by_user.sh',
  '5_recursive_search_words.sh',
  '6_find_duplicate_files.sh',
  '7_find_symbolic_links.sh',
  '8_find_hard_links.sh',
  '9_find_names_by_inode.sh',
  '10_find_names_by_inode_multiple_partitions.sh',
  '11_delete_file_with_links.sh',
  '12_recursive_change_permissions.sh',
  '13_compare_directories.sh',
  '14_get_mac_addresses.sh',
  '15_list_authorized_users.sh',
  '16_list_active_network_connections.sh',
  '17_reassign_symbolic_link.sh',
  '18_create_symbolic_links.sh',
  '19_copy_directory_with_links.sh',
  '20_copy_directory_with_symlinks.sh',
  '21_copy_with_attributes.sh',
  '22_convert_relative_to_direct_links.sh',
  '23_convert_direct_to_relative_links.sh',
  '24_find_and_delete_broken_links.sh',
  '25_unpack_archive.sh',
  '26_pack_directory_with_attributes.sh',
  '27_copy_directory_structure.sh',
  '28_list_users_alphabetically.sh',
  '29_list_system_users_sorted_by_id.sh',
  '30_list_users_sorted_by_reverse_id.sh',
  '31_list_users_without_authorization_rights.sh',
  '32_list_users_with_or_without_terminal.sh',
  '33_download_all_links_from_page.sh',
  '34_stop_long_running_processes.sh',
  '35_delete_orphaned_jpeg_files.sh',
  '36_find_ip_address.sh',
  '37_get_all_ip_addresses_from_file.sh',
  '38_find_active_hosts.sh',
  '39_get_raised_interfaces_ips.sh',
  '40_get_subdomains_from_ssl.sh',
  '41_extract_path_name_extension.sh',
  '42_delete_files_by_size_and_pattern.sh',
  '43_create_files_with_identifiers.sh',
];

scripts.forEach(script => {
  test(`setupCommands contains valid command for ${script}`, () => {
    expect(setupCommands[script]).toBeDefined();
    expect(typeof setupCommands[script]).toBe('string');
  });

  test(`commands contains valid command for ${script}`, () => {
    expect(commands[script]).toBeDefined();
    expect(typeof commands[script]).toBe('string');
  });

  test(`destroyCommands contains valid command for ${script}`, () => {
    expect(destroyCommands[script]).toBeDefined();
    expect(typeof destroyCommands[script]).toBe('string');
  });
});
