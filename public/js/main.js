const numberInput = document.getElementById("number");
const textInput = document.getElementById("msg");
const button = document.getElementById("button");
const alert = document.querySelector(".alert");
const response = document.querySelector(".response");

button.addEventListener("click", send, false);

const socket = io();
socket.on("smsStatus", (data) => {
	alert.classList.add("do-show");
	response.innerHTML = `<h5>Text message sent to: ${data.number}</h5>`;
});

function send() {
	const number = numberInput.value.replace(/\D/g, "");
	const text = textInput.value;

	fetch("/", {
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({ number: number, text: text }),
	})
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
}
