import { z } from "zod";

export const acceptMessage = z.object({
    acceptingMessage: z.boolean()
})