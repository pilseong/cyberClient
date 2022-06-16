// 자동 납부 신청
class B14DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        gubun: '',   // 신규 1, 해지 2, 공백은 미선택
        etc: '',
        bankName: '',
        bandCode: '',
        bankAccount: '',
        certifed: false,
        certifyType: '', // 개인 1, 법인2, 외국인 3, 공백은 미선택
        accountOwnerName: '',
        certifiedNumber: '',
        birthday: '',
        megReceiptionAgreement: false,
        withdrawAgreement: false,
        ruleAgreement: false
      },
      description: {

      }
    }
    this.getDescription();
  }

  // 수용가 조회시 초기값 설정
  // 이 때 기존에 데이터는 초기화가 되어야 한다.
  setInitValue(suyongaNum) {
    const that = this;

    var url = "http://localhost:8080/citizen/common/searchAutoPay.do";
    var queryString = "mgrNo=" + suyongaNum;
    fetch('GET', url, queryString, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }

      console.log(data)

      if (data.result.status === 'SUCCESS') {
        const fetchedData = data.business.bodyVO;
        that.setState({
          ...that.state,
          statusInfo: {
            data: fetchedData
          },
          requestInfo: {
            gubun: '2',   // 신규 1, 해지 2, 공백은 미선택
            etc: '',
            bankName: fetchedData.bankCdNm,
            bandCode: '',
            bankAccount: fetchedData.acctNo,
            certifed: false,
            certifyType: '', // 개인 1, 법인2, 외국인 3, 공백은 미선택
            accountOwnerName: fetchedData.acctowner,
            certifiedNumber: '',
            birthday: fetchedData.juminIdNo,
            megReceiptionAgreement: false,
            withdrawAgreement: false,
            ruleAgreement: false
          }
        })
      } else {
        that.setState({
          ...that.state,
          statusInfo: {
            data: null
          },
          requestInfo: {
            gubun: '1',   // 신규 1, 해지 2, 공백은 미선택
            etc: '',
            bankName: '',
            bandCode: '',
            bankAccount: '',
            certifed: false,
            certifyType: '', // 개인 1, 법인2, 외국인 3, 공백은 미선택
            accountOwnerName: '',
            certifiedNumber: '',
            birthday: '',
            megReceiptionAgreement: false,
            withdrawAgreement: false,
            ruleAgreement: false
          }
        })
      }
    });
  }

  getViewInfo() {
    return {};
  }

  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription() {
    const that = this;

    var url = gContextUrl + "/citizen/common/listCitizenCvplDfn.do";
    var queryString = {
      'minwonCd': this.state.minwonCd
    };

    fetch('GET', url, queryString, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }

      that.setState({
        ...that.state,
        description: data[0]
      })
      console.log(data);
      console.log('after fetching', that.state);
    });
  }

  setState(nextState) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 민원신청 구분
  handleOnChangeGubun(gubun) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        gubun
      }
    });

    this.render();
  }

  render() {
    const that = this;

    let template = `
      <div class="mw-box" id="desc">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
        </div><!-- // info-mw -->
      </div><!-- // mw-box -->        
      <!-- 신청내용 -->
      <div class="mw-box">
        <!-- 자동납부 신청(신규/변경/해지) -->
        <div id="form-mw21" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" class="off" title="닫기"><span class="i-01">자동납부 신청</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li>
                  <label class="input-label-1"><span>자동납부 신청을 선택하세요.</span></label>
                  <ul class="mw-opt mw-opt-6 row">
                    <li id="aGubun1" class="off"><a href="javascript:void(0);" onClick="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeGubun('1')"><span>신규</span></a></li>
                    <li id="aGubun2" class="off"><a href="javascript:void(0);" onClick="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeGubun('2')"><span>해지</span></a></li>
                  </ul>
                </li>
                <li>
                  <label for="contents" class="input-label-1"><span>비고</span></label>
                  <textarea name="contents" id="content" maxlength="1500" title="비고"  class="textarea-box"></textarea>
                  <p class="form-cmt form-cmt-1 txStrongColor">
                    * 증권계좌는 자동납부 신청이 불가합니다.<br>
                    * 지방세징수법에 의거 증권사는 지방세수납대행기관에 해당되지 않습니다.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw21 -->
      </div><!-- //mw-box -->
  
  
      <div id="mw-box1" class="mw-box display-none row">
      <!-- 신계좌 정보 -->
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw22');" class="off" title="닫기"><span class="i-01">자동납부(계좌) 신규 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="n_bank_nm_new" class="input-label"><span class="form-req">은행 </span></label>
                <select id="n_bank_nm_new" name="n_bank_nm_new" title="은행명 선택" class="input-box input-w-2">
                  <option value="000" selected="selected">은행선택</option>
                  <option value="020">우리은행</option>
                  <option value="003">기업은행</option>
                  <option value="004">국민은행</option>
                  <option value="088">신한은행</option>
                  <option value="081">KEB하나은행</option>
                  <option value="011">농협(중앙)</option>
                  <option value="012">농협(단위)</option>
                  <option value="071">우체국</option>
                  <option value="007">수협</option>
                  <option value="090">카카오뱅크</option>
                  <option value="089">케이뱅크</option>
                  <option value="002">산업은행</option>
                  <option value="023">제일은행</option>
                  <option value="045">새마을금고</option>
                  <option value="027">한국씨티은행</option>
                  <option value="031">대구은행</option>
                  <option value="032">부산은행</option>
                  <option value="034">광주은행</option>
                  <option value="035">제주은행</option>
                  <option value="037">전북은행</option>
                  <option value="039">경남은행</option>
                  <option value="048">신용협동조합</option>
                  <option value="050">상호저축은행</option>
                  <option value="064">산림조합중앙회</option>
                  <option value="100">기타</option>
                </select>
              </li>
              <li><label for="form-mw35-tx" class="input-label"><span class="form-req">계좌번호 </span></label><input type="text" id="form-mw35-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <a href="#" class="btn btnSS"><span>계좌확인</span></a><a href="#" class="btn btnSS"><span>계좌이력확인</span></a>
              </li>
              <li>
                <label for="eGubun" class="input-label-1"><span>본인인증</span></label>
                <select id="eGubun" name="eGubun" title="선택" class="input-box input-w-2">
                  <option value="001">개인</option>
                  <option value="002">법인</option>
                  <option value="003">외국인</option>
                </select>
  
                <label for="form-mw56-tx"><span class="sr-only">성명(예금주)</span></label>
                <input type="text" id="form-mw56-tx" class="input-box input-w-2" placeholder="성명(예금주)" readOnly>
                <a href="javascript:void(0);" class="btn btnSS"><span>휴대폰인증</span></a>
                <a href="javascript:void(0);" class="btn btnSS"><span>공공아이핀</span></a>
                <p class="form-cmt form-cmt-1">* 인증 오류는 <a href="https://www.niceid.co.kr/index.nc" target="_blank">NICE평가정보</a>에 문의해 주시기 바랍니다. (Tel.1600-1522)</p>
              </li>
  
              <li>
                <label for="form-mw46-tx"><span class="sr-only">인증번호</span></label><input type="text" id="form-mw46-tx" class="input-box input-w-1" placeholder="인증번호"  readOnly>
                <p class="form-cmt form-cmt-1">
                  <span class="txStrongColor">* 개인, 외국인(생년월일:YYMMDD), 법인(사업자번호:XXXXXXXXXX)</span><br>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box -->
  
      <div id="mw-box2" class="mw-box display-none row">
      <!-- 자동납부(계좌) 해지 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">자동납부(계좌) 해지 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="form-mw18-tx" class="input-label">
                <span>은행명</span>
                </label>
                <input type="text"
                  value="${that.state.requestInfo.bankName}"
                  id="form-mw18-tx" class="input-box input-w-2" placeholder="은행명" readOnly>
              </li>
              <li>
                <label for="form-mw28-tx" class="input-label">
                  <span>계좌번호</span>
                </label>
                <input type="text" 
                  value="${that.state.requestInfo.bankAccount}"
                  id="form-mw28-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력" readOnly>
              </li>
              <li>
                <label for="form-mw38-tx" class="input-label">
                  <span>성명(예금주)</span>
                </label>
                <input type="text" 
                  value="${that.state.requestInfo.accountOwnerName}"
                  id="form-mw38-tx" class="input-box input-w-2" placeholder="성명(예금주)" readOnly>
                <p class="form-cmt">* 예금주명과 주민등록번호가 표시되어(이미 저장됨) 있으면 변경할 수 없습니다.</p>
              </li>
              <li>
                <label for="form-mw48-tx" class="input-label">
                  <span>실명번호</span>
                </label>
                <input 
                  value="${that.state.requestInfo.birthday.length !== 10 ? that.state.requestInfo.birthday.substring(0, 6) : that.state.requestInfo.birthday}"
                    type="text" id="form-mw48-tx" class="input-box input-w-2" placeholder="생년월일" readOnly>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->
  
      <div class="mw-box row">
      <!-- 약관동의 -->
      <div id="form-mw24" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw24');" class="off" title="닫기"><span class="i-01">이용약관</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li><label for="form-mw35-tx" class="input-label"><span>이용약관에 동의하세요.</span></label>
                <p class="form-info">
                  <input type="checkbox" name="ch71" id="ch71">
                  <label class="chk-type" for="ch71"> <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span></label><br>
  
                  <input type="checkbox" name="ch72" id="ch72">
                  <label class="chk-type" for="ch72"> <span>예금주와 신청인이 동일하며, 동일하지 않은 경우 예금주로부터 출금동의 받음<span class="tx-opt">(필수) </span></span></label><br>
  
                  <input type="checkbox" name="ch73" id="ch73">
                  <label class="chk-type" for="ch73"> <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span></label>
                  <a href="https://www.xrp.kr/_arisu/data/use-info.hwp" target="_blank" class="btn btnSS btnTypeC"><span>내용보기</span></a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->        
    `;

    document.getElementById('minwonRoot').innerHTML = template;

    this.renderDescription(document.getElementById('desc'));

    this.afterRender();
  }

  afterRender() {
    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;

    //    hideGubunMulti('#aGubun1', '#mw-box1');
    //    hideGubunMulti('#aGubun2', '#mw-box2');

    // 신청, 해지 버튼 그려주기
    if (requestInfo.gubun === '1') {
      showGubunMulti('#aGubun1', '#mw-box1');
      hideGubunMulti('#aGubun2', '#mw-box2');
      hideElement('#aGubun2');
    } else if (requestInfo.gubun === '2') {
      showGubunMulti('#aGubun2', '#mw-box2');
      hideGubunMulti('#aGubun1', '#mw-box1');
      hideElement('#aGubun1');
    } else {
      hideGubunMulti('#aGubun1', '#mw-box1');
      hideGubunMulti('#aGubun2', '#mw-box2');
    }
    this.setEventListeners();
  }

  renderDescription(target) {
    const that = this;

    const desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>${that.state.description.minwonNm}</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>${that.state.description.minwonDfn}<br>
                </ul>
              </div>
    
              <div class="tit-mw-h5 row"><span>신청방법</span></div>
              - ${that.state.description.minwonHow}<br>
              <div class="tit-mw-h5 row"><span>처리기간</span></div>
              - ${that.state.description.minwonReqstDc}<br>
              <div class="tit-mw-h5 row"><span>처리부서</span></div>
              - ${that.state.description.minwonGde}<br>
              <div class="tit-mw-h5 row"><span>신청서류</span></div>
              - ${that.state.description.presentnPapers}<br>
              <div class="tit-mw-h5 row"><span>관련법규</span></div>
              - ${that.state.description.mtinspGde}<br>
              <div class="tit-mw-h5 row"><span>처리절차</span></div>
              - ${that.state.description.minwonProcedure}<br>
            </div>
          </div>
        </div><!-- // info-mw -->
      `;
    target.innerHTML = desc;
  }
}