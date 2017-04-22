import {expect} from 'chai';
import Metalsmith from 'metalsmith';

import helpers from 'tests/helpers';
import outputs from 'tests/fixtures/outputs';
import index from 'src/index';

const {fixtures, getContent, trimContent} = helpers;

describe('integration - react', function () {
  let files;
  let metalsmith;

  before(function (done) {
    metalsmith = new Metalsmith(fixtures);
    metalsmith.read((err, result) => {
      if (err) throw err;
      files = result;
      done();
    });
  });

  it('should work with default options', function (done) {
    const plugin = index();

    const test = {
      'default.md': {...files['default.md']}
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['default.html'])).to.eql(trimContent(outputs.default));
      done();
    });
  });

  it('should keep original file extension', function (done) {
    const plugin = index({extension: null});

    const test = {
      'default.md': {...files['default.md']}
    }

    plugin(test, metalsmith, () => {
      expect(test['default.md']).to.exist;
      done();
    });
  });

  it('should rename file extension', function (done) {
    const plugin = index({extension: '.htm'});

    const test = {
      'default.md': {...files['default.md']}
    }

    plugin(test, metalsmith, () => {
      expect(test['default.htm']).to.exist;
      done();
    });
  });

  it('should keep subdirectory structure', function (done) {
    const plugin = index({extension: '.html'});

    const test = {
      'subdir/structure.md': {...files['subdir/structure.md']}
    }

    plugin(test, metalsmith, () => {
      expect(test['subdir/structure.html']).to.exist;
      done();
    });
  });

  it('should use a base file', function (done) {
    const plugin = index({baseFile: 'base.html'});

    const test = {
      'default.md': {...files['default.md']}
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['default.html'])).to.eql(trimContent(outputs.baseFileDefault));
      done();
    });
  });

  it('should use a different base file directory', function (done) {
    const plugin = index({
      baseFile: 'base-alt.html',
      baseFileDirectory: 'others'
    });

    const test = {
      'default.md': {...files['default.md']}
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['default.html'])).to.eql(trimContent(outputs.baseFileDefault));
      done();
    });
  });

  it('should throw an error when template is not found', function (done) {
    const plugin = index();

    const test = {
      'default.md': {
        ...files['default.md'],
        rtemplate: 'Error.jsx'
      }
    }

    plugin(test, metalsmith, (err) => {
      expect(err).to.not.be.eql(null);
      done();
    });
  });

  it('should not process file if no template/rtemplate and no defaultTemplate', function (done) {
    const plugin = index({defaultTemplate: null});

    const test = {
      'default.md': {
        ...files['default.md']
      }
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['default.md'])).to.eql(getContent(files['default.md']));
      done();
    });
  });

  it('should be able to access yaml front matter parameters as variables in template', function (done) {
    const plugin = index();

    const test = {
      'variable.md': {
        ...files['variable.md'],
        rtemplate: 'Variable.jsx'
      }
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['variable.html'])).to.eql(trimContent(outputs.variable));
      done();
    });
  });

  it('should be able to access yaml front matter parameters as variables in baseFile', function (done) {
    const plugin = index();

    const test = {
      'baseFile.md': {
        ...files['baseFile.md']
      }
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['baseFile.html'])).to.eql(trimContent(outputs.baseFileDefault));
      done();
    });
  });

  it('should use template instead of the rtemplate parameter in from the yaml front matter ', function (done) {
    const plugin = index({templateKey: 'template'});

    const test = {
      'template.md': {...files['template.md']}
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['template.html'])).to.eql(trimContent(outputs.other));
      done();
    });
  });

  it('should render react-ids if isStatic is set to false', function (done) {
    const plugin = index({isStatic: false});

    const test = {
      'baseFile.md': {
        ...files['baseFile.md']
      }
    }

    plugin(test, metalsmith, () => {
      const content = getContent(test['baseFile.html']);

      expect(content.match(/data-reactid/)).to.have.length.gt(0);
      expect(content.match(/data-react-checksum/)).to.have.length.gt(0);
      done();
    });
  });

  it('should render functional templates (react 0.14+)', function (done) {
    const plugin = index();

    const test = {
      'default.md': {
        ...files['default.md'],
        rtemplate: 'Functional.jsx'
      }
    }

    plugin(test, metalsmith, () => {
      expect(getContent(test['default.html'])).to.eql(trimContent(outputs.default));
      done();
    });
  });

  it('should use props defined by propsKey', function (done) {
    const plugin = index({
      propsKey: 'customKey'
    });

    const test = {
      'default.md': {
        ...files['default.md'],
        rtemplate: 'CustomKey.jsx',
        customKey: {
          contents: 'Test content from custom key'
        }
      }
    };

    plugin(test, metalsmith, () => {
      expect(getContent(test['default.html'])).to.eql(trimContent(outputs.defaultCustomKey));
      done();
    });
  });
});
