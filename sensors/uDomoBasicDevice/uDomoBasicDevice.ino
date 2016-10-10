/*
  Hi nerds folks! I'm a programmer from Argentina and I've been working with this proyect for a few months for my final proyect in university.
  I've tried to write all the code in english. Sorry if you found any mistake.

  + Device with websockets(SocketIO). Receive and send messages from the server (mine is in NodeJS).
  + It has a new functionality that permits OTA (Over the Air) updates. Has a lot of work to do, but it's awesome if you can't reach the device once installed.
  + Change device constants acordingly to your network.

  Author              : Lucas Santiago Vi�als
  Created             : 01/11/2015
  Last modified       : 20/03/2016
  Contact             : lucas.vinals@gmail.com (preferred) / lucas.vinals@hotmail.com
  URL of this project : github.com

  JSON to send:
  Params:
  "N": Number of device
  "Z": Zone or area where device is located
  "T": Temperature
  "P": Pressure
  "Pins": Pins Object
  "H": Humidity (Soon)
  "A": Altitude
  "L": Ambient light (Soon)

  Observer: http://osdevlab.blogspot.com.ar/2016/05/observer-design-pattern-in-arduino.html
*/

/******************************************************* Libraries *********************************************************/
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h>
#include <SocketIOClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
/***************************************************************************************************************************/

/******************************************************* DEBUG ********************************************************************/
#define DEBUG // UNCOMMENT to enable DEBUG outputs in the console (Ctrl + Shift + m). Comment for PRODUCTION release.
#ifdef DEBUG
#define debugPrintln(x)  Serial.println(x)
#define debugPrint(x)    Serial.print(x)
#define debugFlush()     Serial.flush()
#else
#define debugPrint(x)
#define debugPrintln(x)
#define debugFlush()
#endif
/**********************************************************************************************************************************/

/************************************************** Device constants and variables ************************************************/
const unsigned char	BUTTONS	          = 2;
volatile const unsigned char	INPUTS[BUTTONS]	  = { 13, 12 }; // Inputs.  Available pins: 2, 12, 13, 14 and 16. DO NOT repeat in outputs[]
volatile const unsigned char	OUTPUTS[BUTTONS]  = { 14, 16 }; // Outputs. Available pins: 2, 12, 13, 14 and 16. DO NOT repeat in inputs[]

const short UPDATERPORT          = 8888;
volatile const short DEBOUNCE    = 400;

const unsigned short PORT = 12078;

const bool SENSORPRESENT = true; // Flag to indicate if this pressure/temperature/altitude/light sensor is present or not.

volatile bool stateInput[BUTTONS]   = { false }; // Input pins.For example: Button switches...
volatile bool stateOutput[BUTTONS]  = { false }; // State
volatile bool prevStateOut[BUTTONS]	= { false };
volatile bool buttonPressed         = true;

String deviceIP	= "";
String serverIP = "";
const String DEVICEID = "32da52b9-2a6e-4b2a-bd60-9bdb0ace038d";

volatile unsigned long  timeLapse[BUTTONS]		= { 0 };
/**********************************************************************************************************************************/

/******************************************************* Libraries instances ******************************************************/
ESP8266WiFiMulti WiFiMulti;
SocketIOClient socketio;
ESP8266WebServer httpServer(UPDATERPORT);
ESP8266HTTPUpdateServer httpUpdater;
/*********************************************************************************************************************************/

/***************** These variables are assinged in the SocketIO manager with the incomming messages parameters ********************/
extern String RID;
extern String Rname;
extern String Rcontent;
/**********************************************************************************************************************************/

/************************************************ BMP180 helper Functions ********************************************************/
short ac1, ac2, ac3, b1, b2, mb, mc, md;
unsigned short ac4, ac5, ac6;
unsigned char oss;
float temperatureDec = 0, pressureDec = 0, altitudeDec = 0, lightDec = 0;

