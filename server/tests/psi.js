const psi = require('psi');
const gulp = require('gulp');
const { log } = process;
const { startCase, toLower } = require('lodash');

function psilog(speed, usability, type) {
  const SPEED_MIN = 40;
  const SPEED_MAX = 80;

  switch (speed) {
    case speed < SPEED_MIN:
      log.error(`Speed score for ${ type }: ${ speed }`);
      break;
    case speed >= SPEED_MIN && speed <= SPEED_MAX:
      // log.warning(`Speed score for ${ type }: ${ speed }`);
      break;
    case speed > SPEED_MAX:
      log.success(`Speed score for ${ type }: ${ speed }`);
      break;
    default:
      break;
  }

  const USABILITY_MIN = 40;
  const USABILITY_MAX = 80;

  switch (usability) {
    case usability < USABILITY_MIN:
      log.error(`Usability score for ${ type }: ${ usability }`);
      break;
    case usability >= USABILITY_MIN && usability <= USABILITY_MAX:
      // log.warning(`Usability score for ${ type }: ${ usability }`);
      break;
    case usability > USABILITY_MAX:
      log.success(`Usability score for ${ type }: ${ usability }`);
      break;
    default:
      break;
  }
}

function test(device) {
  return gulp
    .task(device, () => psi('localhost',
      {
        nokey: 'true',
        strategy: device,
      }).then((mobileData) =>
        psilog(
          mobileData
            .ruleGroups
              .SPEED
                .score,
          mobileData
            .ruleGroups
              .USABILITY
                .score,
          startCase(toLower(device))
        )
      )
    );
}

module.exports = (device) => test(device);
