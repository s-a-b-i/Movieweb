document.addEventListener("DOMContentLoaded", () => {
  const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1";
  const IMGPATH = "https://image.tmdb.org/t/p/w780";
  const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=";

  const movieBox = document.querySelector("#movie-box");
  const searchInput = document.querySelector("#search");
  const searchBtn = document.querySelector("#search-btn");
  const loading = document.querySelector("#loading");
  const prevBtn = document.querySelector("#prev-btn");
  const nextBtn = document.querySelector("#next-btn");
  const pageInfo = document.querySelector("#page-info");
  const modal = document.querySelector("#movie-modal");
  const modalTitle = document.querySelector("#modal-title");
  const modalRating = document.querySelector("#modal-rating");
  const modalOverview = document.querySelector("#modal-overview");
  const closeBtn = document.querySelector("#close-btn");

  if (!movieBox || !searchInput || !searchBtn || !loading || !prevBtn || !nextBtn || !pageInfo || !modal || !modalTitle || !modalRating || !modalOverview || !closeBtn) {
      console.error("One or more DOM elements not found.");
      return;
  }

  let currentPage = 1;
  let totalPages = 1;
  let currentApi = APIURL;
  let isSearch = false;

  const getMovie = async (page = 1) => {
      try {
          loading.style.display = "block";
          const apiUrl = `${currentApi}&page=${page}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          totalPages = data.total_pages || 1;
          currentPage = page;
          showMovies(data.results);
          updatePagination();
      } catch (error) {
          console.error("Error fetching movies:", error);
      } finally {
          loading.style.display = "none";
      }
  };

  const showMovies = (data) => {
      movieBox.innerHTML = "";
      data.forEach((item) => {
          if (item.poster_path) {
              const box = document.createElement("div");
              box.classList.add("box");
              box.innerHTML = `
                  <img src="${IMGPATH + item.poster_path}" alt="${item.original_title}">
              `;
              box.addEventListener("click", () => {
                  modalTitle.textContent = item.original_title;
                  modalRating.textContent = item.vote_average.toFixed(1);
                  modalOverview.textContent = item.overview || "No overview available.";
                  modal.style.display = "flex";
              });
              movieBox.appendChild(box);
          }
      });
  };

  const updatePagination = () => {
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
  };

  const handleSearch = () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
          currentApi = SEARCHAPI + encodeURIComponent(searchTerm);
          isSearch = true;
      } else {
          currentApi = APIURL;
          isSearch = false;
      }
      currentPage = 1;
      getMovie(currentPage);
  };

  searchBtn.addEventListener("click", handleSearch);

  searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
          handleSearch();
      }
  });

  prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
          getMovie(currentPage - 1);
      }
  });

  nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
          getMovie(currentPage + 1);
      }
  });

  closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
  });

  modal.addEventListener("click", (event) => {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  });

  getMovie(currentPage);
});