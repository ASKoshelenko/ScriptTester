const logger = require('../utils/logger');

const config = {
  sandboxDir: '/home/ask/ubuntu-scripts-tester/sandbox',
  serverUrl: 'http://192.168.194.24:5001'
};

const setupCommands = {
  '1_find_system_groups.sh': `mkdir -p ${config.sandboxDir} && cd ${config.sandboxDir} && touch ${config.sandboxDir}/test_passwd && echo "Created sandbox directory and test_passwd file" && echo "Sandbox setup for testing 1_find_system_groups.sh completed"`,
  '2_find_files_with_access_rights.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/file2 && mkdir -p ${config.sandboxDir}/test_dir/subdir && touch ${config.sandboxDir}/test_dir/subdir/file3 && chmod u+x,g+w ${config.sandboxDir}/test_dir/file1 && chmod u+x,g-w ${config.sandboxDir}/test_dir/file2 && chmod u-x,g+w ${config.sandboxDir}/test_dir/subdir/file3 && echo "Created test_dir with files and subdirectories, set permissions" && echo "Sandbox setup for testing 2_find_files_with_access_rights.sh completed"`,
  '3_find_all_scripts.sh': `mkdir -p ${config.sandboxDir}/test_dir && echo '#!/bin/bash' > ${config.sandboxDir}/test_dir/script1.sh && chmod +x ${config.sandboxDir}/test_dir/script1.sh && echo 'echo "Hello, World!"' >> ${config.sandboxDir}/test_dir/script1.sh && echo "Created test_dir with script1.sh" && echo "Sandbox setup for testing 3_find_all_scripts.sh completed"`,
  '4_search_scripts_by_user.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/script1.sh && chmod +x ${config.sandboxDir}/test_dir/script1.sh && echo "Created test_dir with executable script1.sh" && echo "Sandbox setup for testing 4_search_scripts_by_user.sh completed"`,
  '5_recursive_search_words.sh': `mkdir -p ${config.sandboxDir}/test_dir && echo "This is a test file" > ${config.sandboxDir}/test_dir/test.txt && echo "Created test_dir with test.txt file" && echo "Sandbox setup for testing 5_recursive_search_words.sh completed"`,
  '6_find_duplicate_files.sh': `mkdir -p ${config.sandboxDir}/test_dir && echo "Test file content" > ${config.sandboxDir}/test_dir/file1.txt && echo "Test file content" > ${config.sandboxDir}/test_dir/file2.txt && echo "Created test_dir with duplicate files file1.txt and file2.txt" && echo "Sandbox setup for testing 6_find_duplicate_files.sh completed"`,
  '7_find_symbolic_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/link1 && echo "Created test_dir with symbolic link link1" && echo "Sandbox setup for testing 7_find_symbolic_links.sh completed"`,
  '8_find_hard_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -f ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/hardlink1 && echo "Created test_dir with hard link hardlink1" && echo "Sandbox setup for testing 8_find_hard_links.sh completed"`,
  '9_find_names_by_inode.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && echo "Created test_dir with file1" && echo "Sandbox setup for testing 9_find_names_by_inode.sh completed"`,
  '10_find_names_by_inode_multiple_partitions.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && echo "Created test_dir with file1" && echo "Sandbox setup for testing 10_find_names_by_inode_multiple_partitions.sh completed"`,
  '11_delete_file_with_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/link1 && echo "Created test_dir with file1 and symbolic link link1" && echo "Sandbox setup for testing 11_delete_file_with_links.sh completed"`,
  '12_recursive_change_permissions.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && chmod 644 ${config.sandboxDir}/test_dir/file1 && ls -l ${config.sandboxDir}/test_dir && echo "Created test_dir with file1 and set permissions to 644" && echo "Sandbox setup for testing 12_recursive_change_permissions.sh completed"`,
  '13_compare_directories.sh': `mkdir -p ${config.sandboxDir}/dir1 && mkdir -p ${config.sandboxDir}/dir2 && echo "File in dir1" > ${config.sandboxDir}/dir1/file1.txt && echo "File in dir2 with difference" > ${config.sandboxDir}/dir2/file1.txt && echo "Created dir1 and dir2 with differing files" && echo "Sandbox setup for testing 13_compare_directories.sh completed"`,
  '14_get_mac_addresses.sh': `echo "Sandbox setup is not required for testing 14_get_mac_addresses.sh"`,
  '15_list_authorized_users.sh': `echo "Sandbox setup is not required for testing 15_list_authorized_users.sh"`,
  '16_list_active_network_connections.sh': `echo "Sandbox setup is not required for testing 16_list_active_network_connections.sh"`,
  '17_reassign_symbolic_link.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/link1 && echo "Created test_dir with file1 and symbolic link link1" && echo "Sandbox setup for testing 17_reassign_symbolic_link.sh completed"`,
  '18_create_symbolic_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && mkdir -p ${config.sandboxDir}/sym_dir && echo "${config.sandboxDir}/test_dir/file1" > ${config.sandboxDir}/file_list && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/sym_dir/link_to_file1 && echo "Created test_dir with file1 and symbolic link in sym_dir" && echo "Sandbox setup for testing 18_create_symbolic_links.sh completed"`,
  '19_copy_directory_with_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/link1 && echo "Created test_dir with file1 and symbolic link link1" && echo "Sandbox setup for testing 19_copy_directory_with_links.sh completed"`,
  '20_copy_directory_with_symlinks.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/link1 && echo "Created test_dir with file1 and symbolic link link1" && echo "Sandbox setup for testing 20_copy_directory_with_symlinks.sh completed"`,
  '21_copy_with_attributes.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && cp -rp ${config.sandboxDir}/test_dir ${config.sandboxDir}/dir4/ && ls -l ${config.sandboxDir}/dir4 && echo "Created test_dir with file1 and copied to dir4 with attributes" && echo "Sandbox setup for testing 21_copy_with_attributes.sh completed"`,
  '22_convert_relative_to_direct_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/link1 && echo "Created test_dir with file1 and symbolic link link1" && echo "Sandbox setup for testing 22_convert_relative_to_direct_links.sh completed"`,
  '23_convert_direct_to_relative_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -sf ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/link1 && echo "Created test_dir with file1 and symbolic link link1" && echo "Sandbox setup for testing 23_convert_direct_to_relative_links.sh completed"`,
  '24_find_and_delete_broken_links.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && ln -s ${config.sandboxDir}/test_dir/file1 ${config.sandboxDir}/test_dir/broken_link && rm ${config.sandboxDir}/test_dir/file1 && echo "Created test_dir with broken symbolic link" && echo "Sandbox setup for testing 24_find_and_delete_broken_links.sh completed"`,
  '25_unpack_archive.sh': `mkdir -p ${config.sandboxDir}/unpacked && mkdir -p ${config.sandboxDir}/archive && echo "This is a test file" > ${config.sandboxDir}/archive/testfile.txt && tar -cvf ${config.sandboxDir}/arc.tar -C ${config.sandboxDir}/archive . && echo "Created archive with testfile.txt" && echo "Sandbox setup for testing 25_unpack_archive.sh completed"`,
  '26_pack_directory_with_attributes.sh': `mkdir -p ${config.sandboxDir}/dir1 && touch ${config.sandboxDir}/dir1/file1 && echo "Created dir1 with file1" && echo "Sandbox setup for testing 26_pack_directory_with_attributes.sh completed"`,
  '27_copy_directory_structure.sh': `mkdir -p ${config.sandboxDir}/dir1 && mkdir -p ${config.sandboxDir}/dir1/subdir && touch ${config.sandboxDir}/dir1/file1.txt && mkdir -p ${config.sandboxDir}/dir_structure && echo "Created dir1 with subdir and file1.txt" && echo "Sandbox setup for testing 27_copy_directory_structure.sh completed"`,
  '28_list_users_alphabetically.sh': `echo "Sandbox setup is not required for testing 28_list_users_alphabetically.sh"`,
  '29_list_system_users_sorted_by_id.sh': `echo "Sandbox setup is not required for testing 29_list_system_users_sorted_by_id.sh"`,
  '30_list_users_sorted_by_reverse_id.sh': `echo "Sandbox setup is not required for testing 30_list_users_sorted_by_reverse_id.sh"`,
  '31_list_users_without_authorization_rights.sh': `echo "Sandbox setup is not required for testing 31_list_users_without_authorization_rights.sh"`,
  '32_list_users_with_or_without_terminal.sh': `echo "Sandbox setup is not required for testing 32_list_users_with_or_without_terminal.sh"`,
  '33_download_all_links_from_page.sh': `mkdir -p ${config.sandboxDir}/downloads && echo "Created downloads directory" && echo "Sandbox setup for testing 33_download_all_links_from_page.sh completed"`,
  '34_stop_long_running_processes.sh': `echo "Sandbox setup is not required for testing 34_stop_long_running_processes.sh"`,
  '35_delete_orphaned_jpeg_files.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1.txt && touch ${config.sandboxDir}/test_dir/file1.jpeg && touch ${config.sandboxDir}/test_dir/file2.jpeg && echo "Created test_dir with file1.txt, file1.jpeg, and file2.jpeg" && echo "Sandbox setup for testing 35_delete_orphaned_jpeg_files.sh completed"`,
  '36_find_ip_address.sh': `echo "Sandbox setup is not required for testing 36_find_ip_address.sh"`,
  '37_get_all_ip_addresses_from_file.sh': `mkdir -p ${config.sandboxDir}/test_dir && echo "192.168.1.1" > ${config.sandboxDir}/test_dir/ips.txt && echo "10.0.0.1" >> ${config.sandboxDir}/test_dir/ips.txt && echo "Created test_dir with ips.txt" && echo "Sandbox setup for testing 37_get_all_ip_addresses_from_file.sh completed"`,
  '38_find_active_hosts.sh': `mkdir -p ${config.sandboxDir}/test_dir && echo "192.168.194.1" > ${config.sandboxDir}/test_dir/hosts.txt && echo "192.168.194.15" >> ${config.sandboxDir}/test_dir/hosts.txt && echo "Created test_dir with hosts.txt" && echo "Sandbox setup for testing 38_find_active_hosts.sh completed"`,
  '39_get_raised_interfaces_ips.sh': `echo "Sandbox setup is not required for testing 39_get_raised_interfaces_ips.sh"`,
  '40_get_subdomains_from_ssl.sh': `echo "Sandbox setup is not required for testing 40_get_subdomains_from_ssl.sh"`,
  '41_extract_path_name_extension.sh': `echo "Sandbox setup is not required for testing 41_extract_path_name_extension.sh"`,
  '42_delete_files_by_size_and_pattern.sh': `mkdir -p ${config.sandboxDir}/test_dir && dd if=/dev/zero of=${config.sandboxDir}/test_dir/file1.txt bs=1 count=22 && touch ${config.sandboxDir}/test_dir/file2.txt && ls -l ${config.sandboxDir}/test_dir && echo "Created test_dir with file1.txt and file2.txt" && echo "Sandbox setup for testing 42_delete_files_by_size_and_pattern.sh completed"`,
  '43_create_files_with_identifiers.sh': `mkdir -p ${config.sandboxDir}/test_dir && echo "${config.sandboxDir}/test_dir/file1 1234" > ${config.sandboxDir}/file_list && echo "${config.sandboxDir}/test_dir/file2 5678" >> ${config.sandboxDir}/file_list && xargs -a ${config.sandboxDir}/file_list -n2 sh -c 'mkdir -p $(dirname $1) && echo $2 > $1' && echo "Created test_dir with files having identifiers" && echo "Sandbox setup for testing 43_create_files_with_identifiers.sh completed"`
};

