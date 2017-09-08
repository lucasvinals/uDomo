# UDOMO
> Simple home automation. Yet, complete appliances management.

## Steps to get uDomo running:
* Clone this repository `git clone https://github.com/lucasvinals/uDomo`
* **cd** to this directory and execute in a console: **bash ./server/tools/prepareSystem.sh**
* Execute one of the following:
  <ul>
    <li><strong>yarn run local</strong> (with HMR)</li>
    <li><strong>yarn run development</strong> (with a cloud based databse)</li>
    <li><strong>yarn run production</strong> (with uglify, tree shaking, etc)</li>
  </ul>

## TODO
+ [Server] Change old console logs for a more robust framework like Winston or Bunyan
+ [Client] Geolocation service
+ [Server] Cache (cachegoose) for caching common finds
+ [Server] Implement Nginx reverse proxy
+ [Client] Angular-Translate
+ [Client] [Server] Scenes ABM
+ [Client] Scenes Activation
+ [Server][DONE] HTTPS server instead of NET module. Verify if ESP8266 support wss!
+ [Device] Auto-discover server IP based on it's MAC.

## Common issues
#### "failed to connect to server [127.0.0.1:12079] on first connect"
> Create the "data/db" directory with `mkdir -p /data/db`.
> Restart.

## About me
I'm Lucas Viñals, a guy who loves the combination of electronics and software.
Feel free to contact me at "lucas.vinals@gmail.com" with any doubt you had or improvement!
