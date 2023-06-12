const mainEl = document.getElementById("main");
let hist = localStorage.getItem("hist");
if (hist === null) {
	const p = document.createElement("p");
	p.innerText = "None, your history is empty."
	mainEl.appendChild(p);
} else {
	hist = hist.split(",");
	const ul = document.createElement("ul");
	for (word of hist) {
		const li = document.createElement("li");
		const a = document.createElement("a");
		a.href = "./index.html?w=" + word;
		a.innerText = word;
		li.appendChild(a);
		ul.appendChild(li);
	}
	mainEl.appendChild(ul)
}