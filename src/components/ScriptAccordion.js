import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const scriptCommands = {
  '1_find_system_groups.sh': 'cat /etc/group | grep "^[^:]*:[^:]*:[1-9][0-9]*:" | sort -u -t: -k3,3 > system_groups.txt',
  '2_find_files_with_access_rights.sh': 'find . -perm -u=x,g=w',
  '3_find_all_scripts.sh': 'find . -type f -name \'*.sh\'',
  '4_search_scripts_by_user.sh': 'find . -type f -name \'*.sh\' -user $(whoami)',
  '5_recursive_search_words.sh': 'grep -r \'word_to_search\' --include \\*.txt',
  '6_find_duplicate_files.sh': 'find . -type f -exec cksum {} + | sort | uniq -w32 -dD',
  '7_find_symbolic_links.sh': 'find . -type l',
  '8_find_hard_links.sh': 'find . -samefile',
  '9_find_names_by_inode.sh': 'find / -inum 123456',
  '10_find_names_by_inode_multiple_partitions.sh': 'find /mnt /media -inum 123456',
  '11_delete_file_with_links.sh': 'find . -type f -links +1 -exec rm {} +',
  '12_recursive_change_permissions.sh': 'chmod -R 755 /tmp/sandbox/test_dir',
  '13_compare_directories.sh': 'diff -qr /tmp/sandbox/dir1 /tmp/sandbox/dir2',
  '14_get_mac_addresses.sh': 'ip link show | grep link/ether',
  '15_list_authorized_users.sh': 'who',
  '16_list_active_network_connections.sh': 'netstat -an | grep ESTABLISHED | wc -l',
  '17_reassign_symbolic_link.sh': 'ln -sf /new/path/to/file /tmp/sandbox/test_dir/link1',
  '18_create_symbolic_links.sh': 'while IFS= read -r line; do set -- $line; ln -s $1 $2; done < /tmp/sandbox/file_list',
  '19_copy_directory_with_links.sh': 'cp -a /tmp/sandbox/test_dir /tmp/sandbox/test_dir_copy',
  '20_copy_directory_with_symlinks.sh': 'cp -a /tmp/sandbox/test_dir /tmp/sandbox/test_dir_copy',
  '21_copy_with_attributes.sh': 'cp -a /tmp/sandbox/test_dir /tmp/sandbox/test_dir_copy',
  '22_convert_relative_to_direct_links.sh': 'find /tmp/sandbox/test_dir -type l -exec sh -c \'ln -sf $(readlink -f $0) $0\' {} \\;',
  '23_convert_direct_to_relative_links.sh': 'find /tmp/sandbox/test_dir -type l -exec sh -c \'ln -sf $(realpath --relative-to=$(dirname $0) $(readlink $0)) $0\' {} \\;',
  '24_find_and_delete_broken_links.sh': 'find /tmp/sandbox/test_dir -xtype l -delete',
  '25_unpack_archive.sh': 'tar -xvf /tmp/sandbox/test_archive.tar -C /tmp/sandbox/unpacked',
  '26_pack_directory_with_attributes.sh': 'tar -cvf /tmp/sandbox/packed_archive.tar /tmp/sandbox/test_dir',
  '27_copy_directory_structure.sh': 'find /tmp/sandbox/test_dir -type d -exec mkdir -p /tmp/sandbox/test_dir_copy/{} \\;',
  '28_list_users_alphabetically.sh': 'cut -d: -f1 /etc/passwd | sort',
  '29_list_system_users_sorted_by_id.sh': 'awk -F: \\\'$3 < 1000 {print $1, $3}\\\' /etc/passwd | sort -k2,2n',
  '30_list_users_sorted_by_reverse_id.sh': 'awk -F: \\\'{print $1, $3}\\\' /etc/passwd | sort -k2,2nr',
  '31_list_users_without_authorization_rights.sh': 'awk -F: \\\'$7 ~ /nologin/ {print $1}\\\' /etc/passwd',
  '32_list_users_with_or_without_terminal.sh': 'awk -F: \\\'{print $1, $7}\\\' /etc/passwd',
  '33_download_all_links_from_page.sh': 'wget -r -l1 -H -nd -A.html,.htm -e robots=off http://example.com',
  '34_stop_long_running_processes.sh': 'ps -eo pid,etime,cmd | awk -F \' \' \\\'$2 ~ /[0-9]+-/ {print $1}\\\' | xargs kill -9',
  '35_delete_orphaned_jpeg_files.sh': 'for f in /tmp/sandbox/test_dir/*.jpeg; do [ ! -f ${f%.jpeg}.txt ] && rm $f; done',
  '36_find_ip_address.sh': 'hostname -I',
  '37_get_all_ip_addresses_from_file.sh': 'cat /tmp/sandbox/test_dir/ips.txt',
  '38_find_active_hosts.sh': 'nmap -iL /tmp/sandbox/test_dir/hosts.txt',
  '39_get_raised_interfaces_ips.sh': 'ip -o -4 addr show up',
  '40_get_subdomains_from_ssl.sh': 'openssl s_client -connect example.com:443 -showcerts | openssl x509 -noout -text | grep DNS',
  '41_extract_path_name_extension.sh': 'file=\'/path/to/file.txt\'; path=$(dirname $file); name=$(basename $file .txt); ext=${file##*.}; echo $path $name $ext',
  '42_delete_files_by_size_and_pattern.sh': 'find /tmp/sandbox/test_dir -type f -name \'pattern\' -size +100c -delete',
  '43_create_files_with_identifiers.sh': 'while IFS=\' \' read -r filename identifier; do echo $identifier > $filename; done < /tmp/sandbox/file_list'
};

