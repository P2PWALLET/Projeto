const Telegraf = require('telegraf');
const bot = new Telegraf('5757748016:AAGBo1y4eNipedPatNRE0Jl9tlmX0q_Jvzs');
const Markup = require('telegraf/markup');
const affiliates = {};

bot.start((ctx) => {
    const chatId = ctx.from.id;
    const firstName = ctx.from.first_name;
    const lastName = ctx.from.last_name;
    if (!affiliates[chatId]) {
        affiliates[chatId] = {
            firstName,
            lastName,
            referrals: [],
            level: 0,
            bonus: 0
        };
    }
    ctx.reply(`🤗 Olá ${firstName} ${lastName}, seja bem-vindo ao nosso programa de afiliados!`,
    Markup.inlineKeyboard([
        Markup.callbackButton('📝 Registrar-se', 'register'),
        Markup.callbackButton('💰 Ver bônus', 'bonus'),
        Markup.callbackButton('💼 Ver afiliados', 'affiliates')
    ]).extra());
});

bot.action('register', (ctx) => {
    const chatId = ctx.from.id;
    const firstName = ctx.from.first_name;
    const lastName = ctx.from.last_name;
    const referralId = ctx.callbackQuery.data.split(" ")[1];

    if (!affiliates[chatId]) {
        if (affiliates[referralId]) {
            affiliates[chatId] = {
                firstName,
                lastName,
                referrals: [],
                level: 1,
                bonus: 0
            };
            affiliates[referralId].referrals.push(chatId);
            affiliates[referralId].bonus += 10;
            ctx.reply(`✅ ${firstName} ${lastName} foi registrado com sucesso como afiliado nível 1 e adicionado a rede de ${affiliates[referralId].firstName} ${affiliates[referralId].lastName}`);
        } else {
            ctx.reply("🚫 Id de referência inválido");
        }
    } else {
        ctx.reply("🚫 Você já é afiliado");
    }
});

bot.action('bonus', (ctx) => {
    const chatId = ctx.from.id;
    if (affiliates[chatId]) {
        let message = `💰 Seu bônus é de ${affiliates[chatId].bonus}`;
        ctx.reply(message);
    } else {
        ctx.reply("🚫 Você não é afiliado");
    }
});

bot.action('affiliates', (ctx) => {
    const chatId = ctx.from.id;
        if (affiliates[chatId]) {
        let message = `💼 Informações do afiliado:\n\n`;
        message += `Nome: ${affiliates[chatId].firstName} ${affiliates[chatId].lastName}\n`;
        message += `Nível: ${affiliates[chatId].level}\n`;
        message += `Referências: \n`;

        for (let referral of affiliates[chatId].referrals) {
            message += `- ${affiliates[referral].firstName} ${affiliates[referral].lastName}\n`;
        }

        ctx.reply(message);
    } else {
        ctx.reply("🚫 Você não é afiliado");
    }
});

bot.launch();
