## Laravel Chat App

Laravel Chat App is a realtime chat application built with Laravel, Inertia JS, and React JS. This project is an example of how to implement realtime chat application in Laravel using Soketi.

Source code : [GitHub](https://github.com/raprmdn/laravel-chat-app)

### Tech Stack

- [Laravel](https://laravel.com/)
- [Inertia JS](https://inertiajs.com/)
- [React JS](https://reactjs.org/)
- [Soketi](https://docs.soketi.app/)

### Packages

- [pusher/pusher-php-server](https://laravel.com/docs/10.x/broadcasting)
- [laravel/scout](https://laravel.com/docs/10.x/scout)
- [laravel-echo](https://laravel.com/docs/10.x/broadcasting)
- [pusher-js](https://laravel.com/docs/10.x/broadcasting)

## Installation and Usage

Clone the repository

```bash
git clone https://github.com/Spenkau/laravel_react_messanger
```

Go to the project directory

```bash
cd laravel-chat-app
```

Install dependencies

```bash
# composer
composer install

# npm
npm install
```

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

Run migration and seeder

```bash
# migration
php artisan migrate

# seeder
php artisan db:seed
```

> You must install <a href="https://docs.soketi.app/getting-started/installation/cli-installation" target="_blank">Soketi</a> globally before running the application.

Install Soketi

```bash
npm install -g @soketi/soketi
```

Run Soketi with custom configuration.

```bash
npm run soketi
```

Run the application

```bash
# Start the development server
php artisan serve

# Run React JS
npm run dev
```


