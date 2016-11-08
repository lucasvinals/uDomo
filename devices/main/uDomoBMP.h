#include "Arduino.h"
#include <Wire.h>

#ifndef BMP_h
    #define BMP_h

    struct tpa{
        float temperature;
        float pressure; 
        float altitude;
    };

    class BMP{
        public:
            BMP(void);
            tpa getTPA();
            void calibrate(void);
        private:
            unsigned short read16(unsigned char);
            unsigned char read8(unsigned char);
            void write8(unsigned char, unsigned char);
            bool getCalibrationData(void);
          
            short ac1, ac2, ac3, b1, b2, mb, mc, md;
            unsigned short ac4, ac5, ac6;
            unsigned char oss;
    };

#endif