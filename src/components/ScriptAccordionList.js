import React, { useState, useRef, useEffect } from 'react';
import ScriptAccordion from './ScriptAccordion';
import './ScriptAccordion.css'; // Ensure you have the correct path for your CSS file

const scripts = {
  '1_find_system_groups.sh': {
    description: 'Find all system groups and save their unique names and IDs to a file.',
    command: 'cut -d: -f1,3 /etc/group | grep -E ":[0-9]{1,3}$" > /home/ask/ubuntu-scripts-tester/sandbox/sys_groups && cat /home/ask/ubuntu-scripts-tester/sandbox/sys_groups'
  },
  '2_find_files_with_access_rights.sh': {
    description: 'Find all files and directories with specific access rights.',
    command: 'find . -perm -u=x,g=w'
  },
  '3_find_all_scripts.sh': {
    description: 'Find all scripts in the specified directory and its subdirectories.',
    command: 'find . -type f -executable -exec sh -c \'[ "$(head -c2 "$1")" = "#!" ] && echo "$1"\' _ {} \\; && echo "Task completed"'
  },
  '4_search_scripts_by_user.sh': {
    description: 'Find all script files owned by the specified user.',
    command: 'find . -type f -name \'*.sh\' -user $(whoami)'
  },
  '5_recursive_search_words.sh': {
    description: 'Recursively search for words or phrases in files of the specified type.',
    command: 'grep -r --include=*.txt "file" && echo "Task completed"'
  },
  '6_find_duplicate_files.sh': {
    description: 'Find duplicate files in the specified directories.',
    command: 'find . -type f -exec md5sum {} + | sort | uniq -D -w32 | sort -k2 && echo "Task completed"'
  },
  '7_find_symbolic_links.sh': {
    description: 'Find all symbolic links pointing to the specified file.',
    command: 'find . -type l -lname *file1 && echo "Task completed"'
  },
  '8_find_hard_links.sh': {
    description: 'Find all hard links pointing to the specified file.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -samefile /home/ask/ubuntu-scripts-tester/sandbox/test_dir/file1 && echo "Task completed"'
  },
  '9_find_names_by_inode.sh': {
    description: 'Find all file names by their inode.',
    command: 'ls -i /home/ask/ubuntu-scripts-tester/sandbox/test_dir/file1 | cut -d\' \' -f1 | xargs find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -inum && echo "Task completed"'
  },
  '10_find_names_by_inode_multiple_partitions.sh': {
    description: 'Find all file names by their inode, considering multiple mounted partitions.',
    command: 'ls -i /home/ask/ubuntu-scripts-tester/sandbox/test_dir/file1 | cut -d\' \' -f1 | xargs find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -xdev -inum && echo "Task completed"'
  },
  '11_delete_file_with_links.sh': {
    description: 'Correctly delete a file considering symbolic or hard links.',
    command: 'sudo find -L /home/ask/ubuntu-scripts-tester/sandbox/test_dir -samefile /home/ask/ubuntu-scripts-tester/sandbox/test_dir/file1 && echo "Task completed"'
  },
  '12_recursive_change_permissions.sh': {
    description: 'Recursively change file permissions in the specified directory.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -type f -perm 644 -exec chmod 640 {} \\; && echo "Task completed"'
  },
  '13_compare_directories.sh': {
    description: 'Recursively compare two directories and show only differing files.',
    command: 'diff -rN -u5 /home/ask/ubuntu-scripts-tester/sandbox/dir1/ /home/ask/ubuntu-scripts-tester/sandbox/dir2/ && echo "Task completed"'
  },
  '14_get_mac_addresses.sh': {
    description: 'Get the MAC addresses of network interfaces.',
    command: 'ip link | grep ether | xargs -n4 | cut -d\' \' -f2 && echo "Task completed"'
  },
  '15_list_authorized_users.sh': {
    description: 'List all authorized users currently logged into the system.',
    command: 'sudo users | xargs -n1 | sort -u && echo "Task completed"'
  },
  '16_list_active_network_connections.sh': {
    description: 'List all active network connections in a table format.',
    command: 'ss -atOH | cut -d\' \' -f1 | sort | xargs -n1 | uniq -c && echo "Task completed"'
  },
  '17_reassign_symbolic_link.sh': {
    description: 'Reassign an existing symbolic link to a new target.',
    command: 'readlink /home/ask/ubuntu-scripts-tester/sandbox/test_dir/link1 | xargs -I {} ln -srf {} /home/ask/ubuntu-scripts-tester/sandbox/test_dir/link1 && echo "Task completed"'
  },
  '18_create_symbolic_links.sh': {
    description: 'Create symbolic links to specified files.',
    command: 'mkdir -p /home/ask/ubuntu-scripts-tester/sandbox/sym_dir && cat /home/ask/ubuntu-scripts-tester/sandbox/file_list | xargs -I{} sh -c \'ln -sbrf {} /home/ask/ubuntu-scripts-tester/sandbox/sym_dir/link_to_$(basename {})\' && echo "Task completed"'
  },
  '19_copy_directory_with_links.sh': {
    description: 'Copy a directory, preserving existing symbolic links.',
    command: 'cp -a /home/ask/ubuntu-scripts-tester/sandbox/test_dir /home/ask/ubuntu-scripts-tester/sandbox/backup/ && rsync -al /home/ask/ubuntu-scripts-tester/sandbox/test_dir/ /home/ask/ubuntu-scripts-tester/sandbox/rsync_backup/ && echo "Task completed"'
  },
  '20_copy_directory_with_symlinks.sh': {
    description: 'Copy a directory, preserving symbolic links.',
    command: 'cp -a /home/ask/ubuntu-scripts-tester/sandbox/test_dir /home/ask/ubuntu-scripts-tester/sandbox/archive/ && echo "Task completed"'
  },
  '21_copy_with_attributes.sh': {
    description: 'Copy files and directories with their attributes (permissions, timestamps).',
    command: 'cp -rp /home/ask/ubuntu-scripts-tester/sandbox/test_dir /home/ask/ubuntu-scripts-tester/sandbox/dir4/ && echo "Task completed"'
  },
  '22_convert_relative_to_direct_links.sh': {
    description: 'Convert all relative symbolic links to direct links.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -type l | xargs -I{} sh -c \'ln -sf $(realpath {}) {}\' && echo "Task completed"'
  },
  '23_convert_direct_to_relative_links.sh': {
    description: 'Convert all direct symbolic links to relative links.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -type l | xargs -I{} sh -c \'ln -srf $(readlink {}) {}\' && echo "Task completed"'
  },
  '24_find_and_delete_broken_links.sh': {
    description: 'Find and delete all broken symbolic links in the specified directory.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -xtype l -delete && echo "Task completed"'
  },
  '25_unpack_archive.sh': {
    description: 'Unpack a specified archive into the target directory.',
    command: 'tar -xvf /home/ask/ubuntu-scripts-tester/sandbox/arc.tar -C /home/ask/ubuntu-scripts-tester/sandbox/unpacked && echo "Task completed"'
  },
  '26_pack_directory_with_attributes.sh': {
    description: 'Pack a directory, preserving its attributes.',
    command: 'sudo tar -Jcf /home/ask/ubuntu-scripts-tester/sandbox/arc.tar.xz /home/ask/ubuntu-scripts-tester/sandbox/dir1/ && sudo tar -xf /home/ask/ubuntu-scripts-tester/sandbox/arc.tar.xz -C /home/ask/ubuntu-scripts-tester/sandbox && echo "Task completed"'
  },
  '27_copy_directory_structure.sh': {
    description: 'Copy only the directory structure, excluding files.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/dir1/ -type d -print | xargs -I{} mkdir -p /home/ask/ubuntu-scripts-tester/sandbox/dir_structure/{} && echo "Task completed"'
  },
  '28_list_users_alphabetically.sh': {
    description: 'List all users alphabetically by their usernames.',
    command: 'cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{4,}$" | cut -d: -f1 | sort && echo "Task completed"'
  },
  '29_list_system_users_sorted_by_id.sh': {
    description: 'List all system users, sorted by their user ID.',
    command: 'cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{1,3}$" | sort -t: -nk2 | tr \':\' \' \' && echo "Task completed"'
  },
  '30_list_users_sorted_by_reverse_id.sh': {
    description: 'List all users, sorted by their user ID in reverse order.',
    command: 'cut -d: -f1,3 /etc/passwd | grep -E ":[0-9]{1,3}$" | sort -t: -rnk2 | cut -d: -f1 && echo "Task completed"'
  },
  '31_list_users_without_authorization_rights.sh': {
    description: 'List all users without authorization rights.',
    command: 'sudo cut -d: -f1,2 /etc/shadow | grep -vE \':\!\*\' | cut -d: -f1 && sudo cut -d: -f1,2 /etc/shadow | grep -E \':\!\*\' | cut -d: -f1 && echo "Task completed"'
  },
  '32_list_users_with_or_without_terminal.sh': {
    description: 'List all users with or without a terminal.',
    command: 'cut -d: -f1,7 /etc/passwd | grep -E "/(bash|sh|zsh)$" | cut -d: -f1 && cut -d: -f1,7 /etc/passwd | grep -vE "/(bash|sh|zsh)$" | cut -d: -f1 && echo "Task completed"'
  },
  '33_download_all_links_from_page.sh': {
    description: 'Download all links from a specified web page.',
    command: 'wget -qO - https://abc.xyz/ | grep -oP \'href="\\K[^\"]+\' | xargs -I{} wget -P /home/ask/ubuntu-scripts-tester/sandbox/downloads/ {} && echo "Task completed"'
  },
  '34_stop_long_running_processes.sh': {
    description: 'Stop all long-running processes older than 5 days.',
    command: 'ps -eo comm= | xargs -n1 killall -o 5d && find /proc -maxdepth 1 -type d -ctime +5 | grep -oP \'/\\K[0-9]+\' | xargs kill -9 && echo "Task completed"'
  },
  '35_delete_orphaned_jpeg_files.sh': {
    description: 'Delete all orphaned JPEG files that do not have corresponding text files.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -type f -name \'*.jpeg\' | xargs -I{} sh -c \'pname="$(dirname {})/$(basename -s .jpeg {})"; [ ! -e ${pname}.txt ] && rm ${pname}.jpeg && echo "Deleted: ${pname}.jpeg"\' && echo "Task completed"'
  },
  '36_find_ip_address.sh': {
    description: 'Find the IP address of the specified network interface.',
    command: 'ip -o addr | grep inet | cut -d \' \' -f2,7 | tail -n +3 && echo "Task completed"'
  },
  '37_get_all_ip_addresses_from_file.sh': {
    description: 'Extract all IP addresses from the specified file.',
    command: 'grep -oP \'\\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\b\' /home/ask/ubuntu-scripts-tester/sandbox/test_dir/ips.txt && sudo grep -P \'\\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\b\' /etc/netplan/*.yaml | xargs && echo "Task completed"'
  },
  '38_find_active_hosts.sh': {
    description: 'Find all active hosts in the specified network range.',
    command: 'printf "192.168.194.%d\\n" {1..254} | xargs -I{} ping -c1 {} > /dev/null; cat /home/ask/ubuntu-scripts-tester/sandbox/test_dir/hosts.txt | xargs -I{} ping -c1 {} > /dev/null; ip -4 n | grep REACHABLE | cut -d \' \' -f1 | sort -u && echo "Task completed"'
  },  
  '39_get_raised_interfaces_ips.sh': {
    description: 'Get the IP addresses of all active (raised) network interfaces.',
    command: 'ip a | grep \'state UP\' | cut -d \' \' -f2 | xargs -n1 ip a show | grep inet | cut -d \' \' -f5,6 && sudo grep -P \'\\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\\b\' /etc/netplan/*.yaml | xargs && echo "Task completed"'
  },
  '40_get_subdomains_from_ssl.sh': {
    description: 'Extract subdomains from an SSL certificate of the specified domain.',
    command: 'echo | openssl s_client -connect microsoft.com:443 2>/dev/null | openssl x509 -noout -ext subjectAltName | tail -n +2 | xargs -n1 | cut -d: -f2 | tr -d \' \' && echo "Task completed"'
  },
  '41_extract_path_name_extension.sh': {
    description: 'Extract the path, name, and extension from a given file path.',
    command: 'file=\'./dir1/file1.txt\'; path=$(dirname $file); name=$(basename ${file%.*}); ext=${file##*.}; echo $path $name $ext && echo "Task completed"'
  },
  '42_delete_files_by_size_and_pattern.sh': {
    description: 'Delete files of a specific size and pattern.',
    command: 'find /home/ask/ubuntu-scripts-tester/sandbox/test_dir -type f -size 22c -name \'*.txt\' -delete && echo "Task completed"'
  },
  '43_create_files_with_identifiers.sh': {
    description: 'Create files with specified identifiers from a list.',
    command: 'xargs -a /home/ask/ubuntu-scripts-tester/sandbox/file_list -n2 sh -c \'mkdir -p $(dirname $1) && echo $2 > $1\' && echo "Task completed"'
  }
};

const ScriptAccordionList = () => {
  const [openScript, setOpenScript] = useState(null);
  const scriptRefs = useRef({});

  const handleToggle = (script) => {
    setOpenScript(openScript === script ? null : script);
  };

  useEffect(() => {
    if (openScript && scriptRefs.current[openScript]) {
      scriptRefs.current[openScript].scrollIntoView({ behavior: 'smooth' });
    }
  }, [openScript]);

  return (
    <div className="script-accordion-list">
      {Object.keys(scripts).map((script) => (
        <div key={script} ref={(el) => (scriptRefs.current[script] = el)}>
          <ScriptAccordion
            script={script}
            description={scripts[script].description}
            command={scripts[script].command}
            isOpen={openScript === script}
            onToggle={() => handleToggle(script)}
          />
        </div>
      ))}
    </div>
  );
};

export default ScriptAccordionList;
