#!/bin/bash
# Archivo de configuración que me hice para automatizar varias tareas que
# siempre se tienen que hacer al arrancar el repositorio de uDomo recién
# descargado.
# Autor: Lucas Viñals
# Creado: 04/2016

# Directorio principal [directorio dentro del cual esta uDomo, Arduino, etc]
HOMEDIR='/root'
# Arquitectura de procesador (cambiar dependiendo de el sistema donde corra)
# RaspberryPi: armv7l, armv6l, arm64
# x64: linux-x64
# x86: linux-x86
ARCHITECTURE_uDomo='linux-x64'
# Bibliotecas de ESP8266
LIBRARIESDIR=$HOMEDIR'/Arduino/libraries'

# Instalar aplicaciones necesarias
echo -e "\e[103m\e[91m Updating the system and installing needed software \e[0m"
# MongoDB installs (04/10/2016) the outdated v2.4 in Raspbian (Debian), but we're good for now.
sudo apt -qq update && sudo apt --yes --force-yes install bash git tar mongodb realpath

SERVERDIR=$HOMEDIR'/uDomo/server'

# Set default environment to production
echo 'production' > $SERVERDIR'/../environment'

BINARIESDIR=$SERVERDIR'/binaries'
if [ -d "$BINARIESDIR" ]; then
  echo -e '\e[103m\e[91m Emptying tree directory '$BINARIESDIR'...\e[0m'
  rm -r $BINARIESDIR
else
  echo -e "\e[103m\e[91m The tree directory '$BINARIESDIR' doesn't exists. Creating...\e[0m"
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
$BINARIESDIR/nodejs/bin/node -e "console.log('\n\x1b[42m\x1b[37m\x1b[1m','NodeJS was successfully installed\!','\x1b[0m\n');"

# Add NodeJS binaries to PATH
if [ ! -f $HOMEDIR'/.profile' ]; then # .profile doesn't exists
  echo 'PATH=$PATH:'$BINARIESDIR'/nodejs/bin' > $HOMEDIR/.profile
else # .profile exists
  ! $(grep -Fxq $(echo 'PATH=$PATH:'$BINARIESDIR'/nodejs/bin') $HOMEDIR/.profile) &&
  echo 'PATH=$PATH:'$BINARIESDIR'/nodejs/bin' >> $HOMEDIR/.profile
fi

# Update PATH
source $HOMEDIR'/.profile';

# Si no existe el directorio, lo creo.
if [ ! -d "$LIBRARIESDIR" ]; then
  echo -e "\e[103m\e[91m The tree directory '$LIBRARIESDIR' doesn't exists. Creating...\e[0m"
  mkdir -p $LIBRARIESDIR
fi

# Descargo SocketIO para ESP8266
if [ ! -d $LIBRARIESDIR'/Socket.io-v1.x-Library' ]; then
  echo -e "\e[103m\e[91m Downloading SocketIO...\e[0m"
  ( cd $LIBRARIESDIR && git clone https://github.com/washo4evr/Socket.io-v1.x-Library.git )
fi

# Descargo ArduinoJSON
if [ ! -d $LIBRARIESDIR'/ArduinoJson' ]; then
  echo -e "\e[103m\e[91m Downloading ArduinoJson...\e[0m"
  ( cd $LIBRARIESDIR && git clone https://github.com/bblanchon/ArduinoJson.git )
fi

# Descargo ESP8266TrueRandom
if [ ! -d $LIBRARIESDIR'/ESP8266TrueRandom' ]; then
  echo -e "\e[103m\e[91m Downloading ESP8266TrueRandom...\e[0m"
  ( cd $LIBRARIESDIR && git clone https://github.com/marvinroger/ESP8266TrueRandom.git )
fi

# Si hay un log viejo, lo borro.
[ -f $SERVERDIR'/npm-debug.log' ] && echo -e "\e[103m\e[91m Previous NPM logs. Deleting...\e[0m" && rm $SERVERDIR'/npm-debug.log'

# Si no existe el directorio público, lo creo.
[ ! -d $SERVERDIR'/../udomo' ] && echo -e "\e[103m\e[91m The tree directory 'udomo' doesn't exists. Creating...\e[0m" && mkdir $SERVERDIR'/../udomo'

# Si no existe el árbol de directorios de la base de datos, lo creo.
if [ ! -d $SERVERDIR'/db' ]; then
  echo -e "\e[103m\e[91m The tree directory 'db' doesn't exists. Creating...\e[0m"
  mkdir -p $SERVERDIR'/db/data/db'
  mkdir $SERVERDIR'/db/logs' && echo "" > $SERVERDIR'/db/logs/log.txt'
fi

echo -e "\e[44m Installing/updating NPM libraries \e[0m\n"
( cd $HOMEDIR'/uDomo' && npm install )
npm install -g gulp nsp snyk npm-check

# Esto es un error conocido de NPM cuando se instala en un directorio especificado. Deja un directorio llamado "etc" vacío
[ -d $SERVERDIR'/../etc' ] && rm -r $SERVERDIR'/../etc'

# Añado un cron para que se inicie con un sólo hilo por lo menos (npm start), cuando levante la red (if-up)
if [ ! -f '/etc/network/if-up.d/uDomo' ]; then
  sudo bash -c 'cat << EOF > /etc/network/if-up.d/uDomo
  #!/bin/bash
  ( cd /home/pi/uDomo && $BINARIESDIR/nodejs/bin/npm start )
  EOF'
  # Le doy permisos de lectura y ejecución para mi usuario
  sudo chmod 0600 /etc/network/if-up.d/uDomo
fi

echo -e "\n\e[91m\e[103m Please, edit the database file in "$SERVERDIR"/config/db.js accordingly. \n"
echo -e "\n All system is ready. Now, because the PATH is not automatically updated, you should log out / log in. \e[0m"
echo -e "\n\e[42m\e[97m Start the uDomo service with '$BINARIESDIR"/nodejs/bin/npm start' or '$BINARIESDIR"/nodejs/bin/npm run cluster' once the system is configured. \e[0m"