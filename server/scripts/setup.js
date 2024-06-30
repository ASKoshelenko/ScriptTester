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
  '41_extract_path_name_extension.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1.txt && echo "Настройка песочницы для тестирования 41_extract_path_name_extension.sh завершена"`,
  '25_unpack_archive.sh': `mkdir -p ${sandboxDir}/unpacked && echo "Настройка песочницы для тестирования 25_unpack_archive.sh завершена"`,
  '26_pack_directory_with_attributes.sh': `mkdir -p ${sandboxDir}/test_dir && touch ${sandboxDir}/test_dir/file1.txt && echo "Настройка песочницы для тестирования 26_pack_directory_with_attributes.sh завершена"`,
  '27_copy_directory_structure.sh': `mkdir -p ${sandboxDir}/test_dir && mkdir -p ${sandboxDir}/test_dir/subdir && echo "Настройка песочницы для тестирования 27_copy_directory_structure.sh завершена"`
};

const destroyCommands = {
  '1_find_system_groups.sh': `rm -rf ${sandboxDir}/test_passwd`,
  '2_find_files_with_access_rights.sh': `rm -rf ${sandboxDir}/test_dir`,
  '3_find_all_scripts.sh': `rm -rf ${sandboxDir}/test_dir`,
  '9_find_names_by_inode.sh': `rm -rf ${sandboxDir}/test_dir`,
  '10_find_names_by_inode_multiple_partitions.sh': `rm -rf ${sandboxDir}/test_dir`,
  '11_delete_file_with_links.sh': `rm -rf ${sandboxDir}/test_dir`,
  '12_recursive_change_permissions.sh': `rm -rf ${sandboxDir}/test_dir`,
  '13_compare_directories.sh': `rm -rf ${sandboxDir}/dir1 ${sandboxDir}/dir2`,
  '35_delete_orphaned_jpeg_files.sh': `rm -rf ${sandboxDir}/test_dir`,
  '41_extract_path_name_extension.sh': `rm -rf ${sandboxDir}/test_dir`,
  '25_unpack_archive.sh': `rm -rf ${sandboxDir}/unpacked`,
  '26_pack_directory_with_attributes.sh': `rm -rf ${sandboxDir}/test_dir`,
  '27_copy_directory_structure.sh': `rm -rf ${sandboxDir}/test_dir`
};

module.exports = { setupCommands, destroyCommands };
