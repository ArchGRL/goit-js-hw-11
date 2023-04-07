import axios from "axios";

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34997790-f8c4a5b7d116715454d2fb294';
  #BASE_SEARCH_PARAMS = {
    key: this.#API_KEY,
    per_page: 40,
    image_type: 'photo',
    safesearch: true,
  };
  page = 1;
  q = null;
  
  get perPage() {
    return this.#BASE_SEARCH_PARAMS.per_page;
  }

  fetchPhotos() {
    const searchParams = new URLSearchParams ({
        ...this.#BASE_SEARCH_PARAMS,
        q: this.q,
        webformatURL: this.webformatURL,
        largeImageURL: this.largeImageURL,
        tags: this.tags,
        likes: this.likes,
        views: this.views,
        comments: this.comments,
        downloads: this.downloads,
    });

    return axios.get(`${this.#BASE_URL}?page=${this.page}&${searchParams}`)
    .then(res => res.data)
    .catch(error => {
      throw new Error(error.response.status);
    });
  }
}
