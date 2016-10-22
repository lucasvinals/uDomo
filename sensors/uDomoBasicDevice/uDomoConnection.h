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
            String deviceIP();
            bool hasMessage();
            bool sendJSON(const char*, char*);
            void setup();
       private:
            void addAPs();
            void connectWifi();
            void initHTTPServer();
            // void erasePreviousNetwork();
            char* findServerIP();
            unsigned char getNetworkParamsSize();
            const int _PORT = 12078;
            const char* _updaterPassword = "uDomo";
            const char* _updaterUser = "uDomo";
            const char* _updaterPath = "/device";
            char* _serverIP;
            char* _networks[25] = {
                /* SSIDs        Passwords         	      Fixed server IP (in router) */
                "Lucasnet"    , "uD0m0_uk"                , "192.168.43.43",
                "Casa_01"     , "Pilarjazmin3"            , "192.168.0.12",
                "MLuz"        , "36578742luz"             , "192.168.1.3"
            };
    };
#endif