const sandboxDir = '/home/ask/ubuntu-scripts-tester/sandbox';

const setupCommands = {
  '1_find_system_groups.sh': `mkdir -p ${sandboxDir} && cd ${sandboxDir} && touch ${sandboxDir}/test_passwd && echo "Настройка песочницы для тестирования 1_find_system_groups.sh завершена"`,
  '2_find_files_with_access_rights.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/file2 && mkdir -p ${sandboxDir}/test_dir/subdir && touch ${sandboxDir}/test_dir/subdir/file3 && chmod u+x,g+w ${sandboxDir}/test_dir/file1 && chmod u+x,g-w ${sandboxDir}/test_dir/file2 && chmod u-x,g+w ${sandboxDir}/test_dir/subdir/file3 && echo "Настройка песочницы для тестирования 2_find_files_with_access_rights.sh завершена"`,
  '3_find_all_scripts.sh': `mkdir -p ${sandboxDir}/test_dir && echo '#!/bin/bash' > ${sandboxDir}/test_dir/script1.sh && chmod +x ${sandboxDir}/test_dir/script1.sh && echo 'echo "Hello, World!"' >> ${sandboxDir}/test_dir/script1.sh && echo "Настройка песочницы для тестирования 3_find_all_scripts.sh завершена"`,
  '9_find_names_by_inode.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования 9_find_names_by_inode.sh завершена"`,
  '10_find_names_by_inode_multiple_partitions.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования 10_find_names_by_inode_multiple_partitions.sh завершена"`,
  '11_delete_file_with_links.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && ln -s ${sandboxDir}/test_dir/file1 ${sandboxDir}/test_dir/link1 && echo "Настройка песочницы для тестирования 11_delete_file_with_links.sh завершена"`,
  '12_recursive_change_permissions.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1 && chmod 644 ${sandboxDir}/test_dir/file1 && echo "Настройка песочницы для тестирования 12_recursive_change_permissions.sh завершена"`,
  '13_compare_directories.sh': `mkdir -p ${sandboxDir}/dir1 && mkdir -p ${sandboxDir}/dir2 && echo "File in dir1" > ${sandboxDir}/dir1/file1.txt && echo "File in dir2" > ${sandboxDir}/dir2/file1.txt && echo "Настройка песочницы для тестирования 13_compare_directories.sh завершена"`,
  '35_delete_orphaned_jpeg_files.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1.txt && touch ${sandboxDir}/test_dir/file1.jpeg && touch ${sandboxDir}/test_dir/file2.jpeg && echo "Настройка песочницы для тестирования 35_delete_orphaned_jpeg_files.sh завершена"`,
  '37_get_all_ip_addresses_from_file.sh': `mkdir -p ${sandboxDir}/test_dir && echo "192.168.1.1" > ${sandboxDir}/test_dir/ips.txt && echo "10.0.0.1" >> ${sandboxDir}/test_dir/ips.txt && echo "Настройка песочницы для тестирования 37_get_all_ip_addresses_from_file.sh завершена"`,
  '38_find_active_hosts.sh': `mkdir -p ${sandboxDir}/test_dir && echo "192.168.1.1" > ${sandboxDir}/test_dir/hosts.txt && echo "10.0.0.1" >> ${sandboxDir}/test_dir/hosts.txt && echo "Настройка песочницы для тестирования 38_find_active_hosts.sh завершена"`,
  '42_delete_files_by_size_and_pattern.sh': `mkdir -p ${sandboxDir}/test_dir && dd if=/dev/zero of=${sandboxDir}/test_dir/file1.txt bs=1 count=22 && touch ${sandboxDir}/test_dir/file2.txt && echo "Настройка песочницы для тестирования 42_delete_files_by_size_and_pattern.sh завершена"`,
  '43_create_files_with_identifiers.sh': `mkdir -p ${sandboxDir}/test_dir && echo "${sandboxDir}/test_dir/file1 1234" > ${sandboxDir}/file_list && echo "${sandboxDir}/test_dir/file2 5678" >> ${sandboxDir}/file_list && echo "Настройка песочницы для тестирования 43_create_files_with_identifiers.sh завершена"`
};

