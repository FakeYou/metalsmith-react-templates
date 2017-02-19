/*eslint-disable react/react-in-jsx-scope */
/*eslint-disable no-unused-vars */
import Preact from 'preact';

import renderToString from 'preact-render-to-string';
import constants from '../constants';

function preactTemplates(props = {}, Component = null) {
  if (!Component) {
    throw new Error(constants.INVALID_COMPONENT);
  }

  return renderToString(<Component {...props} />);
}

export default preactTemplates;
