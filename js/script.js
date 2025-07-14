const select = document.getElementById("language-select");
const contents = document.querySelectorAll(".lang-content");

function updateLanguage(lang) {
  contents.forEach(div => {
    div.classList.toggle("active", div.dataset.lang === lang);
  });
}

// 初期表示
updateLanguage(select.value);

// 言語変更時
select.addEventListener("change", () => {
  updateLanguage(select.value);
});
