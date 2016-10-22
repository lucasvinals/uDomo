#include "uDomoConnection.h"
/**
 * Init global objects
 */
ESP8266WiFiMulti WiFiMulti;
SocketIOClient socketio;
ESP8266WebServer httpServer(80);
ESP8266HTTPUpdateServer httpUpdater;

/**
 * Public methods
 */
uDomoConnection::uDomoConnection(){}

void uDomoConnection::setup(){
  // erasePreviousNetwork();
  addAPs();
  connectWifi();
  _serverIP = findServerIP();
  initHTTPServer();
}

String uDomoConnection::deviceIP(){
    IPAddress ip = WiFi.localIP();
    return String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]);
}

void uDomoConnection::clientESP(){ httpServer.handleClient(); }

bool uDomoConnection::hasMessage(){ return socketio.monitor(); }

bool uDomoConnection::isSocketConnected(){
  if (!socketio.connected()) {
    if (!socketio.connect(_serverIP, _PORT)) {
      delay(400);
      return false;
    }
  }
  return true;
}

bool uDomoConnection::sendJSON(const char* room, char* message){
  socketio.sendJSON(room, message);
  return true;
}

/**
 * Private methods
 */
void uDomoConnection::connectWifi(){ while (WiFiMulti.run() != WL_CONNECTED){ delay(300); } }

unsigned char uDomoConnection::getNetworkParamsSize(){ return sizeof _networks[0]; }

void uDomoConnection::addAPs(){
  // void uDomoConnection::connectWifi(){
  unsigned char index = getNetworkParamsSize();
  while (index > 2) {
    WiFiMulti.addAP(_networks[index - 3], _networks[index - 2]);
    Serial.print("Agregando ");
    Serial.print(_networks[index - 3]);
    Serial.print(" con pass: ");
    Serial.println(_networks[index - 2]);
    index -= 3;
  }

  // unsigned char index = getNetworkParamsSize();
  // while (index > 2 && WiFi.status() != WL_CONNECTED) {
  //   WiFi.begin(_networks[index - 3], _networks[index - 2]);
  //   delay(500);
  //   index -= 3;
  // }
}

void uDomoConnection::initHTTPServer(){
  httpUpdater.setup(&httpServer, _updaterPath, _updaterUser, _updaterPassword);
  httpServer.begin();
}

// void uDomoConnection::erasePreviousNetwork(){ spi_flash_erase_sector(0x7E); }

char* uDomoConnection::findServerIP(){
  unsigned char index = getNetworkParamsSize();
  char* ip = "";
  while (index > 2) {
    if(WiFi.SSID() == _networks[index - 3]){
      ip = _networks[index - 1];
      index = 3;
    }
    index -= 3;
  }
  Serial.print("IP: ");
  Serial.println(ip);
  return ip;
}