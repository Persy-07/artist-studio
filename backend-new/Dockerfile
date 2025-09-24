FROM php:8.2-cli

# Installer les extensions PHP et outils nécessaires
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copier composer.json et composer.lock en premier
COPY composer.json composer.lock ./

# Installer les dépendances sans les scripts
RUN composer install --no-dev --no-scripts --optimize-autoloader

# Copier le reste des fichiers
COPY . .

# Installer les dépendances avec scripts (si nécessaire)
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]