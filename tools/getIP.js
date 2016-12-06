const bashCommand = require('shelljs').exec;

let linuxServer = () => {
    let ip  = bashCommand(
    /**
     * EN: Get the first 'up' local IP. Tested in Debian-based systems,
     *     should work with Ubuntu.
     * ES: Obtiene la primer IP levantada. Testeado en sistemas basados en Debian,
     *     debería funcionar en Ubuntu.
     */
    "ip addr | grep 'state UP' -A2 | tail -n1 |" +
    "awk '{print $2}' | cut -f1  -d'/'", 
    {silent: true}).stdout;
   /**
    * Quit when registered in domain
    */
    /*bashCommand('grep -q -F \'' + ip + ' ' +
                        'udomo.com www.udomo.com\' /etc/hosts || ' +
                        'echo \'' + ip.replace('\n', '') + ' ' +
                        'udomo.com  www.udomo.com\' >> /etc/hosts',
                        {silent: true}
                        );
    bashCommand('sudo service networking restart', {silent: true}); */
    return ip;
};

let windowsServer = () => {
    /**
     * Find out the command in Windows to obtain current IP address.
     */
    return 'localhost';
};

module.exports = (os) => {
    let ip = 'localhost';
    switch(os){
        case 'linux':
            ip = linuxServer();
        break;
        case 'windows':
            ip = windowsServer();
        break;
        default:
        break;
    }
    return ip;
};
