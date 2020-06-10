#!/usr/bin/env node

const program = require('commander');
const robot = require('robotjs');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const defaultActionInterval = 240;

program
    .version('1.0.0')
    .option('-i, --interval [value]', 'How many seconds between mouse movements [240]', tryParseInt(defaultActionInterval), defaultActionInterval)
    .option('-f, --f15instead', 'Hit F15 instead of moving the mouse')
    .option('-k, --key [value]', 'Provide a keep awake key.')
    .option('-f, --force', 'do not skip movement if the mouse has changed position between last runs..')
    .option('-r, --run', 'Run immediately')
    .parse(process.argv);

let lastKnownPosition = robot.getMousePos();
    
if(program.run) {
    logger.log('info', 'Running action now.');
    keepPCAwakeAction();
}

const movementIntervalInSeconds = program.interval * 1000;

logger.log('info', 'Moving the mouse every %s seconds.', movementIntervalInSeconds / 1000);

setInterval(function(){
    keepPCAwakeAction();
}, movementIntervalInSeconds);

function keepPCAwakeAction() {

    if(program.f15instead) {

        if(program.key) {
            logger.log('info', 'Hitting %s instead of moving the mouse.', program.key);
            robot.keyTap(program.key);
            return;
        }

        logger.log('info', 'Hitting F15 instead of moving the mouse.');

        robot.keyTap('f3', 'shift');
        return;
    }

    const currentPosition = robot.getMousePos();
    // Do not move mouse if its moved recently
    if(!program.force) {
        if(lastKnownPosition.x !== currentPosition.x ||
            lastKnownPosition.y !== currentPosition.y) {
            logger.log('info', 'The mouse appears to have moved since we last ran, skipping movement.');
            return;
        }
    } else {
        logger.log('info', 'Skipping mouse position check.');
    }

    const screenSize = robot.getScreenSize();
    const desiredHeight = (screenSize.height / 2) - 10;
    const desiredWidth = screenSize.width / 2;

    logger.log('info', 'Moving mouse.');

    robot.moveMouseSmooth(desiredWidth, desiredHeight);

    lastKnownPosition = robot.getMousePos();
}


function tryParseInt(defaultValue) {
    return function tryParseInt(str) {
        return parseInt(str, 10) || defaultValue;
    };
}