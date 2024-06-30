const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 5001;
const sandboxDir = '/home/ask/ubuntu-scripts-tester/sandbox';
const logFile = '/home/ask/ubuntu-scripts-tester/log.txt';

app.use(cors());
app.use(express.json());

app.post('/setup-environment', (req, res) => {
  const script = req.body.script;
  const command = setupEnvironment(script);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error setting up environment: ${error.message}`);
      return res.status(500).json({ error: `Error setting up environment: ${stderr || error.message}` });
    }
    res.json({ output: stdout });
  });
});

app.post('/destroy-environment', (req, res) => {
  const command = `rm -rf ${sandboxDir} && echo "Environment destroyed"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error destroying environment: ${error.message}`);
      return res.status(500).json({ error: `Error destroying environment: ${stderr || error.message}` });
    }
    res.json({ output: stdout });
  });
});

app.post('/run-script', (req, res) => {
  const script = req.body.script;
  const command = runScript(script);

  exec(command, { cwd: sandboxDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running script: ${error.message}`);
      return res.status(500).json({ error: `Error running script: ${stderr || error.message}` });
    }
    res.json({ output: stdout });
  });
});

const setupEnvironment = (script) => {
  switch (script) {
    case '1_find_system_groups.sh':
      return `mkdir -p ${sandboxDir} && cd ${sandboxDir} && touch ${sandboxDir}/test_passwd && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '2_find_files_with_access_rights.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/file2 && mkdir -p ${sandboxDir}/test_dir/subdir && touch ${sandboxDir}/test_dir/subdir/file3 && chmod u+x,g+w ${sandboxDir}/test_dir/file1 && chmod u+x,g-w ${sandboxDir}/test_dir/file2 && chmod u-x,g+w ${sandboxDir}/test_dir/subdir/file3 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '3_find_all_scripts.sh':
      return `mkdir -p ${sandboxDir}/test_dir && echo '#!/bin/bash' > ${sandboxDir}/test_dir/script1.sh && chmod +x ${sandboxDir}/test_dir/script1.sh && echo 'echo "Hello, World!"' >> ${sandboxDir}/test_dir/script1.sh && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '4_search_scripts_by_user.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/script1.sh && chmod +x ${sandboxDir}/test_dir/script1.sh && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '5_recursive_search_words.sh':
      return `mkdir -p ${sandboxDir}/test_dir && echo "This is a test file" > ${sandboxDir}/test_dir/test.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '6_find_duplicate_files.sh':
      return `mkdir -p ${sandboxDir}/test_dir && echo "Test file content" > ${sandboxDir}/test_dir/file1.txt && echo "Test file content" > ${sandboxDir}/test_dir/file2.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '7_find_symbolic_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && ln -s ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '8_find_hard_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && ln ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/hardlink1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '9_find_names_by_inode.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '10_find_names_by_inode_multiple_partitions.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '11_delete_file_with_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && ln -s ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '12_recursive_change_permissions.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && chmod 644 ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '13_compare_directories.sh':
      return `mkdir -p ${sandboxDir}/dir1 && mkdir -p ${sandboxDir}/dir2 && echo "File in dir1" > ${sandboxDir}/dir1/file1.txt && echo "File in dir2" > ${sandboxDir}/dir2/file1.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '14_get_mac_addresses.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '15_list_authorized_users.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '16_list_active_network_connections.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '17_reassign_symbolic_link.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && ln -s ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '18_create_symbolic_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && echo "${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1" > ${sandboxDir}/file_list && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '19_copy_directory_with_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && ln -s ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '20_copy_directory_with_symlinks.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && ln -s ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '21_copy_with_attributes.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '22_convert_relative_to_direct_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && ln -s file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '23_convert_direct_to_relative_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && ln -s ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '24_find_and_delete_broken_links.sh':
      return `mkdir -p ${sandboxDir}/test_dir && ln -s ${sandboxDir}/test_dir/non_existent ${sandboxDir}/test_dir/broken_link && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '25_unpack_archive.sh':
      return `mkdir -p ${sandboxDir}/test_dir && echo "Test file" > ${sandboxDir}/test_dir/file1 && tar -cvf ${sandboxDir}/test_archive.tar ${sandboxDir}/test_dir && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '26_pack_directory_with_attributes.sh':
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '27_copy_directory_structure.sh':
      return `mkdir -p ${sandboxDir}/test_dir/subdir1 && mkdir -p ${sandboxDir}/test_dir/subdir2 && echo "Настройка песочницы для тестирования ${script} завершена"`;
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
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1.txt && touch ${sandboxDir}/test_dir/file1.jpeg && touch ${sandboxDir}/test_dir/file2.jpeg && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '36_find_ip_address.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '37_get_all_ip_addresses_from_file.sh':
      return `mkdir -p ${sandboxDir}/test_dir && echo "192.168.1.1" > ${sandboxDir}/test_dir/ips.txt && echo "10.0.0.1" >> ${sandboxDir}/test_dir/ips.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '38_find_active_hosts.sh':
      return `mkdir -p ${sandboxDir}/test_dir && echo "192.168.1.1" > ${sandboxDir}/test_dir/hosts.txt && echo "10.0.0.1" >> ${sandboxDir}/test_dir/hosts.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '39_get_raised_interfaces_ips.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '40_get_subdomains_from_ssl.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '41_extract_path_name_extension.sh':
      return `echo "Настройка песочницы не требуется для тестирования ${script}"`;
    case '42_delete_files_by_size_and_pattern.sh':
      return `mkdir -p ${sandboxDir}/test_dir && dd if=/dev/zero of=${sandboxDir}/test_dir/file1.txt bs=1 count=22 && touch ${sandboxDir}/test_dir/file2.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
    case '43_create_files_with_identifiers.sh':
      return `mkdir -p ${sandboxDir}/test_dir && echo "${sandboxDir}/test_dir/file1 1234" > ${sandboxDir}/file_list && echo "${sandboxDir}/test_dir/file2 5678" >> ${sandboxDir}/file_list && echo "Настройка песочницы для тестирования ${script} завершена"`;
    default:
      return `echo "Нет настроек для скрипта ${script}"`;
  }
};

