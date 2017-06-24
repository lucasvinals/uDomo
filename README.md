# UDOMO
> Simple home automation. Yet, complete appliances management.

## Steps to get uDomo running:
* Clone this repository `git clone https://github.com/lucasvinals/uDomo`
* **cd** to this directory and execute in a console: **bash ./server/tools/prepareSystem.sh**
* Change database configuration in ./server/config/db.js
* Execute: ** yarn run development** (with HMR) or ** yarn run production ** (with uglify, tree shaking, etc)

## TODO
+ [Server] Change old console logs for a more robust framework like Winston or Bunyan  
+ [Client] Geolocation service
+ [Server] Cache (cachegoose) for caching common finds
+ [Server] Implement Nginx reverse proxy
+ [Server] Aggregation framework for MongoDB queries
+ [Client] Angular-Translate
+ [Client] [Server] Scenes ABM
+ [Client] Scenes Activation
+ [Server] HTTPS server instead of NET module. Verify if ESP8266 support wss!
+ [Device] Auto-discover server IP based on it's MAC.

## Common issues
#### "failed to connect to server [127.0.0.1:27017] on first connect"
> Configure the file in ./server/config/db.js according to your setup.

## About me
I'm Lucas Viñals, a guy how loves the combination of electronics and software.
Feel free to contact me at "lucas.vinals@gmail.com" with any doubt you had or improvement!
