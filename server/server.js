const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(bodyParser.json());

const setupEnvironment = (script) => {
  switch (script) {
    case '1_find_system_groups.sh':
      return `mkdir -p /tmp/sandbox && cd /tmp/sandbox && touch /tmp/sandbox/test_passwd && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '2_find_files_with_access_rights.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/file2 && mkdir -p /tmp/sandbox/test_dir/subdir && touch /tmp/sandbox/test_dir/subdir/file3 && chmod u+x,g+w /tmp/sandbox/test_dir/file1 && chmod u+x,g-w /tmp/sandbox/test_dir/file2 && chmod u-x,g+w /tmp/sandbox/test_dir/subdir/file3 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '3_find_all_scripts.sh':
      return `mkdir -p /tmp/sandbox/test_dir && echo '#!/bin/bash' > /tmp/sandbox/test_dir/script1.sh && chmod +x /tmp/sandbox/test_dir/script1.sh && echo 'echo "Hello, World!"' >> /tmp/sandbox/test_dir/script1.sh && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '4_search_scripts_by_user.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/script1.sh && chmod +x /tmp/sandbox/test_dir/script1.sh && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '5_recursive_search_words.sh':
      return `mkdir -p /tmp/sandbox/test_dir && echo "This is a test file" > /tmp/sandbox/test_dir/test.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '6_find_duplicate_files.sh':
      return `mkdir -p /tmp/sandbox/test_dir && echo "Test file content" > /tmp/sandbox/test_dir/file1.txt && echo "Test file content" > /tmp/sandbox/test_dir/file2.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '7_find_symbolic_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && ln -s /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '8_find_hard_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && ln /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/hardlink1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '9_find_names_by_inode.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '10_find_names_by_inode_multiple_partitions.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '11_delete_file_with_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && ln -s /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '12_recursive_change_permissions.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && chmod 644 /tmp/sandbox/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '13_compare_directories.sh':
      return `mkdir -p /tmp/sandbox/dir1 && mkdir -p /tmp/sandbox/dir2 && echo "File in dir1" > /tmp/sandbox/dir1/file1.txt && echo "File in dir2" > /tmp/sandbox/dir2/file1.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '14_get_mac_addresses.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '15_list_authorized_users.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '16_list_active_network_connections.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '17_reassign_symbolic_link.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && ln -s /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '18_create_symbolic_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && echo "/tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/link1" > /tmp/sandbox/file_list && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '19_copy_directory_with_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && ln -s /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '20_copy_directory_with_symlinks.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && ln -s /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '21_copy_with_attributes.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '22_convert_relative_to_direct_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && ln -s file1 /tmp/sandbox/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '23_convert_direct_to_relative_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && ln -s /tmp/sandbox/test_dir/file1 /tmp/sandbox/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '24_find_and_delete_broken_links.sh':
      return `mkdir -p /tmp/sandbox/test_dir && ln -s /tmp/sandbox/test_dir/non_existent /tmp/sandbox/test_dir/broken_link && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '25_unpack_archive.sh':
      return `mkdir -p /tmp/sandbox/test_dir && echo "Test file" > /tmp/sandbox/test_dir/file1 && tar -cvf /tmp/sandbox/test_archive.tar /tmp/sandbox/test_dir && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '26_pack_directory_with_attributes.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '27_copy_directory_structure.sh':
      return `mkdir -p /tmp/sandbox/test_dir/subdir1 && mkdir -p /tmp/sandbox/test_dir/subdir2 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '28_list_users_alphabetically.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '29_list_system_users_sorted_by_id.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '30_list_users_sorted_by_reverse_id.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '31_list_users_without_authorization_rights.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '32_list_users_with_or_without_terminal.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '33_download_all_links_from_page.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '34_stop_long_running_processes.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '35_delete_orphaned_jpeg_files.sh':
      return `mkdir -p /tmp/sandbox/test_dir && touch /tmp/sandbox/test_dir/file1.txt && touch /tmp/sandbox/test_dir/file1.jpeg && touch /tmp/sandbox/test_dir/file2.jpeg && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '36_find_ip_address.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '37_get_all_ip_addresses_from_file.sh':
      return `mkdir -p /tmp/sandbox/test_dir && echo "192.168.1.1" > /tmp/sandbox/test_dir/ips.txt && echo "10.0.0.1" >> /tmp/sandbox/test_dir/ips.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '38_find_active_hosts.sh':
      return `mkdir -p /tmp/sandbox/test_dir && echo "192.168.1.1" > /tmp/sandbox/test_dir/hosts.txt && echo "10.0.0.1" >> /tmp/sandbox/test_dir/hosts.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '39_get_raised_interfaces_ips.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '40_get_subdomains_from_ssl.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '41_extract_path_name_extension.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '42_delete_files_by_size_and_pattern.sh':
      return `mkdir -p /tmp/sandbox/test_dir && dd if=/dev/zero of=/tmp/sandbox/test_dir/file1.txt bs=1 count=22 && touch /tmp/sandbox/test_dir/file2.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '43_create_files_with_identifiers.sh':
      return `mkdir -p /tmp/sandbox/test_dir && echo "/tmp/sandbox/test_dir/file1 1234" > /tmp/sandbox/file_list && echo "/tmp/sandbox/test_dir/file2 5678" >> /tmp/sandbox/file_list && echo "Настройка песочницы для тестирования ${script} завершена"`;
    default:
      return `echo "Нет настроек для скрипта ${script}"`;
  }
};

const cleanupEnvironment = () => {
  return `rm -rf /tmp/sandbox && echo "Очистка песочницы завершена"`;
};

app.post('/run-script', (req, res) => {
  const { script } = req.body;
  const scriptPath = path.join(__dirname, 'scripts', script);

  const setupCommand = setupEnvironment(script);
  const cleanupCommand = cleanupEnvironment();
  const command = `bash ${scriptPath}`;

  const fullCommand = `${setupCommand} && ${command} && ${cleanupCommand}`;

  exec(fullCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
