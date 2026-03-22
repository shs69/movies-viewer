import type { data } from "../manual_data";

export const GENRES = [
	"драма",
	"боевик",
	"комедия",
	"триллер",
	"фантастика",
	"ужасы",
	"детектив",
	"приключения",
	"анимация",
	"фэнтези",
	"криминал",
	"семейный",
	"документальный",
	"мюзикл",
	"биография",
	"история",
	"военный",
	"спорт",
];

interface FavFilm {
	id: number;
	name: string;
	posterUrl?: string;
	year: string;
	rating: number;
}

export function parseMovies(movies: typeof data.docs) {
	return movies.map((item: (typeof data.docs)[0]) => {
		const rating = Math.max(...Object.values(item.rating));
		const genres = item.genres
			? item.genres.map((elem) => Object.values(elem)[0])
			: [];
		return {
			id: item.id,
			name: item.name ?? item.alternativeName,
			posterUrl: item.poster?.url,
			year: (
				item.year ??
				(item.status === "PRE_PRODUCTION"
					? "Ещё не вышел"
					: "Нет данных о годе выпуска")
			).toString(),
			rating: rating,
			duration: item.movieLength ?? "Нет информации о длительности",
			genres: genres.length > 0 ? genres : "Нет информации о жанрах",
		};
	});
}

export function parseRange(range: string) {
	if (range.includes("-")) {
		return { from: range.split("-")[0] ?? "", to: range.split("-")[0] ?? "" };
	}
	return { from: "", to: "" };
}

export function createRange({ from, to }: { from: string; to: string }) {
	if (!to) return `${from}`;
	if (Number(to) < Number(from)) return `${to}-${from}`;
	return `${from}-${to}`;
}

export function addToFavorite(film: FavFilm) {
	const favorites = localStorage.getItem("favorites");
	const favoritesArray: FavFilm[] = favorites ? JSON.parse(favorites) : [];
	localStorage.setItem("favorites", JSON.stringify([...favoritesArray, film]));
}

export function readFromFavorites() {
	const favorites = localStorage.getItem("favorites");
	const favoritesArray = favorites ? JSON.parse(favorites) : [];
	return parseMovies(favoritesArray);
}

export function findInFavoritesById(id: number) {
	const favorites = localStorage.getItem("favorites");
	const favoritesArray = favorites ? JSON.parse(favorites) : [];
	return !!favoritesArray.find((film: FavFilm) => film.id === id);
}

export function removeFromFavoritesById(id: number) {
	const favorites = localStorage.getItem("favorites");
	const favoritesArray = favorites ? JSON.parse(favorites) : [];
	const filtered = favoritesArray.filter((film: FavFilm) => film.id !== id);
	localStorage.setItem("favorites", JSON.stringify(filtered));
}
