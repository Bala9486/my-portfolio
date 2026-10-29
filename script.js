/* =========================================================
   Balakumar H – Portfolio script
   1 Setup · 2 Mobile menu · 3 Active nav link · 4 Scroll reveal
   5 Back-to-top · 6 Project filter · 7 Contact form validation
   ========================================================= */
(function () {
  "use strict";

  /* 1. SETUP --------------------------------------------------
     Adding the "js" class lets the CSS hide .reveal elements only
     when JavaScript is available (so content never stays invisible). */
  document.documentElement.classList.add("js");
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. MOBILE MENU -------------------------------------------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  // Close after choosing a link
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  // Close with the Escape key (keyboard friendly)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  /* 3. ACTIVE NAV LINK ----------------------------------------
     Highlights the link of the section currently in the middle of the screen. */
  var sections = document.querySelectorAll("main section[id]");
  var links = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            var on = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", on);
            if (on) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* 4. SCROLL REVEAL ------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target); // animate once
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* 5. BACK-TO-TOP BUTTON -------------------------------------- */
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* 6. PROJECT FILTER ------------------------------------------ */
  var filterBtns = document.querySelectorAll(".filter");
  var projects = document.querySelectorAll(".project");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.filter;
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      projects.forEach(function (p) {
        var show = cat === "all" || p.dataset.category === cat;
        p.hidden = !show;
        if (show) p.classList.add("visible"); // make sure revealed cards stay visible
      });
    });
  });

  /* 7. CONTACT FORM --------------------------------------------
     Validates every field, shows messages, and then opens the visitor's
     email app with the message pre-filled (mailto). To send real email,
     connect a form service and replace the mailto block (see README steps). */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name:    function (v) { return v.length >= 2 ? "" : "Please enter your name (at least 2 characters)."; },
    email:   function (v) { return EMAIL_RE.test(v) ? "" : "Please enter a valid email address."; },
    subject: function (v) { return v.length >= 3 ? "" : "Please enter a subject (at least 3 characters)."; },
    message: function (v) { return v.length >= 10 ? "" : "Your message should be at least 10 characters."; }
  };

  function validateField(field) {
    var msg = rules[field.name](field.value.trim());
    document.getElementById(field.id + "-err").textContent = msg;
    field.classList.toggle("invalid", msg !== "");
    field.setAttribute("aria-invalid", String(msg !== ""));
    return msg === "";
  }

  var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea"));
  fields.forEach(function (f) {
    f.addEventListener("blur", function () { validateField(f); });
    f.addEventListener("input", function () { if (f.classList.contains("invalid")) validateField(f); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    var firstInvalid = null;
    fields.forEach(function (f) {
      if (!validateField(f) && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim()
    };

    // --- Replace this block with fetch() to Formspree/Netlify for real delivery ---
    var body = "Name: " + data.name + "\nEmail: " + data.email + "\n\n" + data.message;
    window.location.href = "mailto:haribala8049@gmail.com?subject=" +
      encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body);
    // -----------------------------------------------------------------------------

    status.textContent = "Thanks, " + data.name + "! Your email app should open with the message ready to send.";
    form.reset();
    fields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
  });
})();
