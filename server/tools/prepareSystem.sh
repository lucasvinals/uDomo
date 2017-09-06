#### Automate various common task to init a recently downloaded copy of uDomo ####
# Author: Lucas Viñals
# Created: 04/2016
# Modified: 06/2017

# Main directory
HOMEDIR=~
# ESP8266 Libraries
LIBRARIESDIR=$HOMEDIR'/Arduino/libraries'
# Server main directory
SERVERDIR=$HOMEDIR'/uDomo/server'

# Install required packages
echo $(tput setaf 4)'> Updating the system and installing needed software.'$(tput sgr0)
INPUT_PLATFORM_ERROR=0 # Flag to trigger the error
DEPENDENCIES_uDomo='git mongodb redis python openssl pwgen patch' # System required packages

# Debian linux based systems
if [ "$1" == 'debian' ]; then
  su - root -c 'apt -qq update && apt --yes --force-yes install '$DEPENDENCIES_uDomo
# Arch linux based systems
elif [ "$1" == 'arch' ]; then
  su - root -c 'pacman -Syy '$DEPENDENCIES_uDomo
# OSX systems
elif [ "$1" == 'osx' ]; then
  brew install $DEPENDENCIES_uDomo
else
  INPUT_PLATFORM_ERROR=1
fi

# Throw an error if the platform is not recognized.
if [ $INPUT_PLATFORM_ERROR -ne 0 ]; then
  echo $(tput setaf 1)Error. Cannot find any platform with the name: \"$1\".
  exit 1
fi

# Install NodeJS
echo $(tput setaf 4)"> Installing NodeJS"$(tput sgr0)
(
  if [ ! -d $HOMEDIR'/.nvm' ]; then
    cd $HOMEDIR
    rm -rf .nvm
    git clone https://github.com/creationix/nvm.git .nvm
    cd .nvm
    ./install.sh # Install NVM
  fi
  # Update PATH to use NVM
  if [ -f $HOMEDIR'/.bashrc' ]; then
    source $HOMEDIR/.bashrc
  fi
  source $HOMEDIR/.nvm/nvm.sh
  # This installs the latest NodeJS version. For production, it's recommended to add '--lts' flag.
  nvm install node
)

source $HOMEDIR/.nvm/nvm.sh # Update PATH with the newly installed Node

npm i -g yarn # Install yarn globally

# Check if there is an Arduino libraries directory; if not, create.
if [ ! -d $LIBRARIESDIR ]; then
  echo $(tput setaf 3)"> The tree directory "$LIBRARIESDIR" doesn\'t exists. Creating..."$(tput sgr0)
  mkdir -p $LIBRARIESDIR
fi

