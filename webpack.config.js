const path = require('path');

 module.exports = {
     entry: './js/app.js',
     output: {
         path: path.resolve(__dirname, 'commer/commerJS'),
         filename: 'app.http.js'
     }
 };