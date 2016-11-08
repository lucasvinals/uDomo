#include <Arduino.h>
#include <EEPROM.h>
#include "ArduinoJson.h"
#include "ESP8266TrueRandom.h"
#include "uDomoSensors.h"
#include "uDomoConnection.h"

#ifndef uDomoActions_h
    #define uDomoActions_h
    
    extern volatile const unsigned char INPUTS[2];
    extern volatile const unsigned char OUTPUTS[2];
    extern volatile bool stateOutput[2];
    extern volatile bool buttonPressed;

    class uDomoActions{
        public:
            uDomoActions();
            void setup();
            void loop();
       private:
            bool actionReceived();
            bool sendMessage();
            void sendPeriodically();
            void initPins();
            void setDeviceUUID();
            char* makeRandomUUID();
    };
#endif