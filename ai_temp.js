document.getElementById("current-year").textContent = new Date().getFullYear();
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const darkModeToggle = document.querySelector(".dark-mode-toggle");
const body = document.body;
const aiModelSelect = document.getElementById("aiModel");
const aiContentTextarea = document.getElementById("aiContent");
const sendQueryButton = document.getElementById("sendQuery");
const aiResponseDiv = document.getElementById("aiResponse");
const loadingSpinner = document.querySelector(".loading-spinner");
const copyResponseButton = document.getElementById("copyResponse");

function setDarkMode(isDark) {
  if (isDark) {
    body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️";
    localStorage.setItem("darkMode", "enabled");
  } else {
    body.classList.remove("dark-mode");
    darkModeToggle.textContent = "🌙";
    localStorage.setItem("darkMode", "disabled");
  }
}

const savedDarkMode = localStorage.getItem("darkMode");
setDarkMode(savedDarkMode === "enabled");

darkModeToggle.addEventListener("click", () => {
  setDarkMode(!body.classList.contains("dark-mode"));
});

hamburger.addEventListener("click", () => {
  const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", !isExpanded);
  hamburger.classList.toggle("is-active");
  navMenu.classList.toggle("is-active");
  body.classList.toggle("nav-open");
});

document.querySelectorAll(".nav-link").forEach(navLink => {
  navLink.addEventListener("click", () => {
    if (window.innerWidth <= 768 && navMenu.classList.contains("is-active")) {
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-active");
      body.classList.remove("nav-open");
    }
  });
});

function triggerAdLogic(event) {
  const target = event.target;
  if (target.closest("button")) return;

  const link = target.closest("a");
  let finalURL = null;

  if (link && link.href) {
    const linkHref = link.href;
    const currentHref = window.location.href;
    const currentPage = currentHref.split("#")[0];
    const targetPage = linkHref.split("#")[0];

    if (
      !linkHref.startsWith("javascript:") &&
      !linkHref.startsWith("#") &&
      linkHref !== currentHref &&
      targetPage !== currentPage
    ) {
      finalURL = linkHref;
    }
  }

  if (finalURL) {
    event.preventDefault();
    window.open(finalURL, "_blank");
    window.location.href = "https://otieu.com/4/8908364";
  }
}

document.body.addEventListener("click", triggerAdLogic, {
  capture: true
});

particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 5
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
});

sendQueryButton.addEventListener("click", async () => {
  const selectedModel = aiModelSelect.value;
  const userInput = aiContentTextarea.value.trim();

  if (!userInput) {
    aiResponseDiv.textContent = "Silakan masukkan pertanyaan Anda.";
    copyResponseButton.style.display = "none";
    return;
  }

  aiResponseDiv.textContent = "";
  loadingSpinner.style.display = "inline-block";
  sendQueryButton.disabled = true;
  copyResponseButton.style.display = "none";

  let apiUrl = "";

  switch (selectedModel) {
    case "gemini-pro":
      apiUrl = `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(userInput)}`;
      break;
    case "deepseek-llm-67b":
      apiUrl = `https://api.siputzx.my.id/api/ai/deepseek-llm-67b-chat?content=${encodeURIComponent(userInput)}`;
      break;
    case "meta-ai":
      apiUrl = `https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(userInput)}`;
      break;
    case "blackbox-ai":
      apiUrl = `https://api.siputzx.my.id/api/ai/blackboxai?content=${encodeURIComponent(userInput)}`;
      break;
  }

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.status && result.data) {
      aiResponseDiv.textContent = result.data;
      copyResponseButton.style.display = "inline-block";
    } else {
      aiResponseDiv.textContent = "Error: " + (result.data || "Gagal mendapatkan respons dari AI. Coba lagi nanti.");
      copyResponseButton.style.display = "none";
    }
  } catch (error) {
    aiResponseDiv.textContent = "Terjadi kesalahan jaringan atau API. (" + error.message + ")";
    copyResponseButton.style.display = "none";
  } finally {
    loadingSpinner.style.display = "none";
    sendQueryButton.disabled = false;
  }
});

copyResponseButton.addEventListener("click", () => {
  const responseText = aiResponseDiv.textContent;
  navigator.clipboard.writeText(responseText).then(() => {
    const originalText = copyResponseButton.textContent;
    copyResponseButton.textContent = "Disalin!";
    setTimeout(() => {
      copyResponseButton.textContent = originalText;
    }, 2000);
  }).catch(() => {
    alert("Gagal menyalin teks. Pastikan Anda memberikan izin salin pada browser.");
  });
});
