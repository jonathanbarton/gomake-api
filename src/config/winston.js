import winston from 'winston';

winston.addColors({
  silly: 'magenta',
  debug: 'blue',
  audit: 'green',
  warn: 'yellow',
  error: 'red',
  info: 'cyan'
});

winston.remove(winston.transports.Console);

winston.add(winston.transports.Console, {
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: true
});

export default winston;