# Download SocketIO para ESP8266
if [ ! -d $LIBRARIESDIR'/Socket.io-v1.x-Library' ]; then
  echo $(tput setaf 6)"> Downloading SocketIO..."$(tput sgr0)
  ( cd $LIBRARIESDIR && git clone https://github.com/washo4evr/Socket.io-v1.x-Library.git )
fi

# Download ArduinoJSON
if [ ! -d $LIBRARIESDIR'/ArduinoJson' ]; then
  echo $(tput setaf 6)"> Downloading ArduinoJson..."$(tput sgr0)
  ( cd $LIBRARIESDIR && git clone https://github.com/bblanchon/ArduinoJson.git )
fi

# Download ESP8266TrueRandom
if [ ! -d $LIBRARIESDIR'/ESP8266TrueRandom' ]; then
  echo $(tput setaf 6)"> Downloading ESP8266TrueRandom..."$(tput sgr0)
  ( cd $LIBRARIESDIR && git clone https://github.com/marvinroger/ESP8266TrueRandom.git )
fi

# If there is an old log, erase it.
rm -f $SERVERDIR'/npm-debug.log'

# Check if there is a database directory; if not, create.
if [ ! -d $SERVERDIR'/db' ]; then
  echo $(tput setaf 3)"> The tree directory db doesn\'t exists. Creating..."$(tput sgr0)
  mkdir -p $SERVERDIR'/db/data/db'
  mkdir $SERVERDIR'/db/logs' && echo '<------ uDomo Database Log ------>' > $SERVERDIR'/db/logs/log.txt'
fi

echo $(tput setaf 4)"> Installing/updating libraries."$(tput sgr0)
# Install all project dependencies
( cd $HOMEDIR/uDomo && yarn )

# Generate all SSL certificates
# Great guide from: https://matoski.com/article/node-express-generate-ssl/
echo $(tput setaf 4)"> Generating all SSL certificates..."$(tput sgr0)
## Generate CA certificates
CA_DIR=$SERVERDIR'/ssl/ca'
echo $(tput setaf 6)"> Creating SSL Certificate Authority directory..."$(tput sgr0)
mkdir -p $CA_DIR

# Generate passphrase
PASSPHRASE=$(pwgen 50 1 -s)

# Generate private key
echo $(tput setaf 6)"> Generating private key CA..."$(tput sgr0)
openssl genrsa \
-aes256 \
-out $CA_DIR'/ca.key' \
-passout pass:$PASSPHRASE \
4096

# Certificate signing request
echo $(tput setaf 6)"> Signing request CA..."$(tput sgr0)
openssl req \
-new \
-days 1024 \
-key $CA_DIR'/ca.key' \
-passin pass:$PASSPHRASE \
-out $CA_DIR'/ca.csr' \
-subj "/C=AR/ST=SantaFe/L=Rosario/O=ACME Signing Authority Inc/CN=local.udomo.com"

# Signing the certificate
echo $(tput setaf 6)"> Sign the certificate CA..."$(tput sgr0)
openssl x509 \
-req \
-days 365 \
-in $CA_DIR'/ca.csr' \
-out $CA_DIR'/ca.crt' \
-signkey $CA_DIR'/ca.key' \
-passin pass:$PASSPHRASE

## Generate server certificates
SERVER_SSL_DIR=$SERVERDIR'/ssl/server'
echo $(tput setaf 6)"> Generating SSL server certificates..."$(tput sgr0)
mkdir -p $SERVER_SSL_DIR

# Generate private key
echo $(tput setaf 6)"> Creating private key server..."$(tput sgr0)
openssl genrsa \
-aes256 \
-passout pass:$PASSPHRASE \
-out $SERVER_SSL_DIR'/server.key' \
4096

#  Certificate Signing Request
echo $(tput setaf 6)"> Signing request server..."$(tput sgr0)
openssl req \
-new \
-key $SERVER_SSL_DIR'/server.key' \
-passin pass:$PASSPHRASE \
-out $SERVER_SSL_DIR'/server.csr' \
-subj "/C=AR/ST=SantaFe/L=Rosario/O=ACME Signing Authority Inc/CN=local.udomo.com"

# Remove passphrase
echo $(tput setaf 6)"> Removing passphrase server..."$(tput sgr0)
cp $SERVER_SSL_DIR'/server.key' $SERVER_SSL_DIR'/server.key.passphrase'
openssl rsa \
-in $SERVER_SSL_DIR'/server.key.passphrase' \
-passin pass:$PASSPHRASE \
-out $SERVER_SSL_DIR'/server.key'

# Signing the certificate
echo $(tput setaf 6)"> Signing the server certificate..."$(tput sgr0)
openssl x509 \
-req \
-days 365 \
-in $SERVER_SSL_DIR'/server.csr' \
-signkey $SERVER_SSL_DIR'/server.key' \
-out $SERVER_SSL_DIR'/server.crt'

echo $(tput setaf 3)"> Checking dependencies vulnerabilities..."$(tput sgr0)
yarn run nsp
#yarn run snyk-auth &
yarn run snyk-protect
# yarn run snyk-test

# Now (09/2017) forever-service is not supported in Arch Linux.
if [ "$1" != 'arch' ]; then
  echo $(tput setaf 3)"> Installing service with forever-service..."
  # Install global packages
  yarn global add forever forever-service
  # Set a forever service to start the application when system's up.
  (NODE_ENV=production forever-service install --start cluster.js)
fi

echo $(tput setaf 3)"> Please, edit the database file in '$SERVERDIR'/config/db.js accordingly."
echo $(tput setaf 2)"> Project ready. Please, start the uDomo service with yarn run production or yarn run development when the system is configured."
