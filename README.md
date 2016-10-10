# UDOMO #

Author, Designer, Programmer, Tester: Lucas Viñals
Date: 06/2015

Steps to get it running:
    * Clone this repository
    * Execute in a bash: npm run prepare
    * Change configuration in ./config/db.js (Secret key, paths, etc)
    * Change OS in ./cluster.js (in case it's not GNU/Linux)
    * 
    * Then, execute: bower install (Client side libraries)
    * Go to the main directory and execute: node server.js

### Simple home automation. Yet, complete appliances management. ###

* Quick summary
* 0.1

TODO:   + [Client] Angular-Translate
        + [Server] Auto-Discover Devices DONE
        + [Device] Change net params wirelessly Done (once you flash the device with your SSID/password).
        + [Client] [Server] Scenes ABM
        + [Client] Scenes Activation
        + [Client] Verify if IP is public or private (then -> load CDN or Static js files). Basket.js?
        + [Server] HTTPS server instead of NET. Verify if ESP8266 ws support security!
        + [Device] Auto-discover server IP based on it's MAC.

Common mistakes: 
                Problem: "failed to connect to server [127.0.0.1:12079] on first connect"
                Solution: Configure the db.js file in ./config according to your setup.
                 
I'm Lucas Viñals, a guy how loves the combination of electronics and software. Feel free to contact me at "lucas.vinals@gmail.com" with any doubt you had or improvement!