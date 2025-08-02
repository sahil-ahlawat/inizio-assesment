# Use the official PHP image with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install PDO MySQL extension
RUN docker-php-ext-install pdo_mysql

# Copy application files
COPY . .