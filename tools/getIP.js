const bashCommand = require('shelljs').exec;

let linuxServer = () => {
    let ip  = bashCommand(
    /* EN: Get the first 'up' local IP. Tested in Debian-based systems, 
        should work with Ubuntu.
    ES: Obtiene la primer IP levantada. Testeado en sistemas basados en Debian,
        debería funcionar en Ubuntu.
    */
        "ip addr | grep 'state UP' -A2 | tail -n1 |" +
        "awk '{print $2}' | cut -f1  -d'/'", 
        {silent: true}).stdout;

    /* Esto es para ir en el navegador a "udomo.com" y que resuelva la IP del servidor
    SACAR cuando se registre el dominio */
    bashCommand('grep -q -F \'' + ip + ' ' +
                        'udomo.com www.udomo.com\' /etc/hosts || ' +
                        'echo \'' + ip.replace('\n', '') + ' ' +
                        'udomo.com  www.udomo.com\' >> /etc/hosts',
                        {silent: true}
                        );
    bashCommand('sudo service networking restart', {silent: true});
    /**************************************************************************************/
    return ip;
};

let windowsServer = () => {
    return 'localhost'; // tengo que hacer el proceso que obtenga la ip local en windows
};

module.exports = (os) => {
    let ip = null;
    switch(os){
        case 'linux':
            ip = linuxServer();
        break;
        case 'windows':
            ip = windowsServer();
        break;
        default:
            ip = 'localhost';
        break;
    }
    return ip;
};
