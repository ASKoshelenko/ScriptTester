const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(bodyParser.json());
app.use(cors());

const sandboxDir = path.join(__dirname, '..', 'sandbox');
const logFile = path.join(sandboxDir, 'log.txt');

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
      return `mkdir -p ${sandboxDir}/dir1 ${sandboxDir}/dir2 && echo "File in dir1" > ${sandboxDir}/dir1/file1.txt && echo "File in dir2" > ${sandboxDir}/dir2/file1.txt && echo "Настройка песочницы для тестирования ${script} завершена"`;
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
      return `mkdir -p ${sandboxDir}/test_dir/subdir1 ${sandboxDir}/test_dir/subdir2 && echo "Настройка песочницы для тестирования ${script} завершена"`;
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
      return `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1.txt ${sandboxDir}/test_dir/file1.jpeg ${sandboxDir}/test_dir/file2.jpeg && echo "Настройка песочницы для тестирования ${script} завершена"`;
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

const cleanupEnvironment = () => {
  return `rm -rf ${sandboxDir} && echo "Очистка песочницы завершена"`;
};

app.post('/setup-environment', (req, res) => {
  const { script } = req.body;

  const setupCommand = setupEnvironment(script);

  exec(setupCommand, (error, stdout, stderr) => {
    if (error) {
      fs.appendFileSync(logFile, `Error setting up environment for ${script}: ${stderr}\n`);
      return res.status(500).json({ error: stderr });
    }
    fs.appendFileSync(logFile, `Environment setup for ${script} completed: ${stdout}\n`);
    res.json({ output: stdout });
  });
});

