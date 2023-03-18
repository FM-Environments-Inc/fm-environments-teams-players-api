import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { PlayerResolver } from './player.resolver';
import { Player, PlayerSchema } from './schemas/player.schema';
import { CountryModule } from '../country/country.module';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    CountryModule,
    forwardRef(() => TeamModule),
  ],
  providers: [
    PlayerResolver,
    PlayerRepository,
    PlayerService,
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
  exports: [PlayerRepository],
})
export class PlayerModule {}
