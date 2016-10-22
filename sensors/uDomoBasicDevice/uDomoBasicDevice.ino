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
#include "bmp.h"
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
const unsigned char	BUTTONS	= 2;
volatile const unsigned char INPUTS[BUTTONS] = { 13, 12 }; // Inputs.  Available pins: 2, 12, 13, 14 and 16. DO NOT repeat in outputs[]
volatile const unsigned char	OUTPUTS[BUTTONS] = { 14, 16 }; // Outputs. Available pins: 2, 12, 13, 14 and 16. DO NOT repeat in inputs[]

const short UPDATERPORT = 8888;
const short DEBOUNCE = 400;

const unsigned short PORT = 12078;

const bool SENSORPRESENT = true; // Flag to indicate if this pressure/temperature/altitude/light sensor is present or not.

volatile bool stateInput[BUTTONS] = { false }; // Input pins.For example: Button switches...
volatile bool stateOutput[BUTTONS] = { false }; // State
volatile bool prevStateOut[BUTTONS]	= { false };
volatile bool buttonPressed = true;

String deviceIP	= "";
String serverIP = "";
const String DEVICEID = "39da52b9-2a6e-4b2a-bd60-9bdb0ace038d";

volatile unsigned long timeLapse[BUTTONS] = { 0 };
/**********************************************************************************************************************************/

/******************************************************* Libraries instances ******************************************************/
ESP8266WiFiMulti WiFiMulti;
SocketIOClient socketio;
ESP8266WebServer httpServer(UPDATERPORT);
ESP8266HTTPUpdateServer httpUpdater;
BMP Sensor;
/*********************************************************************************************************************************/

/***************** These variables are assinged in the SocketIO manager with the incomming messages parameters ********************/
extern String RID;
extern String Rname;
extern String Rcontent;
/**********************************************************************************************************************************/

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
    struct tpa values = Sensor.getTPAL();

    root["T"] = values.temperature;
    root["A"] = values.altitude;
    root["P"] = values.pressure;
    root["L"] = values.light;
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
  if(RID == "changePin"){
    String str = Rcontent; // Because Rcontent could change in any moment..
    StaticJsonBuffer<200> jsonActions;
    String payload = "{" + str.substring(0, str.lastIndexOf('}'));
    JsonObject& incomingDevice = jsonActions.parseObject(payload);
    if (incomingDevice["_id"] == DEVICEID){
      analogWrite(incomingDevice["pin"], incomingDevice["value"]);
    }
  }
  return true;
}

/* This function checks the state of the button selected and then set the output accordingly.*/
//void checkButtons(){
//  /*for (unsigned char index = 0; index < BUTTONS; ++index){
//    detachInterrupt(INPUTS[index]);
//  }*/
//  for (volatile unsigned char button = 0; button < BUTTONS; button++){
//    stateInput[button] = digitalRead(INPUTS[button]);
//    /*************************************************************************************************************************************************
//      If the state is HIGH, the previous state was LOW, and it has been more than "debounce"
//      milliseconds that the button was pressed, then it's not a bounce!
//    *************************************************************************************************************************************************/
//    if (stateInput[button] == HIGH && prevStateOut[button] == LOW && (micros() - timeLapse[button]) > DEBOUNCE * 1000){
//      stateOutput[button] = !stateOutput[button];
//      timeLapse[button] = micros();
//      buttonPressed = true;
//    }
//    digitalWrite(OUTPUTS[button], stateOutput[button]);
//    prevStateOut[button] = stateInput[button];
//    //attachInterrupt(INPUTS[button], checkButtons, HIGH); // ONLY for relay actions, COMMENT if any INPUT has a different behaviour.
//  }
//}

void changeB1(){
  delayMicroseconds(DEBOUNCE * 1000);
  char button = 0;
  stateOutput[button] = !stateOutput[button];
  digitalWrite(OUTPUTS[button], stateOutput[button]);
  buttonPressed = true;
}

void changeB2(){
  delayMicroseconds(DEBOUNCE * 1000);
  char button = 1;
  stateOutput[button] = !stateOutput[button];
  digitalWrite(OUTPUTS[button], stateOutput[button]);
  buttonPressed = true;
}

bool checkConnection() {
  if (!socketio.connected()) {
    char hostBuffer[16];
    serverIP.toCharArray(hostBuffer, sizeof(hostBuffer));
    if (!socketio.connect(hostBuffer, PORT)) {
      debugPrint(F("> Connection with the server listening at ")); debugPrint(hostBuffer);
      debugPrint(F(":")); debugPrint(PORT); debugPrintln(F(" FAILED!"));
      delay(400);
      return false;
    }
  }
  return true;
}

void sendPeriodically(){
  static unsigned long last = 0;
  if (abs(millis() - last) > 5000){ // Send the status of all pins connected, physics measures and other variables every 5 seconds.
//    SENSORPRESENT && bmp.getTempPress(); // Update variables of temperature, altitude and pressure
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
//    attachInterrupt(digitalPinToInterrupt(INPUTS[index]), checkButtons, HIGH); // ONLY for relay actions, COMMENT if any INPUT has a different behaviour.IT DOES NOT WORK WELL WITH 2 BUTTONS
  }
  attachInterrupt(digitalPinToInterrupt(INPUTS[0]), changeB1, HIGH);
  attachInterrupt(digitalPinToInterrupt(INPUTS[1]), changeB2, HIGH);
  debugPrintln(F("************************************************************")); debugPrintln();
  
  Sensor.calibrate();
  
  /**
   * Network parameters 
   */
  const char SSID_PASS_IP[][25] = {
    /* SSIDs        Passwords         	      Fixed server IP (in router) */
    "Lucasnet"    , "uD0m0_uk"                , "192.168.43.43",
    "Casa_01"     , "Pilarjazmin3"            , "192.168.0.4"
  };    

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

  debugPrintln(F("UUID try: ")); debugPrintln(ESP.getFlashChipId());
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
  
  debugPrint(F("Free memory SETUP: ")); debugPrintln(ESP.getFreeHeap());
}

void loop() {
  httpServer.handleClient(); // OTA Update. Upload code from the webpage of uDomo.
  
  if (checkConnection()) { // Check if the device is connected with the server
    buttonPressed && sendMessageServer() && (buttonPressed = false);
    sendPeriodically();
    socketio.monitor() && actionReceived();
  }
}
