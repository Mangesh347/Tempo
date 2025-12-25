// (() => {
//   if (window.__tempoInjected) return;
//   window.__tempoInjected = true;

//   let badge = null;
//   let speed = 1;
//   let enabled = false;
//   let popup = false;
//   let lastVideo = null;

//   const defaultNormalPos = { left: 10, top: 10 };
//   const defaultFullPos = { left: 10, top: 10 };
//   let posNormal = { ...defaultNormalPos };
//   let posFull = { ...defaultFullPos };

//   const isFull = () => !!document.fullscreenElement;

//   function getVideo() {
//     return [...document.querySelectorAll('video')].find(v => v.videoWidth > 0 && v.videoHeight > 0);
//   }

//   function videoKey() {
//     return `tempo_${location.hostname}`;
//   }

//   function apply(v) {
//     const video = getVideo();
//     if (video) video.playbackRate = enabled ? v : 1;
//   }

//   function updateText() {
//     if (badge) badge.textContent = enabled ? `${speed}x` : 'OFF';
//   }

//   function showBadge() {
//     if (!badge) return;
//     badge.style.opacity = '1';
//   }

//   function positionBadge() {
//     const video = getVideo();
//     if (!video || !badge) return;

//     const rect = video.getBoundingClientRect();
//     const p = isFull() ? posFull : posNormal;

//     badge.style.position = 'absolute';
//     badge.style.left = rect.left + p.left + 'px';
//     badge.style.top = rect.top + p.top + 'px';
//   }

//   function removeBadge() {
//     if (badge) {
//       badge.remove();
//       badge = null;
//     }
//   }

//   function createBadge() {
//     const video = getVideo();
//     if (!video || badge || !popup) return;

//     const key = videoKey();
//     chrome.storage.local.get([key], d => {
//       const site = d[key] || {};
//       posNormal = site.posNormal || { ...defaultNormalPos };
//       posFull = site.posFull || { ...defaultFullPos };
//       enabled = site.enabled === true;

//       apply(speed);

//       badge = document.createElement('div');
//       badge.style.cssText = `
//         padding: 8px 14px;
//         background: #111;
//         color: #ff4d4d;
//         border-radius: 16px;
//         font-size: 14px;
//         font-weight: 600;
//         cursor: pointer;
//         z-index: 999999;
//         user-select: none;
//         opacity: 0;
//         transition: opacity 0.25s ease;
//       `;

//       updateText();
//       positionBadge();

//       // ✅ ON/OFF TOGGLE
//       badge.onclick = () => {
//         enabled = !enabled;
//         apply(speed);
//         updateText();
//         showBadge();

//         // save per-site
//         chrome.storage.local.get([key], d => {
//           const s = d[key] || {};
//           s.enabled = enabled;
//           chrome.storage.local.set({ [key]: s });
//         });
//       };

//       document.body.appendChild(badge);
//       showBadge();
//     });
//   }

//   // INITIAL LOAD
//   chrome.storage.local.get(['speed', 'popup'], d => {
//     speed = d.speed || 1;
//     popup = d.popup === true;
//     if (popup) createBadge();
//   });

//   // REAL-TIME STORAGE SYNC
//   chrome.storage.onChanged.addListener(changes => {
//     if (changes.speed) {
//       speed = changes.speed.newValue;
//       apply(speed);
//       updateText();
//       showBadge();
//     }

//     if (changes.popup) {
//       popup = changes.popup.newValue;
//       popup ? createBadge() : removeBadge();
//     }

//     if (changes[videoKey()]) {
//       enabled = changes[videoKey()].newValue?.enabled === true;
//       apply(speed);
//       updateText();
//       showBadge();
//     }
//   });

//   // SPA / VIDEO SWITCH DETECTION
//   const observer = new MutationObserver(() => {
//     const video = getVideo();
//     if (!video) return;

//     if (video !== lastVideo) {
//       lastVideo = video;
//       removeBadge();
//       if (popup) createBadge();
//     }

//     if (badge) positionBadge();
//   });

//   observer.observe(document.body, { childList: true, subtree: true });

//   document.addEventListener('fullscreenchange', () => {
//     if (badge) positionBadge();
//   });
// })();

// ===============================================================================

// (() => {
//   if (window.__tempoInjected) return;
//   window.__tempoInjected = true;

//   let badge = null;
//   let speed = 1;
//   let enabled = false;
//   let popup = false;
//   let lastVideo = null;

