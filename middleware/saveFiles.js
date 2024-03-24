const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Функція для збереження файлів
const saveFiles = async (mediaFiles) => {
  const fileNames = [];
  
  // Перевірка, чи mediaFiles є масивом
  if (Array.isArray(mediaFiles)) {
    for (const media of mediaFiles) {
      const fileName = uuidv4() + '.jpg';
      await media.mv(path.resolve(__dirname, '..', 'static', fileName));
      fileNames.push(fileName);
    }
  } else {
    // Якщо mediaFiles не є масивом, то це один файл
    const fileName = uuidv4() + '.jpg';
    await mediaFiles.mv(path.resolve(__dirname, '..', 'static', fileName));
    fileNames.push(fileName);
  }
  
  return fileNames;
};

module.exports = saveFiles;