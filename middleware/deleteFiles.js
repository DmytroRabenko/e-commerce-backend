const fs = require('fs');
const path = require('path');

const deleteFiles = async fileNames => {
  for (const fileName of fileNames) {
    const filePath = path.resolve(__dirname, '..', 'static', fileName);
    try {
      // Видаляємо файл
      fs.unlinkSync(filePath);
      console.log(`Файл ${fileName} успішно видалено`);
    } catch (error) {
      console.error(`Помилка під час видалення файлу ${fileName}:`, error);
    }
  }
};

module.exports = deleteFiles;
