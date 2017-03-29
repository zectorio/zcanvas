/**
 * @module zcanvas/backend
 */

import {SVGBackend, SVGGroup, SVGShape} from './svg'
import {CanvasBackend, CanvasGroup, CanvasShape} from './canvas'

function choice(backendName='svg') {
  if(backendName === 'svg') {
    return {
      Backend : SVGBackend,
      Group : SVGGroup,
      Shape : SVGShape
    };
  } else if(backendName === 'canvas') {
    return {
      Backend : CanvasBackend,
      Group : CanvasGroup,
      Shape : CanvasShape
    }
  } else {
    throw new Error('Unknown backend: '+backendName);
  }
}

export default choice;