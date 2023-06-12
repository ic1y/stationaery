const searchInput = document.getElementById("search");
const goButton = document.getElementById("go");
const shareButton = document.getElementById("share");
const alertEl = document.getElementById("alertEl");
const printButton = document.getElementById("print")
// const starButton = document.getElementById("star");
let queryingWord, currentWord;

getParams();
searchInput.addEventListener("keyup", (e) => {
	if (e.key == "Enter") getWord();
})
goButton.addEventListener("click", getWord);
shareButton.addEventListener("click", share);
printButton.addEventListener("click", () => {
	window.print();
})

function getParams() {
	// get url parameters to find word
	const params = new URLSearchParams(document.location.search);
	const wordParam = params.get("w");
	// console.log(wordParam);
	if (wordParam != null) {
		searchInput.value = wordParam;
		getWord();
	}
}

async function getWord() {
	queryingWord = searchInput.value.trim();
	if (queryingWord === 0) return;
	let data;
	const startTime = Date.now();
	await fetch(
		"https://api.dictionaryapi.dev/api/v2/entries/en/" + queryingWord
	)
		.then(async (resp) => {
			if (!resp.ok) {
				alertEl.innerText =
					resp.status === 404
						? "Entered word '" + queryingWord + "' not found."
						: "Unknown status code: " + resp.status;
				return;
			}
			await resp.json().then((json) => {
				data = json;
				const timeElapsed = Date.now() - startTime;
				alertEl.innerText = "Word found in " + timeElapsed + " milliseconds!";
			});
		})
		.catch((err) => {
			alertEl.innerText = "Unknown error occurred. " + err;
		});
	
	currentWord = queryingWord;
	
	// set url parameters to current word
	const url = new URL(location);
	url.searchParams.set("w", queryingWord);
	window.history.pushState({}, "", url);

	// escape function if request failed
	if (data === undefined) return;
	console.log(data);
	const mainEl = document.querySelector("main");
	mainEl.innerText = "";
	for (word of data) {
		// console.log(word);
		const wordDiv = document.createElement("div");
		const wordName = document.createElement("h2");
		wordName.innerText = word.word;
		wordDiv.appendChild(wordName);

		if (word.phonetic) {
			const phonetic = document.createElement("span");
			phonetic.innerText = word.phonetic;
			wordDiv.appendChild(phonetic);
		}

		for (meaning of word.meanings) {
			const meaningDiv = document.createElement("div");
			const partOfSpeech = document.createElement("h3");
			partOfSpeech.innerText = meaning.partOfSpeech;
			meaningDiv.appendChild(partOfSpeech);

			const definitionList = document.createElement("ol");
			for (definition of meaning.definitions) {
				const definitionItem = document.createElement("li");
				definitionItem.innerHTML =
					definition.definition +
					(definition.example ? "<br><i>" + definition.example + "</i>" : "");
				definitionList.appendChild(definitionItem);
			}

			meaningDiv.appendChild(definitionList);
			wordDiv.appendChild(meaningDiv);
		}
		mainEl.appendChild(wordDiv);
	}

	let hist = localStorage.getItem("hist");
	if (hist === null) {
		localStorage.setItem("hist", queryingWord);
	} else {
		hist = hist.split(",");
		if (hist.includes(queryingWord)) {
			hist.splice(hist.indexOf(queryingWord), 1);
		}
		hist.unshift(queryingWord);
		localStorage.setItem("hist", hist.join(","));
	}
}

async function share() {
	if (navigator.share) {
		await navigator.share({
				title: "Stationaery",
				// text: "The bestest dictionary", 
				url: location.href,
			})
			.then(() => {
				console.log("Data successfully shared via navigator.share!");
			})
			.catch((err) => {
				console.log("Unable to share data using navigator.share: " + err);
			});
	} else {
		navigator.clipboard.writeText(location.href)
			.then(() => {
				console.log(
					"Data successfully shared via navigator.clipboard.writeText!"
				);
				alert("The URL of this page has been copied to your clipboard.")
			})
			.catch((err) => {
				console.log(
					"Unable to share data using navigator.clipboard.writeText: " + err
				);
			});
	}
}