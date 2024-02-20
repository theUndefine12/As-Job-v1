import fetch from "node-fetch"
import prisma from "../db/prisma.js"



const authenticate = async () => {
  try {
    const email = process.env.ESKIZ_EMAIL
    const password = process.env.ESKIZ_PASSWORD

    const res = await fetch('https://my.eskiz.uz/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (!res.ok) {
      throw new Error(`Authentication failed. Status: ${res.status}, Message: ${await res.text()}`)
    }

    const data = await res.json()
    return data
  } catch (error) {
    throw new Error(`Error during authentication: ${error.message}`)
  }
}

const refreshAccessToken = async (refreshToken) => {
  try {
    const res = await fetch('https://my.eskiz.uz/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })

    if (!res.ok) {
      throw new Error(`Token refresh failed. Status: ${res.status}, Message: ${await res.text()}`)
    }

    const data = await res.json()
    return data.access_token
  } catch (error) {
    throw new Error(`Error during token refresh: ${error.message}`)
  }
}


const authenticationData = await authenticate();
export const datas  = authenticationData.access_token

export const sendSMS = async (token, phoneNumber) => {
  try {
    const num = Math.floor(1000 + Math.random() * 9000);
    const url = await fetch('https://my.eskiz.uz/api/send-sms/single', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.ESKIZ_CLIENT,
        count: 1,
        nik_id: '4546',
        phone: phoneNumber,
        sending: 'server1',
        text: 'Code' + ' ' + num,
      }),
    })

    if (!url.ok) {
      throw new Error(`SMS sending failed. Status: ${url.status}, Message: ${await url.text()}`);
    }

    const isNum = num.toString()
    const eskiz = await prisma.otp.create({
        data: {
            phone: phoneNumber,
            code: isNum
        }
    })

    const datas = await url.json();
    console.log(datas, eskiz)
  } catch (error) {
    throw new Error(`Error during SMS sending: ${error.message}`);
  }
};

export const main = async (phoneNumber) => {
  try {
    const authenticationData = await authenticate();
    console.log("Authentication successful:", authenticationData);

    const refreshToken = authenticationData.refresh_token;
    let accessToken = authenticationData.access_token;
    const smsResponse = await sendSMS(accessToken, phoneNumber);
    console.log("SMS sent successfully:", smsResponse);
  } catch (error) {
    console.error(error.message);
  }
}


