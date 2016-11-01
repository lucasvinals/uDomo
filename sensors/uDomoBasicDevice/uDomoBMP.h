/**
 * Header file for the BMP sensor used in uDomo
 */
#include "Arduino.h"
#include <Wire.h>
#include "thirdParty/TSL2561.h"

#ifndef BMP_h
    #define BMP_h

    struct tpa{
        float temperature;
        float pressure; 
        float altitude;
        float light;
    };

    class BMP{
        public:
            BMP(void);
            tpa getTPAL(void);
            void calibrate(void);
        private:
            unsigned short read16(unsigned char);
            unsigned char read8(unsigned char);
            void write8(unsigned char, unsigned char);
            void getCalibrationData(void);
          
            short ac1, ac2, ac3, b1, b2, mb, mc, md;
            unsigned short ac4, ac5, ac6;
            unsigned char oss;
    };

#endif