const commands = {
  '1_find_system_groups.sh': `cut -d: -f1,3 /etc/group | grep -E ':[0-9]{1,3}$' > ${config.sandboxDir}/sys_groups && cat ${config.sandboxDir}/sys_groups && echo "Task completed"`,
  '2_find_files_with_access_rights.sh': `find . -perm -u=x,g=w && echo "Task completed"`,
  '3_find_all_scripts.sh': `find . -type f -executable -exec sh -c '[ "$(head -c2 "$1")" = "#!" ] && echo "$1"' _ {} \\; && echo "Task completed"`,
  '4_search_scripts_by_user.sh': `sudo -u root -H find . -type f -executable -exec sh -c 'head -c2 "$1" | grep -q "#!" && echo "$1"' _ {} \\; && echo "Task completed"`,
  '5_recursive_search_words.sh': `grep -r --include=*.txt "file" . && echo "Task completed"`,
  '6_find_duplicate_files.sh': `find . -type f -exec md5sum {} + | sort | uniq -D -w32 | sort -k2 && echo "Task completed"`,
  '7_find_symbolic_links.sh': `find ${config.sandboxDir}/test_dir -type l -lname *file1 -exec ls -l {} \\; && echo "Task completed"`,
  '8_find_hard_links.sh': `find ${config.sandboxDir}/test_dir -samefile ${config.sandboxDir}/test_dir/file1 && echo "Task completed"`,
  '9_find_names_by_inode.sh': `ls -i ${config.sandboxDir}/test_dir/file1 | cut -d' ' -f1 | xargs -I{} find ${config.sandboxDir}/test_dir -inum {} && echo "Task completed"`,
  '10_find_names_by_inode_multiple_partitions.sh': `ls -i ${config.sandboxDir}/test_dir/file1 | cut -d' ' -f1 | xargs -I{} find ${config.sandboxDir}/test_dir -xdev -inum {} && echo "Task completed"`,
  '11_delete_file_with_links.sh': `sudo find -L ${config.sandboxDir}/test_dir -samefile ${config.sandboxDir}/test_dir/file1 && echo "Task completed"`,
  '12_recursive_change_permissions.sh': `find ${config.sandboxDir}/test_dir -type f -perm 644 -exec chmod 640 {} \\; && ls -l ${config.sandboxDir}/test_dir && echo "Task completed"`,
  '13_compare_directories.sh': `diff -rN -u5 ${config.sandboxDir}/dir1/ ${config.sandboxDir}/dir2/ > ${config.sandboxDir}/diff_output.txt; cat ${config.sandboxDir}/diff_output.txt && echo "Task completed"`,
  '14_get_mac_addresses.sh': `ip link | grep ether | xargs -n4 | cut -d' ' -f2' && echo "Task completed"`,
  '15_list_authorized_users.sh': `sudo users | xargs -n1 | sort -u && echo "Task completed"`,
  '16_list_active_network_connections.sh': `ss -atOH | cut -d' ' -f1 | sort | xargs -n1 | uniq -c && echo "Task completed"`,
  '17_reassign_symbolic_link.sh': `echo "Before reassignment: $(readlink ${config.sandboxDir}/test_dir/link1)" && readlink ${config.sandboxDir}/test_dir/link1 | xargs -I {} ln -srf {} ${config.sandboxDir}/test_dir/link1 && echo "After reassignment: $(readlink ${config.sandboxDir}/test_dir/link1)" && echo "Task completed"`,
  '18_create_symbolic_links.sh': `mkdir -p ${config.sandboxDir}/sym_dir && cat ${config.sandboxDir}/file_list | xargs -I{} sh -c 'rm -f ${config.sandboxDir}/sym_dir/link_to_$(basename {}); ln -s {} ${config.sandboxDir}/sym_dir/link_to_$(basename {}) && echo "Created symbolic link for {}"' && echo "Task completed"`,
  '19_copy_directory_with_links.sh': `cp -a ${config.sandboxDir}/test_dir ${config.sandboxDir}/backup/ && rsync -al ${config.sandboxDir}/test_dir/ ${config.sandboxDir}/rsync_backup/ && echo "Backup directory contents:" && ls -l ${config.sandboxDir}/backup/ && echo "Rsync backup directory contents:" && ls -l ${config.sandboxDir}/rsync_backup/ && echo "Task completed"`,
  '20_copy_directory_with_symlinks.sh': `cp -a ${config.sandboxDir}/test_dir ${config.sandboxDir}/archive/ && echo "Archive directory contents:" && ls -l ${config.sandboxDir}/archive/ && echo "Task completed"`,
  '21_copy_with_attributes.sh': `mkdir -p ${config.sandboxDir}/test_dir && touch ${config.sandboxDir}/test_dir/file1 && chmod 644 ${config.sandboxDir}/test_dir/file1 && cp -rp ${config.sandboxDir}/test_dir ${config.sandboxDir}/dir4/ && echo "Directory contents after copying with attributes:" && ls -lR ${config.sandboxDir}/dir4/ && echo "Task completed"`,
  '22_convert_relative_to_direct_links.sh': `find ${config.sandboxDir}/test_dir -type l | xargs -I{} sh -c 'ln -sf $(realpath {}) {} && echo "Converted relative link {} to direct link"' && echo "Task completed"`,
  '23_convert_direct_to_relative_links.sh': `find ${config.sandboxDir}/test_dir -type l | xargs -I{} sh -c 'ln -srf $(readlink {}) {} && echo "Converted direct link {} to relative link"' && echo "Task completed"`,
  '24_find_and_delete_broken_links.sh': `find ${config.sandboxDir}/test_dir -xtype l -print -delete && echo "Deleted broken links" && echo "Task completed"`,
  '25_unpack_archive.sh': `tar -xvf ${config.sandboxDir}/arc.tar -C ${config.sandboxDir}/unpacked && ls -lR ${config.sandboxDir}/unpacked && echo "Task completed"`,
  '26_pack_directory_with_attributes.sh': `echo "Contents before archiving:" && ls -lR ${config.sandboxDir}/dir1 && sudo tar -Jcf ${config.sandboxDir}/arc.tar.xz ${config.sandboxDir}/dir1/ && sudo tar -xf ${config.sandboxDir}/arc.tar.xz -C ${config.sandboxDir} && echo "Contents after extracting:" && ls -lR ${config.sandboxDir}/dir1 && echo "Task completed"`,
  '27_copy_directory_structure.sh': `echo "Directory structure before copying:" && find ${config.sandboxDir}/dir1/ -type d -print && find ${config.sandboxDir}/dir1/ -type d -print | xargs -I{} mkdir -p ${config.sandboxDir}/dir_structure/{} && echo "Directory structure after copying:" && find ${config.sandboxDir}/dir_structure/ -type d -print && echo "Task completed"`,
  '28_list_users_alphabetically.sh': `cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{4,}$" | cut -d: -f1 | sort && echo "Task completed"`,
  '29_list_system_users_sorted_by_id.sh': `cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{1,3}$" | sort -t: -nk2 | tr ':' ' ' && echo "Task completed"`,
  '30_list_users_sorted_by_reverse_id.sh': `cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{1,3}$" | sort -t: -rnk2 | cut -d: -f1 && echo "Task completed"`,
  '31_list_users_without_authorization_rights.sh': `sudo cut -d: -f1,2 /etc/shadow | grep -vE ':\!\*' | cut -d: -f1 && sudo cut -d: -f1,2 /etc/shadow | grep -E ':\!\*' | cut -d: -f1 && echo "Task completed"`,
  '32_list_users_with_or_without_terminal.sh': `cut -d: -f1,7 /etc/passwd | grep -E "/(bash|sh|zsh)$" | cut -d: -f1 && cut -d: -f1,7 /etc/passwd | grep -vE "/(bash|sh|zsh)$" | cut -d: -f1 && echo "Task completed"`,
  '33_download_all_links_from_page.sh': `wget -qO - https://abc.xyz/ | grep -oP 'href="\\K[^"]+' | xargs -I{} wget -P ${config.sandboxDir}/downloads/ {} 2>&1 | tee ${config.sandboxDir}/download_log && cat ${config.sandboxDir}/download_log && echo "Task completed"`,
  '34_stop_long_running_processes.sh': `ps -eo comm= | xargs -n1 killall -o 5d && find /proc -maxdepth 1 -type d -ctime +5 | grep -oP '/\\K[0-9]+' | xargs kill -9 && echo "Task completed"`,
  '35_delete_orphaned_jpeg_files.sh': `find ${config.sandboxDir}/test_dir -type f -name '*.jpeg' -exec sh -c 'pname="$(dirname {})/$(basename -s .jpeg {})"; if [ ! -e "$pname.txt" ]; then rm "{}"; echo "Deleted orphaned JPEG: {} (corresponding text file: $pname.txt not found)"; else echo "Kept JPEG: {} (corresponding text file: $pname.txt found)"; fi' \\; && echo "Task completed"`,
  '36_find_ip_address.sh': `ip -o addr | grep inet | cut -d ' ' -f2,7 | tail -n +3 && echo "Task completed"`,
  '37_get_all_ip_addresses_from_file.sh': `grep -oP '\\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\b' ${config.sandboxDir}/test_dir/ips.txt && sudo grep -P '\\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\b' /etc/netplan/*.yaml | xargs && echo "Task completed"`,
  '38_find_active_hosts.sh': `printf "192.168.194.%d\\n" {1..254} | xargs -I{} ping -c1 {} > /dev/null; cat ${config.sandboxDir}/test_dir/hosts.txt | xargs -I{} ping -c1 {} > /dev/null; ip -4 n | grep REACHABLE | cut -d ' ' -f1 | sort -u && echo "Task completed"`,
  '39_get_raised_interfaces_ips.sh': `ip a | grep 'state UP' | cut -d ' ' -f2 | xargs -n1 ip a show | grep inet | cut -d ' ' -f5,6 && sudo grep -P '\\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0][9]|1[0-9][0-9]|[1-9]?[0-9])\\b' /etc/netplan/*.yaml | xargs && echo "Task completed"`,
  '40_get_subdomains_from_ssl.sh': `echo | openssl s_client -connect microsoft.com:443 2>/dev/null | openssl x509 -noout -ext subjectAltName | tail -n +2 | xargs -n1 | cut -d: -f2 | tr -d ' ' && echo "Task completed"`,
  '41_extract_path_name_extension.sh': `file='./dir1/file1.txt'; path=$(dirname $file); name=$(basename \${file%.*}); ext=\${file##*.}; echo $path $name $ext && echo "Task completed"`,
  '42_delete_files_by_size_and_pattern.sh': `find ${config.sandboxDir}/test_dir -type f -size 22c -name '*.txt' -delete && ls -l ${config.sandboxDir}/test_dir && echo "Task completed"`,
  '43_create_files_with_identifiers.sh': `xargs -a ${config.sandboxDir}/file_list -n2 sh -c 'mkdir -p $(dirname $1) && echo $2 > $1 && echo "Created file $1 with identifier $2"' && echo "Task completed"`
};


