var Discord = require('discord.js');
//var logger = require('winston');
var keep_alive = require('./keep_alive.js');
var config = require('./config.json');
const token = process.env.BOT_TOKEN;
const mysqlHost = process.env.mysql_Host;
const mysqlUser = process.env.mysql_User;
const mysqlPass = process.env.mysql_Pass;
const mysqlDB = process.env.mysql_DB;

var mysql = require('mysql');

var bot = new Discord.Client();
var db = mysql.createConnection({
	host: mysqlHost,
	user: mysqlUser,
	password: mysqlPass,
	database: mysqlDB,
	charset: 'utf8_unicode_ci'
});
bot.on('ready', () => {
	console.log('Discord Bot is starting on ' + config.version);
});

bot.on('message', message => {
	if (message.channel.type != 'text') return;
	if (message.content === '~getid') {
		message.author.send('Your ID: ' + message.member.id);
	}
	if (message.content === '出來吧!!直葉') {
		message.channel.send(
			'您好!!我是直葉，負責管理簽到\n\n還沒註冊的話, 請輸入 `建立用戶` \n查看貨幣數量輸入 `星爆糖檢查`\n要簽到請打 `簽到`\n每日簽到可獲得10星爆糖\n\n200星爆糖每季可購買隱藏房間通行證\n如要購買通行證請輸入`購買通行證`'
		);
	}
	if (message.content === '出来吧!!直叶') {
		message.channel.send(
			'您好!!我是直叶，负责管理签到\n\n还没注册的话, 请输入 `建立用户` \n查看货币数量输入 `星爆糖检查`\n要签到请打 `签到`\n每日签到可获得10星爆糖\n\n200星爆糖每季可购买隐藏房间通行证\n如要购买通行证请输入`购买通行证`'
		);
	}
	if (message.content === '購買通行證') {
		var id = message.member.id;
		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] UpdateDB: ' + id + ' not create a account');
					message.reply('無記錄，輸入 `建立用戶` 以開始!');
					return false;
				} else {
					let PassRole = message.guild.roles.cache.find(
						x => x.id == '797411493141413898'
					);
					if (
						obj[0].day >= 20 &&
						!message.member.roles.cache.has(PassRole.id)
					) {
						db.query(
							"UPDATE discord SET day='" +
								(obj[0].day * 1 - 20) +
								"' WHERE dis_id='" +
								id +
								"'",
							[],
							function(err, rows) {
								message.member.roles.add('797411493141413898');
								console.log('[INFO] UpdateDB: ' + id + ' 成功購買了通行證');
								message.reply('成功購買通行證!');
								return false;
							}
						);
					} else {
						message.reply('你未達購買條件或你已經擁有通行證');
						return false;
					}
				}
			}
		);
	}
	if (message.content === '购买通行证') {
		var id = message.member.id;
		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] UpdateDB: ' + id + ' not create a account');
					message.reply('无记录，输入 `建立用户` 以开始!');
					return false;
				} else {
					let PassRole = message.guild.roles.cache.find(
						x => x.id == '797411493141413898'
					);
					if (
						obj[0].day >= 20 &&
						!message.member.roles.cache.has(PassRole.id)
					) {
						db.query(
							"UPDATE discord SET day='" +
								(obj[0].day * 1 - 20) +
								"' WHERE dis_id='" +
								id +
								"'",
							[],
							function(err, rows) {
								message.member.roles.add('797411493141413898');
								console.log('[INFO] UpdateDB: ' + id + ' 成功购买了通行证');
								message.reply('成功购买通行证!');
								return false;
							}
						);
					} else {
						message.reply('你未达购买条件或你已经拥有通行证');
						return false;
					}
				}
			}
		);
	}
	if (message.content === '星爆糖檢查') {
		var id = message.member.id;
		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] CheckDB: ' + id + ' not create a account');
					message.reply('無記錄，輸入 `建立用戶` 以開始!');
					return false;
				} else {
					console.log(
						'[INFO] CheckDB: ' +
							id +
							' check sign in day on ' +
							obj[0].day +
							' days, last sign in date: ' +
							obj[0].date
					);
					message.reply('擁有: ' + obj[0].day * 10 + ' 星爆糖!\n最後簽到日期: '+obj[0].date);
				}
			}
		);
	}
	if (message.content === '星爆糖检查') {
		var id = message.member.id;
		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] CheckDB: ' + id + ' not create a account');
					message.reply('无记录，输入 `建立用户` 以开始!');
					return false;
				} else {
					console.log(
						'[INFO] CheckDB: ' +
							id +
							' check sign in day on ' +
							obj[0].day +
							' days, last sign in date: ' +
							obj[0].date
					);
					message.reply('拥有: ' + obj[0].day * 10 + ' 星爆糖!\n最后签到日期: '+obj[0].date);
				}
			}
		);
	}
	if (message.content === '建立用戶') {
		var id = message.member.id;
		var name = message.member.user.tag;
		var date = new Date();
		var year = date.getFullYear();
		var month = ('0' + (date.getMonth() * 1 + 1)).substr(-2);
		var day = ('0' + (date.getDate() * 1 - 1)).substr(-2);
		var now = year + '-' + month + '-' + day;

		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] CheckDB: ' + id + ' not create a account');
					message.reply('成功建立!');
					db.query(
						"INSERT INTO discord VALUES(NULL,'" +
							id +
							"','0','" +
							now +
							"','" +
							name +
							"')"
					);
					return false;
				} else {
					console.log('[INFO] Success create at:' + id);
					message.reply('你已經註冊過了!');
				}
			}
		);
	}
	if (message.content === '建立用户') {
		var id = message.member.id;
		var name = message.member.user.tag;
		var date = new Date();
		var year = date.getFullYear();
		var month = ('0' + (date.getMonth() * 1 + 1)).substr(-2);
		var day = ('0' + (date.getDate() * 1 - 1)).substr(-2);
		var now = year + '-' + month + '-' + day;

		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] CheckDB: ' + id + ' not create a account');
					message.reply('成功建立!');
					db.query(
						"INSERT INTO discord VALUES(NULL,'" +
							id +
							"','0','" +
							now +
							"','" +
							name +
							"')"
					);
					return false;
				} else {
					console.log('[INFO] Success create at:' + id);
					message.reply('你已经注册过了!');
				}
			}
		);
	}
	if (message.content === '簽到') {
		var id = message.member.id;
		var date = new Date();
		var year = date.getFullYear();
		var month = ('0' + (date.getMonth() * 1 + 1)).substr(-2);
		var day = ('0' + date.getDate()).substr(-2);
		var now = year + '-' + month + '-' + day;
		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] UpdateDB: ' + id + ' not create a account');
					message.reply('無記錄，輸入 `建立用戶` 以開始!');
					return false;
				} else {
					if (obj[0].date == now) {
						console.log('[INFO] UpdateDB: ' + id + ' sign in failed');
						message.reply('今天你已經簽到過了!');
						return false;
					} else {
						db.query(
							"UPDATE discord SET day='" +
								(obj[0].day * 1 + 1) +
								"',date='" +
								now +
								"' WHERE dis_id='" +
								id +
								"'",
							[],
							function(err, rows) {
								console.log(
									'[INFO] UpdateDB: ' +
										id +
										' sign in ' +
										(obj[0].day * 1 + 1) +
										' days successfuly'
								);
								message.reply('簽到成功! 你獲得了`10`星爆糖');
								return false;
							}
						);
					}
				}
			}
		);
	}
		if (message.content === '签到') {
		var id = message.member.id;
		var date = new Date();
		var year = date.getFullYear();
		var month = ('0' + (date.getMonth() * 1 + 1)).substr(-2);
		var day = ('0' + date.getDate()).substr(-2);
		var now = year + '-' + month + '-' + day;
		db.query(
			"SELECT date,day FROM discord WHERE dis_id='" + id + "'",
			[],
			function(err, rows) {
				var obj = JSON.stringify(rows);
				var obj = JSON.parse(obj);
				if (obj[0] == null) {
					console.log('[INFO] UpdateDB: ' + id + ' not create a account');
					message.reply('无记录，输入 `建立用户` 以开始!');
					return false;
				} else {
					if (obj[0].date == now) {
						console.log('[INFO] UpdateDB: ' + id + ' sign in failed');
						message.reply('今天你已经签到过了!');
						return false;
					} else {
						db.query(
							"UPDATE discord SET day='" +
								(obj[0].day * 1 + 1) +
								"',date='" +
								now +
								"' WHERE dis_id='" +
								id +
								"'",
							[],
							function(err, rows) {
								console.log(
									'[INFO] UpdateDB: ' +
										id +
										' sign in ' +
										(obj[0].day * 1 + 1) +
										' days successfuly'
								);
								message.reply('签到成功! 你获得了`10`星爆糖');
								return false;
							}
						);
					}
				}
			}
		);
	}
});
bot.login(token);
