#!/bin/bash
#### Automate various common task to init a recently downloaded copy of uDomo ####
# Author: Lucas Viñals
# Created: 04/2016
# Modified: 06/2017

# Platform -> 'linux-debian', 'osx'
PLATFORM='linux-debian-based'
# Main directory
HOMEDIR=~
# ESP8266 Libraries
LIBRARIESDIR=$HOMEDIR'/Arduino/libraries'
# Server main directory
SERVERDIR=$HOMEDIR'/uDomo/server'

# Install NodeJS
echo -e '\e[44m> Installing NodeJS \e[0m\n'
(
  if [ ! -d $HOMEDIR'/.nvm' ]; then
    cd $HOMEDIR
    rm -rf .nvm
    git clone https://github.com/creationix/nvm.git .nvm
    cd .nvm
    # Install NVM
    ./install.sh
  fi
  # Update PATH to use NVM
  source $HOMEDIR/.bashrc
  source $HOMEDIR/.nvm/nvm.sh
  # This installs the latest NodeJS version. For production, it's recommended to add '--lts' flag.
  nvm install node
)

# Update PATH with the newly installed Node
source $HOMEDIR/.nvm/nvm.sh

# Install required packages
echo -e '\e[103m\e[91m> Updating the system and installing needed software \e[0m'
npm i -g yarn
# MongoDB installs (04/10/2016) the outdated v2.4 in Raspbian (Debian), but we're good for now.
DEPENDENCIES_uDomo='git mongodb redis-server python openssl'
if [ "$PLATFORM" == 'linux-debian-based' ]; then
  su - root -c 'apt -qq update && apt --yes --force-yes install '$DEPENDENCIES_uDomo
elif [ '$PLATFORM' == 'osx' ]; then
  brew install $DEPENDENCIES_uDomo
fi

# Check if there is an Arduino libraries directory; if not, create.
if [ ! -d $LIBRARIESDIR ]; then
  echo -e '\e[103m\e[91m> The tree directory '$LIBRARIESDIR' doesn\''t exists. Creating...\e[0m'
  mkdir -p $LIBRARIESDIR
fi

# Download SocketIO para ESP8266
if [ ! -d $LIBRARIESDIR'/Socket.io-v1.x-Library' ]; then
  echo -e '\e[103m\e[91m> Downloading SocketIO...\e[0m'
  ( cd $LIBRARIESDIR && git clone https://github.com/washo4evr/Socket.io-v1.x-Library.git )
fi

# Download ArduinoJSON
if [ ! -d $LIBRARIESDIR'/ArduinoJson' ]; then
  echo -e '\e[103m\e[91m> Downloading ArduinoJson...\e[0m'
  ( cd $LIBRARIESDIR && git clone https://github.com/bblanchon/ArduinoJson.git )
fi

# Download ESP8266TrueRandom
if [ ! -d $LIBRARIESDIR'/ESP8266TrueRandom' ]; then
  echo -e '\e[103m\e[91m> Downloading ESP8266TrueRandom...\e[0m'
  ( cd $LIBRARIESDIR && git clone https://github.com/marvinroger/ESP8266TrueRandom.git )
fi

# If there is an old log, erase it.
rm -f $SERVERDIR'/npm-debug.log'

# Check if there is a database directory; if not, create.
if [ ! -d $SERVERDIR'/db' ]; then
  echo -e "\e[103m\e[91m> The tree directory db doesn't exists. Creating...\e[0m"
  mkdir -p $SERVERDIR'/db/data/db'
  mkdir $SERVERDIR'/db/logs' && echo '<------ uDomo Database Log ------>' > $SERVERDIR'/db/logs/log.txt'
fi


echo -e '\e[44m> Installing/updating libraries \e[0m\n'
# Install all project dependencies
( cd $HOMEDIR'/uDomo' && yarn --ignore-engines)
# Install some aditional (recommended) global packages

echo -e '\e[103m\e[91m> Checking dependencies vulnerabilities...\e[0m'
yarn run nsp
yarn run snyk-auth &
yarn run snyk-protect
# yarn run snyk-test

# Generate all SSL certificates
echo -e '\e[44m> Generating all SSL certificates \e[0m\n'
## Generate CA certificates
CA_DIR=$SERVERDIR'/ssl/ca'
echo -e '\e[44m> Creating SSL Certificate Authority directory \e[0m\n'
mkdir -p $CA_DIR

# Generate passphrase
PASSPHRASE=$(pwgen 50 1 -s)

# Generate private key
echo -e '\e[44m> Generating private key CA \e[0m\n'
openssl genrsa \
-aes256 \
-out $CA_DIR'/ca.key' \
-passout pass:$PASSPHRASE \
4096

# Certificate signing request
echo -e '\e[44m> Signing request CA \e[0m\n'
openssl req \
-new \
-days 1024 \
-key $CA_DIR'/ca.key' \
-passin pass:$PASSPHRASE \
-out $CA_DIR'/ca.csr' \
-subj "/C=AR/ST=SantaFe/L=Rosario/O=ACME Signing Authority Inc/CN=local.udomo.com"

# Signing the certificate
echo -e '\e[44m> Sign the certificate CA \e[0m\n'
openssl x509 \
-req \
-days 365 \
-in $CA_DIR'/ca.csr' \
-out $CA_DIR'/ca.crt' \
-signkey $CA_DIR'/ca.key' \
-passin pass:$PASSPHRASE

## Generate server certificates
SERVER_SSL_DIR=$SERVERDIR'/ssl/server'
echo -e '\e[44m> Generating SSL server certificates \e[0m\n'
mkdir -p $SERVER_SSL_DIR

# Generate private key
echo -e '\e[44m> Creating private key server \e[0m\n'
openssl genrsa \
-aes256 \
-passout pass:$PASSPHRASE \
-out $SERVER_SSL_DIR'/server.key' \
4096

#  Certificate Signing Request
echo -e '\e[44m> Signing request server \e[0m\n'
openssl req \
-new \
-key $SERVER_SSL_DIR'/server.key' \
-passin pass:$PASSPHRASE \
-out $SERVER_SSL_DIR'/server.csr' \
-subj "/C=AR/ST=SantaFe/L=Rosario/O=ACME Signing Authority Inc/CN=local.udomo.com"

# Remove passphrase
echo -e '\e[44m> Removing passphrase server \e[0m\n'
cp $SERVER_SSL_DIR'/server.key' $SERVER_SSL_DIR'/server.key.passphrase'
openssl rsa \
-in $SERVER_SSL_DIR'/server.key.passphrase' \
-passin pass:$PASSPHRASE \
-out $SERVER_SSL_DIR'/server.key'

# Signing the certificate
echo -e '\e[44m> Signing the server certificate \e[0m\n'
openssl x509 \
-req \
-days 365 \
-in $SERVER_SSL_DIR'/server.csr' \
-signkey $SERVER_SSL_DIR'/server.key' \
-out $SERVER_SSL_DIR'/server.crt'

# Set a cron service to start the application when there is a network running.
if [ ! -f '/etc/network/if-up.d/uDomo' ]; then
  su - root -c 'cat '$SERVERDIR'/tools/initOnIFUP.txt > /etc/network/if-up.d/uDomo'
  su - root -c 'chmod 0600 /etc/network/if-up.d/uDomo'
fi

echo -e '\n\e[91m\e[103m> Please, edit the database file in '$SERVERDIR'/config/db.js accordingly. \n'
echo -e '\n\e[42m\e[97m> All system is ready. Please, start the uDomo service with "yarn run production" or "yarn run development" when the system is configured. \e[0m'
