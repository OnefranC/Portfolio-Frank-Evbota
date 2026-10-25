/**
 * Globe — dependency-free Canvas 2D rotating globe for the Contact page.
 * Draws a wireframe + continent sphere with interactive location markers.
 * Drag to rotate, click a marker to expand and show user count.
 * Honours `prefers-reduced-motion` (static drawing, no loop) and pauses
 * when the tab is hidden. No React, no `cobe`, no external dependencies.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = document.querySelector(".fe-globe__canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var dpr = window.devicePixelRatio || 1;
  var W = 0, H = 0, cx = 0, cy = 0, r = 0;
  var angle = 0;
  var frame = null;
  var running = false;
  var expandedMarker = null;

  // Drag state
  var isDragging = false;
  var dragStartX = 0;
  var dragStartY = 0;
  var basePhi = 0;
  var baseTheta = 0;
  var dragOffsetPhi = 0;
  var dragOffsetTheta = 0;

  // Marker locations with user counts — matches the React/cobe demo.
  var MARKERS = [
    { id: "hq", lat: 37.78, lon: -122.44, label: "HQ", users: 1420 },
    { id: "eu", lat: 52.52, lon: 13.41, label: "EU", users: 892 },
    { id: "asia", lat: 35.68, lon: 139.65, label: "Asia", users: 2103 },
    { id: "latam", lat: -23.55, lon: -46.63, label: "LATAM", users: 567 },
    { id: "mena", lat: 25.2, lon: 55.27, label: "MENA", users: 734 },
    { id: "oceania", lat: -33.87, lon: 151.21, label: "APAC", users: 445 },
    { id: "africa", lat: -6.52, lon: 3.38, label: "Africa", users: 612 }
  ];

  // Simplified world landmasses as [lat, lon] rings (stylised, not precise).
  var LAND = [
    [ 12,-98],[22,-92],[35,-100],[48,-98],[60,-88],[70,-110],[74,-140],[56,-155],[42,-128],[30,-115],[18,-98],[8,-88],[12,-98],
    [ 10,-82],[ 0,-72],[-14,-60],[-28,-56],[-42,-52],[-52,-46],[-54,-36],[-40,-30],[-22,-42],[-6,-52],[ 8,-64],[10,-80],
    [ 36,-6],[48,0],[58,14],[70,34],[74,70],[70,115],[58,140],[46,150],[36,155],[24,140],[12,124],[ 0,110],[-8,96],[ 0,82],[14,72],[28,58],[40,38],[48,18],
    [ 36,-14],[26,2],[16,24],[ 6,42],[-4,46],[-12,-42],[-22,36],[-32,30],[-36,22],[-32,16],[-26,12],[-20,6],[-14,0],[-12,-14],[-6,-16],[ 0,-17],[12,-17],[22,-15],[30,-10],[36,-8],
    [ -8,112],[ 0,118],[-10,130],[-22,140],[-32,148],[-42,152],[-46,146],[-44,134],[-38,122],[-30,114],[-18,110],[-8,112],
    [ -58,-150],[-66,-110],[-72,-70],[-76,-30],[-78,10],[-74,52],[-70,94],[-64,138],[-58,170],[-58,-150]
  ];

  function fit() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var size = Math.min(rect.width || 749, rect.height || 749, 1800);
    size = Math.max(size, 180);
    var dW = size * dpr, dH = size * dpr;
    if (canvas.width !== dW || canvas.height !== dH) {
      canvas.width = dW;
      canvas.height = dH;
    }
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = size;
    H = size;
    cx = size / 2;
    cy = size / 2;
    r = size * 0.44;
  }

  // Orthographic projection with a slight tilt; z > 0 = front hemisphere.
  function project(lat, lon) {
    var latR = lat * Math.PI / 180;
    var lonR = ((lon + angle + basePhi + dragOffsetPhi) * Math.PI / 180);
    var sL = Math.sin(latR), cL = Math.cos(latR);
    var sO = Math.sin(lonR), cO = Math.cos(lonR);
    var tilt = 0.28 + baseTheta + dragOffsetTheta;
    var x = cL * sO;
    var y = sL * Math.cos(tilt) - cL * cO * Math.sin(tilt);
    var z = cL * cO * Math.cos(tilt) + sL * Math.sin(tilt);
    return { x: x, y: y, z: z };
  }

  function screen(p) {
    return { x: cx + p.x * r, y: cy + p.y * r };
  }

  // Projects a ring of [lat, lon] points, breaking the stroke whenever a
  // point slips behind the limb (z <= 0) so lines terminate at the edge.
  function drawPath(points, closed) {
    var began = false;
    for (var i = 0; i < points.length; i++) {
      var p = project(points[i][0], points[i][1]);
      if (p.z <= 0) {
        began = false;
        continue;
      }
      var s = screen(p);
      if (!began) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        began = true;
      } else {
        ctx.lineTo(s.x, s.y);
      }
    }
    if (began && closed) ctx.closePath();
    return began;
  }

  function isPointInMarker(markerScreen, markerSize, clickX, clickY) {
    var dx = clickX - markerScreen.x;
    var dy = clickY - markerScreen.y;
    return (dx * dx + dy * dy) <= (markerSize * markerSize);
  }

  function handleCanvasClick(e) {
    if (isDragging) return; // Don't treat drag end as click
    var rect = canvas.getBoundingClientRect();
    var clickX = (e.clientX - rect.left) * dpr;
    var clickY = (e.clientY - rect.top) * dpr;

    // Check markers in reverse order (topmost first)
    for (var i = MARKERS.length - 1; i >= 0; i--) {
      var m = MARKERS[i];
      var p = projectMarker(m.lat, m.lon);
      var s = screen(p);
      var size = r * 0.045;
      if (isPointInMarker(s, size + 20, clickX, clickY)) {
        expandedMarker = expandedMarker === m.id ? null : m.id;
        drawGlobe();
        return;
      }
    }
    // Clicked empty space
    if (expandedMarker) {
      expandedMarker = null;
      drawGlobe();
    }
  }

  function handlePointerDown(e) {
    if (reduceMotion) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    canvas.style.cursor = "grabbing";
  }

  function handlePointerMove(e) {
    if (!isDragging || reduceMotion) return;
    var deltaX = e.clientX - dragStartX;
    var deltaY = e.clientY - dragStartY;
    // Scale: horizontal drag rotates phi (longitude), vertical drag rotates theta (tilt)
    dragOffsetPhi = deltaX / 2.5; // degrees
    dragOffsetTheta = deltaY / 8; // degrees
    drawGlobe();
  }

  function handlePointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    // Commit drag offsets to base offsets
    basePhi += dragOffsetPhi;
    baseTheta += dragOffsetTheta;
    dragOffsetPhi = 0;
    dragOffsetTheta = 0;
    canvas.style.cursor = "grab";
  }

  function handlePointerLeave(e) {
    if (isDragging) {
      isDragging = false;
      basePhi += dragOffsetPhi;
      baseTheta += dragOffsetTheta;
      dragOffsetPhi = 0;
      dragOffsetTheta = 0;
      canvas.style.cursor = "grab";
    }
  }

  // Project a marker to screen, clamping to limb edge if behind the globe.
  function projectMarker(lat, lon) {
    var p = project(lat, lon);
    if (p.z > 0) return { x: p.x, y: p.y, z: p.z, onLimb: false };
    // Behind the limb: project to the limb edge (normalize x,y to sphere radius).
    var len = Math.sqrt(p.x * p.x + p.y * p.y);
    if (len === 0) return { x: 0, y: 0, z: p.z, onLimb: true };
    return { x: p.x / len, y: p.y / len, z: 0, onLimb: true };
  }

  function drawMarkers() {
    MARKERS.forEach(function (m) {
      var p = projectMarker(m.lat, m.lon);
      var s = screen(p);
      var isOnLimb = p.onLimb;
      var isExpanded = expandedMarker === m.id;
      var size = r * 0.045;
      var pulse = isExpanded ? 1.2 : 1;
      var alpha = isOnLimb ? 0.45 : 1; // faded on back side

      // Outer glow ring for expanded
      if (isExpanded) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, size * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(26,31,32,0.4)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Marker dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(18,21,21," + alpha + ")";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255," + (isOnLimb ? 0.3 : 0.6) + ")";
      ctx.lineWidth = isExpanded ? 2 : 1;
      ctx.stroke();

      // Label (skip label for limb markers to avoid clutter)
      if (!isOnLimb) {
        ctx.fillStyle = "rgba(18,21,21," + alpha + ")";
        ctx.font = "600 " + Math.max(11, r * 0.055) + "px var(--fe-display)";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(m.label, s.x + size * pulse + 4, s.y);

        // Expanded user count
        if (isExpanded) {
          var userText = m.users.toLocaleString() + " users";
          ctx.font = "400 " + Math.max(10, r * 0.045) + "px var(--fe-font)";
          ctx.fillStyle = "var(--fe-muted)";
          ctx.fillText(userText, s.x + size * pulse + 4, s.y + Math.max(14, r * 0.06));
        }
      }
    });
  }

  function drawGlobe() {
    ctx.clearRect(0, 0, W, H);

    // Back glow.
    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.12);
    glow.addColorStop(0, "rgba(18,21,21,0.06)");
    glow.addColorStop(1, "rgba(18,21,21,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    // Sphere fill.
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "var(--fe-soft)";
    ctx.fill();
    ctx.strokeStyle = "rgba(18,21,21,0.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Grid: meridians.
    ctx.strokeStyle = "rgba(18,21,21,0.16)";
    ctx.lineWidth = 0.7;
    var lons = [-160, -110, -60, -10, 40, 90, 140];
    for (var m = 0; m < lons.length; m++) {
      var pts = [];
      for (var la = -90; la <= 90; la += 6) pts.push([la, lons[m]]);
      drawPath(pts, false);
      ctx.stroke();
    }
    // Grid: parallels.
    var lats = [-60, -30, 0, 30, 60];
    for (var n = 0; n < lats.length; n++) {
      var pts = [];
      for (var lo = -180; lo <= 180; lo += 7) pts.push([lats[n], lo]);
      drawPath(pts, false);
      ctx.stroke();
    }

    // Continents (dots + lines for defined shapes).
    ctx.strokeStyle = "rgba(18,21,21,0.35)";
    ctx.lineWidth = 1.2;
    ctx.fillStyle = "rgba(18,21,21,0.55)";
    for (var c = 0; c < LAND.length; c++) {
      var path = LAND[c];
      // Draw lines connecting points.
      drawPath(path, true);
      ctx.stroke();
      // Draw dots at each coordinate point for definition.
      for (var d = 0; d < path.length; d++) {
        var p = project(path[d][0], path[d][1]);
        if (p.z <= 0) continue;
        var s = screen(p);
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(1.5, r * 0.008), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Rotating location markers (drawn after continents so they sit on top).
    drawMarkers();

    // Specular highlight.
    ctx.beginPath();
    ctx.arc(cx - r * 0.30, cy - r * 0.30, r * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fill();

    // Outer hairline.
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(18,21,21,0.10)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function loop() {
    drawGlobe();
    if (!reduceMotion && !isDragging) {
      angle += 0.0014;
      frame = requestAnimationFrame(loop);
    } else if (isDragging) {
      // Keep animating while dragging (to show drag offset live)
      frame = requestAnimationFrame(loop);
    }
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (frame) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  // Event listeners
  canvas.addEventListener("click", handleCanvasClick, { passive: true });
  canvas.addEventListener("pointerdown", handlePointerDown, { passive: true });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerup", handlePointerUp, { passive: true });
  canvas.addEventListener("pointerleave", handlePointerLeave, { passive: true });

  window.addEventListener("resize", fit, { passive: true });
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  }, { passive: true });

  fit();
  drawGlobe();
  if (!reduceMotion) start();
})();