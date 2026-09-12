const TMDB_IMAGE_URL =
    "https://image.tmdb.org/t/p";

export const getPoster = (path) => {
    if (!path) return "";

    return `${TMDB_IMAGE_URL}/w500${path}`;
};

export const getBackdrop = (path) => {
    if (!path) return "";

    return `${TMDB_IMAGE_URL}/original${path}`;
};