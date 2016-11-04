#include <Arduino.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h>
#include "SocketIOClient.h"

#ifndef uDomoConnection_h
    #define uDomoConnection_h
    
    class uDomoConnection{
        public:
            uDomoConnection();
            void clientESP();
            bool isSocketConnected();
            String deviceIP();
            bool hasMessage();
            bool sendJSON(const char*, char*);
            void setup();
       private:
            void addAPs();
            void connectWifi();
            void initHTTPServer();
            char* findServerIP();
            unsigned char getNetworkParamsSize();
            const int _PORT = 12078;
            const char* _updaterPassword = "uDomo";
            const char* _updaterUser = "uDomo";
            const char* _updaterPath = "/device";
            char* _serverIP;
    };
#endif