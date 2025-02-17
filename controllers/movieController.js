import Movie from '../models/MovieModel'
import asyncHandler from 'express-async-handler'

// @desc get a list of all movies from the open movie API. Use this data to seed the database
// @route /coming
// @access public
export const getComingMovies = asyncHandler(async (req, res) => {
	const apiKey = process.env.MOVIE_API_KEY
	const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data.results.map((movie) => {
				const newMovie = new Movie({
					title: movie.title,
					director: 'WHO?',
					duration: 100,
					description: movie.overview,
					genre: ['comedy', 'thriller'],
					releaseDate: movie.release_date,
					posterUrl: movie.poster_path,
					backdropUrl: movie.backdrop_path,
					rating: 3,
					IMDBRating: movie.vote_average,
				})
				newMovie.save()
			})
		})

	const movies = await Movie.find()
	res.json(movies)
})

// @desc get all movies from the database
// @route /
// @access public
export const getMovies = asyncHandler(async (req, res) => {
	let movies = await Movie.find()
	if (movies.length > 0) {
		res.status(200).json(movies)
	} else {
		res.status(404).json({ message: 'No movies found in the database' })
	}
})

// @desc get one movie from the database
// @route /:movieID
// @access public
export const getMovie = asyncHandler(async (req, res) => {
	const theMovieID = req.params.movieID
	let aMovie = await Movie.findById(theMovieID)

	if (aMovie) {
		res.status(200).json(aMovie)
	} else {
		res.status(404).json({
			message: 'The movie with this ID does not exist in the database',
		})
	}
})

// @desc post one movie to the database
// @route /
// @access public
export const postMovie = asyncHandler(async (req, res) => {
	try {
		const {
			title,
			director,
			duration,
			description,
			genre,
			releaseDate,
			posterUrl,
			backdropUrl,
			rating,
			IMDBRating,
		} = req.body
		if (
			!title ||
			!duration ||
			!director ||
			!description ||
			!genre ||
			!releaseDate ||
			!posterUrl
			// !backdropUrl ||
			// !rating ||
			// !IMDBRating
		) {
			return res
				.status(400)
				.json({ message: 'Missing required information' })
		}

		let newMovie = new Movie({
			title: title,
			director: director,
			duration: duration,
			description: description,
			genre: genre,
			releaseDate: releaseDate,
			posterUrl: posterUrl,
			backdropUrl: backdropUrl,
			rating: rating,
			IMDBRating: IMDBRating,
		})

		newMovie.save()
		res.status(201).json(newMovie)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})
