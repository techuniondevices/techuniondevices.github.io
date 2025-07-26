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

let slideIndex = 1;

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("carousel-slide");
    let dots = document.getElementsByClassName("dot");
    let carouselSlidesContainer = document.querySelector('.carousel-slides');

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    // Update transform for the carousel slides container
    if (carouselSlidesContainer) {
        carouselSlidesContainer.style.transform = `translateX(-${(slideIndex - 1) * 100}%)`;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('active');
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
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
    if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath === '/techuniondevices.github.io/') { 
        initModalLogic();
        showSlides(slideIndex); // Initialize carousel

        // Auto-slide every 3 seconds
        setInterval(() => {
            plusSlides(1);
        }, 5000);
    }

    // Load terms of use on terms.html
    if (currentPath.endsWith('terms.html')) {
        const savedLang = localStorage.getItem('lang') || 'ja';
        setLanguage(savedLang);
    }

    // Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const messageInput = document.getElementById('message');
        const charCount = document.getElementById('message-char-count');

        messageInput.addEventListener('input', () => {
            const currentLength = messageInput.value.length;
            charCount.textContent = `(${currentLength}/1000)`;
        });

        const submitButton = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            // Disable the button to prevent multiple submissions
            submitButton.disabled = true;
            submitButton.style.opacity = '0.5'; // Optional: visual feedback
            submitButton.style.cursor = 'not-allowed'; // Optional: visual feedback

            const email = document.getElementById('email').value;
            const appcode = document.getElementById('appcode').value;
            const message = document.getElementById('message').value;

            const res = await sendInquiry(email, appcode, message);
            if(res) {
                alert('お問い合わせを送信しました。ありがとうございます。');
                window.location.href = 'index.html';
            } else {
                alert('お問い合わせでエラーが発生しました。送信内容をご確認ください。');
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            }
        });
    }
});

/**
 * APIに問い合わせを送信するメインの非同期関数
 */
async function sendInquiry(mail, appcode, content) {
    const API_URL = 'https://script.google.com/macros/s/AKfycbzPV5xUwD_jwPFK_Pegx7oM2xDAS_DvCWZs0zmrmSWGGNvQI8uEd9a_UKxfKkyqD43ClA/exec';
    try {
        const getUrl = `${API_URL}?ac=${appcode}`;
        const getResponse = await fetch(getUrl);

        if (!getResponse.ok) {
            const errorText = await getResponse.text();
            throw new Error(`GET request failed: ${getResponse.status} - ${errorText}`);
        }

        const getData = await getResponse.json();
        const dynamicKey = getData.key;

        if (!dynamicKey) {
            throw new Error('Failed to retrieve a valid key from the server.');
        }

        const postData = {
            email: mail,
            appcode: appcode,
            content: content,
            key: dynamicKey
        };

        const postResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain;charset=utf-8',},
            body: JSON.stringify(postData),
            redirect: 'follow' 
        });

        if (!postResponse.ok) {
            const errorText = await postResponse.text();
            throw new Error(`POST request failed: ${postResponse.status} - ${errorText}`);
        }
        const postResult = await postResponse.json();
        console.log(postResult);
        return postResult.code == 200
    } catch (error) {
        return false
    }
}