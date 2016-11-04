#include "uDomoConnection.h"

ESP8266WiFiMulti WiFiMulti;
SocketIOClient socketio;
ESP8266WebServer httpServer(80);
ESP8266HTTPUpdateServer httpUpdater;

char _networks[][25] = {
    /* SSIDs        Passwords         	      Fixed server IP (in router) */
    "Lucasnet"    , "uD0m0_uk"                , "192.168.43.43",
    "Casa_01"     , "Pilarjazmin3"            , "192.168.0.12",
    "MLuz"        , "36578742luz"             , "192.168.1.3"
};

/**
 * Public methods
 */
uDomoConnection::uDomoConnection(){}

void uDomoConnection::setup(){
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

unsigned char uDomoConnection::getNetworkParamsSize(){ return sizeof(_networks)/sizeof(_networks[0]); }

void uDomoConnection::addAPs(){
  unsigned char index = getNetworkParamsSize();
  while (index > 2) {
    WiFiMulti.addAP(_networks[index - 3], _networks[index - 2]);
    index -= 3;
  }
}

void uDomoConnection::initHTTPServer(){
  httpUpdater.setup(&httpServer, _updaterPath, _updaterUser, _updaterPassword);
  httpServer.begin();
}

char* uDomoConnection::findServerIP(){
  unsigned char index = getNetworkParamsSize();
  while (index > 2) {
    if(WiFi.SSID() == _networks[index - 3]){
      return _networks[index - 1];
    }
    index -= 3;
  }
}