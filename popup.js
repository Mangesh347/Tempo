const input = document.getElementById('speed');
const plus = document.getElementById('plus');
const minus = document.getElementById('minus');
const saveBtn = document.getElementById('save');
const toggle = document.getElementById('toggle');

/* LOAD */
chrome.storage.local.get(['speed', 'popup'], d => {
  if (d.speed) input.value = (+d.speed).toFixed(2);
  if (d.popup) toggle.classList.add('on');
});

/* HELPERS */
const clamp = v => Math.min(16, Math.max(0.25, v));
const snap = v => Math.round(v / 0.25) * 0.25;

/* REAL-TIME SPEED CHANGE */
function updateSpeed(v) {
  const speed = clamp(snap(v));
  input.value = speed.toFixed(2);
  chrome.storage.local.set({ speed });
}

/* + / - */
plus.onclick = () => updateSpeed(+input.value + 0.25);
minus.onclick = () => updateSpeed(+input.value - 0.25);

/* MOUSE WHEEL */
input.addEventListener('wheel', e => {
  e.preventDefault();
  updateSpeed(+input.value + (e.deltaY < 0 ? 0.25 : -0.25));
});

/* MANUAL */
input.addEventListener('blur', () => updateSpeed(+input.value || 1));

/* SAVE (visual only) */
saveBtn.onclick = () => {
  saveBtn.innerText = 'Saved';
  setTimeout(() => saveBtn.innerText = 'Save', 1200);
};

/* VIDEO POPUP TOGGLE (REAL-TIME) */
toggle.onclick = () => {
  toggle.classList.toggle('on');
  chrome.storage.local.set({ popup: toggle.classList.contains('on') });
};

/* TYPING EFFECT */
const note = document.getElementById('typingNote');
const txt = note.innerText;
note.innerText = '';
let i = 0;
(function type() {
  if (i < txt.length) {
    note.innerText += txt[i++];
    setTimeout(type, 28);
  }
})();
