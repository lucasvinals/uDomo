#include "uDomoBMP.h"

short counter = 0;

BMP::BMP(){}

void BMP::calibrate(){
    getCalibrationData();
}

bool BMP::getCalibrationData(){
    ac1 = read16(0xAA);
    ac2 = read16(0xAC);
    ac3 = read16(0xAE);
    ac4 = read16(0xB0);
    ac5 = read16(0xB2);
    ac6 = read16(0xB4);

    b1 = read16(0xB6);
    b2 = read16(0xB8);


    mb = read16(0xBA);
    mc = read16(0xBC);
    md = read16(0xBE);
    
    return true;
}

void BMP::write8(unsigned char reg, unsigned char val){
    Wire.beginTransmission(0x77);
    Wire.write(reg);
    Wire.write(val);
    Wire.endTransmission();
}

unsigned char BMP::read8(unsigned char reg){
    unsigned char data;

    Wire.beginTransmission(0x77);
    Wire.write(reg);
    Wire.endTransmission();

    Wire.beginTransmission(0x77);
    Wire.requestFrom(0x77, 1);
    data = Wire.read();
    Wire.endTransmission();

    return data;
}

unsigned short BMP::read16(unsigned char reg){
    unsigned short data;

    Wire.beginTransmission(0x77);
    Wire.write(reg);
    Wire.endTransmission();

    Wire.beginTransmission(0x77);
    Wire.requestFrom(0x77, 2);
    data = static_cast<unsigned short>(Wire.read()) * 256 + Wire.read();
    Wire.endTransmission();

    return data;
}

struct tpa BMP::getTPA(){
    /**
     * Every 10 calls, calibrate the sensor
     */
    counter == 9 && getCalibrationData() && (counter = 0);
    ++counter;

    int UT, UP, B3, B5, B6, X1, X2, X3, p, T;
    unsigned int B4, B7;

    //Temperature
    write8(0xF4, 0x2E);
    delay(5);
    UT = read16(0xF6);

    // press
    write8(0xF4, 0x34 + (oss << 6));

    oss = oss & 0x03;

    if (oss == 0) delay(5);
    else if (oss == 1) delay(8);
    else if (oss == 2) delay(14);
    else if (oss == 3) delay(26);

    UP = read16(0xF6);
    UP <<= 8;
    UP += read8(0xF6 + 2);
    UP >>= (8 - oss);

    X1 = ((UT - ac6) * ac5) >> 15; // /2^15
    X2 = (static_cast<int>(mc) << 11) / (X1 + md);

    B5 = X1 + X2;
    T = (B5 + 8) >> 4;
    //Serial.println(T);

    B6 = B5 - 4000;
    X1 = (static_cast<int>(b2) * ((B6 * B6) >> 12)) >> 11;
    X2 = (static_cast<int>(ac2) * B6) >> 11;
    X3 = X1 + X2;

    B3 = (((static_cast<int>(ac1) * 4 + X3) << oss) + 2) >> 2;
    X1 = (static_cast<int>(ac3) * B6) >> 13;
    X2 = (static_cast<int>(b1) * ((B6 * B6) >> 12)) >> 16;
    X3 = ((X1 + X2) + 2) >> 2;
    B4 = (static_cast<unsigned int>(ac4) * (X3 + 32768)) >> 15;
    B7 = (static_cast<unsigned int>(UP) - B3) * (static_cast<unsigned int>(50000) >> oss);

    if (B7 < 0x80000000) p = (B7 * 2) / B4;
    else p = (B7 / B4) * 2;

    X1 = (p >> 8) * (p >> 8);
    X1 = (X1 * 3038) >> 16;
    X2 = (-7357 * p) >> 16;
    p = p + ((X1 + X2 + 3791) >> 4);

    struct tpa returnValues;
    returnValues.pressure = p / 100.0;
    returnValues.temperature = T < 0 ? -1 * T / 10.0 : T / 10.0;
    const float constExpPressure = 0.190295;
    const float pressureCalc = p / 101325.0;
    returnValues.altitude = 44330 * (1.0 - pow(pressureCalc, constExpPressure));
    return returnValues;
}