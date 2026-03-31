// 네이버 클라우드 SENS SMS 발송 유틸리티
import crypto from 'crypto'

interface SendSMSParams {
  to: string
  content: string
}

interface NaverSMSConfig {
  accessKey: string
  secretKey: string
  serviceId: string
  sender: string
}

export async function sendSMS({ to, content }: SendSMSParams): Promise<boolean> {
  try {
    const config: NaverSMSConfig = {
      accessKey: process.env.NAVER_CLOUD_ACCESS_KEY || '',
      secretKey: process.env.NAVER_CLOUD_SECRET_KEY || '',
      serviceId: process.env.NAVER_CLOUD_SMS_SERVICE_ID || '',
      sender: process.env.NAVER_CLOUD_SMS_SENDER || '',
    }

    if (!config.accessKey || !config.secretKey || !config.serviceId || !config.sender) {
      console.error('네이버 SENS 환경 변수가 설정되지 않았습니다.')
      return false
    }

    const timestamp = Date.now().toString()
    const method = 'POST'
    const space = ' '
    const newLine = '\n'
    const url = `/sms/v2/services/${config.serviceId}/messages`

    // HMAC SHA256 서명 생성
    const message = method + space + url + newLine + timestamp + newLine + config.accessKey
    const signature = crypto
      .createHmac('sha256', config.secretKey)
      .update(message)
      .digest('base64')

    const response = await fetch(`https://sens.apigw.ntruss.com${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': config.accessKey,
        'x-ncp-apigw-signature-v2': signature,
      },
      body: JSON.stringify({
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: config.sender,
        content: content,
        messages: [
          {
            to: to.replace(/^0/, '82'), // 010 → 8210
          },
        ],
      }),
    })

    const result = await response.json()

    if (response.ok) {
      return true
    } else {
      console.error('SMS 발송 실패:', result)
      return false
    }
  } catch (error) {
    console.error('SMS 발송 오류:', error)
    return false
  }
}

export async function sendVerificationSMS(phone: string, code: string): Promise<boolean> {
  const content = `[한평생 유학] 인증번호는 [${code}]입니다. 5분 이내에 입력해주세요.`
  return sendSMS({ to: phone, content })
}
