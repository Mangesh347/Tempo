
// const input = document.getElementById('speed');
// const plus = document.getElementById('plus');
// const minus = document.getElementById('minus');
// const saveBtn = document.getElementById('save');
// const toggle = document.getElementById('toggle');

// /* ================= LOAD ================= */

// chrome.storage.local.get(['speed', 'enabled'], data => {
//   if (data.speed !== undefined) input.value = (+data.speed).toFixed(2);
//   if (data.enabled === true) toggle.classList.add('on');
// });

// /* ================= HELPERS ================= */

// function clamp(v) {
//   return Math.min(16, Math.max(0.25, v));
// }

// function snapStep(v) {
//   return Math.round(v / 0.25) * 0.25;
// }

// /* ================= PREMIUM FIXED STEP ANIMATION ================= */

// let raf = null;

// function animateValue(from, to) {
//   cancelAnimationFrame(raf);

//   const duration = 260;
//   const start = performance.now();

//   function easeOutCubic(t) {
//     return 1 - Math.pow(1 - t, 3);
//   }

//   function frame(now) {
//     const p = Math.min((now - start) / duration, 1);
//     const eased = easeOutCubic(p);
//     const value = from + (to - from) * eased;

//     input.value = value.toFixed(2);

//     if (p < 1) raf = requestAnimationFrame(frame);
//   }

//   raf = requestAnimationFrame(frame);
// }

// /* ================= + / - BUTTONS ================= */

// plus.onclick = () => {
//   const oldVal = snapStep(+input.value);
//   const newVal = clamp(oldVal + 0.25);
//   animateValue(oldVal, newVal);
// };

// minus.onclick = () => {
//   const oldVal = snapStep(+input.value);
//   const newVal = clamp(oldVal - 0.25);
//   animateValue(oldVal, newVal);
// };

// /* ================= MOUSE WHEEL ================= */

// input.addEventListener('wheel', e => {
//   e.preventDefault();

//   const oldVal = snapStep(+input.value);
//   const step = e.deltaY < 0 ? 0.25 : -0.25;
//   const newVal = clamp(oldVal + step);

//   animateValue(oldVal, newVal);
// });

// /* ================= MANUAL INPUT SNAP ================= */

// input.addEventListener('blur', () => {
//   const v = snapStep(+input.value || 1);
//   animateValue(+input.value, clamp(v));
// });

// /* ================= SAVE ================= */

// saveBtn.onclick = () => {
//   chrome.storage.local.set({
//     speed: +input.value,
//     enabled: toggle.classList.contains('on')
//   });

//   saveBtn.innerText = 'Saved';
//   setTimeout(() => saveBtn.innerText = 'Save', 700);
// };

// /* ================= TOGGLE ================= */

// toggle.onclick = () => {
//   toggle.classList.toggle('on');
//   chrome.storage.local.set({
//     enabled: toggle.classList.contains('on')
//   });
// };

// /* ================= TYPING EFFECT ================= */

// const typingNote = document.getElementById('typingNote');
// const text = typingNote.innerText;
// typingNote.innerText = '';
// let i = 0;

// (function type() {
//   if (i < text.length) {
//     typingNote.innerText += text[i++];
//     setTimeout(type, 30);
//   }
// })();
const input = document.getElementById('speed');
const plus = document.getElementById('plus');
const minus = document.getElementById('minus');
const saveBtn = document.getElementById('save');
const toggle = document.getElementById('toggle');

/* ================= RELOAD NOTE ================= */

const reloadNote = document.createElement('div');
reloadNote.innerText = 'Reload page after saving';
reloadNote.style.cssText = `
  font-size: 12px;
  color: #ff4d4d;
  margin-top: 6px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  font-weight: 600;
`;
saveBtn.after(reloadNote);

/* ================= LOAD ================= */

chrome.storage.local.get(['speed', 'enabled'], data => {
  if (data.speed !== undefined) input.value = (+data.speed).toFixed(2);
  if (data.enabled === true) toggle.classList.add('on');
});

/* ================= HELPERS ================= */

function clamp(v) {
  return Math.min(16, Math.max(0.25, v));
}

function snapStep(v) {
  return Math.round(v / 0.25) * 0.25;
}

/* ================= PREMIUM ANIMATION ================= */

let raf = null;

function animateValue(from, to) {
  cancelAnimationFrame(raf);

  const duration = 260;
  const start = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = easeOutCubic(p);
    const value = from + (to - from) * eased;
    input.value = value.toFixed(2);

    if (p < 1) raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
}

/* ================= + / - ================= */

plus.onclick = () => {
  const oldVal = snapStep(+input.value);
  animateValue(oldVal, clamp(oldVal + 0.25));
};

minus.onclick = () => {
  const oldVal = snapStep(+input.value);
  animateValue(oldVal, clamp(oldVal - 0.25));
};

/* ================= MOUSE WHEEL ================= */

input.addEventListener('wheel', e => {
  e.preventDefault();
  const oldVal = snapStep(+input.value);
  const step = e.deltaY < 0 ? 0.25 : -0.25;
  animateValue(oldVal, clamp(oldVal + step));
});

/* ================= MANUAL INPUT ================= */

input.addEventListener('blur', () => {
  const v = snapStep(+input.value || 1);
  animateValue(+input.value, clamp(v));
});

/* ================= SAVE ================= */

saveBtn.onclick = () => {
  chrome.storage.local.set({
    speed: +input.value,
    enabled: toggle.classList.contains('on')
  });

  saveBtn.innerText = 'Saved';
  reloadNote.style.opacity = 1;

  setTimeout(() => {
    saveBtn.innerText = 'Save';
    reloadNote.style.opacity = 0;
  }, 2000);
};

/* ================= TOGGLE ================= */

toggle.onclick = () => {
  toggle.classList.toggle('on');
  chrome.storage.local.set({
    enabled: toggle.classList.contains('on')
  });
};

/* ================= TYPING EFFECT ================= */

const typingNote = document.getElementById('typingNote');
const text = typingNote.innerText;
typingNote.innerText = '';
let i = 0;

(function type() {
  if (i < text.length) {
    typingNote.innerText += text[i++];
    setTimeout(type, 30);
  }
})();
