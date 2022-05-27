const urlParameter = window.location.search;
const index = urlParameter.indexOf('minwonCd');
const minwonCd = urlParameter.substring(index + 1 + 'minwonCd'.length);

const root = document.getElementById('app');
var app = new UnityMinwon(minwonCd, root);

var suyongaInfo = new SuyongaPage(app, root);
app.addSuyongaInfoPage(suyongaInfo);

var summaryStep = new SummaryPage(app, root);
app.addSummaryPage(summaryStep);

var detailB04 = new B04DetailPage(app, root);
var detailB14 = new B14DetailPage(app, root);
var detailB19 = new B19DetailPage(app, root);
var detailB25 = new B25DetailPage(app, root);


var minwonB04 = [suyongaInfo, detailB04, summaryStep];  // 명의변경
var minwonB14 = [suyongaInfo, detailB14, summaryStep];  // 자동납부
var minwonB19 = [suyongaInfo, detailB19, summaryStep];  // 전자고지
var minwonB25 = [suyongaInfo, detailB25, summaryStep];  // 수도요금 바로 알림


app.addMinwon('B04', minwonB04, '명의변경 신청');
app.addMinwon('B14', minwonB14, '자동납부 신청');
app.addMinwon('B19', minwonB19, '전자고지 신청');
app.addMinwon('B25', minwonB25, '수도요금 바로알림 신청');

console.log(app);

app.setPage(0);
