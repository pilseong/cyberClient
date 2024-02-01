import Storage from './StorageT';
import { setTimer } from '../util/uiux-common';
enum CyberMinwonKey {
  IS_SESSION = 'isSessionData',
  MKEY = 'mkey',
  AUTH = 'athenticationInfo',
  APPLY = 'applicantInfo',
  P_AGREE = 'privacyAgree',
  S_AGREE = 'smsAgree',
  SESSION_DATA = 'sessionData',
  SESSION_PAY = 'sessionPay',
  UNITY = 'unityMinwons'
}

class CyberMinwonStorage extends Storage<CyberMinwonKey> {
  sessionObj : any;
  sessionPayObj : any;
  constructor(){
    super();
    this.sessionObj = {
      isSessionData : '',
      mkey : '',
      authenticationInfo : {},
      applicantInfo : {},
      privacyAgree : false,
      smsAgree : false,
      payMentInfo : {}
    }
    this.sessionPayObj = {
      paymentChk: false,
      paymentCnt: 0,
      //급수설비 폐지 요금납부 입력 정보
      chargeFlag: 'N',
      bankCd: '',
      bankNm: '',
      bankBranch: '',
      paidDt: '',
      paidAmount: '',
    }
  }
  
  setStorageData(isSessionData:string, mkey:string, authenticationInfo: any,
              applicantInfo:any, privacyAgree: boolean, smsAgree: boolean){
    this.sessionObj = {
      isSessionData : isSessionData,
      mkey : mkey,
      authenticationInfo : authenticationInfo,
      applicantInfo : applicantInfo,
      privacyAgree : privacyAgree,
      smsAgree : smsAgree,
      
    }
    this.set(CyberMinwonKey.SESSION_DATA, JSON.stringify(this.sessionObj));
  }
  
  getStorageData(){
    const data = this.get(CyberMinwonKey.SESSION_DATA);
    if(data){
      this.sessionObj = JSON.parse(data);
    }else{
      this.sessionObj = null;
    }
    return this.sessionObj;
  }
  
  setStoragePay(payMentInfo: any){
    this.sessionPayObj = {
      paymentChk: payMentInfo.paymentChk,
      paymentCnt: payMentInfo.paymentCnt,
      //급수설비 폐지 요금납부 입력 정보
      chargeFlag: payMentInfo.chargeFlag,
      bankCd: payMentInfo.bankCd,
      bankNm: payMentInfo.bankNm,
      bankBranch: payMentInfo.bankBranch,
      paidDt: payMentInfo.paidDt,
      paidAmount: payMentInfo.paidAmount,
    }
    this.set(CyberMinwonKey.SESSION_PAY, JSON.stringify(this.sessionPayObj));
  }
  
  getStoragePay(){
    const data = this.get(CyberMinwonKey.SESSION_PAY);
    if(data){
      this.sessionPayObj = JSON.parse(data);
    }else{
      this.sessionPayObj = null;
    }
    return this.sessionPayObj;
  }
  
  removeItemPay(){
    this.clearItem(CyberMinwonKey.SESSION_PAY);
  }
  
  setUnityMinwons(unity: any){
    this.set(CyberMinwonKey.UNITY, JSON.stringify(unity));
  }
  
  getUnityMinwons(){
    const unity = this.get(CyberMinwonKey.UNITY);
    
    return unity? JSON.parse(unity) : null;
  }
  
  expirySessionData(cyberminwon: any, ttl: number, reset: boolean, gubun: string){
    setTimer(cyberminwon, this, ttl, reset, gubun)
  }
  
  removeItem(){
    this.clearItem(CyberMinwonKey.SESSION_DATA);
  }
  
  clear() {
    this.clearItems([
      CyberMinwonKey.SESSION_DATA,
      CyberMinwonKey.UNITY,
      CyberMinwonKey.SESSION_PAY,
    ]);
  }
}

export default new CyberMinwonStorage();