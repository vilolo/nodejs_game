import WxPay from 'wechatpay-node-v3'; // 支持使用require
import fs from 'fs';
import request from 'superagent';

const pay = new WxPay({
  appid: '直连商户申请的公众号或移动应用appid',
  mchid: '商户号',
  publicKey: fs.readFileSync('./apiclient_cert.pem'), // 公钥
  privateKey: fs.readFileSync('./apiclient_key.pem'), // 秘钥
});

// 这里以h5支付为例
try {
    // 参数介绍请看h5支付文档 https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_1.shtml
    const params = {
      appid: '直连商户申请的公众号或移动应用appid',
      mchid: '商户号',
      description: '测试',
      out_trade_no: '订单号',
      notify_url: '回调url',
      amount: {
        total: 1,
      },
      scene_info: {
        payer_client_ip: 'ip',
        h5_info: {
          type: 'Wap',
          app_name: '网页名称 例如 百度',
          app_url: '网页域名 例如 https://www.baidu.com',
        },
      },
    };
    const nonce_str = Math.random().toString(36).substr(2, 15), // 随机字符串
      timestamp = parseInt(+new Date() / 1000 + '').toString(), // 时间戳 秒
      url = '/v3/pay/transactions/h5';

    // 获取签名
    const signature = pay.getSignature('POST', nonce_str, timestamp, url, params); // 如果是get 请求 则不需要params 参数拼接在url上 例如 /v3/pay/transactions/id/12177525012014?mchid=1230000109
    // 获取头部authorization 参数
    const authorization = pay.getAuthorization(nonce_str, timestamp, signature);

    const result = await request
      .post('https://api.mch.weixin.qq.com/v3/pay/transactions/h5')
      .send(params)
      .set({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        Authorization: authorization,
      });

    console.log('result==========>', result.body);
  } catch (error) {
    console.log(error);
  }