//   const defaultNormalPos = { left: 10, top: 10 };
//   const defaultFullPos = { left: 10, top: 10 };
//   let posNormal = { ...defaultNormalPos };
//   let posFull = { ...defaultFullPos };

//   let hideTimer = null;

//   const isFull = () => !!document.fullscreenElement;

//   function getVideo() {
//     return [...document.querySelectorAll('video')].find(v => v.videoWidth > 0 && v.videoHeight > 0);
//   }

//   function videoKey() {
//     return `tempo_${location.hostname}`;
//   }

//   function apply(v) {
//     const video = getVideo();
//     if (video) video.playbackRate = enabled ? v : 1;
//   }

//   function updateText() {
//     if (badge) badge.textContent = enabled ? `${speed}x` : 'OFF';
//   }

//   function showBadge() {
//     if (!badge) return;
//     badge.style.opacity = '1';
//     clearTimeout(hideTimer);
//     hideTimer = setTimeout(() => {
//       if (badge) badge.style.opacity = '0';
//     }, 2000);
//   }

//   function positionBadge() {
//     const video = getVideo();
//     if (!video || !badge) return;

//     const rect = video.getBoundingClientRect();
//     const p = isFull() ? posFull : posNormal;

//     badge.style.position = 'absolute';
//     badge.style.left = rect.left + p.left + 'px';
//     badge.style.top = rect.top + p.top + 'px';
//   }

//   function removeBadge() {
//     if (badge) {
//       badge.remove();
//       badge = null;
//     }
//   }

//   function createBadge() {
//     const video = getVideo();
//     if (!video || badge || !popup) return;

//     const key = videoKey();
//     chrome.storage.local.get([key], d => {
//       const site = d[key] || {};
//       posNormal = site.posNormal || { ...defaultNormalPos };
//       posFull = site.posFull || { ...defaultFullPos };
//       enabled = site.enabled === true;

//       apply(speed);

//       badge = document.createElement('div');
//       badge.style.cssText = `
//         padding: 8px 14px;
//         background: #111;
//         color: #ff4d4d;
//         border-radius: 16px;
//         font-size: 14px;
//         font-weight: 600;
//         cursor: pointer;
//         z-index: 999999;
//         user-select: none;
//         opacity: 0;
//         transition: opacity 0.3s ease;
//       `;

//       updateText();
//       positionBadge();
//       showBadge();

//       // ON/OFF TOGGLE
//       badge.onclick = () => {
//         enabled = !enabled;
//         apply(speed);
//         updateText();

//         chrome.storage.local.get([key], d => {
//           const s = d[key] || {};
//           s.enabled = enabled;
//           chrome.storage.local.set({ [key]: s });
//         });

//         showBadge();
//       };

//       document.body.appendChild(badge);
//     });
//   }

//   // INITIAL LOAD
//   chrome.storage.local.get(['speed', 'popup'], d => {
//     speed = d.speed || 1;
//     popup = d.popup === true;
//     if (popup) createBadge();
//   });

//   // REAL-TIME STORAGE SYNC
//   chrome.storage.onChanged.addListener(changes => {
//     if (changes.speed) {
//       speed = changes.speed.newValue;
//       apply(speed);
//       updateText();
//       showBadge();
//     }

//     if (changes.popup) {
//       popup = changes.popup.newValue;
//       popup ? createBadge() : removeBadge();
//     }

//     if (changes[videoKey()]) {
//       enabled = changes[videoKey()].newValue?.enabled === true;
//       apply(speed);
//       updateText();
//       showBadge();
//     }
//   });

//   // SPA / VIDEO SWITCH DETECTION
//   const observer = new MutationObserver(() => {
//     const video = getVideo();
//     if (!video) return;

//     if (video !== lastVideo) {
//       lastVideo = video;
//       removeBadge();
//       if (popup) createBadge();
//     }

//     if (badge) positionBadge();
//   });

//   observer.observe(document.body, { childList: true, subtree: true });

//   document.addEventListener('fullscreenchange', () => {
//     if (badge) positionBadge();
//   });

