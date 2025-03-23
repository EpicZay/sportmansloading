fx_version 'cerulean'
game 'gta5'

author 'Your Name'
description 'Modern Loading Screen for Crescent City RP'
version '1.0.0'

loadscreen 'index.html'

files {
    'index.html',
    'style.css',
    'script.js',
    'config.js',
    'img/logo.png',
    'img/background.png',
    'img/bg-pattern.png',
    'audio/background.mp3'
}

loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

client_script 'client.lua'