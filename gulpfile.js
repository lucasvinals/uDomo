/**
 * Set environment and custom configurations.
 */
require('./server/config/environment');
/**
 * Load all tasks
 */
require('require-dir')('./build', { recurse: true });
