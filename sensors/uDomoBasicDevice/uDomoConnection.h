#include <Arduino.h>
#include <ESP8266WiFiMulti.h>
#include <SocketIOClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h>

#ifndef uDomoConnection_h
    #define uDomoConnection_h
    
    class uDomoConnection{
        public:
            uDomoConnection();
            void clientESP();
            bool isSocketConnected();
            bool isWifiConnected();
            String deviceIP();
            bool hasMessage();
            bool sendJSON(const char*, char*);
            void addAP(const char*, const char*);
            void initHTTPServer();
       private:
            
            const int _PORT = 12078;
            const char* _updaterPassword = "uDomo";
            const char* _updaterUser = "uDomo";
            const char* _updaterPath = "/device";
            char* _serverIP = "192.168.0.4";
    };
#endif