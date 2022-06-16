/**
 * 
 */class B19DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        gubun: '',   // 신규 1, 해지 2, 공백은 미선택
        etc: '',
        bank: '',
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

  // 초기값 설정
  setInitValue(suyongaNum) {
    const that = this;

    var url = gContextUrl + "/citizen/common/getEmailNticInfo.do";
    var queryString = "mgrNo=" + suyongaNum;
    fetch('GET', url, queryString, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }
      console.log(data)

      that.setState({
        ...that.state,
        statusInfo: {
          data
        },
        requestInfo: {
          ...that.state.requestInfo,
        }
      })
    });
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

  getViewInfo() {
    return {};
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
      <div class="mw-box">
      <div id="form-mw20" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw20');" class="off" title="닫기"><span class="i-01">전자고지 신청 (신규/변경/해지)</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>전자고지 유형을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="aGubun1" class="off"><a href="javascript:void(0);" onClick="setGubunMulti('#aGubun1','#mw-box1')"><span>문자</span></a></li>
                  <li id="aGubun2" class="off"><a href="javascript:void(0);" onClick="setGubunMulti('#aGubun2','#mw-box2')"><span>이메일</span></a></li>
                </ul>
              </li>
  
              <li>
                <label for="eGubun" class="input-label-1"><span>본인인증</span></label>
                <select id="eGubun" name="eGubun" title="선택" class="input-box input-w-2">
                  <option value="001">개인</option>
                  <option value="002">법인</option>
                  <option value="003">외국인</option>
                </select>
  
                <label for="form-mw56-tx"><span class="sr-only">성명(사업자명)</span></label>
                <input type="text" id="form-mw56-tx" class="input-box input-w-2" placeholder="성명(사업자명)" readOnly>
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>휴대폰인증</span></a>
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>공공아이핀</span></a>
                <p class="form-cmt form-cmt-1">* 인증 오류는 <a href="https://www.niceid.co.kr/index.nc" target="_blank">NICE평가정보</a>에 문의해 주시기 바랍니다. (Tel.1600-1522)</p>
              </li>
  
              <li>
                <label for="form-mw66-tx"><span class="sr-only">인증번호</span></label><input type="text" id="form-mw66-tx" class="input-box input-w-1" placeholder="인증번호"  readOnly>
                <p class="form-cmt form-cmt-1">
                  <span class="txStrongColor">* 개인, 외국인(생년월일:YYMMDD), 법인(사업자번호:XXXXXXXXXX)</span><br>
                  * 인증번호는 이메일 수신시 암호로 사용됩니다.
                </p>
              </li>
  
                <li>
                  <div class="txStrong">사용현황</div>
                  <p class="display-block form-info form-info-box txStrongColor">
                      <span class="mw-info-label txStrongColor ">문자</span> 사용현황없음<br>
                      <span class="mw-info-label txStrongColor">이메일</span> 사용현황없음<br>
                      <span class="mw-info-label txStrongColor">앱</span> 사용현황없음<br>
                      <span class="mw-info-label txStrongColor">종이고지서</span> 사용현황없음<br>
                  </p>
                  <p class="form-cmt form-cmt-1">
                    <span class="txStrongColor">* 앱 전자고지는 네이버(전자문서), 카카오톡(카카오페이-내문서함), 페이코, 신한페이판(my bill&pay) 앱에서 신청/해지하세요.</span>
                  </p>
                </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw20 -->
      </div><!-- //mw-box -->
  
      <div id="mw-box1" class="mw-box display-none row">
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" class="on" title="닫기"><span class="i-01">문자 전자고시 신청정보</span></a></div>
        <div class="form-mw-box display-block row">
  
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>전자고지신청 구분을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="bGubun1" class="dGubun disable"><a href="javascript:void(0);" tabindex="-1"><span>신규</span></a></li>
                  <li id="bGubun2" class="bGubun off"><a href="javascript:void(0);" onClick="addMW('#bGubun2','.bGubun')"><span>변경</span></a></li>
                  <li id="bGubun3" class="bGubun off"><a href="javascript:void(0);" onClick="addMW('#bGubun3','.bGubun')"><span>해지</span></a></li>
                </ul>
              </li>
              <li>
                <label class="input-label"><span>안내방법을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="cGubun1" class="cGubun off"><a href="javascript:void(0);" onClick="addMW('#cGubun1','.cGubun')"><span>알림톡</span></a></li>
                  <li id="cGubun2" class="cGubun off"><a href="javascript:void(0);" onClick="addMW('#cGubun2','.cGubun')"><span>문자</span></a></li>
                </ul>
              </li>
              <li><label for="form-mw46-tx" class="input-label"><span>연락처</span></label>
                <input type="text" id="form-mw46-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
            </ul>
          </div>
  
        </div>
      </div><!-- //form-mw21 -->
      </div><!-- //mw-box1 -->
  
      <div id="mw-box2" class="mw-box display-none row">
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw22');" class="on" title="닫기"><span class="i-01">이메일 전자고시 신청정보</span></a></div>
        <div class="form-mw-box display-block row">
  
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>전자고지신청 구분을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="dGubun1" class="dGubun off">
                    <a href="javascript:void(0);" onClick="addMW('#dGubun1','.dGubun')"><span>신규</span></a>
                  </li>
                  <li id="dGubun2" class="dGubun off">
                    <a href="javascript:void(0);" onClick="addMW('#dGubun2','.dGubun')"><span>변경</span></a>
                  </li>
                  <li id="dGubun3" class="dGubun off">
                    <a href="javascript:void(0);" onClick="addMW('#dGubun3','.dGubun')"><span>해지</span></a>
                  </li>
                </ul>
              </li>
              <li>
                <label for="form-mw371-tx" class="input-label"><span>이메일</span></label>
                <input type="text" id="form-mw371-tx" class="input-box input-w-mail"> @
                <label for="form-mw372-tx"><span class="sr-only">이메일 주소</span></label>
                <input type="text" id="form-mw372-tx" class="input-box input-w-mail">
                <label for="email3"><span class="sr-only">이메일 선택</span></label>
                <select name="email3" id="email3" title="이메일도메인선택" class="input-box input-w-mail2">
                  <option value="">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="hotmail.com">hotmail.com</option>
                  <option value="chol.com">chol.com</option>
                  <option value="dreamwiz.com">dreamwiz.com</option>
                  <option value="empal.com">empal.com</option>
                  <option value="freechal.com">freechal.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="hanafos.com">hanafos.com</option>
                  <option value="hanmir.com">hanmir.com</option>
                  <option value="hitel.net">hitel.net</option>
                  <option value="korea.com">korea.com</option>
                  <option value="nate.com">nate.com</option>
                  <option value="netian.com">netian.com</option>
                  <option value="paran.com">paran.com</option>
                  <option value="yahoo.com">yahoo.com</option>
                </select>
              </li>
  
            </ul>
          </div>
  
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box -->
  
      <div class="mw-box">
      <div id="form-mw24" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw24');" class="on" title="펼치기">
        <span class="i-01">종이고지서 발행 신청</span></a>
        </div>
        <div class="form-mw-box row display-none">
          <div class="form-mv row">
            <ul>
              <li><label><span class="sr-only"> 종이 고지서 발행 신청</span></label>
                <input type="checkbox" name="ch31" id="ch31">
                <label class="chk-type" for="ch31"> <span>종이 고지서 발행 (전자고지 + 종이 고지서 발송) 희망 시 체크</span></label>
                <a href="javascript:void(0);" onClick="showHideInfo('#form-mw23-info');" class="btn btnSS btnTypeC"><span>안내사항</span></a>
  
                <p id="form-mw23-info" class="display-none form-info-box">
                  <span class="tit-mw-h5 row">안내사항</span>
                    1. 종이 고지서 발행을 선택하는 경우 요금이 감면되지 않습니다.(상수도 요금의 1% 최소 200 ~ 1,000원)<br>
                    2. 당월 8일 까지 “신청/변경/해지” 건은 당월 납기에 반영되고, 당월 8일 후 “신청/변경/해지” 건은 다음 납기에 반영됩니다.<br>
                    3. 향후, 이사정산을 하는 경우 전입자가 고지서를 받는 못하는 사례를 방지하기 위해 종이고지서를 발행하는 전자고지로 직권변경 및 직권해지 될 수 있습니다.
                </p>
              </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->
  
  
      <div id="mw-box11" class="mw-box display-none row">
      <!-- 신계좌 정보 -->
      <div id="form-mw25" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw25');" class="off" title="닫기"><span class="i-01">신규 계좌정보를 입력하세요.</span></a></div>
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
                <label for="fGubun" class="input-label"><span>인증정보</span></label>
                <select id="fGubun" name="fGubun" title="선택" class="input-box input-w-2">
                  <option value="001">개인</option>
                  <option value="002">법인</option>
                  <option value="003">외국인</option>
                </select>
                <label for="form-mw76-tx"><span class="sr-only">인증정보</span></label><input type="text" id="form-mw76-tx" class="input-box input-w-2" placeholder="인증정보">
                <p class="form-cmt-1">
                  <span class="txStrongColor">* 개인, 외국인(생년월일:Y2022-03-15YMMDD), 법인(사업자번호:XXXXXXXXXX)</span><br>
                </p>
              </li>
              <li>
                <label for="dGubun" class="input-label"><span>성명(예금주)</span></label>
                <input type="text" id="dGubun" class="input-box input-w-2" placeholder="성명(예금주)">
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>휴대폰인증</span></a>
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>공공아이핀</span></a>
                <p class="form-cmt">* 인증 오류는 <a href="https://www.niceid.co.kr/index.nc" target="_blank">NICE평가정보</a>에 문의해 주시기 바랍니다. (Tel.1600-1522)</p>
              </li>
  
              <li><label class="input-label"><span class="sr-only">수신 동의</span></label>
                <input type="checkbox" name="ch51" id="ch51">
                <label class="chk-type" for="ch51"> <span>자동납부  출금 및 미출금내역 메시지 수신 동의</span></label>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box11 -->
  
  
      <div id="mw-box21" class="mw-box display-none row">
      <!-- 신계좌 정보 -->
      <div id="form-mw26" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw26');" class="off" title="닫기"><span class="i-01">자동납부 해지정보를 입력하세요.</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="form-mw18-tx" class="input-label"><span class="form-req">은행명</span></label>
                <input type="text" id="form-mw18-tx" class="input-box input-w-2" placeholder="은행명">
              </li>
              <li>
                <label for="form-mw28-tx" class="input-label"><span class="form-req">계좌번호</span></label>
                <input type="text" id="form-mw28-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw38-tx" class="input-label"><span class="form-req">성명(예금주)</span></label>
                <input type="text" id="form-mw38-tx" class="input-box input-w-2" placeholder="성명(예금주)">
                <p class="form-cmt">* 예금주명과 주민등록번호가 표시되어(이미 저장됨) 있으면 변경할 수 없습니다.</p>
              </li>
              <li>
                <label for="form-mw48-tx" class="input-label"><span class="form-req">생년월일</span></label>
                <input type="text" id="form-mw48-tx" class="input-box input-w-2" placeholder="생년월일">
              </li>
  
              <li><label for="form-mw35-tx" class="input-label"><span>약관동의</span></label>
                <p class="form-info">
                  <input type="checkbox" name="ch71" id="ch71">
                  <label class="chk-type" for="ch71"> <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span></label><br>
  
                  <input type="checkbox" name="ch72" id="ch72">
                  <label class="chk-type" for="ch72"> <span>예금주와 신청인이 동일하며, 동일하지 않은 경우 예금주로부터 출금동의 받음<span class="tx-opt">(필수) </span></span></label><br>
  
                  <input type="checkbox" name="ch73" id="ch73">
                  <label class="chk-type" for="ch73"> <span>자동이체 이용약관 동의<span class="tx-opt-a">(필수)</span></span></label>
                  <a href="javascript:fncFileDownload(4);" class="btn btnSS btnDGray"><span>약관보기</span></a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box21 -->    
    `;

    document.getElementById('minwonRoot').innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
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