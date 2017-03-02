const Bash = require('shelljs').exec;

function linuxServer() {
  return Bash(
  /**
   * EN: Get the first 'up' local IP. Tested in Debian-based systems,
   *     should work with Ubuntu.
   * ES: Obtiene la primer IP levantada. Testeado en sistemas basados en Debian,
   *     debería funcionar en Ubuntu.
   */
  'ip addr | grep \'state UP\' -A2 | tail -n1 | awk \'{print $2}\' | cut -f1  -d\'/\'',
  { silent: true }).stdout;
  /**
  * Quit when registered in domain
  */
  /* Bash('grep -q -F \'' + ip + ' ' +
                      'udomo.com www.udomo.com\' /etc/hosts || ' +
                      'echo \'' + ip.replace('\n', '') + ' ' +
                      'udomo.com  www.udomo.com\' >> /etc/hosts',
                      {silent: true}
                      );
  Bash('sudo service networking restart', {silent: true}); */
}

function windowsServer() {
  /**
   * Find out the command in Windows to obtain current IP address.
   */
  return 'localhost';
}

module.exports = (operatingSystem) => {
  let ipAddress = 'localhost';
  switch (operatingSystem) {
    case 'linux':
      ipAddress = linuxServer();
      break;
    case 'windows':
      ipAddress = windowsServer();
      break;
    default:
      break;
  }
  return ipAddress.trim();
};
