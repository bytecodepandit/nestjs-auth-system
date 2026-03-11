import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

import { IORedisKey } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(IORedisKey)
    private readonly redisClient: Redis,
  ) { }

  async onModuleInit() {
    try {
      // Redis returns "PONG" if the connection is successful
      const response = await this.redisClient.ping();
      this.logger.log(`Redis connection check: ${response}`);
    } catch (error) {
      this.logger.error('Could not connect to Redis', error.stack);
    }
  }

  async getKeys(pattern?: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async insert(key: string, value: string | number): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async validate(key: string, value: string): Promise<boolean> {
    const storedValue = await this.redisClient.get(key);
    return storedValue === value;
  }
}
