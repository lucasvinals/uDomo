#!/bin/bash
# Archivo de configuración que me hice para automatizar varias tareas que
# siempre se tienen que hacer al arrancar el repositorio de uDomo recién
# descargado.
# Autor: Lucas Viñals
# Creado: 04/2016

# Directorio principal
MAINDIR='/root/uDomo'
# Arquitectura de procesador (cambiar dependiendo de el sistema donde corra)
# RaspberryPi: armv7l
# x64: linux-x64
# x86: linux-x86
ARCHITECTURE_uDomo='linux-x64'
# Incluir path absoluto para evitar errores
LIBRARIESDIR='/root/Arduino/libraries'


# Actualizar/Obtener GIT
echo -e "\e[103m\e[91m> Actualizando el sistema e instalando aplicaciones necesarias \e[0m"
# MongoDB installs 2.4 (04/10/2016) in Raspbian (Debian) but we're good for now.
sudo apt-get update && sudo apt-get --yes --force-yes install git tar mongodb

BINARIESDIR=$MAINDIR'/binaries'
if [ -d "$BINARIESDIR" ]; then
  echo -e '\e[103m\e[91m> Vaciando el árbol de directorios '$BINARIESDIR'...\e[0m'
  rm -r $BINARIESDIR
else
  echo -e '\e[103m\e[91m El árbol de directorios '$BINARIESDIR' no existe. Creando...\e[0m'
fi

mkdir $BINARIESDIR
# Descargo la última versión de NodeJS
( cd $BINARIESDIR && wget -A "*$ARCHITECTURE_uDomo.tar.xz" -r -np -nc -l1 --no-check-certificate -e robots=off https://nodejs.org/dist/latest/)
# Muevo el comprimido a el directorio principal
mv $BINARIESDIR/nodejs.org/dist/latest/*.tar.xz $BINARIESDIR
# Lo descomprimo..
( cd $BINARIESDIR && tar xf *$ARCHITECTURE_uDomo.tar.xz )
# Le cambio el nombre al directorio a "nodejs"
mkdir $BINARIESDIR/nodejs && mv $BINARIESDIR/node-*/* $BINARIESDIR/nodejs
# Elimino los archivos sobrantes
rm -r $BINARIESDIR/node-* $BINARIESDIR/nodejs.org
# Pruebo que ande bien
$BINARIESDIR/nodejs/bin/node -e "console.log('\n\x1b[42m\x1b[37m\x1b[1m','NodeJS se instalo correctamente\!','\x1b[0m\n');"
 
# Si no existe el directorio, lo creo.
[ ! -d "$LIBRARIESDIR" ] &&
mkdir $LIBRARIESDIR &&
echo -e '\e[103m\e[91m> El árbol de directorios '$LIBRARIESDIR' no existe. Creando...\e[0m'

# Descargo SocketIO para ESP8266
if [ ! -d $LIBRARIESDIR'/Socket.io-v1.x-Library' ]; then
  echo -e "\e[103m\e[91m> Descargando SocketIO...\e[0m"
  ( cd $LIBRARIESDIR && git clone https://github.com/washo4evr/Socket.io-v1.x-Library.git )
fi

# Descargo ArduinoJSON
if [ ! -d $LIBRARIESDIR'/ArduinoJson' ]; then
  echo -e "\e[103m\e[91m> Descargando ArduinoJson...\e[0m"
  ( cd $LIBRARIESDIR && git clone https://github.com/bblanchon/ArduinoJson.git )
fi

# Descargo ESP8266TrueRandom
if [ ! -d $LIBRARIESDIR'/ESP8266TrueRandom' ]; then
  echo -e "\e[103m\e[91m> Descargando ESP8266TrueRandom...\e[0m"
  ( cd $LIBRARIESDIR && git clone https://github.com/marvinroger/ESP8266TrueRandom.git )
fi

# Si hay un log viejo, lo borro.
[ -f $MAINDIR'/npm-debug.log' ] && echo -e "\e[103m\e[91m> Logs de NPM previos. Borrando...\e[0m" && rm $MAINDIR'/npm-debug.log'

# Si no existe el directorio público, lo creo.
[ ! -d $MAINDIR'/udomo' ] && echo -e "\e[103m\e[91m> El árbol de directorios \"udomo\" no existe. Creando...\e[0m" && mkdir $MAINDIR'/udomo'

# Si no existe el árbol de directorios de la base de datos, lo creo.
if [ ! -d $MAINDIR'/db' ]; then
  echo -e "\e[103m\e[91m> El árbol de directorios \"db\" no existe. Creando...\e[0m"
  mkdir -p $MAINDIR'/db/data/db'
  mkdir $MAINDIR'/db/logs' && touch $MAINDIR'/db/logs/log.txt'
fi

echo -e "\e[44m> Se van a instalar/actualizar las librerías de NPM\e[0m\n"
$BINARIESDIR/nodejs/bin/npm install --prefix $MAINDIR

# Esto es un error conocido de NPM cuando se instala en un directorio especificado. Deja un directorio llamado "etc" vacío
[ -d $MAINDIR'/etc' ] && rm -r $MAINDIR'/etc'

# No existe un archivo de configuracion de la base de datos, así que copio el ejemplo e informo que se edite...
if [ ! -f $MAINDIR'/config/db.js' ]; then
  cp $MAINDIR'/config/dbExample.js' $MAINDIR'/config/db.js'
  echo -e "\n\e[91m\e[103m> No existe un archivo de configuración de la base de datos.\n> Por favor, edite el archivo en " $MAINDIR "/config/db.js de acuerdo a su sistema.\e[0m\n"
fi

echo -e "\e[42m\e[97mTodo instalado. Iniciar servicio de uDomo con \"npm start\" o \"npm run cluster\" una vez que todo esté configurado.\e[0m"
