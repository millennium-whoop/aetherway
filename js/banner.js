<script>
const banner = document.getElementById("dynamic-banner");
const source = document.getElementById("banner-source");

// only allow textual elements
const items = Array.from(
  source.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6")
);

let index = 0;

function showLine() {
  banner.textContent = items[index].textContent;
  index = (index + 1) % items.length;
}

showLine();
setInterval(showLine, 3000);
</script>
