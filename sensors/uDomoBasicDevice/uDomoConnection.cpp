#include "uDomoConnection.h"
/**
 * Init global objects
 */
 const int _UPDATERPORT = 8888;
ESP8266WiFiMulti WiFiMulti;
SocketIOClient socketio;
ESP8266WebServer httpServer(_UPDATERPORT);
ESP8266HTTPUpdateServer httpUpdater;

/**
 * Public
 */
uDomoConnection::uDomoConnection(){}

String uDomoConnection::deviceIP(){
    IPAddress ip = WiFi.localIP();
    return String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]);
}

void uDomoConnection::clientESP(){
  httpServer.handleClient();
}

bool uDomoConnection::isSocketConnected(){
  if (!socketio.connected()) {
    if (!socketio.connect(_serverIP, _PORT)) {
      delay(400);
      return false;
    }
  }
  return true;
}

bool uDomoConnection::isWifiConnected(){
  return WiFiMulti.run() == WL_CONNECTED;
}

bool uDomoConnection::hasMessage(){
    return socketio.monitor();
}

bool uDomoConnection::sendJSON(const char* room, char* message){
  socketio.sendJSON(room, message);
  return true;
}

void uDomoConnection::addAP(const char* ssid, const char* port){
  WiFiMulti.addAP(ssid, port);
}

void uDomoConnection::initHTTPServer(){
  httpUpdater.setup(&httpServer, _updaterPath, _updaterUser, _updaterPassword);
  httpServer.begin();
}