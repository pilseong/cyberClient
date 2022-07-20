import CyberMinwon from './CyberMinwon';
import { toggleLayer, showHideLayer } from './util/uiux-common';

const root = document.getElementById('app');

// const currentUrl = window.location.pathname.split('/citizen/common/')[1].split('.do')[0];
window.cyberMinwon = new CyberMinwon('', root);
window.toggleLayer = toggleLayer;
window.showHideLayer = showHideLayer;
