module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            database: 'stock_indicator',
            user: 'root',
            host: "localhost",
            port: "3306",
            password: '',
        },
        migrations: {
            directory: './src/migrations',
        },
        seeds: {
            directory: './src/seeders'
        }
    },

    staging: {
        client: 'mysql2',
        connection: {
            database: 'stock_indicator',
            user: 'root',
            host: "localhost",
            port: "3306",
            password: ''
        },
        migrations: {
            directory: './src/migrations',
        },
        seeds: {
            directory: './src/seeders'
        }
    },
};