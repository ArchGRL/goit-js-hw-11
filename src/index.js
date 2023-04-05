import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createGalleryCards from './templates/photo-card.hbs';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const handleSearchPhotos = async event => {
  event.preventDefault();

  pixabayAPI.page = 1;

  const searchQuery = event.target.elements['searchQuery'].value.trim();
 
  if (!searchQuery) {
    Notify.warning('Please enter a search query.');
    return;
  }

  pixabayAPI.q = searchQuery;

  try {
    const data = await pixabayAPI.fetchPhotos();
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } 
      galleryEl.innerHTML = createGalleryCards(data.hits);
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
  
      const totalPage = Math.ceil(data.totalHits / pixabayAPI.perPage);
      if (pixabayAPI.page === totalPage) {
        return;
      }
      loadMoreBtnEl.classList.remove('is-hidden');
     
      lightbox.refresh(); 
    } catch (error) {
    console.log(error);
      loadMoreBtnEl.classList.add('is-hidden');
    };

    const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
};

const handleLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const  data  = await pixabayAPI.fetchPhotos();
    const totalPage = Math.ceil(data.totalHits / pixabayAPI.perPage);
    if (pixabayAPI.page === totalPage) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));
  
    lightbox.refresh();
  } catch (error) {
    console.log(error);
    loadMoreBtnEl.classList.add('is-hidden');
  };
  
  const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
};
    

formEl.addEventListener('submit', handleSearchPhotos);

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);