const runScript = (script) => {
  switch (script) {
    case '1_find_system_groups.sh':
      return `cat /etc/group | grep '^[^:]*:[^:]*:[1-9][0-9]*:' | sort -u -t: -k3,3 > ${sandboxDir}/system_groups.txt && echo "Task completed"`;
    case '2_find_files_with_access_rights.sh':
      return `find . -perm -u=x,g=w && echo "Task completed"`;
    case '3_find_all_scripts.sh':
      return `find . -type f -name '*.sh' && echo "Task completed"`;
    case '4_search_scripts_by_user.sh':
      return `find . -type f -name '*.sh' -user $(whoami) && echo "Task completed"`;
    case '5_recursive_search_words.sh':
      return `grep -r 'word_to_search' --include \\*.txt && echo "Task completed"`;
    case '6_find_duplicate_files.sh':
      return `find . -type f -exec cksum {} + | sort | uniq -w32 -dD && echo "Task completed"`;
    case '7_find_symbolic_links.sh':
      return `find . -type l && echo "Task completed"`;
    case '8_find_hard_links.sh':
      return `find . -samefile && echo "Task completed"`;
    case '9_find_names_by_inode.sh':
      return `find . -inum $(stat -c '%i' ${sandboxDir}/test_dir/file1) && echo "Task completed"`;
    case '10_find_names_by_inode_multiple_partitions.sh':
      return `find /mnt /media -inum $(stat -c '%i' ${sandboxDir}/test_dir/file1) && echo "Task completed"`;
    case '11_delete_file_with_links.sh':
      return `find . -type f -links +1 -exec rm {} + && echo "Task completed"`;
    case '12_recursive_change_permissions.sh':
      return `chmod -R 755 ${sandboxDir}/test_dir && echo "Task completed"`;
    case '13_compare_directories.sh':
      return `diff -qr ${sandboxDir}/dir1 ${sandboxDir}/dir2 && echo "Task completed"`;
    case '14_get_mac_addresses.sh':
      return `ip link show | grep link/ether && echo "Task completed"`;
    case '15_list_authorized_users.sh':
      return `who && echo "Task completed"`;
    case '16_list_active_network_connections.sh':
      return `netstat -an | grep ESTABLISHED | wc -l && echo "Task completed"`;
    case '17_reassign_symbolic_link.sh':
      return `ln -sf /new/path/to/file ${sandboxDir}/test_dir/link1 && echo "Task completed"`;
    case '18_create_symbolic_links.sh':
      return `while IFS= read -r line; do set -- $line; ln -s $1 $2; done < ${sandboxDir}/file_list && echo "Task completed"`;
    case '19_copy_directory_with_links.sh':
      return `cp -a ${sandboxDir}/test_dir ${sandboxDir}/test_dir_copy && echo "Task completed"`;
    case '20_copy_directory_with_symlinks.sh':
      return `cp -a ${sandboxDir}/test_dir ${sandboxDir}/test_dir_copy && echo "Task completed"`;
    case '21_copy_with_attributes.sh':
      return `cp -a ${sandboxDir}/test_dir ${sandboxDir}/test_dir_copy && echo "Task completed"`;
    case '22_convert_relative_to_direct_links.sh':
      return `find ${sandboxDir}/test_dir -type l -exec sh -c 'ln -sf $(readlink -f $0) $0' {} \\; && echo "Task completed"`;
    case '23_convert_direct_to_relative_links.sh':
      return `find ${sandboxDir}/test_dir -type l -exec sh -c 'ln -sf $(realpath --relative-to=$(dirname $0) $(readlink $0)) $0' {} \\; && echo "Task completed"`;
    case '24_find_and_delete_broken_links.sh':
      return `find ${sandboxDir}/test_dir -xtype l -delete && echo "Task completed"`;
    case '25_unpack_archive.sh':
      return `tar -xvf ${sandboxDir}/test_archive.tar -C ${sandboxDir}/unpacked && echo "Task completed"`;
    case '26_pack_directory_with_attributes.sh':
      return `tar -cvf ${sandboxDir}/packed_archive.tar ${sandboxDir}/test_dir && echo "Task completed"`;
    case '27_copy_directory_structure.sh':
      return `find ${sandboxDir}/test_dir -type d -exec mkdir -p ${sandboxDir}/test_dir_copy/{} \\; && echo "Task completed"`;
    case '28_list_users_alphabetically.sh':
      return `cut -d: -f1 /etc/passwd | sort && echo "Task completed"`;
    case '29_list_system_users_sorted_by_id.sh':
      return `awk -F: '$3 < 1000 {print $1, $3}' /etc/passwd | sort -k2,2n && echo "Task completed"`;
    case '30_list_users_sorted_by_reverse_id.sh':
      return `awk -F: '{print $1, $3}' /etc/passwd | sort -k2,2nr && echo "Task completed"`;
    case '31_list_users_without_authorization_rights.sh':
      return `awk -F: '$7 ~ /nologin/ {print $1}' /etc/passwd && echo "Task completed"`;
    case '32_list_users_with_or_without_terminal.sh':
      return `awk -F: '{print $1, $7}' /etc/passwd && echo "Task completed"`;
    case '33_download_all_links_from_page.sh':
      return `wget -r -l1 -H -nd -A.html,.htm -e robots=off http://example.com && echo "Task completed"`;
    case '34_stop_long_running_processes.sh':
      return `ps -eo pid,etime,cmd | awk -F ' ' '$2 ~ /[0-9]+-/ {print $1}' | xargs kill -9 && echo "Task completed"`;
    case '35_delete_orphaned_jpeg_files.sh':
      return `for f in ${sandboxDir}/test_dir/*.jpeg; do [ ! -f \${f%.jpeg}.txt ] && rm $f; done && echo "Task completed"`;
    case '36_find_ip_address.sh':
      return `hostname -I && echo "Task completed"`;
    case '37_get_all_ip_addresses_from_file.sh':
      return `cat ${sandboxDir}/test_dir/ips.txt && echo "Task completed"`;
    case '38_find_active_hosts.sh':
      return `nmap -iL ${sandboxDir}/test_dir/hosts.txt && echo "Task completed"`;
    case '39_get_raised_interfaces_ips.sh':
      return `ip -o -4 addr show up && echo "Task completed"`;
    case '40_get_subdomains_from_ssl.sh':
      return `openssl s_client -connect example.com:443 -showcerts | openssl x509 -noout -text | grep DNS && echo "Task completed"`;
    case '41_extract_path_name_extension.sh':
      return `file='/path/to/file.txt'; path=$(dirname $file); name=$(basename $file .txt); ext=\${file##*.}; echo $path $name $ext && echo "Task completed"`;
    case '42_delete_files_by_size_and_pattern.sh':
      return `find ${sandboxDir}/test_dir -type f -name 'pattern' -size +100c -delete && echo "Task completed"`;
    case '43_create_files_with_identifiers.sh':
      return `while IFS=' ' read -r filename identifier; do echo $identifier > $filename; done < ${sandboxDir}/file_list && echo "Task completed"`;
    default:
      return `echo "Нет описания задачи для скрипта ${script}"`;
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
