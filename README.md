<h2  align="center">Shop</h2>
<p  align="center">A shop website where you're able to list items and have people buy them with PayPal and have the product emailed to them</p>

<br/>

## Installing

1. Clone this repo ```git clone https://github.com/tokyojack/Shop```
2. Run ```npm install``` for the packages
3. Go into ```/config/config.js``` and configure the SQL database and Paypal options.
4. Run ```node scripts/createDatabase.js``` in your console.
5. Launch the node server ```node index.js```
6. Check out it within your browser.

## Usage

When you first start it, you'll need to create a shop item. Go to the login panel and login with as "cat" for both the username
and password (can be changed in config). There, fill in the info required to add your item.

When your item is add, go to the shop and you are able to purchase the item. When the item is bought, you'll get emailed a download URL
of the item you just bought.

##

Now you've just install the program! This is the perfect program to start selling my "golden" hair so I can make millions. ```(ง'̀-'́)ง"``` 
