
// (() => {
//   let badge = null;
//   let hideTimer = null;
//   let isDragging = false;
//   let offsetX = 0;
//   let offsetY = 0;

//   let savedSpeed = 1;
//   let speedEnabled = true;
//   let badgeEnabled = true;

//   let posNormal = { x: window.innerWidth - 90, y: 14 };
//   let posFullscreen = { x: window.innerWidth - 90, y: 60 };

//   let videoActive = false;
//   let observer;

// /* ================= SAFETY ================= */

//   function alive() {
//     return chrome?.runtime?.id;
//   }

// /* ================= VIDEO DETECTION (FIX) ================= */

//   function getActiveVideo() {
//     const videos = [...document.querySelectorAll('video')];
//     return videos.find(v =>
//       v.src &&
//       v.videoWidth > 0 &&
//       v.videoHeight > 0 &&
//       v.offsetParent !== null &&
//       !v.muted
//     );
//   }

// /* ================= HELPERS ================= */

//   function isFullscreen() {
//     return !!document.fullscreenElement;
//   }

//   function getPos() {
//     return isFullscreen() ? posFullscreen : posNormal;
//   }

//   function savePos(x, y) {
//     if (!alive()) return;

//     if (isFullscreen()) {
//       posFullscreen = { x, y };
//       chrome.storage.local.set({ badgePosFullscreen: posFullscreen });
//     } else {
//       posNormal = { x, y };
//       chrome.storage.local.set({ badgePosNormal: posNormal });
//     }
//   }

// /* ================= SPEED ================= */

//   function applySpeed(speed) {
//     document.querySelectorAll('video').forEach(v => {
//       v.playbackRate = speed;
//     });
//   }

// /* ================= BADGE ================= */

//   function removeBadge() {
//     if (badge) {
//       badge.remove();
//       badge = null;
//     }
//   }

//   function createBadge() {
//     if (badge || !badgeEnabled) return;

//     const pos = getPos();

//     badge = document.createElement('div');
//     badge.textContent = speedEnabled ? `${savedSpeed}x` : 'OFF';

//     badge.style.cssText = `
//       position: fixed;
//       top: ${pos.y}px;
//       left: ${pos.x}px;
//       padding: 8px 14px;
//       background: #111;
//       color: #ff4d4d;
//       border-radius: 14px;
//       font-size: 14px;
//       font-weight: 600;
//       cursor: pointer;
//       z-index: 999999;
//       user-select: none;
//       opacity: 0;
//       transition: opacity 0.25s ease;
//     `;

//     document.body.appendChild(badge);

//     badge.onclick = () => {
//       speedEnabled = !speedEnabled;
//       applySpeed(speedEnabled ? savedSpeed : 1);
//       updateBadge();
//     };

//     badge.onmousedown = e => {
//       isDragging = true;
//       offsetX = e.clientX - badge.offsetLeft;
//       offsetY = e.clientY - badge.offsetTop;
//       e.preventDefault();
//     };
//   }

//   function updateBadge() {
//     if (!badge) return;
//     badge.textContent = speedEnabled ? `${savedSpeed}x` : 'OFF';
//     badge.style.opacity = '1';
//   }

//   function showBadge() {
//     if (!badge) return;

//     badge.style.opacity = '1';
//     clearTimeout(hideTimer);

//     hideTimer = setTimeout(() => {
//       if (badge) badge.style.opacity = '0';
//     }, 1800);
//   }

// /* ================= DRAG ================= */

//   function onMouseMove(e) {
//     if (!isDragging || !badge) return;

//     const x = e.clientX - offsetX;
//     const y = e.clientY - offsetY;

//     badge.style.left = x + 'px';
//     badge.style.top = y + 'px';

//     savePos(x, y);
//   }

//   function onMouseUp() {
//     isDragging = false;
//   }

// /* ================= VIDEO CONTROL ================= */

//   function videoOn() {
//     if (videoActive) return;
//     videoActive = true;

//     applySpeed(savedSpeed);
//     createBadge();

//     document.addEventListener('mousemove', showBadge);
//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('mouseup', onMouseUp);
//   }

//   function videoOff() {
//     videoActive = false;
//     removeBadge();

//     document.removeEventListener('mousemove', showBadge);
//     window.removeEventListener('mousemove', onMouseMove);
//     window.removeEventListener('mouseup', onMouseUp);
//   }

// /* ================= FULLSCREEN CHANGE ================= */

//   document.addEventListener('fullscreenchange', () => {
//     if (!badge) return;
//     const pos = getPos();
//     badge.style.left = pos.x + 'px';
//     badge.style.top = pos.y + 'px';
//   });

// /* ================= INIT ================= */

//   if (!alive()) return;

//   chrome.storage.local.get(
//     ['speed', 'enabled', 'badgePosNormal', 'badgePosFullscreen'],
//     data => {
//       if (!alive()) return;

