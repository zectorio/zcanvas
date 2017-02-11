const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

let fileToWatch = process.argv[2];
console.log('Watching', fileToWatch);

function doWatch() {

  let watcher = fs.watch(fileToWatch, (evtype, fname) => {
    if(evtype === 'change') {
      let basename = path.basename(fname,path.extname(fname));
      let cmd = `/usr/bin/dot -Tsvg ${fname} -o ${basename}.svg`;

      console.log(`[${new Date().toLocaleTimeString()}] ${cmd}`);

      exec(cmd, (err,sout,serr) => {
        if(err) {
          console.error(err, serr);
        }
      });
      watcher.close();
      doWatch();
    }
  });
}

doWatch();
