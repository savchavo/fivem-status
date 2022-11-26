const { ActivityType } = require("discord.js")
const fivereborn = require("fivereborn-query")
const config = require("../config.js")

module.exports = {
	name: 'ready',
	once: true,
	execute: async(client) => {
	 function activity(){
        setTimeout(() => {
fivereborn.query(`${config.serverip}`, config.serverport, (err, data) => {
                if (err) {
                 client.user.setActivity({name: `Server is offline`});
                } else {
                    client.user.setActivity({name: `${config.servername} (${data.clients}/${data.maxclients})`});
                }
            });
            activity();
        }, 3000);
    }
    activity()
}};
