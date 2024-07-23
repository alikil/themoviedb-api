import { Module } from '@nestjs/common';

import { TheMovieDbService } from './the-movie-db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TheMovieDbService],
  exports: [TheMovieDbService],
})
export class TheMovieDbModule {}
