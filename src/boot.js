//const urlParameter = window.location.search;
//const index = urlParameter.indexOf('minwonCd');
//const minwonCd = urlParameter.substring(index + 1 + 'minwonCd'.length);
const root = document.getElementById('app');

// const currentUrl = window.location.pathname.split('/citizen/common/')[1].split('.do')[0];
const cyberMinwon = new CyberMinwon(null, root);

cyberMinwon.render();