unsigned short read16(unsigned char reg){
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

unsigned char read8(unsigned char reg){
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

void write8(unsigned char reg, unsigned char val){
  Wire.beginTransmission(0x77);
  Wire.write(reg);
  Wire.write(val);
  Wire.endTransmission();
}

void getCalibrationData(){
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
}

bool getTempPress(){
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

  pressureDec = p / 100.0;
  temperatureDec = T < 0 ? -1 * T / 10.0 : T / 10.0;
  const float constExpPressure = 0.190295;
  const float pressureCalc = p / 101325.0;
  altitudeDec = 44330 * (1.0 - pow(pressureCalc, constExpPressure));
  return true;
}

/********************************************************************************************************************************************/

bool sendMessageServer(){
  /*********************************************** Device JSON constructors **********************************/
  StaticJsonBuffer<500> jsonLoop;
  JsonObject& root = jsonLoop.createObject();
  JsonObject& Pins = root.createNestedObject("Pins");
  /***********************************************************************************************************/

  /*********************************************** Build JSON object *****************************************/
  root["IP"] = deviceIP;
  root["_id"] = DEVICEID;
  /***********************************************************************************************************/
  /**************************** Add all output pins with their respective reading ****************************/
  for (unsigned char i = 0; i < sizeof(OUTPUTS) / sizeof(unsigned char); ++i){
    Pins[String(OUTPUTS[i])] = analogRead(OUTPUTS[i]);
  }
  /***********************************************************************************************************/

  /************************************* Build JSON of BMP180 (if present) ***********************************/
  if (SENSORPRESENT){
    getTempPress();
    root["T"] = temperatureDec;
    root["A"] = altitudeDec;
    root["P"] = pressureDec;
    //        root["L"] = lightDec; // TSL2561. readLight(), pending
  }
  /**********************************************************************************************************/

  /*********************** Build the char array to send the builded JSON to server **************************/
  char bufferLoop[sizeof(jsonLoop)];
  root.printTo(bufferLoop, sizeof(bufferLoop));
  socketio.sendJSON("bufferLoop", bufferLoop);
  /**********************************************************************************************************/
  #ifdef DEBUG
    root.prettyPrintTo(Serial);
    debugPrintln();
  #endif
  return true;
}

void setDeviceIP(){
  IPAddress ip = WiFi.localIP();
  deviceIP = String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]);
}

bool actionReceived(){  
  /**************************************************** Pin JSON decoder *************************************/
  if(RID == "deviceChangePin"){
    String str = Rcontent; // Because Rcontent could change in any moment..
    StaticJsonBuffer<200> jsonActions;
    String payload = "{" + str.substring(0, str.lastIndexOf('}'));
    JsonObject& incomingDevice = jsonActions.parseObject(payload);
    if (incomingDevice["_id"] == DEVICEID){
      analogWrite(incomingDevice["pin"], incomingDevice["value"]);
      //sendMessageServer();
    }
  }
  /***********************************************************************************************************/
  return true;
}

/* This function checks the state of the button selected and then set the output accordingly.*/
void checkButtons(){
  /*for (unsigned char index = 0; index < BUTTONS; ++index){
    detachInterrupt(INPUTS[index]);
  }*/
  for (volatile unsigned char button = 0; button < BUTTONS; button++){
    stateInput[button] = digitalRead(INPUTS[button]);
    /*************************************************************************************************************************************************
      If the state is HIGH, the previous state was LOW, and it has been more than "debounce"
      milliseconds that the button was pressed, then it's not a bounce!
    *************************************************************************************************************************************************/
    if (stateInput[button] == HIGH && prevStateOut[button] == LOW && (micros() - timeLapse[button]) > DEBOUNCE * 1000){
      stateOutput[button] = !stateOutput[button];
      timeLapse[button] = micros();
      buttonPressed = true;
    }
    digitalWrite(OUTPUTS[button], stateOutput[button]);
    prevStateOut[button] = stateInput[button];
    //attachInterrupt(INPUTS[button], checkButtons, HIGH); // ONLY for relay actions, COMMENT if any INPUT has a different behaviour.
  }
}

bool checkConnection() {
  if (!socketio.connected()) {
    char hostBuffer[16];
    serverIP.toCharArray(hostBuffer, sizeof(hostBuffer));
    if (!socketio.connect(hostBuffer, PORT)) {
      debugPrint(F("> Connection with the server ")); debugPrint(hostBuffer);
      debugPrint(F(" (with port number): ")); debugPrint(PORT); debugPrintln(F(" FAILED!"));
      delay(400);
      return false;
    }
  }
  return true;
}

void sendPeriodically(){
  static unsigned long last = 0;
  if (abs(millis() - last) > 1000){ // Send the status of all pins connected, physics measures and other variables every 5 seconds.
    SENSORPRESENT && getTempPress(); // Update variables of temperature, altitude and pressure
    sendMessageServer();
    last = millis();
  }
}

