# ТСПП2025 Telegram Mini App

## 📱 Простая установка клиента

### Шаг 1: Установка Node.js
1. Откройте [официальный сайт Node.js](https://nodejs.org)
2. Скачайте и установите последнюю LTS версию (она помечена как "Рекомендуется")
3. Проверьте установку, открыв командную строку (терминал) и введя:
   ```bash
   node --version
   ```
   Должна появиться версия Node.js (например, v18.x.x)

### Шаг 2: Скачивание проекта
1. Нажмите зеленую кнопку "Code" вверху страницы
2. Выберите "Download ZIP"
3. Распакуйте скачанный архив в удобное место

### Шаг 3: Установка проекта
1. Откройте командную строку (терминал)
2. Перейдите в папку с проектом:
   ```bash
   cd путь/к/папке/tspp2025-tg-app
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```

### Шаг 4: Запуск клиента
1. В той же командной строке введите:
   ```bash
   npm run dev
   ```
2. Дождитесь сообщения о запуске сервера
3. Готово! 🎉

## 🖥️ Установка сервера

### Шаг 1: Создание Telegram бота
1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте команду `/newbot`
4. Следуйте инструкциям и сохраните полученный токен

### Шаг 2: Настройка сервера
1. Создайте файл `.env` в корне проекта:
   ```bash
   touch .env
   ```
2. Добавьте в него следующие строки:
   ```
   BOT_TOKEN=ваш_токен_бота
   DATABASE_URL=file:./dev.db
   PORT=3000
   ```

### Шаг 3: Установка базы данных
1. Перейдите в папку сервера:
   ```bash
   cd server
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Инициализируйте базу данных:
   ```bash
   npm run db:setup
   ```

### Шаг 4: Запуск сервера
1. В папке сервера выполните:
   ```bash
   npm run dev
   ```
2. Сервер запустится на порту 3000

### 🔒 Важные замечания по серверу

1. **Безопасность**
   - Никогда не публикуйте токен бота
   - Храните `.env` в `.gitignore`
   - Используйте HTTPS в продакшене

2. **База данных**
   - Регулярно делайте бэкапы
   - База находится в `server/prisma/dev.db`
   - Для продакшена используйте PostgreSQL

3. **Мониторинг**
   - Проверяйте логи в `server/logs`
   - Следите за использованием памяти
   - Настройте оповещения об ошибках

### 🆘 Частые проблемы

1. **Ошибка "command not found: npm"**
   - Переустановите Node.js
   - Перезапустите компьютер

2. **Ошибка при npm install**
   - Проверьте подключение к интернету
   - Попробуйте очистить кэш:
     ```bash
     npm cache clean --force
     ```

3. **Не запускается сервер**
   - Проверьте, что порты 5173 и 3000 свободны
   - Закройте другие запущенные серверы
   - Проверьте права доступа к базе данных

### 📞 Поддержка

Если что-то не получается:
1. Откройте Telegram
2. Напишите в чат поддержки: @tspp2025_support

## Функциональность

- 👤 Профиль участника
  - Отображение данных из Telegram
  - Фото профиля
  - Имя и контактная информация

- 💬 Чат между участниками
  - Обмен сообщениями
  - Отображение времени отправки
  - Удобный интерфейс