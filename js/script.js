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
    const response = await fetch(`locales/${lang}.json`);
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

    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
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
});