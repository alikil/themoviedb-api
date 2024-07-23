import { Test } from '@nestjs/testing';

import { AppService } from './app.service';
import { TheMovieDbModule } from './the-movie-db/the-movie-db.module';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TheMovieDbModule],
      controllers: [],
      providers: [AppService],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('popularMovies', async () => {
    const result = await appService.getPopularMovies({ page: 1 });
    expect(result).toBeDefined();
    expect(result instanceof Buffer).toBe(true);
  });

  it('movieById', async () => {
    const result = await appService.getMovieById('1039868');
    expect(result).toBeDefined();
    expect(result instanceof Buffer).toBe(true);
  });
});
