#!/bin/bash
# Archivo de configuración que me hice para automatizar varias tareas que
# siempre se tienen que hacer al arrancar el repositorio de uDomo recién
# descargado.
# Autor: Lucas Viñals
# Creado: 04/2016

# Directorio principal
MAINDIR='/root/uDomo/'

# Actualizar/Obtener GIT
echo -e "\e[103m\e[91m> Actualizando el sistema e instalando 'git' \e[0m"
sudo apt-get update && sudo apt-get install git

# Incluir path absoluto para evitar errores
LIBRARIESDIR=$MAINDIR'sensors/uDomoBasicDevice/thirdParty'

# Si no existe el directorio, lo creo.
[ ! -d "$LIBRARIESDIR" ] &&
mkdir $LIBRARIESDIR &&
echo -e '\e[103m\e[91m> El árbol de directorios '$LIBRARIESDIR' no existe. Creando...\e[0m'

# Descargo SocketIO para ESP8266
echo -e "\e[103m\e[91m> Descargando SocketIO...\e[0m"
git clone https://github.com/washo4evr/Socket.io-v1.x-Library.git $LIBRARIESDIR/TMP
mv $LIBRARIESDIR/TMP/*.cpp $LIBRARIESDIR/TMP/*.h $LIBRARIESDIR/
rm -r $LIBRARIESDIR/TMP

# Descargo ArduinoJSON
echo -e "\e[103m\e[91m> Descargando ArduinoJson...\e[0m"
git clone https://github.com/bblanchon/ArduinoJson.git $LIBRARIESDIR/TMP
[ ! -d "$LIBRARIESDIR/ArduinoJson/include" ] && mkdir -p $LIBRARIESDIR/ArduinoJson/include
mv $LIBRARIESDIR/TMP/ArduinoJson.h $LIBRARIESDIR/ArduinoJson
rm -r $LIBRARIESDIR/ArduinoJson/include && mkdir -p $LIBRARIESDIR/ArduinoJson/include
mv $LIBRARIESDIR/TMP/include/* $LIBRARIESDIR/ArduinoJson/include
mv $LIBRARIESDIR/TMP/LICENCE.md $LIBRARIESDIR/ArduinoJson/
rm -r $LIBRARIESDIR/TMP

# Descargo TSL2561
echo -e "\e[103m\e[91m> Descargando TSL2561...\e[0m"
git clone https://github.com/adafruit/TSL2561-Arduino-Library.git $LIBRARIESDIR/TMP
mv $LIBRARIESDIR/TMP/*.cpp $LIBRARIESDIR/TMP/*.h $LIBRARIESDIR/
rm -r $LIBRARIESDIR/TMP

# Descargo ESP8266TrueRandom
echo -e "\e[103m\e[91m> Descargando ESP8266TrueRandom...\e[0m"
git clone https://github.com/marvinroger/ESP8266TrueRandom.git $LIBRARIESDIR/TMP
mv $LIBRARIESDIR/TMP/*.cpp $LIBRARIESDIR/TMP/*.h $LIBRARIESDIR/
mv $LIBRARIESDIR/TMP/LICENCE $LIBRARIESDIR/
rm -r $LIBRARIESDIR/TMP

# Si hay un log viejo, lo borro.
[ -f $MAINDIR'npm-debug.log' ] && echo -e "\e[103m\e[91m> Logs de NPM previos. Borrando...\e[0m" && rm $MAINDIR'npm-debug.log'

# Si no existe el directorio público, lo creo.
[ ! -d $MAINDIR'udomo' ] && echo -e "\e[103m\e[91m> El árbol de directorios \"udomo\" no existe. Creando...\e[0m" && mkdir $MAINDIR'udomo'

# Si no existe el árbol de directorios de la base de datos, lo creo.
if [ ! -d $MAINDIR'db' ]; then
  echo -e "\e[103m\e[91m> El árbol de directorios \"db\" no existe. Creando...\e[0m"
  mkdir -p $MAINDIR'db/data/db'
  mkdir $MAINDIR'db/logs' && touch $MAINDIR'db/logs/log.txt'
fi

echo -e "\e[44m> Se van a instalar/actualizar las librerías de NPM\e[0m\n"
npm install --prefix $MAINDIR
rm -r $MAINDIR'etc'

# No existe un archivo de configuracion de la base de datos, así que copio el ejemplo e informo que se edite...
if [ ! -f "./config/db.js" ]; then
  echo -e "\n\e[91m\e[103m> No existe un archivo de configuración de la base de datos.\n> Por favor, edite el archivo en 'config/db.js' de acuerdo a su sistema.\e[0m\n"
  cp $MAINDIR'config/dbExample.js' $MAINDIR'config/db.js'
fi

echo -e "\e[42m\e[97mTodo instalado. Iniciar servicio de uDomo con \"npm start\" o \"npm run cluster\" una vez que todo esté configurado.\e[0m"
