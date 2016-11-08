#include "uDomoActions.h"

uDomoConnection Connection;
uDomoSensors Sensor;

extern String RID;
extern String Rcontent;
volatile const unsigned char INPUTS[2] = { 13, 12 };
volatile const unsigned char OUTPUTS[2] = { 14, 16 };
volatile bool buttonPressed = false;
volatile bool stateOutput[2] = { false };
String DEVICEIP = "";
String DEVICEID = "";

/**
 * Public
 */
uDomoActions::uDomoActions(){}

void uDomoActions::setup(){

  Serial.begin(115200);
  Serial.setDebugOutput(true); // ESP8266 has a rich debug!
  /**
   * Give the uC some time to properly start..
   */
  delay(1000);
  Serial.println(F("************************************************************"));
  Serial.println(F("********************** Booting Device **********************"));
  Serial.println(F("************************************************************"));
  uint8_t t = 4;
  while (t){
    Serial.flush();
    delay(1000);
    t--;
  }

  // EEPROM.begin(16);
  setDeviceUUID();
  initPins();

  Sensor.BMP_Calibrate();
  Connection.setup();
  DEVICEIP = Connection.deviceIP();
}

void uDomoActions::loop(){
  Connection.clientESP();
  
  if (Connection.isSocketConnected()) {
    buttonPressed && sendMessage() && (buttonPressed = false);
    sendPeriodically();
    Connection.hasMessage() && actionReceived();
  }
}

/**
 * Private
 */

bool uDomoActions::sendMessage(){
    StaticJsonBuffer<500> jsonLoop;
    JsonObject& root = jsonLoop.createObject();
    JsonObject& Pins = root.createNestedObject("Pins");

    root["IP"] = DEVICEIP;
    root["_id"] = DEVICEID;
    
    /**
    * Outputs readings
    */
    for (unsigned char i = 0; i < sizeof(OUTPUTS) / sizeof(unsigned char); ++i){
      Pins[String(OUTPUTS[i])] = analogRead(OUTPUTS[i]);
    }

   
      /**
      * getTPA -> Temperature, Pressure, Altitude
      */
      struct tpa BMP180 = Sensor.BMP_getTPA();
      root["T"] = BMP180.temperature;
      root["A"] = BMP180.altitude;
      root["P"] = BMP180.pressure;

      root["L"] = Sensor.TSL_getLight();
    

    /**
    * Serialize JSON object to send in Connection
    */
    char deviceRequest[sizeof(jsonLoop)];
    root.printTo(deviceRequest, sizeof(deviceRequest));
    Connection.sendJSON("deviceRequest", deviceRequest);

    return true;
}

bool uDomoActions::actionReceived(){
  Serial.print("Message Arrived");
  if(RID == "changePin"){
    String str = Rcontent; // Because Rcontent could change in any moment..
    StaticJsonBuffer<200> jsonActions;
    String payload = "{" + str.substring(0, str.lastIndexOf('}'));
    JsonObject& incomingDevice = jsonActions.parseObject(payload);
    if (incomingDevice["_id"] == DEVICEID){
      analogWrite(incomingDevice.get<short>("pin"), incomingDevice.get<short>("value"));
      sendMessage();
    }
  }
  return true;
 }

void uDomoActions::sendPeriodically(){
  static unsigned long last = 0;
  if (abs(millis() - last) > 5000){
    sendMessage();
    last = millis();
  }
}

void uDomoActions::initPins(){
  /**
   * Outputs init
   */
  for (unsigned char index = 0; index < sizeof(OUTPUTS) / sizeof(unsigned char); ++index){
    pinMode(OUTPUTS[index], OUTPUT);
    digitalWrite(OUTPUTS[index], LOW);
  }
  /**
   * Inputs init
   */
  for (unsigned char index = 0; index < sizeof(INPUTS) / sizeof(unsigned char); ++index){
    pinMode(INPUTS[index], INPUT);
  }
}

void uDomoActions::setDeviceUUID(){
    byte uuidNumber[16];
    ESP8266TrueRandom.uuid(uuidNumber);
    DEVICEID = ESP8266TrueRandom.uuidToString(uuidNumber);
}