const ScriptAccordion = ({ script, description, isOpen, onToggle }) => {
  const [isEnvironmentSetup, setIsEnvironmentSetup] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const setupEnvironment = () => {
    axios.post('http://192.168.194.24:5001/setup-environment', { script })
      .then(response => {
        setIsEnvironmentSetup(true);
        setOutput(response.data.output);
        setError('');
      })
      .catch(err => {
        const errorMsg = err.response && err.response.data ? err.response.data.error : 'Error setting up environment';
        setError(errorMsg);
      });
  };

  const runScript = () => {
    axios.post('http://192.168.194.24:5001/run-script', { script })
      .then(response => {
        setOutput(response.data.output);
        setError('');
      })
      .catch(err => {
        const errorMsg = err.response && err.response.data ? err.response.data.error : 'Error running script';
        setError(errorMsg);
      });
  };

  const destroyEnvironment = () => {
    axios.post('http://192.168.194.24:5001/destroy-environment', { script })
      .then(response => {
        setIsEnvironmentSetup(false);
        setOutput(response.data.output);
        setError('');
      })
      .catch(err => {
        const errorMsg = err.response && err.response.data ? err.response.data.error : 'Error destroying environment';
        setError(errorMsg);
      });
  };

  return (
    <div className="script-accordion">
      <div className="script-header" onClick={onToggle}>
        <h3>{script}</h3>
      </div>
      {isOpen && (
        <div className="script-content">
          <p>{description}</p>
          <div className="command-section">
            <strong>Command:</strong> {scriptCommands[script]}
          </div>
          <button
            className={`setup-button ${isEnvironmentSetup ? 'destroy-button' : ''}`}
            onClick={isEnvironmentSetup ? destroyEnvironment : setupEnvironment}
          >
            {isEnvironmentSetup ? 'Destroy Environment' : 'Setup Environment'}
          </button>
          {isEnvironmentSetup && (
            <button className="run-button" onClick={runScript}>
              Run Script
            </button>
          )}
          <div className="output-section">
            <h4>Output</h4>
            <pre>{output}</pre>
            {error && (
              <div className="error-section">
                <h4>Error</h4>
                <pre>{error}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptAccordion;
