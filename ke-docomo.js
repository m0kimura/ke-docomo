const Cp=require('child_process');
module.exports=class keDocomo {
/**
 * ドコモAPIコンストラクター
 * @param  {String} site API対応サイト(省略時は対応サイト)
 * @return {Void}       none
 * @constructor
 */
  constructor(site) {
    this.Context='';
    this.Site=site||'https://api.apigw.smt.docomo.ne.jp';
  }
/**
 * 雑談対話インターフェイス
 * @param  {String}   msg 対話メッセージ
 * @param  {Function} fn  対話データ返信処理(返信メッセージ、エラーコード)
 * @return {Void}         none
 * @method
 */
  dialogue(msg) {
    let req={}, res, out;
    req.utt=msg; req.context=this.Context;
    try{
      let stdout=Cp.execSync(this.curlDialog(JSON.stringify(req)))+'';
      res=JSON.parse(stdout);
      out=res.utt; this.Context=res.context;
    }catch(error){
      out='何か調子が悪いです。';
      console.log('error16', error);
      this.error=error;
    }
    return out;
  }
/**
 * 対話curlコマンド編集
 * @param  {String} data 送信メッセージ
 * @return {String}      curlコマンド
 * @method
 */
  curlDialog(data) {
    let apikey=process.env.DOCOMO_DIALOGUE_KEY;
    let out='curl -f -X POST '+this.Site+'/dialogue/v1/dialogue?APIKEY='+apikey+' ';
    out+='-H \'Content-type: application/json\' ';
    out+='-d \''+data+'\'';
    return out;
  }
/**
 * 知識QAインターフェイス
 * @param  {String}   msg 質問
 * @param  {Function} fn  回答対応処理(回答, エラーメッセージ)
 * @return {Void}         none
 * @method
 */
  qa(msg) {
    let out, res;
    let txt=encodeURIComponent(msg);
    try{
      let stdout=Cp.execSync(this.curlQa(txt))+'';
      res=JSON.parse(stdout);
      out=res.message.textForDisplay;
    }catch(error){
      out='何か調子が悪いです。';
      this.error=error;
      console.log('error30', error);
    }
    return out;
  }
  /**
   * QAcurlコマンド編集
   * @param  {String} data 送信メッセージ
   * @return {String}      curlコマンド
   * @method
   */
  curlQa(data) {
    let apikey=process.env.DOCOMO_QA_KEY;
    let out='curl -f "'+this.Site+'/knowledgeQA/v1/ask?APIKEY='+apikey;
    out+='&q='+data+'" ';
    out+='-H \'Content-type: application/json\'';
    return out;
  }
/**
 * 形態素、固定表現解析インターフェイス
 * @param  {String}   msg 文章・センテンス
 * @param  {Function} fn  解析後データ処理（解析オブジェクト, エラーメッセージ）
 * @return {Void}         none
 * @method
 */
  analytics(msg) {
    let a, b, c, req, res, i, j, txt, stdout;
    let sentence=[];
    req={};
    req.sentence=msg;
    try{
      stdout=Cp.execSync(this.curlMorph(JSON.stringify(req)))+'';
      res=JSON.parse(stdout);
      for(i in res.word_list){
        txt=''; b=[];
        for(j in res.ne.list[i]){
          a=res.word_list[i][j];
          b.push({'part': a[0], 'form': a[1], 'pos': a[2], 'read': a[3]});
          txt+=a[0];
        }
        req={};
        req.sentence=txt;
        stdout=Cp.exec(this.curlEntity(JSON.stringify(req)))+'';
        res=JSON.parse(stdout);
        c=[];
        for(i in res.ne_list){
          a=res.ne_list[i];
          c.push({'part': a[0], 'type': a[1]});
        }
      }
      sentence.push({'text': txt, 'forms': b, 'proper': c});
    }catch(error){
      this.error=error;
      console.log('error83', error);
    }
    return sentence;
  }
  /**
   * 形態素解析curlコマンド編集
   * @param  {String} data 送信メッセージ
   * @return {String}      curlコマンド
   * @method
   */
  curlMorph(data) {
    let apikey=process.env.DOCOMO_ANALYTICS_KEY;
    let out='curl -f "'+this.Site+'/gooLanguageAnalysis/v1/morph?APIKEY='+apikey;
    out+='-H \'Content-type: application/json\' ';
    out+='-d '+data;
    return out;
  }
  /**
   * 固定表現抽出ｃurlコマンド編集
   * @param  {String} data 送信メッセージ
   * @return {String}      curlコマンド
   * @method
   */
  curlEntity(data) {
    let apikey=process.env.DOCOMO_ANALYTICS_KEY;
    let out='curl -f "'+this.Site+'/gooLanguageAnalysis/v1/entity?APIKEY='+apikey;
    out+='-H \'Content-type: application/json\' ';
    out+='-d '+data;
    return out;
  }
/**
 * カテゴリ分析インターフェイス
 * @param  {String}   msg 文章・センテンス
 * @param  {Function} fn  解析後処理(解析オブジェクト, エラーメッセージ)
 * @return {Void}         none
 * @method
 */
  cluster(msg) {
    let res, i, a;
    let clusters=[];
    try{
      let stdout=Cp.execSync(this.curlCluster(msg))+'';
      res=JSON.parse(stdout);
      for(i in res.clusters){
        a=res.clusters[i];
        clusters.push({
          'name': a.cluster_name, 'rate': a.cluster_rate, 'rank': a.cluster_rank
        });
      }
    }catch(error){
      this.error=error;
      console.log('error30', error);
    }
    return clusters;
  }
  /**
   * カテゴリ分析ｃurlコマンド編集
   * @param  {String} data 送信メッセージ
   * @return {String}      curlコマンド
   * @method
   */
  curlCluster(data) {
    let apikey=process.env.DOCOMO_ANALYTICS_KEY;
    let out='curl -f "'+this.Site+'/truetext/v1/clusteranalytics?APIKEY='+apikey;
    out+='-H \'Content-type: application/json\' ';
    out+='-F "text='+data+'"';
    return out;
  }
};