void setup(){
  
  #ifdef DEBUG
    Serial.begin(115200);
    Serial.setDebugOutput(true); // ESP8266 has a rich debug!
  #else
    Serial.setDebugOutput(false);
  #endif

  /************************************************* Give time to the device to boot properly *********************************************/
  debugPrintln(F("************************************************************"));
  debugPrintln(F("********************** Booting Device **********************"));
  debugPrintln(F("************************************************************"));
  unsigned char t = 4;
  while (t){
    debugFlush();
    delay(1000);
    t--;
  }
  /****************************************************************************************************************************************/

  /******************************************** Initialize all outputs and set them LOW. **************************************************/
  debugPrintln(F("************************************************************"));
  
  for (unsigned char index = 0; index < sizeof(OUTPUTS) / sizeof(unsigned char); ++index){
    debugPrint(F("> Setting: ")); debugPrint(OUTPUTS[index]); debugPrintln(F(" as OUTPUT."));
    pinMode(OUTPUTS[index], OUTPUT);
    digitalWrite(OUTPUTS[index], LOW);
  }
  debugPrintln(F("************************************************************")); debugPrintln();
  /****************************************************************************************************************************************/

  /***************************************************** Initialize all inputs ************************************************************/
  debugPrintln(F("************************************************************"));
  for (unsigned char index = 0; index < sizeof(INPUTS) / sizeof(unsigned char); ++index){
    debugPrint(F("> Setting: ")); debugPrint(INPUTS[index]); debugPrintln(F(" as INPUT."));
    pinMode(INPUTS[index], INPUT);
    attachInterrupt(digitalPinToInterrupt(INPUTS[index]), checkButtons, HIGH); // ONLY for relay actions, COMMENT if any INPUT has a different behaviour.IT DOES NOT WORK WELL WITH 2 BUTTONS
  }
  debugPrintln(F("************************************************************")); debugPrintln();
  /****************************************************************************************************************************************/

  /******************************************* Initializes I2C in pins 4 and 5 (SDA and SCL respectively) *********************************/
  Wire.begin(); // Wire.begin(int sda, int scl) => Wire.begin(4, 5) by default.
  getCalibrationData();
  /****************************************************************************************************************************************/

  /********************************************************** Network parameters **********************************************************/
  const char SSID_PASS_IP[][25] = {
    /* SSIDs        Passwords         	      Fixed server IP (in router) */
    "Lucasnet"    , "uD0m0_uk"                , "192.168.43.43",
    "Casa_01"     , "esta_es.la:casa/vinals"  , "192.168.0.4",
    "UAI-FI" 		  , "AccesosUAI" 		          , "10.11.91.152",
    "FIBERTEL804" , "0143657874" 		          , "192.168.0.16",
    "Softing" 		, "softing3b" 		          , "192.168.50.118"
  };    
  /****************************************************************************************************************************************/

  /********************************************** Connect to Access Point, check if it's connected. ***************************************/
  debugPrintln(F("************************************************************"));

  unsigned char index = sizeof SSID_PASS_IP / sizeof SSID_PASS_IP[0];
  while (index > 2) {
    debugPrint(F("> Adding SSID: \""));
    debugPrint(SSID_PASS_IP[index - 3]);
    debugPrint(F("\" with password: \""));
    debugPrint(SSID_PASS_IP[index - 2]);
    debugPrintln(F("\""));
    WiFiMulti.addAP(SSID_PASS_IP[index - 3], SSID_PASS_IP[index - 2]);
    index -= 3;
  }

  debugPrintln(F("************************************************************")); debugPrintln();

  while (WiFiMulti.run() != WL_CONNECTED) {
    debugPrint(F("Ping...."));delay(300);debugPrint(F("Pong....\n"));
  }

  setDeviceIP();
  /****************************************************************************************************************************************/

  /**************** Based on which network has an active connection, get the common (fixed on the router) server IP address ***************/
  debugPrintln(F("************************************************************"));
  index = sizeof SSID_PASS_IP / sizeof SSID_PASS_IP[0];
  String ssidTemp = WiFi.SSID();
  while (index > 2) {
    debugPrint(F("> Testing SSID: ")); debugPrint(ssidTemp); debugPrint(F(" against: ")); debugPrintln(SSID_PASS_IP[index - 3]);
    if (ssidTemp == SSID_PASS_IP[index - 3]) {
      debugPrint(F("> Found: \"")); debugPrint(SSID_PASS_IP[index - 3]); debugPrint(F("\" with it's server IP: ")); debugPrintln(SSID_PASS_IP[index - 1]);
      serverIP = SSID_PASS_IP[index - 1];
      index = 3; //Network found, break here.
    }
    index -= 3;
  }
  debugPrintln(F("************************************************************")); debugPrintln();
  /****************************************************************************************************************************************/

  /*************************************** Update sketch Over The Air. Upload code from the webpage of uDomo. *****************************/
  httpUpdater.setup(&httpServer, "/device", "uDomoLucas","uDomoLucas");
  httpServer.begin();
  debugPrint(F("[INFO] To upload a sketch, go to \"http://"));
  debugPrint(deviceIP);
  debugPrint(F(":"));
  debugPrint(UPDATERPORT);
  debugPrintln(F("/device\" in your browser."));
  /****************************************************************************************************************************************/
  
  /******************************************** Obtain physics measures if the sensor is present ******************************************/
  SENSORPRESENT && getTempPress();
  /****************************************************************************************************************************************/

  debugPrint(F("Free memory SETUP: ")); debugPrintln(ESP.getFreeHeap());
}

void loop() {
  httpServer.handleClient(); // OTA Update. Upload code from the webpage of uDomo.
  
  if (checkConnection()) { // Check if the device is connected with the server
    buttonPressed && sendMessageServer();
    buttonPressed = false;
    sendPeriodically();
    socketio.monitor() && actionReceived();
  }
}
