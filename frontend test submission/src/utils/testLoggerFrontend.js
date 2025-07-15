import { logEvent } from './loggerMiddleware.js';

async function testFrontendLogger() {
  const logs = [];
  try {
    // Valid frontend log
    await logEvent('frontend', 'info', 'api', 'Frontend API info log');
    logs.push('Logged: frontend, info, api, Frontend API info log');

    // Valid frontend log with shared package
    await logEvent('frontend', 'debug', 'utils', 'Frontend utils debug log');
    logs.push('Logged: frontend, debug, utils, Frontend utils debug log');

    // Invalid package (should fail)
    try {
      await logEvent('frontend', 'info', 'handler', 'This should fail');
      logs.push('Attempted: frontend, info, handler, This should fail');
    } catch (err) {
      logs.push('Error (expected): ' + err.message);
    }
  } catch (err) {
    logs.push('Unexpected error: ' + err.message);
  }
}

testFrontendLogger(); 