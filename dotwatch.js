/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Canvas.

 Zector Canvas is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Canvas is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Canvas.  If not, see <http://www.gnu.org/licenses/>.

 */

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
        console.log(serr);
      });
      watcher.close();
      doWatch();
    }
  });
}

doWatch();
