import galleryItems from './gallery-item.js';

const galleryBoxRef = document.querySelector('.js-gallery');
const modalWrapRef = document.querySelector('.js-lightbox');
const modalImageRef = document.querySelector('.lightbox__image');
const modalCloseButtonRef = document.querySelector(
  '[data-action="close-lightbox"]',
);
const modalOverlayRef = document.querySelector('.lightbox__overlay');

const gallertMarkupCreate = creategallertMarkupCreate(galleryItems);
galleryBoxRef.insertAdjacentHTML('beforeend', gallertMarkupCreate);

function creategallertMarkupCreate(items) {
  return items
    .map(({ preview, original, description }, index) => {
      return `
        <li class="gallery__item">
        <a class="gallery__link"
        href="${original}"
        >
        <img
            data-index="${index}"
            class="gallery__image"
            src="${preview}"
            data-source="${original}"
            alt="${description}"
        />
    </a>
</li>
`;
    })
    .join('');
}

galleryBoxRef.addEventListener('click', onGalleryItemOpen);

function onGalleryItemOpen(event) {
    event.preventDefault();
  if (event.target.tagName !== 'IMG') {
    return;
  }
  onOpenModal(event);
}

function onOpenModal(event) {
  window.addEventListener('keydown', onEscCloseModal);
  galleryBoxRef.addEventListener('keydown', onClickImageSlide);

  modalWrapRef.classList.add('is-open');
  setImageAttribute(event);
}

function setImageAttribute(event) {
  modalImageRef.src = event.target.dataset.source;
  modalImageRef.alt = event.target.alt;
  modalImageRef.setAttribute('data-index', event.target.dataset.index);
}

modalWrapRef.addEventListener('click', onOverlayClick);

function onCloseModal() {
  window.removeEventListener('keydown', onEscCloseModal);
  galleryBoxRef.removeEventListener('keydown', onClickImageSlide);
  modalWrapRef.classList.remove('is-open');
  unsetImageAttributes();
}

function unsetImageAttributes() {
  modalImageRef.src = '';
  modalImageRef.alt = '';
}

function onOverlayClick(event) {
  if (event.target === modalOverlayRef || event.target === modalCloseButtonRef) {
    onCloseModal();
  }
}

function onEscCloseModal(event) {
  if (event.code === 'Escape') {
    onCloseModal();
  }
}

function onClickImageSlide(event) {
  const {
    dataset: { index },
  } = modalImageRef;
  const parsedIndex = parseInt(index);
  const firstChild = 0;
  const lastChild = galleryItems.length - 1;

  if (event.code === 'ArrowRight') {
    const newIndex = parsedIndex === lastChild ? firstChild : parsedIndex + 1;
    setNewAttributes(newIndex);
  }

  if (event.code === 'ArrowLeft') {
    const newIndex = parsedIndex === firstChild ? lastChild : parsedIndex - 1;
    setNewAttributes(newIndex);
  }
}

function setNewAttributes(newIndex) {
  const { original, description } = galleryItems[newIndex];
  modalImageRef.src = original;
  modalImageRef.alt = description;
  modalImageRef.dataset.index = newIndex;
}

