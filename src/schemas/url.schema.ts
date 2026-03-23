import { z } from "zod";

const createUrlSchema = z.object({
    url: z.string().trim().pipe(z.url("Invalid URL")),
});

export { createUrlSchema };
