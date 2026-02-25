let pageFlip = null;
let currentPortrait = null;

const startBtn      = document.getElementById('start-album');
const flipBtn       = document.getElementById('flip-mode');
const gridBtn       = document.getElementById('grid-mode');
const bookScene     = document.getElementById('book-scene');
const container     = document.getElementById('album-pages');
const coverEl       = document.getElementById('cover');
const headerEl      = document.getElementById('header');
const gridContainer = document.getElementById('grid-container');

// Lightbox элементы
const lightbox        = document.getElementById('photo-lightbox');
const lightboxImg     = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.caption');
const lightboxClose   = lightbox.querySelector('.close-btn');

// Скрытый буфер — страницы живут здесь между пересозданиями PageFlip
const pageBuffer = document.createElement('div');
pageBuffer.style.display = 'none';
document.body.appendChild(pageBuffer);

// ==================== ЗАПУСК АЛЬБОМА ====================
startBtn.addEventListener('click', () => {
  coverEl.style.display   = 'none';
  headerEl.style.display  = 'flex';
  bookScene.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  initPageFlip();
});

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function isMobile() {
  return window.innerWidth < 700;
}

function calcBookSize() {
  const headerH = headerEl.offsetHeight || 52;
  const sceneH  = window.innerHeight - headerH;
  const sceneW  = window.innerWidth;

  if (isMobile()) {
    const ratio = 0.75;
    const maxH  = sceneH - 20;
    const maxW  = sceneW - 16;
    const pageH = Math.floor(Math.min(maxH, maxW / ratio));
    const pageW = Math.floor(pageH * ratio);
    return { pageW, pageH, sceneH, portrait: true };
  } else {
    const ratio = 0.72;
    const maxH  = sceneH - 40;
    const maxW  = (sceneW - 60) / 2;
    const pageH = Math.floor(Math.min(maxH, maxW / ratio));
    const pageW = Math.floor(pageH * ratio);
    return { pageW, pageH, sceneH, portrait: false };
  }
}

function applyContainerSize({ pageW, pageH, portrait, sceneH }) {
  container.style.width  = (portrait ? pageW : pageW * 2) + 'px';
  container.style.height = pageH + 'px';
  bookScene.style.height = sceneH + 'px';
}

// ==================== ИНИЦИАЛИЗАЦИЯ PAGE FLIP ====================
function initPageFlip() {
  const PageFlipClass =
    (window.St && window.St.PageFlip) ||
    window.PageFlip;

  if (!PageFlipClass) {
    alert('Библиотека PageFlip не найдена!');
    return;
  }

  // 1. Спасаем .page элементы в буфер до destroy
  const allPages = Array.from(document.querySelectorAll('.page'));
  allPages.forEach(p => pageBuffer.appendChild(p));

  // 2. Уничтожаем старый инстанс
  if (pageFlip) {
    try { pageFlip.destroy(); } catch(e) {}
    pageFlip = null;
    container.innerHTML = '';
  }

  // 3. Возвращаем страницы из буфера в контейнер
  const freshPages = Array.from(pageBuffer.querySelectorAll('.page'));
  freshPages.forEach(p => container.appendChild(p));

  const sizes = calcBookSize();
  applyContainerSize(sizes);
  const { pageW, pageH, portrait } = sizes;
  currentPortrait = portrait;

  freshPages.forEach((pg, i) => {
    const c = pg.querySelector('.page-content');
    if (c) c.setAttribute('data-page', i + 1);
  });

  try {
    pageFlip = new PageFlipClass(container, {
      width:               pageW,
      height:              pageH,
      size:                'fixed',
      showCover:           false,
      drawShadow:          true,
      flippingTime:        750,
      usePortrait:         portrait,
      autoSize:            false,
      maxShadowOpacity:    0.5,
      mobileScrollSupport: false,
      swipeDistance:       20,
    });

    pageFlip.loadFromHTML(freshPages);
  } catch (e) {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }
}

// ==================== ЛАЙТБОКС (ОДИН ОБРАБОТЧИК НА ВСЁ) ====================
// Единый делегированный обработчик кликов по фото внутри поляроидов
document.addEventListener('click', (e) => {
  const img = e.target.closest('.polaroid img');
  if (!img) return; // клик не по фото
  openLightbox(img);
});

// Открыть лайтбокс
function openLightbox(imgElement) {
  const src = imgElement.src;
  const alt = imgElement.alt;

  const polaroid = imgElement.closest('.polaroid');
  const caption = polaroid ? polaroid.querySelector('p')?.textContent : alt;

  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = caption || '';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Закрыть лайтбокс
function closeLightbox() {
  lightbox.classList.remove('active');
  // Восстанавливаем overflow только если не в режиме плитки
  if (bookScene.style.display !== 'none') {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

// Закрытие по клику на фон или кнопку
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxClose) {
    closeLightbox();
  }
});

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }

  // Навигация стрелками (только если lightbox закрыт)
  if (!lightbox.classList.contains('active') && pageFlip) {
    if (e.key === 'ArrowRight') pageFlip.flipNext();
    if (e.key === 'ArrowLeft')  pageFlip.flipPrev();
  }
});

// ==================== РЕЖИМЫ ПРОСМОТРА ====================
gridBtn.addEventListener('click', () => {
  bookScene.style.display = 'none';
  flipBtn.classList.remove('active');
  gridBtn.classList.add('active');
  document.body.style.overflow = 'auto';

  if (!gridContainer.children.length) {
    // Клонируем поляроиды в плитку (обработчики не нужны – работает делегирование)
    document.querySelectorAll('.page .polaroid').forEach(p => {
      const clonedPolaroid = p.cloneNode(true);
      gridContainer.appendChild(clonedPolaroid);
    });
  }
  gridContainer.style.display = 'grid';
});

flipBtn.addEventListener('click', () => {
  gridContainer.style.display = 'none';
  gridBtn.classList.remove('active');
  flipBtn.classList.add('active');
  document.body.style.overflow = 'hidden';
  bookScene.style.display = 'flex';
  if (pageFlip) pageFlip.update();
});

// ==================== УЛУЧШЕНИЕ ОТКЛИКА НА МОБИЛЬНЫХ ====================
// Добавляем CSS-правило через JS (или можно прописать в таблице стилей)
const style = document.createElement('style');
style.textContent = `
  .polaroid img {
    touch-action: manipulation; /* отключает двойной тап для зума */
    cursor: pointer;
  }
`;
document.head.appendChild(style);