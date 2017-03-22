# UDOMO
> Simple home automation. Yet, complete appliances management.

* Author, Designer, Programmer and Tester: - [Lucas Viñals](https://github.com/lucasvinals)

## Steps to get uDomo running:
* Clone this repository
* client/js/app.js (development -> production):
 * Uncomment config services
* Change in tools/prepareSystem.sh acordingly to your setup:
 * HOMEDIR
 * ARCHITECTURE_uDomo
* **cd** to this directory and execute in a console: **bash ./server/tools/prepareSystem.sh**
* Change database configuration in ./server/config/db.js (Secret key, paths, etc)
* Then, execute: **npm run cluster** (cluster mode - all cores) or **npm start** (only one core)
* If you are a developer, run only **gulp** in the console and nodemon will start the process.

##TODO
+ [Client] Angular-Translate
+ [Client] [Server] Scenes ABM
+ [Client] Scenes Activation
+ [Server] HTTPS server instead of NET module. Verify if ESP8266 support wss!
+ [Device] Auto-discover server IP based on it's MAC.

##Common problems
#### "failed to connect to server [127.0.0.1:27017] on first connect"
> Configure the db.js file in ./config according to your setup.

## About me
I'm Lucas Viñals, a guy how loves the combination of electronics and software. Feel free to contact me at "lucas.vinals@gmail.com" with any doubt you had or improvement!
