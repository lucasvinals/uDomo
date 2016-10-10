# UDOMO
> Simple home automation. Yet, complete appliances management.

* Author, Designer, Programmer and Tester: - [Lucas Viñals](https://github.com/lucasvinals)

## Steps to get this running:
* Clone this repository
* app.js (client/js) [Production only]:
 * Uncomment config services
* gulpfile.js [Production only]: 
 * Uncomment google-closure-compiler
 * Comment concat
* Execute in a bash: npm run prepare
* Change configuration in ./config/db.js (Secret key, paths, etc)
* Change OS in ./cluster.js (in case it's not GNU/Linux)
* Then, execute: npm run cluster (cluster mode - all cores) or npm start (only one core)

##TODO
+ [Client] Angular-Translate
+ [Client] [Server] Scenes ABM
+ [Client] Scenes Activation
+ [Server] HTTPS server instead of NET. Verify if ESP8266 ws support security!
+ [Device] Auto-discover server IP based on it's MAC.

##Common problems
#### "failed to connect to server [127.0.0.1:27017] on first connect"
> Configure the db.js file in ./config according to your setup.

## About me
I'm Lucas Viñals, a guy how loves the combination of electronics and software. Feel free to contact me at "lucas.vinals@gmail.com" with any doubt you had or improvement!
