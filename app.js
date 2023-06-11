const searchInput = document.getElementById("search");
const goButton = document.getElementById("go");
const shareButton = document.getElementById("share");
const tagline = document.getElementById("tagline");

// get url parameters
const params = new URLSearchParams(document.location.search);
const wordParam = params.get("w");
console.log(wordParam)
if (wordParam != null) {
	searchInput.value = wordParam;
	getWord();
}

searchInput.addEventListener("keyup", (e) => {
	if (e.key == "Enter") getWord();
})
goButton.addEventListener("click", getWord);
shareButton.addEventListener("click", share);

async function getWord() { 
	searchInput.value = searchInput.value.trim();
	let data;
	await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + searchInput.value)
		.then(async resp => {
			if (!resp.ok) {
				console.log("Response not OK. Status code: " + resp.status);
				tagline.innerText = (resp.status === 404) ? "Entered word not found." : "Unknown error occurred. Status code: " + resp.status;
				return;
			} 
			await resp.json().then(json => {
				data = json;
				tagline.innerHTML = "<i>The bestest dictionary</i>";
			})
		})
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
				definitionItem.innerHTML = definition.definition + (definition.example?("<br><i>" +definition.example + "</i>"):"");
				definitionList.appendChild(definitionItem);
			}

			meaningDiv.appendChild(definitionList);
			wordDiv.appendChild(meaningDiv);
		}
		mainEl.appendChild(wordDiv);
	};

	// set url parameters to current word
	const url = new URL(location);
	url.searchParams.set("w", searchInput.value);
	history.pushState({}, "", url);
}

async function share() {
	if (navigator.share) {
		await navigator.share({
				title: "Stationaery",
				text: "The bestest dictionary",
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