app.post('/run-script', (req, res) => {
  const { script } = req.body;
  const scriptPath = path.join(__dirname, 'scripts', script);

  let command = '';
  switch (script) {
    case '1_find_system_groups.sh':
      command = `cat /etc/group | grep '^[^:]*:[^:]*:[1-9][0-9]*:' | sort -u -t: -k3,3 > ${sandboxDir}/system_groups.txt && cat ${sandboxDir}/system_groups.txt`;
      break;
    case '2_find_files_with_access_rights.sh':
      command = `find ${sandboxDir}/test_dir -perm -u=x,g=w`;
      break;
    case '3_find_all_scripts.sh':
      command = `find ${sandboxDir}/test_dir -type f -name '*.sh'`;
      break;
    case '4_search_scripts_by_user.sh':
      command = `find ${sandboxDir}/test_dir -type f -name '*.sh' -user $(whoami)`;
      break;
    case '5_recursive_search_words.sh':
      command = `grep -r 'word_to_search' --include \\*.txt ${sandboxDir}/test_dir`;
      break;
    case '6_find_duplicate_files.sh':
      command = `find ${sandboxDir}/test_dir -type f -exec cksum {} + | sort | uniq -w32 -dD`;
      break;
    case '7_find_symbolic_links.sh':
      command = `find ${sandboxDir}/test_dir -type l`;
      break;
    case '8_find_hard_links.sh':
      command = `find ${sandboxDir}/test_dir -samefile ${sandboxDir}/test_dir/file1`;
      break;
    case '9_find_names_by_inode.sh':
      command = `find ${sandboxDir}/test_dir -inum $(ls -i ${sandboxDir}/test_dir/file1 | awk '{print $1}')`;
      break;
    case '10_find_names_by_inode_multiple_partitions.sh':
      command = `find ${sandboxDir} /media -inum $(ls -i ${sandboxDir}/test_dir/file1 | awk '{print $1}')`;
      break;
    case '11_delete_file_with_links.sh':
      command = `find ${sandboxDir}/test_dir -type f -links +1 -exec rm {} +`;
      break;
    case '12_recursive_change_permissions.sh':
      command = `chmod -R 755 ${sandboxDir}/test_dir`;
      break;
    case '13_compare_directories.sh':
      command = `diff -qr ${sandboxDir}/dir1 ${sandboxDir}/dir2`;
      break;
    case '14_get_mac_addresses.sh':
      command = `ip link show | grep link/ether`;
      break;
    case '15_list_authorized_users.sh':
      command = `who`;
      break;
    case '16_list_active_network_connections.sh':
      command = `netstat -an | grep ESTABLISHED | wc -l`;
      break;
    case '17_reassign_symbolic_link.sh':
      command = `ln -sf /new/path/to/file ${sandboxDir}/test_dir/link1`;
      break;
    case '18_create_symbolic_links.sh':
      command = `while IFS= read -r line; do set -- $line; ln -s $1 $2; done < ${sandboxDir}/file_list`;
      break;
    case '19_copy_directory_with_links.sh':
      command = `cp -a ${sandboxDir}/test_dir ${sandboxDir}/test_dir_copy`;
      break;
    case '20_copy_directory_with_symlinks.sh':
      command = `cp -a ${sandboxDir}/test_dir ${sandboxDir}/test_dir_copy`;
      break;
    case '21_copy_with_attributes.sh':
      command = `cp -a ${sandboxDir}/test_dir ${sandboxDir}/test_dir_copy`;
      break;
    case '22_convert_relative_to_direct_links.sh':
      command = `find ${sandboxDir}/test_dir -type l -exec sh -c 'ln -sf $(readlink -f $0) $0' {} \\;`;
      break;
    case '23_convert_direct_to_relative_links.sh':
      command = `find ${sandboxDir}/test_dir -type l -exec sh -c 'ln -sf $(realpath --relative-to=$(dirname $0) $(readlink $0)) $0' {} \\;`;
      break;
    case '24_find_and_delete_broken_links.sh':
      command = `find ${sandboxDir}/test_dir -xtype l -delete`;
      break;
    case '25_unpack_archive.sh':
      command = `tar -xvf ${sandboxDir}/test_archive.tar -C ${sandboxDir}/unpacked`;
      break;
    case '26_pack_directory_with_attributes.sh':
      command = `tar -cvf ${sandboxDir}/packed_archive.tar ${sandboxDir}/test_dir`;
      break;
    case '27_copy_directory_structure.sh':
      command = `find ${sandboxDir}/test_dir -type d -exec mkdir -p ${sandboxDir}/test_dir_copy/{} \\;`;
      break;
    case '28_list_users_alphabetically.sh':
      command = `cut -d: -f1 /etc/passwd | sort`;
      break;
    case '29_list_system_users_sorted_by_id.sh':
      command = `awk -F: '$3 < 1000 {print $1, $3}' /etc/passwd | sort -k2,2n`;
      break;
    case '30_list_users_sorted_by_reverse_id.sh':
      command = `awk -F: '{print $1, $3}' /etc/passwd | sort -k2,2nr`;
      break;
    case '31_list_users_without_authorization_rights.sh':
      command = `awk -F: '$7 ~ /nologin/ {print $1}' /etc/passwd`;
      break;
    case '32_list_users_with_or_without_terminal.sh':
      command = `awk -F: '{print $1, $7}' /etc/passwd`;
      break;
    case '33_download_all_links_from_page.sh':
      command = `wget -r -l1 -H -nd -A.html,.htm -e robots=off http://example.com`;
      break;
    case '34_stop_long_running_processes.sh':
      command = `ps -eo pid,etime,cmd | awk -F ' ' '$2 ~ /[0-9]+-/ {print $1}' | xargs kill -9`;
      break;
    case '35_delete_orphaned_jpeg_files.sh':
      command = `for f in ${sandboxDir}/test_dir/*.jpeg; do [ ! -f \${f%.jpeg}.txt ] && rm $f; done`;
      break;
    case '36_find_ip_address.sh':
      command = `hostname -I`;
      break;
    case '37_get_all_ip_addresses_from_file.sh':
      command = `cat ${sandboxDir}/test_dir/ips.txt`;
      break;
    case '38_find_active_hosts.sh':
      command = `nmap -iL ${sandboxDir}/test_dir/hosts.txt`;
      break;
    case '39_get_raised_interfaces_ips.sh':
      command = `ip -o -4 addr show up`;
      break;
    case '40_get_subdomains_from_ssl.sh':
      command = `openssl s_client -connect example.com:443 -showcerts | openssl x509 -noout -text | grep DNS`;
      break;
    case '41_extract_path_name_extension.sh':
      command = `file='/path/to/file.txt'; path=$(dirname $file); name=$(basename $file .txt); ext=\${file##*.}; echo $path $name $ext`;
      break;
    case '42_delete_files_by_size_and_pattern.sh':
      command = `find ${sandboxDir}/test_dir -type f -name 'pattern' -size +100c -delete`;
      break;
    case '43_create_files_with_identifiers.sh':
      command = `while IFS=' ' read -r filename identifier; do echo $identifier > $filename; done < ${sandboxDir}/file_list`;
      break;
    default:
      command = `bash ${scriptPath}`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      fs.appendFileSync(logFile, `Error running script ${script}: ${stderr}\n`);
      return res.status(500).json({ error: stderr });
    }
    fs.appendFileSync(logFile, `Script ${script} output: ${stdout}\n`);
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
