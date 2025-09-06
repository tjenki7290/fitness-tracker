import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";

import dotenv from "dotenv";
dotenv.config();

// Debug: Check Upstash Redis connection
console.log("Attempting to connect to Upstash Redis...");
console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);

//rate limiter that allows 10 requests per 20 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60s"),
});

export default ratelimit;