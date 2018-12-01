#!/usr/bin/env node

const program = require('commander');
const robot = require('robotjs');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const defaultActionInterval = 240 * 1000;

program
    .version('1.0.0')
    .option('-i, --interval [value]', 'How many seconds between mouse movements [240]', tryParseInt(defaultActionInterval), defaultActionInterval)
    .option('-f, --f15instead', 'Hit F15 instead of moving the mouse')
    .option('-k, --key [value]', 'Provide a keep awake key.')
    .option('-r, --run', 'Run immediately')
    .parse(process.argv);

if(program.run) {
    logger.log('info', 'Running action now.');
    keepPCAwakeAction();
}

logger.log('info', 'Moving the mouse every %s seconds.', program.interval);

setInterval(function(){
    keepPCAwakeAction();
}, program.interval * 1000);

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

    let screenSize = robot.getScreenSize();
    let height = (screenSize.height / 2) - 10;
    let width = screenSize.width;

    robot.moveMouse(width, height);
    robot.moveMouseSmooth(width / 2, height);
}


function tryParseInt(defaultValue) {
    return function tryParseInt(str) {
        return parseInt(str, 10) || defaultValue;
    };
}