//   // MOUSE MOVE DETECT
//   let mouseTimer;
//   document.addEventListener('mousemove', () => {
//     if (badge) badge.style.opacity = '1';
//     clearTimeout(mouseTimer);
//     mouseTimer = setTimeout(() => {
//       if (badge) badge.style.opacity = '0';
//     }, 1500);
//   });
// })();
(() => {
  if (window.__tempoInjected) return;
  window.__tempoInjected = true;

  let badge = null;
  let speed = 1;
  let enabled = false;
  let popup = false;
  let lastVideo = null;

  const defaultNormalPos = { left: 10, top: 10 };
  const defaultFullPos = { left: 10, top: 10 };
  let posNormal = { ...defaultNormalPos };
  let posFull = { ...defaultFullPos };

  let hideTimer = null;
  let mouseTimer = null;

  const isFull = () => !!document.fullscreenElement;

  function getVideo() {
    // Select visible HTML5 video elements with size > 0
    return [...document.querySelectorAll('video')]
      .filter(v => v.videoWidth > 0 && v.videoHeight > 0)[0];
  }

  function videoKey() {
    return `tempo_${location.hostname}`;
  }

  function apply(v) {
    const video = getVideo();
    if (video) video.playbackRate = enabled ? v : 1;
  }

  function updateText(animated = true) {
    if (!badge) return;
    if (animated) {
      // Smooth number transition
      const current = parseFloat(badge.textContent.replace('x','')) || 0;
      const target = enabled ? speed : 0;
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start)/200, 1); // 200ms animation
        const value = current + (target - current) * progress;
        badge.textContent = enabled ? value.toFixed(2) + 'x' : 'OFF';
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    } else {
      badge.textContent = enabled ? speed.toFixed(2) + 'x' : 'OFF';
    }
  }

  function showBadge() {
    if (!badge) return;
    badge.style.opacity = '1';
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { badge.style.opacity = '0'; }, 2000);
  }

  function positionBadge() {
    const video = getVideo();
    if (!video || !badge) return;

    const rect = video.getBoundingClientRect();
    const p = isFull() ? posFull : posNormal;

    badge.style.position = 'absolute';
    badge.style.left = rect.left + p.left + 'px';
    badge.style.top = rect.top + p.top + 'px';
  }

  function removeBadge() {
    if (badge) {
      badge.remove();
      badge = null;
    }
  }

  function createBadge() {
    const video = getVideo();
    if (!video || badge || !popup) return;

    const key = videoKey();
    chrome.storage.local.get([key], d => {
      const site = d[key] || {};
      posNormal = site.posNormal || { ...defaultNormalPos };
      posFull = site.posFull || { ...defaultFullPos };
      enabled = site.enabled === true;

      apply(speed);

      badge = document.createElement('div');
      badge.style.cssText = `
        padding: 8px 14px;
        background: #111;
        color: #ff4d4d;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 999999;
        user-select: none;
        opacity: 0;
        transition: opacity 0.3s ease, left 0.2s ease, top 0.2s ease;
      `;

      updateText(false);
      positionBadge();
      showBadge();

      badge.onclick = () => {
        enabled = !enabled;
        apply(speed);
        updateText();
        chrome.storage.local.get([key], d => {
          const s = d[key] || {};
          s.enabled = enabled;
          chrome.storage.local.set({ [key]: s });
        });
        showBadge();
      };

      document.body.appendChild(badge);
    });
  }

  // INITIAL LOAD
  chrome.storage.local.get(['speed', 'popup'], d => {
    speed = d.speed || 1;
    popup = d.popup === true;
    if (popup) createBadge();
  });

  // REAL-TIME STORAGE SYNC
  chrome.storage.onChanged.addListener(changes => {
    if (changes.speed) {
      speed = changes.speed.newValue;
      apply(speed);
      updateText();
      showBadge();
    }
    if (changes.popup) {
      popup = changes.popup.newValue;
      popup ? createBadge() : removeBadge();
    }
    if (changes[videoKey()]) {
      enabled = changes[videoKey()].newValue?.enabled === true;
      apply(speed);
      updateText();
      showBadge();
    }
  });

  // SPA / VIDEO SWITCH DETECTION
  const observer = new MutationObserver(() => {
    const video = getVideo();
    if (!video) return;

    if (video !== lastVideo) {
      lastVideo = video;
      removeBadge();
      if (popup) createBadge();
    }

    if (badge) positionBadge();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // FULLSCREEN CHANGE
  document.addEventListener('fullscreenchange', () => {
    if (badge) positionBadge();
  });

  // MOUSE MOVE FADE
  document.addEventListener('mousemove', () => {
    if (badge) badge.style.opacity = '1';
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => { if (badge) badge.style.opacity = '0'; }, 1500);
  });
})();