const destroyCommands = {
  '1_find_system_groups.sh': `sudo rm -rf ${config.sandboxDir}`,
  '2_find_files_with_access_rights.sh': `sudo rm -rf ${config.sandboxDir}`,
  '3_find_all_scripts.sh': `sudo rm -rf ${config.sandboxDir}`,
  '4_search_scripts_by_user.sh': `sudo rm -rf ${config.sandboxDir}`,
  '5_recursive_search_words.sh': `sudo rm -rf ${config.sandboxDir}`,
  '6_find_duplicate_files.sh': `sudo rm -rf ${config.sandboxDir}`,
  '7_find_symbolic_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '8_find_hard_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '9_find_names_by_inode.sh': `sudo rm -rf ${config.sandboxDir}`,
  '10_find_names_by_inode_multiple_partitions.sh': `sudo rm -rf ${config.sandboxDir}`,
  '11_delete_file_with_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '12_recursive_change_permissions.sh': `sudo rm -rf ${config.sandboxDir}`,
  '13_compare_directories.sh': `sudo rm -rf ${config.sandboxDir}`,
  '14_get_mac_addresses.sh': `echo "Environment setup was not required"`,
  '15_list_authorized_users.sh': `echo "Environment setup was not required"`,
  '16_list_active_network_connections.sh': `echo "Environment setup was not required"`,
  '17_reassign_symbolic_link.sh': `sudo rm -rf ${config.sandboxDir}`,
  '18_create_symbolic_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '19_copy_directory_with_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '20_copy_directory_with_symlinks.sh': `sudo rm -rf ${config.sandboxDir}`,
  '21_copy_with_attributes.sh': `sudo rm -rf ${config.sandboxDir}`,
  '22_convert_relative_to_direct_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '23_convert_direct_to_relative_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '24_find_and_delete_broken_links.sh': `sudo rm -rf ${config.sandboxDir}`,
  '25_unpack_archive.sh': `sudo rm -rf ${config.sandboxDir}`,
  '26_pack_directory_with_attributes.sh': `sudo rm -rf ${config.sandboxDir}`,
  '27_copy_directory_structure.sh': `sudo rm -rf ${config.sandboxDir}`,
  '28_list_users_alphabetically.sh': `echo "Environment setup was not required"`,
  '29_list_system_users_sorted_by_id.sh': `echo "Environment setup was not required"`,
  '30_list_users_sorted_by_reverse_id.sh': `echo "Environment setup was not required"`,
  '31_list_users_without_authorization_rights.sh': `echo "Environment setup was not required"`,
  '32_list_users_with_or_without_terminal.sh': `echo "Environment setup was not required"`,
  '33_download_all_links_from_page.sh': `echo "Environment setup was not required"`,
  '34_stop_long_running_processes.sh': `echo "Environment setup was not required"`,
  '35_delete_orphaned_jpeg_files.sh': `sudo rm -rf ${config.sandboxDir}`,
  '36_find_ip_address.sh': `echo "Environment setup was not required"`,
  '37_get_all_ip_addresses_from_file.sh': `sudo rm -rf ${config.sandboxDir}`,
  '38_find_active_hosts.sh': `sudo rm -rf ${config.sandboxDir}`,
  '39_get_raised_interfaces_ips.sh': `echo "Environment setup was not required"`,
  '40_get_subdomains_from_ssl.sh': `echo "Environment setup was not required"`,
  '41_extract_path_name_extension.sh': `echo "Environment setup was not required"`,
  '42_delete_files_by_size_and_pattern.sh': `sudo rm -rf ${config.sandboxDir}`,
  '43_create_files_with_identifiers.sh': `sudo rm -rf ${config.sandboxDir}`
};

function runCommand(command, callback) {
  const { exec } = require('child_process');
  logger.info(`Executing command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error executing command: ${error.message}`);
      callback(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.warn(`Command stderr: ${stderr}`);
      callback(`Stderr: ${stderr}`);
      return;
    }
    logger.info(`Command stdout: ${stdout}`);
    callback(`Output: ${stdout}`);
  });
}

module.exports = { setupCommands, commands, destroyCommands, runCommand };
