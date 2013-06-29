var fs = require('fs');
fs.readFile('./resource.json', function(error, data){
    if (error) {
        console.log(error);
    } else {
        console.log("Outputs a buffer of bytes");
        console.log(data);
    }
});