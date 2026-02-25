let $book = null;

const startBtn      = document.getElementById('start-album');
const flipBtn       = document.getElementById('flip-mode');
const gridBtn       = document.getElementById('grid-mode');
const bookScene     = document.getElementById('book-scene');
const container     = document.getElementById('album-pages');
const coverEl       = document.getElementById('cover');
const headerEl      = document.getElementById('header');
const gridContainer = document.getElementById('grid-container');

// Lightbox
const lightbox        = document.getElementById('photo-lightbox');
const lightboxImg     = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.caption');
const lightboxClose   = lightbox.querySelector('.close-btn');


// ==================== ЗАПУСК ====================

startBtn.addEventListener('click', () => {
  coverEl.style.display   = 'none';
  headerEl.style.display  = 'flex';
  bookScene.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  initTurn();
});


// ==================== ИНИЦИАЛИЗАЦИЯ ====================

function initTurn() {
  const isMobile    = window.innerWidth < 700;
  const displayMode = isMobile ? 'single' : 'double';

  const availableWidth  = window.innerWidth;
  const availableHeight = window.innerHeight - headerEl.offsetHeight;

  let width, height;

  if (isMobile) {
    width  = availableWidth * 0.88;   // мобильная — немного уже
    height = availableHeight * 0.92;
  } else {
    width  = availableWidth * 0.75;   // десктоп — аккуратно уже
    height = availableHeight * 0.88;
  }

  container.style.width  = width + 'px';
  container.style.height = height + 'px';

  const totalPages = container.querySelectorAll('.page').length;
if (!$book) {
  $book = $('#album-pages');

  $book.turn({
    width: width,
    height: height,
    display: displayMode,
    autoCenter: true,
    gradients: true,
    acceleration: true,
    elevation: 50,
    duration: 600,
    turnCorners: 'bl,br',
    page: 1,
    pages: totalPages
  });

  if (isMobile) {
    // убираем прозрачную обратную сторону страниц сразу
    container.querySelectorAll('.page').forEach(page => {
      $(page).css({
        'background-color': '#f0ead8',
        'background-image': 'repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(180,160,120,0.3) 31px, rgba(180,160,120,0.3) 32px)'
      });
    });
  }
}
}


// ==================== RESIZE ====================

window.addEventListener('resize', () => {
  if (!$book) return;
  initTurn();
});


// ==================== КЛАВИШИ ====================

document.addEventListener('keydown', (e) => {

  if (lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    return;
  }

  if (!$book) return;

  if (e.key === 'ArrowRight') $book.turn('next');
  if (e.key === 'ArrowLeft')  $book.turn('previous');
});


// ==================== GRID ====================

gridBtn.addEventListener('click', () => {

  bookScene.style.display = 'none';
  flipBtn.classList.remove('active');
  gridBtn.classList.add('active');
  document.body.style.overflow = 'auto';

  if (!gridContainer.children.length) {
    document.querySelectorAll('.page .polaroid').forEach(p => {
      gridContainer.appendChild(p.cloneNode(true));
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

  if ($book) {
    $book.turn('center');
  }
});


// ==================== LIGHTBOX ====================

document.addEventListener('click', (e) => {

  const img = e.target.closest('.polaroid img');
  if (!img) return;

  const polaroid = img.closest('.polaroid');
  const caption = polaroid
    ? polaroid.querySelector('p')?.textContent
    : '';

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption || '';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
});


function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow =
    bookScene.style.display !== 'none'
      ? 'hidden'
      : 'auto';
}


lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxClose) {
    closeLightbox();
  }
});