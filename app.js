const express = require("express");
const ejs = require("ejs");
const Nexmo = require("nexmo");
const socketio = require("socket.io");
const env = require("./env/environment");

const nexmo = new Nexmo(env.keys);
const app = express();

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/", (req, res) => {
	res.send(req.body);
	const number = req.body.number;
	const text = req.body.text;

	nexmo.message.sendSms(
		env.phone,
		number,
		text,
		{ type: "unicode" },
		(err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.dir(res);
				const data = {
					id: res.messages[0]["message-id"],
					number: res.messages[0]["to"],
				};

				io.emit("smsStatus", data);
			}
		},
	);
});

const port = 3000;
const server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

const io = socketio(server);
io.on("connection", (socket) => {
	console.log("Connected");
	io.on("disconnect", () => {
		console.log("Disconnected");
	});
});
