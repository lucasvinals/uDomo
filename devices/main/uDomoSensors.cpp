#include "uDomoSensors.h"
/**
 * For each sensor you have, define here -> [SENSORNAME]_def and initialize the object
 */
#define TSL2561_def
#define BMP180_def

#ifdef TSL2561_def
     TSL2561 TSL(TSL2561_ADDR_FLOAT);
#endif

#ifdef BMP180_def
     BMP BMP180;
#endif

uDomoSensors::uDomoSensors(){
    Wire.begin(); // Wire.begin(int sda, int scl) => Wire.begin(4, 5) by default.

    /**
     * For each sensor you have, make a condition here to config each sensor object with the previous define.
     */
    #ifdef TSL2561_def
        TSL.begin();
        TSL.setGain(TSL2561_GAIN_16X);
        TSL.setTiming(TSL2561_INTEGRATIONTIME_13MS);
    #endif
    
    #ifdef BMP180_def
        BMP180.calibrate();
    #endif
}

struct tpa uDomoSensors::BMP_getTPA(){
    return BMP180.getTPA();
}

float uDomoSensors::TSL_getLight(){
    return TSL.getLuminosity(TSL2561_VISIBLE);
}

void uDomoSensors::BMP_Calibrate(){
    BMP180.calibrate();
}