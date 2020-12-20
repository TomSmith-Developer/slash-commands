const discord = require('discord.js');
const client = new discord.Client();

client.on('ready', () => {
    console.log('ready');
    client.user.setActivity(`BotSocket | botsocket.com`, ({ type: "WATCHING" }));

    client.api.applications(client.user.id).guilds('736170183118290944').commands.post({
        data: {
            name: "hello",
            description: "Replies with Hello World!"
        }
    });

    client.api.applications(client.user.id).guilds('736170183118290944').commands.post({
        data: {
            name: "echo",
            description: "Echos your text as an embed!",

            options: [
                {
                    name: "content",
                    description: "Content of the embed",
                    type: 3,
                    required: true
                }
            ]
        }
    });

    client.api.applications(client.user.id).guilds('736170183118290944').commands.post({
        data: {
            name: "say",
            description: "A say command for all your saying needs.",

            options: [
                {
                    name: "message",
                    description: "The message you want the bot to repeat.",
                    type: 3,
                    required: true
                }
            ]
        }
    });

    client.api.applications(client.user.id).guilds('736170183118290944').commands.post({
        data: {
            name: "botsocket",
            description: "Tells you of what BotSocket is."
        }
    });

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if(command == 'hello') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Hello World!"
                    }
                }
            });
        }

        if(command == "echo") {
            const description = args.find(arg => arg.name.toLowerCase() == "content").value;
            const embed = new discord.MessageEmbed()
                .setTitle("Echo!")
                .setDescription(description)
                .setAuthor(interaction.member.user.username);

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, embed)
                }
            });
        }

        if(command == "say") {
            const description = args.find(arg => arg.name.toLowerCase() == "message").value;
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: description
                    }
                }
            });
        }

        if(command == 'botsocket') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "BotSocket is a free bot hosting service, designed to get your own discord bot running in a few seconds for free and without any coding."
                    }
                }
            });
        }

    });
});

async function createAPIMessage(interaction, content) {
    const apiMessage = await discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
    
    return { ...apiMessage.data, files: apiMessage.files };
}

client.login(require('./config.json').token);
