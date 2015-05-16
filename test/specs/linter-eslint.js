'use strict';

var execSync = require('exec-sync');
var assert = require('assert');
var fs = require('fs');


// JS Only
describe('lint - ES (JS / JSX)', function(){

  var jsResult = './test/logs/lint-js.txt';

  var js = 'eslint' +
        ' --ext .js,.jsx' +
        ' -c .eslintrc' +
        ' --ignore-path .eslintignore' +
        ' --quiet' +
        ' src/*';
        // ' test/*';
        // ' examples/templates/*' +
        // ' examples/scripts/*';

  it('it should pass', function(done){

    execSync('mkdir -p ./test/logs; rm -f '+ jsResult);

    var result = execSync(js);

    if (result){
      fs.writeFile(jsResult, result, function(){});
    }

    assert.equal(result, '');
    done();
  });
});
