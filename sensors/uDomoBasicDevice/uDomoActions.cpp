#include "uDomoActions.h"

uDomoConnection Connection;
BMP Sensor;

extern String RID;
extern String Rcontent;
volatile const unsigned char INPUTS[2] = { 13, 12 };
volatile const unsigned char OUTPUTS[2] = { 14, 16 };
volatile bool buttonPressed = false;
volatile bool stateOutput[2] = { false };

const bool SENSORPRESENT = true;
const String DEVICEID = "39da52b9-2a6e-4b2a-bd60-9bdb0ace038d";

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
  Serial.println(F("************************************************************"));
  Serial.println(F("********************** Booting Device **********************"));
  Serial.println(F("************************************************************"));
  unsigned char t = 4;
  while (t){
    Serial.flush();
    delay(1000);
    t--;
  }

  initPins();

  Sensor.calibrate();
  Connection.setup();
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

  root["IP"] = Connection.deviceIP();
  root["_id"] = DEVICEID;
  
  /**
   * Outputs readings
   */
  for (unsigned char i = 0; i < sizeof(OUTPUTS) / sizeof(unsigned char); ++i){
    Pins[String(OUTPUTS[i])] = analogRead(OUTPUTS[i]);
  }

  if (SENSORPRESENT){
    /**
     * getTPAL -> Temperature, Pressure, Altitude, Light
     */
    struct tpa values = Sensor.getTPAL();
    root["T"] = values.temperature;
    root["A"] = values.altitude;
    root["P"] = values.pressure;
    root["L"] = values.light;
  }

  /**
   * Serialize JSON object to send in Connection
   */
  char deviceRequest[sizeof(jsonLoop)];
  root.printTo(deviceRequest, sizeof(deviceRequest));
  Connection.sendJSON("deviceRequest", deviceRequest);

  return true;
}

bool uDomoActions::actionReceived(){  
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
  Serial.print(F("Este es el tamaño de o: "));
  Serial.println(sizeof(OUTPUTS) / sizeof(unsigned char));
  for (unsigned char index = 0; index < sizeof(OUTPUTS) / sizeof(unsigned char); ++index){
    pinMode(OUTPUTS[index], OUTPUT);
    digitalWrite(OUTPUTS[index], LOW);
  }
  /**
   * Inputs init
   */
  Serial.print(F("Este es el tamaño de i: "));
  Serial.println(sizeof(INPUTS) / sizeof(unsigned char));
  for (unsigned char index = 0; index < sizeof(INPUTS) / sizeof(unsigned char); ++index){
    pinMode(INPUTS[index], INPUT);
  }
}
 