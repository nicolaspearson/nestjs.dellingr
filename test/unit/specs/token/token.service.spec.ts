/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenService } from '$/token/token.service';

import { jwtPayloadMock, userMock } from '#/utils/fixtures';

describe('Token Service', () => {
  let module: TestingModule;
  let jwtService: JwtService;
  let service: TokenService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.register({ secret: 'secretKey', signOptions: { expiresIn: '15m' } }),
      ],
      providers: [TokenService],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
    service = module.get<TokenService>(TokenService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    test('should generate a jwt correctly', async () => {
      const result = await service.generate(jwtPayloadMock);
      const decodedToken = jwtService.verify(result);
      expect(decodedToken).toEqual({
        uuid: userMock.uuid,
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const secExpiration = decodedToken.exp - decodedToken.iat;
      expect(secExpiration).toEqual(15 * 60);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
