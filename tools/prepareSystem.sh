#!/bin/bash
# Archivo de configuración que me hice para automatizar varias tareas que 
# siempre se tienen que hacer al arrancar el repositorio de uDomo recién
# descargado.
# Autor: Lucas Viñals
# Fecha: 04/2016

# Si hay un log viejo, lo borro.
[ -f npm-debug.log ] && echo -e "\e[103m\e[91m> Logs de NPM previos. Borrando...\e[0m" && rm npm-debug.log

# Si no existe el directorio público, lo creo.
[ ! -d "udomo" ] && echo -e "\e[103m\e[91m> El árbol de directorios \"udomo\" no existe. Creando...\e[0m" && mkdir udomo

# Si no existe el árbol de directorios de la base de datos, lo creo.
if [ ! -d "db" ]; then
  echo -e "\e[103m\e[91m> El árbol de directorios \"db\" no existe. Creando...\e[0m"
  mkdir -p db/data/db
  mkdir db/logs && touch db/logs/log.txt
fi

echo -e "\e[44m> Se van a instalar/actualizar las librerías de NPM\e[0m\n"
npm install

# No existe un archivo de configuracion de la base de datos, así que copio el ejemplo e informo que se edite...
if [ ! -f "./config/db.js" ]; then 
  echo -e "\n\e[91m\e[103m> No existe un archivo de configuración de la base de datos.\n> Por favor, edite el archivo en 'config/db.js' de acuerdo a su sistema.\e[0m\n"
  cp ./config/dbExample.js ./config/db.js
fi

echo -e "\e[42m\e[97mTodo instalado. Iniciar servicio de uDomo con \"npm start\" o \"npm run cluster\" una vez que todo esté configurado.\e[0m"