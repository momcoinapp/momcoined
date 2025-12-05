const { spawn } = require('child_process');
const fs = require('fs');

console.log("Starting build...");
const build = spawn('npm.cmd', ['run', 'build'], { shell: true });
const logStream = fs.createWriteStream('full_build_log.txt');

build.stdout.pipe(logStream);
build.stderr.pipe(logStream);

build.stdout.on('data', (data) => {
    process.stdout.write(data);
});
build.stderr.on('data', (data) => {
    process.stderr.write(data);
});

build.on('close', (code) => {
    console.log(`Build process exited with code ${code}`);
});
