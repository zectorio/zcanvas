
import {SVGBackend, SVGGroup, SVGShape} from './svg'
import {CanvasBackend, CanvasGroup, CanvasShape} from './canvas'

function choice(backendName='svg') {
  if(backendName === 'svg') {
    return {
      RenderBackend : SVGBackend,
      RenderGroup : SVGGroup,
      RenderShape : SVGShape
    };
  } else if(backendName === 'canvas') {
    return {
      RenderBackend : CanvasBackend,
      RenderGroup : CanvasGroup,
      RenderShape : CanvasShape
    }
  } else {
    throw new Error('Unknown backend: '+backendName);
  }
}

export default choice;