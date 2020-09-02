const express = require("express");
const user = require("../models/user");
const check = require("../middlewares/middleware");
const router = new express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
	console.log(req.body, "eded");
	try {
		var post = req.body;
		const phone = post.phone;
		const tup = await user.findOne({ phone: phone });
		console.log(tup.userName, post.password);
		req.session.user_id = tup._id;
		const ismatch = await bcrypt.compare(post.password, tup.password);
		console.log("ismatch: ", ismatch);

		//Token Sending
		const token = jwt.sign({ _id: tup._id.toString() }, "aSecretKey");
		console.log(token);
		if (ismatch) {
			// res.send({tup,token})
			res.status(200).json({ tup, token });
		} else {
			// res.send('Bad user/pass')
			res.status(404).json({ message: "Bad user/pass" });
		}
	} catch (err) {
		res.status(404).json({ message: "Bad user/pass" });
	}
});

router.get("/showUser", check, async (req, res) => {
	// res.send(req.session.user_id)
	res.status(200).json({ user_id: req.session.user_id, testk: req.body });
});

// logout route:

router.get("/logout", async (req, res) => {
	delete req.session.user_id;
	// res.send("Logout Sucessfull");
	res.status(200).json({ message: "Logout Success" });
});

// Register Users

router.post("/register", async (req, res) => {
	try {
		var post = req.body;
		const phone = post.phone;
		tup = await user.findOne({ phone: phone });
		if (tup.password)
			// res.send("User Exists")
			res.status(404).json({ message: "User Exists" });
	} catch (err) {
		req.body.password = await bcrypt.hash(req.body.password, 8);

		const itm = new user(req.body);
		await itm.save();
		const token = jwt.sign({ _id: itm._id.toString() }, "aSecretKey");
		// res.status(200)
		// res.send("200")
		res.status(200).json({
			message: "Successfully registered",
			user: itm,
			token: token,
		});
	}
});

module.exports = router;
