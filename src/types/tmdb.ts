export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface TMDBListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBCreditsResponse {
  id: number;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}


export type TMDBGenre = {
    id: number;
    name: string;
};

export type TMDBCast = {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
};

export type TMDBCrew = {
    id: number;
    name: string;
    job: string;
};

export type TMDBRecommendation = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
};

export type MovieDetailsResponse = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    runtime: number | null;
    status: string;
    original_language: string;
    genres: TMDBGenre[];
    tagline: string | null;
    vote_average: number;
    adult?: boolean;
    credits?: {
        cast: TMDBCast[];
        crew: TMDBCrew[];
    };
    recommendations?: {
        results: TMDBRecommendation[];
    };
};


export type TMDBMovieDetailsFull = Movie & {
    runtime?: number | null;
    status?: string | null;
    tagline?: string | null;
    genres?: Array<{ id: number; name: string }>;
    credits?: TMDBCreditsResponse;
    recommendations?: TMDBListResponse;
    original_language?: string;
};

