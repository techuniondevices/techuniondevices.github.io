function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function toggleLanguageDropdown() {
    document.querySelector(".language-options").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.language-selected, .language-selected *')) {
    var dropdowns = document.getElementsByClassName("language-options");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

async function setLanguage(lang) {
    try {
        const response = await fetch(`../locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'TITLE') {
                    el.textContent = translations[key];
                } else {
                    el.innerHTML = translations[key];
                }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                el.placeholder = translations[key];
            }
        });

        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
    } catch (error) {
        console.error(`Error loading or applying language ${lang}:`, error);
    }
}


async function changeLanguage(lang) {
    await setLanguage(lang);
    const langText = {
        'en': 'English',
        'ja': '日本語',
        'zh': '简体中文'
    };
    document.querySelector('.language-selected span').textContent = langText[lang];
    document.querySelector(".language-options").classList.remove("show");
}

function initModalLogic() {
    const modal = document.getElementById("terms-modal");
    const downloadButton = document.getElementById("download-button");
    const closeButton = document.querySelector(".close-button");
    const agreeCheckbox = document.getElementById("agree-checkbox");
    const agreeDownloadButton = document.getElementById("agree-download-button");

    if (modal && downloadButton && closeButton && agreeCheckbox && agreeDownloadButton) {
        downloadButton.onclick = function(e) {
            e.preventDefault();
            modal.style.display = "block";
        }

        closeButton.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        agreeCheckbox.onchange = function() {
            if (this.checked) {
                agreeDownloadButton.classList.remove("disabled");
                agreeDownloadButton.href = "/app/samplefile"; // Set the actual download link
            } else {
                agreeDownloadButton.classList.add("disabled");
                agreeDownloadButton.href = "#";
            }
        }

        agreeDownloadButton.onclick = function(e) {
            if (agreeDownloadButton.classList.contains('disabled')) {
                e.preventDefault();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('lang') || 'ja'; // Default to Japanese
    await setLanguage(savedLang);

    const langText = {
        'en': 'English',
        'ja': '日本語',
        'zh': '简体中文'
    };
    document.querySelector('.language-selected span').textContent = langText[savedLang];

    if (document.querySelector(".tab-link.active")) {
        document.querySelector(".tab-link.active").click();
    }

    // Initialize modal logic only on index.html
    const currentPath = window.location.pathname;
    if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath === '/techuniondevices.github.io/') { // Added /techuniondevices.github.io/ for GitHub Pages root
        initModalLogic();
    }

    // Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;

            // In a real application, you would send this data to a server-side endpoint.
            // For a static GitHub Pages site, this will just show an alert.
            alert(`Message Sent!\nEmail: ${email}\nName: ${name}\nMessage: ${message}\n\n(Note: This is a static site. Actual email sending requires a backend service.)`);

            // Optionally, clear the form
            contactForm.reset();
        });
    }
});