const searchInput = document.getElementById("search");
const goButton = document.getElementById("go");
const mainEl = document.querySelector("main");

searchInput.addEventListener("keyup", (e) => {
	if (e.key == "Enter") getWord();
})
goButton.addEventListener("click", getWord);

async function getWord() { 
	let data;
	await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + searchInput.value)
		.then(async resp => {
			if (!resp.ok) {
				console.log("Response not OK. Status code: " + resp.status);
				return;
			} 
			await resp.json().then(json => {
				data = json;
			})
		})
	if (data === undefined) return;
	console.log(data);
	mainEl.innerText = "";
	for (word of data) {
		console.log(word);
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
}