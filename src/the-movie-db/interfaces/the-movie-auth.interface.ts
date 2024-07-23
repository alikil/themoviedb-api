export interface ITheMovieDbAuthErrorResponse {
  status_code: number;
  status_message: 'Invalid API key: You must be granted a valid key.';
  success: boolean;
}

export interface ITheMovieDbAuthSuccessResponse {
  success: boolean;
  status_code: number;
  status_message: 'Success.';
}