//       savedSpeed = +data.speed || 1;
//       badgeEnabled = data.enabled !== false;

//       if (data.badgePosNormal) posNormal = data.badgePosNormal;
//       if (data.badgePosFullscreen) posFullscreen = data.badgePosFullscreen;

//       observer = new MutationObserver(() => {
//         const video = getActiveVideo();
//         video ? videoOn() : videoOff();
//       });

//       observer.observe(document.body, { childList: true, subtree: true });
//     }
//   );
// })();
(() => {
  let badge = null;
  let hideTimer = null;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  let savedSpeed = 1;
  let speedEnabled = false; // Start as OFF
  let badgeEnabled = true;

  let posNormal = { x: window.innerWidth - 90, y: 14 };
  let posFullscreen = { x: window.innerWidth - 90, y: 60 };

  let videoActive = false;
  let observer;

/* ================= SAFETY ================= */

  function alive() {
    return chrome?.runtime?.id;
  }

/* ================= VIDEO DETECTION ================= */

  function getActiveVideo() {
    const videos = [...document.querySelectorAll('video')];
    return videos.find(v =>
      v.src &&
      v.videoWidth > 0 &&
      v.videoHeight > 0 &&
      v.offsetParent !== null
    );
  }

/* ================= HELPERS ================= */

  function isFullscreen() {
    return !!document.fullscreenElement;
  }

  function getPos() {
    return isFullscreen() ? posFullscreen : posNormal;
  }

  function savePos(x, y) {
    if (!alive()) return;

    if (isFullscreen()) {
      posFullscreen = { x, y };
      chrome.storage.local.set({ badgePosFullscreen: posFullscreen });
    } else {
      posNormal = { x, y };
      chrome.storage.local.set({ badgePosNormal: posNormal });
    }
  }

/* ================= SPEED ================= */

  function applySpeed(speed) {
    document.querySelectorAll('video').forEach(v => {
      v.playbackRate = speed;
    });
  }

/* ================= BADGE ================= */

  function removeBadge() {
    if (badge) {
      badge.remove();
      badge = null;
    }
  }

  function createBadge() {
    if (badge || !badgeEnabled) return;

    const pos = getPos();

    badge = document.createElement('div');
    badge.textContent = speedEnabled ? `${savedSpeed}x` : 'OFF';

    badge.style.cssText = `
      position: fixed;
      top: ${pos.y}px;
      left: ${pos.x}px;
      padding: 8px 14px;
      background: #111;
      color: #ff4d4d;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      z-index: 999999;
      user-select: none;
      opacity: 0;
      transition: opacity 0.25s ease;
    `;

    document.body.appendChild(badge);

    // Toggle speed only on click
    badge.onclick = () => {
      speedEnabled = !speedEnabled;
      applySpeed(speedEnabled ? savedSpeed : 1);
      updateBadge();
    };

    badge.onmousedown = e => {
      isDragging = true;
      offsetX = e.clientX - badge.offsetLeft;
      offsetY = e.clientY - badge.offsetTop;
      e.preventDefault();
    };
  }

  function updateBadge() {
    if (!badge) return;
    badge.textContent = speedEnabled ? `${savedSpeed}x` : 'OFF';
    badge.style.opacity = '1';
  }

  function showBadge() {
    if (!badge) return;

    badge.style.opacity = '1';
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
      if (badge) badge.style.opacity = '0';
    }, 1800);
  }

/* ================= DRAG ================= */

  function onMouseMove(e) {
    if (!isDragging || !badge) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    badge.style.left = x + 'px';
    badge.style.top = y + 'px';

    savePos(x, y);
  }

  function onMouseUp() {
    isDragging = false;
  }

/* ================= VIDEO CONTROL ================= */

  function videoOn() {
    if (videoActive) return;
    videoActive = true;

    // Do NOT auto-apply speed
    createBadge();

    document.addEventListener('mousemove', showBadge);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function videoOff() {
    videoActive = false;
    removeBadge();

    document.removeEventListener('mousemove', showBadge);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

/* ================= FULLSCREEN CHANGE ================= */

  document.addEventListener('fullscreenchange', () => {
    if (!badge) return;
    const pos = getPos();
    badge.style.left = pos.x + 'px';
    badge.style.top = pos.y + 'px';
  });

/* ================= INIT ================= */

  if (!alive()) return;

  chrome.storage.local.get(
    ['speed', 'enabled', 'badgePosNormal', 'badgePosFullscreen'],
    data => {
      if (!alive()) return;

      savedSpeed = +data.speed || 1;
      badgeEnabled = data.enabled !== false;

      if (data.badgePosNormal) posNormal = data.badgePosNormal;
      if (data.badgePosFullscreen) posFullscreen = data.badgePosFullscreen;

      observer = new MutationObserver(() => {
        const video = getActiveVideo();
        video ? videoOn() : videoOff();
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  );
})();
