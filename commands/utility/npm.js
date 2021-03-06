const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'npm',
    alias: [''],
    deskripsi: 'Menampilkan detail package',
    usage: 'npm <package>',

    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Message} message
     * @param {Array[]} args
     */
    run: async(client, message, args) => {
        if (!args[0]) return message.reply('Nama package/npm tidak boleh kosong');

        const runner = () => fetch(`https://registry.npmjs.org/${args[0]}`).then(res => res.json());
        const result = await runner();
        if (result.error) return message.channel.send(`Package \`${args[0]}\` Tidak ada`);

        const versionLatest = result['dist-tags'].latest;
        const latestVersionInfo = result.versions[versionLatest];
        const embed = new Discord.MessageEmbed()
            .setTitle(`**${result.name}**`)
            .setThumbnail('https://cdn.glitch.com/09ef47a6-526a-4167-b85e-7b1e8f538095%2Fae5aa9e8-d4c5-4a28-bb3f-52b19ce11521.image.png?v=1587989708517')
            .setURL(`https://www.npmjs.com/package/${result.name}`)
            .setColor('BLURPLE')
            .setDescription(latestVersionInfo.description)
            .addField('Author', latestVersionInfo.author.name)
            .addField('Repository',
                latestVersionInfo.repository.url.replace('git+', '').replace('.git', ''))
            .addField('License', latestVersionInfo.license)
            .addField('Keywords', latestVersionInfo.keywords.join(', '))
            .setFooter(`${message.author.tag}`,
                message.author.displayAvatarURL())
            .setTimestamp();

        return message.channel.send(embed);
    }
};
