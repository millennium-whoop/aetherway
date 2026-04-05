const input = document.getElementById('fakeSearch');
// Change this to whatever you want the "reveal" to be
const hiddenPhrase = "Actually, I control everything you type here.";

input.addEventListener('input', (e) => {
  const currentLength = input.value.length;
  
  // If the user deletes text, we let the length shrink
  // If they type, we replace the entire value with a substring of our phrase
  if (currentLength <= hiddenPhrase.length) {
    input.value = hiddenPhrase.substring(0, currentLength);
  } else {
    // If they keep typing past the phrase, we can just stop adding letters
    input.value = hiddenPhrase;
  }
});
