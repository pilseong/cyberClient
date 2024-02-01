import CyberMinwon from './infra/CyberMinwon';
import { toggleLayer, showHideLayer, showHideInfo, showHideInfo2 } from './util/uiux-common';
import { setNiceResult, CertResultShow, CertResultShow1, easySignResult } from './util/unity_resource';

const root = document.getElementById('app');

const currentUrl = window.location.pathname.split('/citizen/common/')[1].split('.do')[0];
window.cyberMinwon = new CyberMinwon(currentUrl, root);
window.toggleLayer = toggleLayer;
window.showHideLayer = showHideLayer;
window.showHideInfo = showHideInfo;
window.showHideInfo2 = showHideInfo2;
window.setNiceResult = setNiceResult;
window.CertResultShow = CertResultShow;
window.CertResultShow1 = CertResultShow1;
window.easySignResult = easySignResult;