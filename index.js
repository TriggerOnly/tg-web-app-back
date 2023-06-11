const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const token = '6020412775:AAFGAbKBBZXDll7Q9E5FJD3iAgJpwYz-Kt0';
const webAppUrl = 'https://main--stately-pothos-4e2a61.netlify.app';
const bot = new TelegramBot(token, { polling: true });
const app = express()

app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполните форму', {
      reply_markup: {  
        keyboard: [
          [{ text: 'Заполнить форму', web_app: {url: 'https://main--stately-pothos-4e2a61.netlify.app/form'} }]
        ],
        resize_keyboard: true 
      }
    })

    await bot.sendMessage(chatId, 'Кнопка ниже', {
      reply_markup: {
        inline_keyboard: [
          [{text: "сделать заказ", web_app: {url: webAppUrl}}]
        ]
      }
    })
  }

  if(msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
    
      await bot.sendMessage(chatId, "Спасибо за обратную связь")
      await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country)
      console.log(data);

      setTimeout(async () => {
        await bot.sendMessage(chatId, 'Ваш')
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});

app.post('/web-data', async (req, res) => {
  const {queryId, products, totalPrice} = req.body
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'успешная покупка',
      input_message_content: {message_text: 'Поздравляю с покупкой, вы приобрели на сумму: ' + totalPrice }
    })
    return res.status(200).json({}) 
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'неудалось преобрести товар',
      input_message_content: {message_text: 'неудалось преобрести товар'}
    })
    return res.status(500).json({})
  }
})

const PORT = 8000
app.listen(PORT, () => {
  console.log('server started');
})
//6020412775:AAFGAbKBBZXDll7Q9E5FJD3iAgJpwYz-Kt0


