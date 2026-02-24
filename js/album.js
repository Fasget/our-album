const album = document.getElementById("album");
function buildAlbum() {
  album.innerHTML = "";

  const isDesktop = window.innerWidth >= 1024;

  // Обложка
  album.appendChild(createCover());

  if (isDesktop) {
    for (let i = 0; i < pages.length; i += 2) {
      album.appendChild(createSpread(pages[i], pages[i + 1]));
    }
  } else {
    pages.forEach(p => album.appendChild(createPage(p)));
  }
}

function createCover() {
  const el = document.createElement("section");
  el.className = "page";
  el.innerHTML = `<h1 style="padding:40px">ALBUM TITLE</h1>`;
  return el;
}

// Функция создания одной страницы
function createPage(p) {
  const el = document.createElement("section");
  el.className = "page";

  el.innerHTML = `
    <div class="page-inner">
      <img src="${p.image}" />
      <h2>${p.title}</h2>
    </div>
  `;
  return el;
}

// Функция создания разворота для ПК
function createSpread(left, right) {
  const el = document.createElement("section");
  el.className = "spread";

  el.innerHTML = `
    <div class="page-inner">
      <img src="${left.image}" />
      <h2>${left.title}</h2>
    </div>
    <div class="page-inner">
      <img src="${right?.image || ""}" />
      <h2>${right?.title || ""}</h2>
    </div>
  `;
  return el;
}

// Основная функция сборки альбома
function buildAlbum() {
  if (!album) {
    console.error("Container #album not found!");
    return;
  }

  // Очистка перед сборкой
  album.innerHTML = "";

  const isDesktop = window.innerWidth >= 1024;

  // Добавляем обложку
  album.appendChild(createCover());

  if (isDesktop) {
    // Для ПК собираем развороты
    for (let i = 0; i < pages.length; i += 2) {
      album.appendChild(createSpread(pages[i], pages[i + 1]));
    }
  } else {
    // Для мобильных — по одной странице
    pages.forEach(p => album.appendChild(createPage(p)));
  }
}
