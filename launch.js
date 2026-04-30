delete process.env.ELECTRON_RUN_AS_NODE;
const { spawn } = require('child_process');
const electron = require('electron');
spawn(electron, ['.'], { stdio: 'inherit' }).on('exit', (code) => process.exit(code || 0));
