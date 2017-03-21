const { execSync: Bash } = require('child_process');

function linuxServer() {
  /**
   * EN: Get the first 'up' local IP. Tested in Debian-based systems,
   *     should work with Ubuntu.
   * ES: Obtiene la primer IP levantada. Testeado en sistemas basados en Debian,
   *     debería funcionar en Ubuntu.
   */
  const command = `ip addr | grep ${ 'state UP' } -A2 | tail -n1 | awk ${ '{print $2}' } | cut -f1  -d'/'`.split(' ');
  return Bash(command[0], command.slice(1)).stdout.toString().trim();
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
  const command = `
    for /f "delims=[] tokens=2" %%a in ('ping -4 %computername% -n 1 ^| findstr "["') do (set thisip=%%a)\
    \necho %thisip%`.split(' ');
  return Bash(command[0], command.slice(1)).stdout.toString().trim();
}

module.exports = () => {
  let host = 'localhost';
  switch (process.platform) {
    case 'linux':
      host = linuxServer();
      break;
    case 'windows':
      host = windowsServer();
      break;
    default:
      break;
  }
  return host;
};
