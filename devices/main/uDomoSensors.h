#include "Arduino.h"
#include <Wire.h>
#include "TSL2561.h"
#include "uDomoBMP.h"

#ifndef uDomoSensors_h
    #define uDomoSensors_h

    class uDomoSensors{
        public:
            uDomoSensors();
            tpa BMP_getTPA();
            float TSL_getLight();
            void BMP_Calibrate();
    };

#endif