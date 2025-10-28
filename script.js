const path = document.getElementById("infinity");
const needle = document.getElementById("needle");
const svg = document.getElementById("tattoo-svg");
const progressLabel = document.getElementById("progress-label");

const length = path.getTotalLength();
path.style.setProperty("--pathLength", length);

let progress = 0;

const client = new tmi.Client({
  channels: ["ryaah"]
});
client.connect();

client.on('message', (channel, tags, message, self) => {
  if (self) return;
  const msg = message.trim().toLowerCase();

  if (msg === "!pain") painEffect();
  if (msg === "!draw" && (tags.mod || tags.badges?.broadcaster)) drawSegment();
  if (msg === "!resettattoo" && (tags.mod || tags.badges?.broadcaster)) resetTattoo();
});

function drawSegment() {
  if (progress < 20) {
    progress++;
    const newOffset = length - (length * (progress / 20));
    path.style.strokeDashoffset = newOffset;

    const point = path.getPointAtLength(length - newOffset);
    needle.setAttribute("cx", point.x);
    needle.setAttribute("cy", point.y);
    needle.setAttribute("opacity", 1);
    setTimeout(() => needle.setAttribute("opacity", 0), 700);

    progressLabel.textContent = `Tattoo Progress: ${progress} / 20`;
  }
}

function resetTattoo() {
  progress = 0;
  path.style.strokeDashoffset = length;
  needle.setAttribute("opacity", 0);
  progressLabel.textContent = `Tattoo Progress: 0 / 20`;
}

function painEffect() {
  svg.classList.add("shake");
  setTimeout(() => svg.classList.remove("shake"), 500);
}
