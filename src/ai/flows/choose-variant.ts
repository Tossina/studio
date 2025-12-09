// This is a server-side file!
'use server';

/**
 * @fileOverview Chooses the best poker variant based on user preferences.
 *
 * Exports:
 *   - `chooseVariant`: Function to select a poker variant.
 *   - `ChooseVariantInput`: Input type for `chooseVariant`.
 *   - `ChooseVariantOutput`: Output type for `chooseVariant`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChooseVariantInputSchema = z.object({
  playStyle: z
    .string()
    .describe(
      'Description of the user play style. e.g. aggressive, passive, tight, loose.'
    ),
  variantsPlayed: z
    .array(z.string())
    .describe('List of poker variants the user has already played.'),
});
export type ChooseVariantInput = z.infer<typeof ChooseVariantInputSchema>;

const ChooseVariantOutputSchema = z.object({
  variant: z
    .string()
    .describe(
      'The name of the suggested poker variant, chosen based on the user play style.'
    ),
  reason: z
    .string()
    .describe(
      'A short explanation of why the variant was chosen for the user.'
    ),
});
export type ChooseVariantOutput = z.infer<typeof ChooseVariantOutputSchema>;

export async function chooseVariant(input: ChooseVariantInput): Promise<ChooseVariantOutput> {
  return chooseVariantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chooseVariantPrompt',
  input: {schema: ChooseVariantInputSchema},
  output: {schema: ChooseVariantOutputSchema},
  prompt: `You are an expert poker advisor. A user will describe their play style, and you will choose a poker variant for them to try.

Here are the possible poker variants: Texas Hold'em, Omaha, Stud, Draw.

Do not suggest a variant that the user has already played.

Play style: {{{playStyle}}}

Variants already played: {{#each variantsPlayed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest a variant and explain why it is a good fit for the user:
`,
});

const chooseVariantFlow = ai.defineFlow(
  {
    name: 'chooseVariantFlow',
    inputSchema: ChooseVariantInputSchema,
    outputSchema: ChooseVariantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
