import { z } from "zod";

export const acceptMessage = z.object({
    accepting: z.boolean()
})