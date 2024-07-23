import { Test } from '@nestjs/testing';

import { TheMovieDbService } from './the-movie-db.service';

describe('TheMovieDbService', () => {
  let theMovieDbService: TheMovieDbService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [TheMovieDbService],
    }).compile();

    theMovieDbService = moduleRef.get<TheMovieDbService>(TheMovieDbService);
  });

  it('should be defined', () => {
    expect(theMovieDbService).toBeDefined();
  });

  it('popularMovies', async () => {
    const result = await theMovieDbService.popularMovies({ page: 1 });
    expect(result).toBeDefined();
    expect(result.page).toBe(1);
    expect(result.results[0].id).toBeDefined();
  });

  it('authRequest', async () => {
    const result = await theMovieDbService['authRequest']();
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
