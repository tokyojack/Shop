var mysql = require('mysql');

var config = require('../config/config');
var connection = mysql.createConnection(config.db);

connection.query('CREATE TABLE `emails` ( \
    `email` varchar(255) NOT NULL, \
    UNIQUE KEY `email` (`email`) \
   ) ENGINE=MyISAM DEFAULT CHARSET=latin1');

connection.query('CREATE TABLE `shopItems` ( \
    `id` int(11) NOT NULL AUTO_INCREMENT, \
    `title` varchar(255) NOT NULL, \
    `description` mediumtext NOT NULL, \
    `cost` decimal(11,2) NOT NULL, \
    `picture_url` varchar(255) NOT NULL, \
    `download_url` varchar(255) NOT NULL, \
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    PRIMARY KEY (`id`), \
    UNIQUE KEY `title` (`title`)\
   ) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=latin1');

console.log('Success: Database Created!');

connection.end();