'use server';

/**
 * @fileOverview AI-powered rule logic suggestion.
 *
 * - suggestRuleLogic - A function that suggests rule logic based on a description.
 * - SuggestRuleLogicInput - The input type for the suggestRuleLogic function.
 * - SuggestRuleLogicOutput - The return type for the suggestRuleLogic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRuleLogicInputSchema = z.object({
  ruleDescription: z
    .string()
    .describe('A description of the rule for which logic should be suggested.'),
});
export type SuggestRuleLogicInput = z.infer<typeof SuggestRuleLogicInputSchema>;

const SuggestRuleLogicOutputSchema = z.object({
  suggestedLogic: z
    .string()
    .describe('The suggested rule logic in natural language.'),
});
export type SuggestRuleLogicOutput = z.infer<typeof SuggestRuleLogicOutputSchema>;

export async function suggestRuleLogic(input: SuggestRuleLogicInput): Promise<SuggestRuleLogicOutput> {
  return suggestRuleLogicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRuleLogicPrompt',
  input: {schema: SuggestRuleLogicInputSchema},
  output: {schema: SuggestRuleLogicOutputSchema},
  prompt: `You are an AI assistant that helps users define business rules.

  Based on the user's description of the rule, suggest the rule logic in natural language.

  Rule Description: {{{ruleDescription}}}

  Suggested Rule Logic: `,
});

const suggestRuleLogicFlow = ai.defineFlow(
  {
    name: 'suggestRuleLogicFlow',
    inputSchema: SuggestRuleLogicInputSchema,
    outputSchema: SuggestRuleLogicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
