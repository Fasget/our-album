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

  const width = isMobile
    ? window.innerWidth - 20
    : window.innerWidth - 100;

  const height = window.innerHeight - headerEl.offsetHeight - 20;

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
      pages: totalPages   // 🔑 отключает режим "обложки"
    });

  } else {

    $book.turn('size', width, height);
    $book.turn('display', displayMode);
    $book.turn('center');
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