import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { TeamResolver } from './team.resolver';
import { Team, TeamSchema } from './schemas/team.schema';
import { CountryModule } from '../country/country.module';
import { RegionModule } from '../region/region.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    CountryModule,
    RegionModule,
    forwardRef(() => PlayerModule),
  ],
  providers: [
    TeamResolver,
    TeamRepository,
    TeamService,
    {
      provide: 'MATCHES_PACKAGE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'matches',
            protoPath: join(process.cwd(), 'src/proto/matches.proto'),
            url: `${process.env.MATCHES_RPC_URL}`,
          },
        });
      },
    },
  ],
  exports: [TeamRepository],
})
export class TeamModule {}
